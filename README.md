# EU AI Act Compliance Platform

SaaS platform that helps organisations comply with the **EU AI Act**
(Regulation (EU) 2024/1689): inventory your AI systems, classify their risk
tier, generate Annex IV technical documentation, and serve Article 50
transparency disclosures to end users.

> ⚠️ This platform supports compliance work; it is **not legal advice**.

## MVP modules (this repository)

| # | Module | What it does |
|---|--------|--------------|
| 1 | **AI inventory** | CRUD registry of AI systems with role (provider/deployer), lifecycle status and versioning |
| 2 | **Risk classification engine** | Questionnaire-driven decision tree implementing Art. 5 (prohibited practices), Art. 6(1)/Annex I, Art. 6(2)/Annex III, the Art. 6(3) derogation and Art. 50 transparency triggers — every verdict carries the matched provisions, rationale and resulting obligations |
| 3 | **Technical documentation** | Generates versioned Annex IV technical files in Markdown, pre-filled from the inventory and latest risk assessment, with explicit `TO BE COMPLETED` gaps |
| 4 | **Transparency disclosures** | Art. 50 disclosure API in 6 EU languages plus an embeddable JavaScript banner widget |

A server-rendered compliance dashboard at `/` shows the whole inventory with
risk-tier counts.

## Quick start

```bash
cd backend
pip install -r requirements-dev.txt
python -m pytest              # run the test suite
python -m uvicorn app.main:app --reload
```

Then open:

- `http://localhost:8000/` — compliance dashboard
- `http://localhost:8000/docs` — interactive OpenAPI docs

SQLite is used by default (`compliance.db`); set `DATABASE_URL` for PostgreSQL.

## Example workflow

```bash
# 1. Register an AI system
curl -X POST localhost:8000/api/systems -H 'Content-Type: application/json' -d '{
  "name": "CreditScore AI",
  "intended_purpose": "Creditworthiness evaluation of natural persons",
  "provider_name": "Acme Fintech BV",
  "lifecycle_status": "production"
}'

# 2. Run a risk assessment (credit scoring → Annex III essential services)
curl -X POST localhost:8000/api/systems/1/assessments -H 'Content-Type: application/json' -d '{
  "answers": {
    "annex_iii_areas": ["essential_private_public_services"],
    "performs_profiling_of_natural_persons": true
  }
}'
# → tier: "high", provisions: Art. 6(2) + Annex III, obligations Art. 9-17, 43, 49

# 3. Generate Annex IV technical documentation
curl -X POST localhost:8000/api/systems/1/documents -H 'Content-Type: application/json' -d '{
  "training_data_description": "Loan repayment histories 2015-2024, EU only.",
  "human_oversight_measures": "Credit officers review all rejections."
}'

# 4. Embed the Art. 50 disclosure widget on any page
# <script src="https://<host>/api/widget.js?system_id=1" defer></script>
```

### Scenario planning ("what if")

`POST /api/classify` runs the classifier statelessly — change any answer and
see how the tier moves without persisting anything.
`GET /api/classify/questionnaire` returns the JSON Schema of the questionnaire
for building interactive UIs.

## Architecture

```
backend/
  app/
    main.py                 FastAPI app + dashboard
    database.py             SQLAlchemy engine/session (SQLite dev, PostgreSQL prod)
    models.py               AISystem, RiskAssessment, TechnicalDocument
    schemas.py              Pydantic request/response models
    routers/
      systems.py            Module 1 — inventory CRUD
      classification.py     Module 1 — risk engine endpoints
      documentation.py      Module 3 — Annex IV generation & retrieval
      transparency.py       Module 4 — disclosures + widget.js
    services/
      risk_classifier.py    The decision tree (pure, fully unit-tested)
      doc_generator.py      Annex IV Markdown renderer
      transparency.py       Localised Art. 50 disclosure texts
    static/widget.js        Embeddable disclosure banner
    templates/dashboard.html
  tests/                    26 unit + integration tests
```

The classifier is a pure function (`classify(answers) -> Classification`),
deliberately separated from the web layer so it can be reused in batch jobs,
CI checks or a future rules-versioning scheme.

## Roadmap

See [docs/ROADMAP.md](docs/ROADMAP.md) for the V2/V3 plan (data governance &
bias monitoring, drift detection, notified-body integration) and the product
strategy behind this MVP.
