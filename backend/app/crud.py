"""
CRUD helpers – all raw DB queries live here.
Routers stay thin; they only call these functions.
"""

from typing import Optional

from sqlalchemy import func
from sqlalchemy.orm import Session

from app import models, schemas
from app.calculations import (
    calculate_efficiency,
    classify_severity,
    derive_sensor_statuses,
    estimate_co2_saved_kg,
    estimate_energy_saved_kwh,
    estimate_water_saved,
)


# ─── SensorReading ────────────────────────────────────────────────────────────

def create_sensor_reading(db: Session, payload: schemas.SensorDataIn) -> models.SensorReading:
    severity = classify_severity(
        payload.flow_rate, payload.pressure, payload.vibration, payload.ml_confidence
    )
    reading = models.SensorReading(**payload.model_dump(), severity=severity)
    db.add(reading)
    db.commit()
    db.refresh(reading)
    return reading


def get_latest_reading(db: Session) -> Optional[models.SensorReading]:
    return (
        db.query(models.SensorReading)
        .order_by(models.SensorReading.timestamp.desc())
        .first()
    )


def count_all_readings(db: Session) -> int:
    return db.query(func.count(models.SensorReading.id)).scalar() or 0


def get_avg_ml_confidence(db: Session) -> float:
    result = db.query(func.avg(models.SensorReading.ml_confidence)).scalar()
    return round(float(result), 4) if result else 0.0


# ─── LeakEvent ────────────────────────────────────────────────────────────────

def create_leak_event(db: Session, reading: models.SensorReading) -> models.LeakEvent:
    water_saved = estimate_water_saved(reading.flow_rate)
    energy_kwh  = estimate_energy_saved_kwh()
    co2_kg      = estimate_co2_saved_kg(energy_kwh)

    event = models.LeakEvent(
        timestamp=reading.timestamp,
        flow_rate=reading.flow_rate,
        pressure=reading.pressure,
        water_level=reading.water_level,
        ml_confidence=reading.ml_confidence,
        severity=reading.severity or "LOW",
        water_saved=water_saved,
        energy_saved_kwh=energy_kwh,
        co2_saved_kg=co2_kg,
    )
    db.add(event)
    db.commit()
    db.refresh(event)
    return event


def get_all_leak_events(db: Session, skip: int = 0, limit: int = 200) -> list[models.LeakEvent]:
    return (
        db.query(models.LeakEvent)
        .order_by(models.LeakEvent.timestamp.desc())
        .offset(skip)
        .limit(limit)
        .all()
    )


def count_leak_events(db: Session) -> int:
    return db.query(func.count(models.LeakEvent.id)).scalar() or 0


def get_total_water_saved(db: Session) -> float:
    result = db.query(func.sum(models.LeakEvent.water_saved)).scalar()
    return round(float(result), 4) if result else 0.0


def get_total_energy_saved(db: Session) -> float:
    result = db.query(func.sum(models.LeakEvent.energy_saved_kwh)).scalar()
    return round(float(result), 6) if result else 0.0


def get_total_co2_saved(db: Session) -> float:
    result = db.query(func.sum(models.LeakEvent.co2_saved_kg)).scalar()
    return round(float(result), 6) if result else 0.0


def get_severity_breakdown(db: Session) -> dict[str, int]:
    """Return count of leak events grouped by severity level."""
    rows = (
        db.query(models.LeakEvent.severity, func.count(models.LeakEvent.id))
        .group_by(models.LeakEvent.severity)
        .all()
    )
    # Ensure all 4 levels are always present in the dict
    base = {"LOW": 0, "MEDIUM": 0, "HIGH": 0, "CRITICAL": 0}
    for severity, count in rows:
        base[severity] = count
    return base


# ─── Composite helpers ────────────────────────────────────────────────────────

def build_summary(db: Session) -> schemas.SummaryOut:
    total_events   = count_leak_events(db)
    total_readings = count_all_readings(db)
    avg_conf       = get_avg_ml_confidence(db)
    total_saved    = get_total_water_saved(db)
    energy_saved   = get_total_energy_saved(db)
    co2_saved      = get_total_co2_saved(db)
    efficiency     = calculate_efficiency(total_events, total_readings, avg_conf)
    breakdown      = get_severity_breakdown(db)

    # Approximate avg detection time (confidence proxy):
    # lower confidence → longer detection time
    avg_detection_time = round(30.0 * (1 - avg_conf), 2) if avg_conf else 0.0

    return schemas.SummaryOut(
        total_water_saved=total_saved,
        total_leak_events=total_events,
        avg_leak_detection_time=avg_detection_time,
        avg_ml_confidence=avg_conf,
        efficiency_percent=efficiency,
        total_energy_saved_kwh=energy_saved,
        total_co2_saved_kg=co2_saved,
        severity_breakdown=breakdown,
    )


def build_system_status(db: Session, model_version: str) -> schemas.SystemStatusOut:
    latest = get_latest_reading(db)
    sensor_statuses = derive_sensor_statuses(latest)

    return schemas.SystemStatusOut(
        edge_model=model_version,
        edge_last_inference=latest.timestamp if latest else None,
        sensor_status=schemas.SensorStatusOut(**sensor_statuses),
    )
