"""Annex IV technical documentation endpoints (Module 3)."""

from __future__ import annotations

from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import PlainTextResponse
from sqlalchemy.orm import Session

from .. import models, schemas
from ..database import get_db
from ..services.doc_generator import generate_annex_iv_document
from .systems import get_system_or_404

router = APIRouter(prefix="/api/systems/{system_id}/documents", tags=["documentation"])


@router.post("", response_model=schemas.TechnicalDocumentOut, status_code=201)
def generate_document(
    system_id: int,
    payload: schemas.DocumentGenerateRequest,
    db: Session = Depends(get_db),
):
    """Generate and store an Annex IV technical documentation snapshot."""
    system = get_system_or_404(system_id, db)
    latest_assessment = system.assessments[0] if system.assessments else None

    content = generate_annex_iv_document(
        system_name=system.name,
        version=system.version,
        provider_name=system.provider_name,
        intended_purpose=system.intended_purpose,
        description=system.description,
        classification=latest_assessment.result if latest_assessment else None,
        **payload.model_dump(),
    )
    document = models.TechnicalDocument(
        system_id=system.id, version=system.version, content_markdown=content
    )
    db.add(document)
    db.commit()
    db.refresh(document)
    return document


@router.get("", response_model=list[schemas.TechnicalDocumentOut])
def list_documents(system_id: int, db: Session = Depends(get_db)):
    system = get_system_or_404(system_id, db)
    return system.documents


@router.get("/{document_id}/markdown", response_class=PlainTextResponse)
def download_markdown(system_id: int, document_id: int, db: Session = Depends(get_db)):
    get_system_or_404(system_id, db)
    document = db.get(models.TechnicalDocument, document_id)
    if document is None or document.system_id != system_id:
        raise HTTPException(status_code=404, detail="Document not found")
    return document.content_markdown
