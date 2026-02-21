from datetime import datetime

from sqlalchemy import Boolean, Column, DateTime, Float, Integer, String

from app.database import Base


class SensorReading(Base):
    """Stores every raw payload pushed by the ESP32."""

    __tablename__ = "sensor_readings"

    id = Column(Integer, primary_key=True, index=True)
    timestamp = Column(DateTime, default=datetime.utcnow, index=True)

    flow_rate = Column(Float, nullable=False)
    pressure = Column(Float, nullable=False)
    vibration = Column(Float, nullable=False)
    water_level = Column(Float, nullable=False)
    leak_detected = Column(Boolean, default=False)
    pump_state = Column(String(10), nullable=False)      # "ON" | "OFF"
    ml_confidence = Column(Float, nullable=False)

    # Computed by backend at ingest time
    severity = Column(String(10), nullable=True)         # LOW/MEDIUM/HIGH/CRITICAL


class LeakEvent(Base):
    """Created automatically whenever a sensor reading carries a leak flag."""

    __tablename__ = "leak_events"

    id = Column(Integer, primary_key=True, index=True)
    timestamp = Column(DateTime, default=datetime.utcnow, index=True)

    flow_rate = Column(Float, nullable=False)
    pressure = Column(Float, nullable=False)
    water_level = Column(Float, nullable=False)
    ml_confidence = Column(Float, nullable=False)

    # Severity level classified by backend
    severity = Column(String(10), nullable=False, default="LOW")

    # Sustainability metrics
    water_saved = Column(Float, default=0.0)         # litres
    energy_saved_kwh = Column(Float, default=0.0)    # kilowatt-hours
    co2_saved_kg = Column(Float, default=0.0)        # kg of CO₂ avoided
