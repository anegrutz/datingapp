"""AI system inventory endpoints (Module 1)."""

from __future__ import annotations

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.orm import Session

from .. import models, schemas
from ..database import get_db

router = APIRouter(prefix="/api/systems", tags=["inventory"])


def _with_latest_tier(system: models.AISystem) -> schemas.AISystemOut:
    out = schemas.AISystemOut.model_validate(system)
    out.latest_tier = system.assessments[0].tier if system.assessments else None
    return out


def get_system_or_404(system_id: int, db: Session) -> models.AISystem:
    system = db.get(models.AISystem, system_id)
    if system is None:
        raise HTTPException(status_code=404, detail="AI system not found")
    return system


@router.post("", response_model=schemas.AISystemOut, status_code=201)
def create_system(payload: schemas.AISystemCreate, db: Session = Depends(get_db)):
    system = models.AISystem(**payload.model_dump())
    db.add(system)
    db.commit()
    db.refresh(system)
    return _with_latest_tier(system)


@router.get("", response_model=list[schemas.AISystemOut])
def list_systems(db: Session = Depends(get_db)):
    systems = db.scalars(select(models.AISystem).order_by(models.AISystem.id)).all()
    return [_with_latest_tier(s) for s in systems]


@router.get("/{system_id}", response_model=schemas.AISystemOut)
def get_system(system_id: int, db: Session = Depends(get_db)):
    return _with_latest_tier(get_system_or_404(system_id, db))


@router.patch("/{system_id}", response_model=schemas.AISystemOut)
def update_system(
    system_id: int, payload: schemas.AISystemUpdate, db: Session = Depends(get_db)
):
    system = get_system_or_404(system_id, db)
    for key, value in payload.model_dump(exclude_unset=True).items():
        setattr(system, key, value)
    db.commit()
    db.refresh(system)
    return _with_latest_tier(system)


@router.delete("/{system_id}", status_code=204)
def delete_system(system_id: int, db: Session = Depends(get_db)):
    system = get_system_or_404(system_id, db)
    db.delete(system)
    db.commit()
