"""API integration tests covering inventory, assessment, documentation and
transparency flows end to end against an in-memory SQLite database."""

import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool

from app.database import Base, get_db
from app.main import app

engine = create_engine(
    "sqlite://",
    connect_args={"check_same_thread": False},
    poolclass=StaticPool,
)
TestingSession = sessionmaker(bind=engine, autoflush=False, autocommit=False)


@pytest.fixture()
def client():
    Base.metadata.create_all(bind=engine)

    def override_get_db():
        db = TestingSession()
        try:
            yield db
        finally:
            db.close()

    app.dependency_overrides[get_db] = override_get_db
    with TestClient(app) as c:
        yield c
    app.dependency_overrides.clear()
    Base.metadata.drop_all(bind=engine)


def _create_system(client, **overrides):
    payload = {
        "name": "CreditScore AI",
        "intended_purpose": "Creditworthiness evaluation of natural persons",
        "provider_name": "Acme Fintech BV",
        "operator_role": "provider",
        "lifecycle_status": "production",
        "version": "2.3.1",
    }
    payload.update(overrides)
    response = client.post("/api/systems", json=payload)
    assert response.status_code == 201, response.text
    return response.json()


def test_health(client):
    assert client.get("/health").json() == {"status": "ok"}


def test_inventory_crud(client):
    system = _create_system(client)
    assert system["latest_tier"] is None

    listed = client.get("/api/systems").json()
    assert len(listed) == 1

    updated = client.patch(
        f"/api/systems/{system['id']}", json={"lifecycle_status": "retired"}
    ).json()
    assert updated["lifecycle_status"] == "retired"

    assert client.delete(f"/api/systems/{system['id']}").status_code == 204
    assert client.get(f"/api/systems/{system['id']}").status_code == 404


def test_invalid_role_rejected(client):
    response = client.post("/api/systems", json={"name": "X", "operator_role": "pirate"})
    assert response.status_code == 422


def test_stateless_classification_preview(client):
    response = client.post(
        "/api/classify",
        json={"answers": {"interacts_directly_with_natural_persons": True}},
    )
    assert response.status_code == 200
    assert response.json()["tier"] == "limited"


def test_questionnaire_schema_exposed(client):
    schema = client.get("/api/classify/questionnaire").json()
    assert "annex_iii_areas" in schema["properties"]


def test_assessment_persisted_and_reflected_in_inventory(client):
    system = _create_system(client)
    response = client.post(
        f"/api/systems/{system['id']}/assessments",
        json={
            "answers": {
                "annex_iii_areas": ["essential_private_public_services"],
                "performs_profiling_of_natural_persons": True,
            }
        },
    )
    assert response.status_code == 201
    body = response.json()
    assert body["tier"] == "high"
    assert "Art. 6(2)" in body["result"]["matched_provisions"]

    refreshed = client.get(f"/api/systems/{system['id']}").json()
    assert refreshed["latest_tier"] == "high"

    assessments = client.get(f"/api/systems/{system['id']}/assessments").json()
    assert len(assessments) == 1


def test_assessment_on_missing_system_404(client):
    response = client.post("/api/systems/999/assessments", json={"answers": {}})
    assert response.status_code == 404


def test_document_generation_includes_classification(client):
    system = _create_system(client)
    client.post(
        f"/api/systems/{system['id']}/assessments",
        json={"answers": {"annex_iii_areas": ["essential_private_public_services"]}},
    )
    response = client.post(
        f"/api/systems/{system['id']}/documents",
        json={
            "training_data_description": "Loan repayment histories 2015-2024, EU only.",
            "human_oversight_measures": "Credit officers review all rejections.",
        },
    )
    assert response.status_code == 201
    doc = response.json()
    md = doc["content_markdown"]
    assert "Technical Documentation (Annex IV) — CreditScore AI" in md
    assert "**high**" in md
    assert "Loan repayment histories" in md
    assert "TO BE COMPLETED" in md  # gaps stay visible

    raw = client.get(f"/api/systems/{system['id']}/documents/{doc['id']}/markdown")
    assert raw.status_code == 200
    assert raw.text == md


def test_document_cross_system_access_404(client):
    a = _create_system(client, name="A")
    b = _create_system(client, name="B")
    doc = client.post(f"/api/systems/{a['id']}/documents", json={}).json()
    response = client.get(f"/api/systems/{b['id']}/documents/{doc['id']}/markdown")
    assert response.status_code == 404


def test_disclosure_localised(client):
    system = _create_system(client, name="SupportBot")
    response = client.post(
        f"/api/systems/{system['id']}/disclosure",
        json={"interaction_type": "chat", "language": "de"},
    )
    assert response.status_code == 200
    body = response.json()
    assert body["ai_interaction"] is True
    assert body["legal_basis"] == "Art. 50(1) EU AI Act"
    assert "KI-System" in body["disclosure_text"]


def test_disclosure_unknown_language_falls_back_to_english(client):
    system = _create_system(client)
    body = client.post(
        f"/api/systems/{system['id']}/disclosure",
        json={"interaction_type": "deepfake", "language": "zz"},
    ).json()
    assert body["language"] == "en"
    assert "deep fake" in body["disclosure_text"]


def test_widget_js_served_with_system_id(client):
    system = _create_system(client)
    response = client.get(f"/api/widget.js?system_id={system['id']}")
    assert response.status_code == 200
    assert response.headers["content-type"].startswith("application/javascript")
    assert f'"{system["id"]}"' in response.text
    assert "__SYSTEM_ID__" not in response.text


def test_widget_js_unknown_system_404(client):
    assert client.get("/api/widget.js?system_id=999").status_code == 404


def test_dashboard_renders(client):
    _create_system(client, name="DashboardTestSystem")
    response = client.get("/")
    assert response.status_code == 200
    assert "DashboardTestSystem" in response.text
    assert "EU AI Act Compliance Dashboard" in response.text
