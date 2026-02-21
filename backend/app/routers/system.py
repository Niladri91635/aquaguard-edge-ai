"""
GET /system/status  – Device health and edge model info.
GET /dashboard      – All widget data in one aggregated response.
"""

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app import crud, schemas
from app.config import settings
from app.database import get_db

router = APIRouter(tags=["System"])


@router.get(
    "/system/status",
    response_model=schemas.SystemStatusOut,
    summary="Edge device and sensor health",
    description=(
        "Returns the current edge model version, timestamp of the last ML inference, "
        "and per-sensor health derived from the latest reading."
    ),
)
def get_system_status(db: Session = Depends(get_db)):
    return crud.build_system_status(db, settings.EDGE_MODEL_VERSION)


@router.get(
    "/dashboard",
    response_model=schemas.DashboardOut,
    summary="All widget data in one request",
    description=(
        "Aggregated endpoint that returns live snapshot, summary stats, "
        "the 10 most recent leak events, and system status – "
        "useful for the main dashboard page initial load."
    ),
)
def get_dashboard(db: Session = Depends(get_db)):
    latest = crud.get_latest_reading(db)

    live_data = None
    if latest:
        live_data = schemas.LiveAnalyticsOut(
            flow_rate=latest.flow_rate,
            pressure=latest.pressure,
            vibration=latest.vibration,
            water_level=latest.water_level,
            leak_detected=latest.leak_detected,
            pump_state=latest.pump_state,
            ml_confidence=latest.ml_confidence,
            severity=latest.severity,
            timestamp=latest.timestamp,
        )

    summary = crud.build_summary(db)
    system = crud.build_system_status(db, settings.EDGE_MODEL_VERSION)

    recent_raw = crud.get_all_leak_events(db, skip=0, limit=10)
    recent_events = [
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
        for e in recent_raw
    ]

    return schemas.DashboardOut(
        live=live_data,
        summary=summary,
        recent_events=recent_events,
        system=system,
    )
