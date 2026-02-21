"""
POST /sensor-data  – Ingestion endpoint for the ESP32 device.
After persisting each reading the payload is broadcast via WebSocket
so connected frontend charts update in real time without polling.
"""

from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from app import crud, schemas
from app.database import get_db
from app.ws_manager import ws_manager

router = APIRouter(prefix="/sensor-data", tags=["Sensor Ingestion"])


@router.post(
    "",
    response_model=schemas.AckOut,
    status_code=status.HTTP_201_CREATED,
    summary="Ingest sensor reading from ESP32",
    description=(
        "ESP32 calls this endpoint after every ML inference cycle. "
        "Backend classifies severity and estimates energy/water saved. "
        "A LeakEvent record is automatically created when `leak_detected=true`. "
        "All connected WebSocket clients receive the new reading instantly."
    ),
)
async def ingest_sensor_data(
    payload: schemas.SensorDataIn,
    db: Session = Depends(get_db),
):
    # ── Persist reading (severity classified inside crud) ─────────────────────
    reading = crud.create_sensor_reading(db, payload)

    event = None
    if payload.leak_detected:
        event = crud.create_leak_event(db, reading)

    # ── Build WebSocket broadcast payload ─────────────────────────────────────
    ws_payload = schemas.WSBroadcastPayload(
        type="sensor_update",
        flow_rate=reading.flow_rate,
        pressure=reading.pressure,
        vibration=reading.vibration,
        water_level=reading.water_level,
        leak_detected=reading.leak_detected,
        pump_state=reading.pump_state,
        ml_confidence=reading.ml_confidence,
        severity=reading.severity or "LOW",
        timestamp=reading.timestamp.isoformat(),
        water_saved=event.water_saved if event else None,
        energy_saved_kwh=event.energy_saved_kwh if event else None,
        co2_saved_kg=event.co2_saved_kg if event else None,
    )

    # ── Non-blocking broadcast to all WS clients ──────────────────────────────
    await ws_manager.broadcast(ws_payload.model_dump())

    return schemas.AckOut(status="ok")
