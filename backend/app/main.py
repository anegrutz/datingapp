"""EU AI Act Compliance Platform — FastAPI application entry point."""

from __future__ import annotations

from pathlib import Path

from fastapi import Depends, FastAPI, Request
from fastapi.templating import Jinja2Templates
from sqlalchemy import select
from sqlalchemy.orm import Session

from . import models
from .database import Base, engine, get_db
from .routers import classification, documentation, systems, transparency

Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="EU AI Act Compliance Platform",
    description=(
        "SaaS platform for EU AI Act (Regulation (EU) 2024/1689) compliance: "
        "AI inventory, risk classification, Annex IV technical documentation "
        "and Art. 50 transparency disclosures. Not legal advice."
    ),
    version="0.1.0",
)

app.include_router(systems.router)
app.include_router(classification.router)
app.include_router(documentation.router)
app.include_router(transparency.router)

templates = Jinja2Templates(directory=str(Path(__file__).resolve().parent / "templates"))


@app.get("/health")
def health():
    return {"status": "ok"}


@app.get("/", include_in_schema=False)
def dashboard(request: Request, db: Session = Depends(get_db)):
    all_systems = db.scalars(select(models.AISystem).order_by(models.AISystem.id)).all()
    rows = [
        {
            "system": s,
            "tier": s.assessments[0].tier if s.assessments else None,
            "doc_count": len(s.documents),
        }
        for s in all_systems
    ]
    counts = {
        "total": len(rows),
        "unacceptable": sum(1 for r in rows if r["tier"] == "unacceptable"),
        "high": sum(1 for r in rows if r["tier"] == "high"),
        "limited": sum(1 for r in rows if r["tier"] == "limited"),
        "minimal": sum(1 for r in rows if r["tier"] == "minimal"),
        "unassessed": sum(1 for r in rows if r["tier"] is None),
    }
    return templates.TemplateResponse(
        request, "dashboard.html", {"systems": rows, "counts": counts}
    )
