from datetime import datetime
from typing import Literal, Optional

from pydantic import BaseModel, Field


# ─── Inbound – ESP32 → POST /sensor-data ─────────────────────────────────────
class SensorDataIn(BaseModel):
    flow_rate: float = Field(..., ge=0, description="Flow rate in L/min")
    pressure: float = Field(..., ge=0, description="Pressure in kPa")
    vibration: float = Field(..., ge=0, description="Vibration amplitude")
    water_level: float = Field(..., ge=0, description="Water level in cm")
    leak_detected: bool = Field(..., description="ML inference result")
    pump_state: Literal["ON", "OFF"] = Field(..., description="Current pump state")
    ml_confidence: float = Field(..., ge=0.0, le=1.0, description="Model confidence 0-1")

    model_config = {
        "json_schema_extra": {
            "example": {
                "flow_rate": 2.5,
                "pressure": 118,
                "vibration": 0.32,
                "water_level": 12.6,
                "leak_detected": True,
                "pump_state": "OFF",
                "ml_confidence": 0.94,
            }
        }
    }


# ─── Outbound – GET /analytics/live ──────────────────────────────────────────
class LiveAnalyticsOut(BaseModel):
    flow_rate: float
    pressure: float
    vibration: float
    water_level: float
    leak_detected: bool
    pump_state: str
    ml_confidence: float
    severity: Optional[str] = None          # severity of latest reading
    timestamp: datetime

    model_config = {"from_attributes": True}


# ─── Outbound – GET /analytics/summary ───────────────────────────────────────
class SummaryOut(BaseModel):
    total_water_saved: float                # litres
    total_leak_events: int
    avg_leak_detection_time: float          # seconds (approximated)
    avg_ml_confidence: float
    efficiency_percent: float
    # ── NEW: sustainability metrics ──
    total_energy_saved_kwh: float           # kWh saved across all leak events
    total_co2_saved_kg: float               # kg CO₂ avoided
    # ── NEW: severity breakdown ──
    severity_breakdown: dict[str, int]      # {"LOW": n, "MEDIUM": n, ...}


# ─── Outbound – GET /analytics/events (list item) ────────────────────────────
class LeakEventOut(BaseModel):
    timestamp: datetime
    flow_rate: float
    pressure: float
    water_level: float
    ml_confidence: float
    severity: str
    water_saved: float
    energy_saved_kwh: float
    co2_saved_kg: float

    model_config = {"from_attributes": True}


# ─── Outbound – GET /system/status ───────────────────────────────────────────
class SensorStatusOut(BaseModel):
    flow: str
    pressure: str
    vibration: str
    ultrasonic: str


class SystemStatusOut(BaseModel):
    edge_model: str
    edge_last_inference: Optional[datetime]
    sensor_status: SensorStatusOut


# ─── Outbound – GET /dashboard ───────────────────────────────────────────────
class DashboardOut(BaseModel):
    live: Optional[LiveAnalyticsOut]
    summary: SummaryOut
    recent_events: list[LeakEventOut]
    system: SystemStatusOut


# ─── WebSocket broadcast payload ─────────────────────────────────────────────
class WSBroadcastPayload(BaseModel):
    type: str = "sensor_update"
    flow_rate: float
    pressure: float
    vibration: float
    water_level: float
    leak_detected: bool
    pump_state: str
    ml_confidence: float
    severity: str
    timestamp: str                          # ISO-8601 string (JSON-serialisable)
    # Only present when leak_detected=True
    water_saved: Optional[float] = None
    energy_saved_kwh: Optional[float] = None
    co2_saved_kg: Optional[float] = None


# ─── Generic ACK ─────────────────────────────────────────────────────────────
class AckOut(BaseModel):
    status: str = "ok"
