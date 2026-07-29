"""Risk classification endpoints (Module 1: classification engine)."""

from __future__ import annotations

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from .. import models, schemas
from ..database import get_db
from ..services.risk_classifier import AssessmentAnswers, classify
from .systems import get_system_or_404

router = APIRouter(prefix="/api", tags=["classification"])


@router.post("/classify", response_model=schemas.ClassificationResult)
def classify_preview(payload: schemas.ClassificationRequest):
    """Stateless classification — the 'what if' scenario-planning endpoint."""
    return classify(payload.answers).as_dict()


@router.get("/classify/questionnaire")
def questionnaire_schema():
    """The questionnaire definition, for building interactive UIs."""
    return AssessmentAnswers.model_json_schema()


@router.post(
    "/systems/{system_id}/assessments",
    response_model=schemas.RiskAssessmentOut,
    status_code=201,
)
def assess_system(
    system_id: int,
    payload: schemas.ClassificationRequest,
    db: Session = Depends(get_db),
):
    """Run the classifier and persist the assessment against the system."""
    system = get_system_or_404(system_id, db)
    result = classify(payload.answers)
    assessment = models.RiskAssessment(
        system_id=system.id,
        answers=payload.answers.model_dump(mode="json"),
        tier=result.tier.value,
        result=result.as_dict(),
    )
    db.add(assessment)
    db.commit()
    db.refresh(assessment)
    return assessment


@router.get(
    "/systems/{system_id}/assessments",
    response_model=list[schemas.RiskAssessmentOut],
)
def list_assessments(system_id: int, db: Session = Depends(get_db)):
    system = get_system_or_404(system_id, db)
    return system.assessments
