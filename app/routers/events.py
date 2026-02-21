"""
GET /analytics/events  – Paginated list of all leak event records.
Includes severity, energy saved, and CO₂ avoided per event.
"""

from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from app import crud, schemas
from app.database import get_db

router = APIRouter(prefix="/analytics", tags=["Events"])


@router.get(
    "/events",
    response_model=list[schemas.LeakEventOut],
    summary="Leak event history",
    description=(
        "Returns all recorded leak events ordered most-recent first. "
        "Each entry includes severity classification, water saved (L), "
        "energy saved (kWh), and CO₂ avoided (kg). "
        "Use `skip` + `limit` for pagination."
    ),
)
def get_events(
    skip: int = Query(0, ge=0, description="Records to skip"),
    limit: int = Query(200, ge=1, le=1000, description="Max records to return"),
    severity: str | None = Query(
        None, description="Filter by severity: LOW | MEDIUM | HIGH | CRITICAL"
    ),
    db: Session = Depends(get_db),
):
    events = crud.get_all_leak_events(db, skip=skip, limit=limit)

    # Optional server-side severity filter
    if severity:
        events = [e for e in events if e.severity == severity.upper()]

    return [
        schemas.LeakEventOut(
            timestamp=e.timestamp,
            flow_rate=e.flow_rate,
            pressure=e.pressure,
            water_level=e.water_level,
            ml_confidence=e.ml_confidence,
            severity=e.severity,
            water_saved=e.water_saved,
            energy_saved_kwh=e.energy_saved_kwh,
            co2_saved_kg=e.co2_saved_kg,
        )
        for e in events
    ]
