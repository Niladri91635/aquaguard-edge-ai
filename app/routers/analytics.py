"""
GET /analytics/live      – Latest sensor snapshot (frontend polls every second).
GET /analytics/summary   – Cumulative metrics for the main dashboard.
GET /dashboard           – All widgets in one shot.
"""

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app import crud, schemas
from app.database import get_db

router = APIRouter(prefix="/analytics", tags=["Analytics"])


@router.get(
    "/live",
    response_model=schemas.LiveAnalyticsOut,
    summary="Latest sensor snapshot",
    description="Returns the most recent reading stored in the database. Frontend polls this every second.",
)
def get_live(db: Session = Depends(get_db)):
    reading = crud.get_latest_reading(db)
    if reading is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No sensor data received yet. Waiting for ESP32.",
        )
    return schemas.LiveAnalyticsOut(
        flow_rate=reading.flow_rate,
        pressure=reading.pressure,
        vibration=reading.vibration,
        water_level=reading.water_level,
        leak_detected=reading.leak_detected,
        pump_state=reading.pump_state,
        ml_confidence=reading.ml_confidence,
        severity=reading.severity,
        timestamp=reading.timestamp,
    )


@router.get(
    "/summary",
    response_model=schemas.SummaryOut,
    summary="Cumulative analytics summary",
    description="Aggregated totals: water saved, leak events, ml confidence, efficiency rating.",
)
def get_summary(db: Session = Depends(get_db)):
    return crud.build_summary(db)
