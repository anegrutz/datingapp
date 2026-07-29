"""SQLAlchemy ORM models for the compliance platform."""

from __future__ import annotations

from datetime import datetime, timezone

from sqlalchemy import JSON, DateTime, ForeignKey, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from .database import Base


def _utcnow() -> datetime:
    return datetime.now(timezone.utc)


class AISystem(Base):
    """An entry in the organisation's AI system inventory."""

    __tablename__ = "ai_systems"

    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String(200), index=True)
    description: Mapped[str | None] = mapped_column(Text, nullable=True)
    intended_purpose: Mapped[str | None] = mapped_column(Text, nullable=True)
    provider_name: Mapped[str | None] = mapped_column(String(200), nullable=True)
    operator_role: Mapped[str] = mapped_column(String(50), default="provider")
    version: Mapped[str] = mapped_column(String(50), default="0.1.0")
    lifecycle_status: Mapped[str] = mapped_column(String(50), default="development")
    owner_email: Mapped[str | None] = mapped_column(String(200), nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=_utcnow)
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), default=_utcnow, onupdate=_utcnow
    )

    assessments: Mapped[list["RiskAssessment"]] = relationship(
        back_populates="system", cascade="all, delete-orphan", order_by="RiskAssessment.id.desc()"
    )
    documents: Mapped[list["TechnicalDocument"]] = relationship(
        back_populates="system", cascade="all, delete-orphan", order_by="TechnicalDocument.id.desc()"
    )


class RiskAssessment(Base):
    """A stored run of the risk classification engine for a system."""

    __tablename__ = "risk_assessments"

    id: Mapped[int] = mapped_column(primary_key=True)
    system_id: Mapped[int] = mapped_column(ForeignKey("ai_systems.id"), index=True)
    answers: Mapped[dict] = mapped_column(JSON)
    tier: Mapped[str] = mapped_column(String(20), index=True)
    result: Mapped[dict] = mapped_column(JSON)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=_utcnow)

    system: Mapped[AISystem] = relationship(back_populates="assessments")


class TechnicalDocument(Base):
    """A generated Annex IV technical documentation snapshot."""

    __tablename__ = "technical_documents"

    id: Mapped[int] = mapped_column(primary_key=True)
    system_id: Mapped[int] = mapped_column(ForeignKey("ai_systems.id"), index=True)
    version: Mapped[str] = mapped_column(String(50))
    content_markdown: Mapped[str] = mapped_column(Text)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=_utcnow)

    system: Mapped[AISystem] = relationship(back_populates="documents")
