"""
Pure business-logic helpers – no FastAPI / HTTP dependencies here.
All functions are stateless and unit-testable in isolation.
"""

from typing import Literal

# ─── Constants ────────────────────────────────────────────────────────────────
# Pump-off detection window used for water/energy saved estimation
DETECTION_WINDOW_SECONDS: float = 30.0

# Typical industrial pump power consumption (kW)
PUMP_POWER_KW: float = 2.5

# kg CO₂ emitted per kWh of electricity (India grid emission factor 2024)
CO2_KG_PER_KWH: float = 0.708

# Severity thresholds (composite score 0-1)
SEVERITY_CRITICAL_THRESHOLD: float = 0.90
SEVERITY_HIGH_THRESHOLD: float = 0.75
SEVERITY_MEDIUM_THRESHOLD: float = 0.55

SeverityLevel = Literal["LOW", "MEDIUM", "HIGH", "CRITICAL"]


# ─── 1. Water saved ───────────────────────────────────────────────────────────

def estimate_water_saved(
    flow_rate: float,
    window_seconds: float = DETECTION_WINDOW_SECONDS,
) -> float:
    """
    Estimate litres saved by shutting the pump during a detected leak.
    Formula: flow_rate (L/min) × window (s) / 60
    """
    return round(flow_rate * window_seconds / 60.0, 4)


# ─── 2. Energy saved ──────────────────────────────────────────────────────────

def estimate_energy_saved_kwh(
    pump_power_kw: float = PUMP_POWER_KW,
    window_seconds: float = DETECTION_WINDOW_SECONDS,
) -> float:
    """
    Estimate kWh saved by turning the pump off during a leak event.
    Formula: pump_power (kW) × window (h)
    """
    window_hours = window_seconds / 3600.0
    return round(float(pump_power_kw * window_hours), 6)


def estimate_co2_saved_kg(energy_kwh: float) -> float:
    """
    Convert kWh saved → kg of CO₂ avoided.
    Uses India Central Electricity Authority grid emission factor (2024).
    """
    return round(float(energy_kwh * CO2_KG_PER_KWH), 6)


# ─── 3. Severity classification ───────────────────────────────────────────────

def classify_severity(
    flow_rate: float,
    pressure: float,
    vibration: float,
    ml_confidence: float,
) -> SeverityLevel:
    """
    Compute a composite severity score and map it to a named level.

    Scoring breakdown (sums to max 1.0):
      • Base score  → ml_confidence                (primary ML signal)
      • Pressure    → +0.08 if outside [60, 200]   (anomalous pressure)
      • Vibration   → +0.05 if vibration > 2.0     (structural stress)
      • Flow burst  → +0.05 if flow_rate > 15 L/min (high volume leak)

    Levels:
      ≥ 0.90 → CRITICAL
      ≥ 0.75 → HIGH
      ≥ 0.55 → MEDIUM
       < 0.55 → LOW
    """
    score = ml_confidence

    # Pressure anomaly (too high or too low both indicate problems)
    if not (60.0 <= pressure <= 200.0):
        score += 0.08

    # Structural vibration spike
    if vibration > 2.0:
        score += 0.05

    # Large-volume flow burst
    if flow_rate > 15.0:
        score += 0.05

    score = min(score, 1.0)

    if score >= SEVERITY_CRITICAL_THRESHOLD:
        return "CRITICAL"
    if score >= SEVERITY_HIGH_THRESHOLD:
        return "HIGH"
    if score >= SEVERITY_MEDIUM_THRESHOLD:
        return "MEDIUM"
    return "LOW"


# ─── 4. Efficiency ────────────────────────────────────────────────────────────

def calculate_efficiency(
    total_leak_events: int,
    total_readings: int,
    avg_ml_confidence: float,
) -> float:
    """
    Composite efficiency metric (0-100 %).
    Weights:
      • 60 % → clean-run rate  (1 - leak_events/total_readings)
      • 40 % → average ML confidence
    Returns 0.0 if no readings exist.
    """
    if total_readings == 0:
        return 0.0

    detection_rate = 1.0 - (total_leak_events / total_readings)
    detection_rate = max(0.0, min(detection_rate, 1.0))

    efficiency = (detection_rate * 0.6 + avg_ml_confidence * 0.4) * 100
    return round(efficiency, 2)


# ─── 5. Sensor health ─────────────────────────────────────────────────────────

def derive_sensor_statuses(latest) -> dict:
    """
    Derive OK / WARNING / CRITICAL status for each sensor channel
    based on sanity-range checks on the latest reading.
    Returns a dict compatible with SensorStatusOut.
    """
    if latest is None:
        return {
            "flow": "unknown",
            "pressure": "unknown",
            "vibration": "unknown",
            "ultrasonic": "unknown",
        }

    def check(value, lo, hi, crit_lo=None, crit_hi=None):
        if crit_lo is not None and value < crit_lo:
            return "critical"
        if crit_hi is not None and value > crit_hi:
            return "critical"
        return "ok" if lo <= value <= hi else "warning"

    return {
        "flow":      check(latest.flow_rate,   0,  50, crit_hi=80),
        "pressure":  check(latest.pressure,   60, 200, crit_lo=30, crit_hi=300),
        "vibration": check(latest.vibration,   0,   5, crit_hi=8),
        "ultrasonic":check(latest.water_level, 0, 100),
    }
