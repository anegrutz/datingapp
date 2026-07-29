"""Pydantic request/response schemas for the API."""

from __future__ import annotations

from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field

from .services.risk_classifier import AssessmentAnswers
from .services.transparency import InteractionType


# --- AI system inventory -----------------------------------------------------

class AISystemCreate(BaseModel):
    name: str = Field(min_length=1, max_length=200)
    description: str | None = None
    intended_purpose: str | None = None
    provider_name: str | None = None
    operator_role: str = Field(
        "provider",
        pattern="^(provider|deployer|importer|distributor)$",
        description="Role of this organisation for the system (Art. 2).",
    )
    version: str = "0.1.0"
    lifecycle_status: str = Field(
        "development",
        pattern="^(development|testing|production|retired)$",
    )
    owner_email: str | None = None


class AISystemUpdate(BaseModel):
    name: str | None = Field(None, min_length=1, max_length=200)
    description: str | None = None
    intended_purpose: str | None = None
    provider_name: str | None = None
    operator_role: str | None = Field(None, pattern="^(provider|deployer|importer|distributor)$")
    version: str | None = None
    lifecycle_status: str | None = Field(
        None, pattern="^(development|testing|production|retired)$"
    )
    owner_email: str | None = None


class AISystemOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    name: str
    description: str | None
    intended_purpose: str | None
    provider_name: str | None
    operator_role: str
    version: str
    lifecycle_status: str
    owner_email: str | None
    created_at: datetime
    updated_at: datetime
    latest_tier: str | None = None


# --- Risk classification -----------------------------------------------------

class ClassificationRequest(BaseModel):
    answers: AssessmentAnswers


class ClassificationResult(BaseModel):
    tier: str
    matched_provisions: list[str]
    rationale: list[str]
    obligations: list[dict[str, str]]
    transparency_duties: list[str]


class RiskAssessmentOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    system_id: int
    tier: str
    result: dict
    created_at: datetime


# --- Technical documentation ---------------------------------------------------

class DocumentGenerateRequest(BaseModel):
    hardware_description: str | None = None
    training_data_description: str | None = None
    human_oversight_measures: str | None = None
    accuracy_metrics: str | None = None
    risk_management_summary: str | None = None
    lifecycle_changes: str | None = None
    standards_applied: str | None = None


class TechnicalDocumentOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    system_id: int
    version: str
    content_markdown: str
    created_at: datetime


# --- Transparency ---------------------------------------------------------------

class DisclosureRequest(BaseModel):
    interaction_type: InteractionType
    language: str = "en"
    capabilities_limitations: str | None = None
    human_oversight: str | None = None
