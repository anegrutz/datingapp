"""Article 50 transparency endpoints and embeddable widget (Module 4)."""

from __future__ import annotations

from pathlib import Path

from fastapi import APIRouter, Depends, Query
from fastapi.responses import Response
from sqlalchemy.orm import Session

from .. import schemas
from ..database import get_db
from ..services.transparency import SUPPORTED_LANGUAGES, generate_disclosure
from .systems import get_system_or_404

router = APIRouter(prefix="/api", tags=["transparency"])

_WIDGET_JS = (Path(__file__).resolve().parent.parent / "static" / "widget.js").read_text()


@router.post("/systems/{system_id}/disclosure")
def get_disclosure(
    system_id: int,
    payload: schemas.DisclosureRequest,
    db: Session = Depends(get_db),
):
    """Disclosure payload for a system — consumed by the widget or any UI."""
    system = get_system_or_404(system_id, db)
    return generate_disclosure(
        system_name=system.name,
        intended_purpose=system.intended_purpose,
        interaction_type=payload.interaction_type,
        language=payload.language,
        capabilities_limitations=payload.capabilities_limitations,
        human_oversight=payload.human_oversight,
    )


@router.get("/transparency/languages")
def list_languages():
    return {"supported_languages": SUPPORTED_LANGUAGES}


@router.get("/widget.js")
def widget_js(
    system_id: int = Query(..., description="AI system id to disclose"),
    db: Session = Depends(get_db),
):
    """Embeddable disclosure widget.

    Usage on a customer page:
        <script src="https://<host>/api/widget.js?system_id=1" defer></script>
    """
    get_system_or_404(system_id, db)
    js = _WIDGET_JS.replace("__SYSTEM_ID__", str(system_id))
    return Response(content=js, media_type="application/javascript")
