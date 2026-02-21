# AquaGuard Edge AI — Backend

FastAPI-based REST API backend for the **AquaGuard Edge AI** water-leak detection system.
Designed to pair with the React/Vite frontend and receive sensor data from ESP32 edge devices.

---

## Architecture

```
backend/
├── app/
│   ├── main.py          ← FastAPI app factory + CORS + startup
│   ├── config.py        ← Env-based settings (pydantic-settings)
│   ├── database.py      ← SQLAlchemy engine, session, Base
│   ├── models.py        ← ORM models (SensorReading, LeakEvent)
│   ├── schemas.py       ← Pydantic request/response schemas
│   ├── crud.py          ← All DB queries
│   ├── calculations.py  ← Pure business logic (water saved, efficiency)
│   └── routers/
│       ├── sensor.py    ← POST /sensor-data
│       ├── analytics.py ← GET /analytics/live  GET /analytics/summary
│       ├── events.py    ← GET /analytics/events
│       └── system.py    ← GET /system/status  GET /dashboard
├── uvicorn_conf.py      ← Convenience launcher
├── requirements.txt
├── .env.example
└── README.md
```

---

## Quick Start

### 1 — Create & activate a virtual environment

```bash
python -m venv venv
# Windows
venv\Scripts\activate
# macOS/Linux
source venv/bin/activate
```

### 2 — Install dependencies

```bash
pip install -r requirements.txt
```

### 3 — Configure environment

```bash
cp .env.example .env
# edit .env if needed (SQLite default works out of the box)
```

### 4 — Run the server

```bash
python uvicorn_conf.py
# or
uvicorn app.main:app --reload
```

Server starts at **http://127.0.0.1:8000**

---

## Interactive API Docs

| UI | URL |
|---|---|
| Swagger UI | http://127.0.0.1:8000/docs |
| ReDoc | http://127.0.0.1:8000/redoc |

---

## API Reference

### `POST /sensor-data`
ESP32 sends a sensor payload after every ML inference cycle.

**Request body:**
```json
{
  "flow_rate": 2.5,
  "pressure": 118,
  "vibration": 0.32,
  "water_level": 12.6,
  "leak_detected": true,
  "pump_state": "OFF",
  "ml_confidence": 0.94
}
```
**Response:** `{ "status": "ok" }` — A `LeakEvent` record is auto-created when `leak_detected=true`.

---

### `GET /analytics/live`
Latest sensor snapshot. Frontend polls this every second.

```json
{
  "flow_rate": 2.5,
  "pressure": 118,
  "vibration": 0.32,
  "water_level": 12.6,
  "leak_detected": false,
  "pump_state": "ON",
  "ml_confidence": 0.87,
  "timestamp": "2026-02-15T12:34:56.789Z"
}
```

---

### `GET /analytics/summary`
Cumulative metrics for main dashboard KPI cards.

```json
{
  "total_water_saved": 125.6,
  "total_leak_events": 4,
  "avg_leak_detection_time": 3.1,
  "avg_ml_confidence": 0.91,
  "efficiency_percent": 92.4
}
```

---

### `GET /analytics/events?skip=0&limit=200`
Paginated history of all leak events.

```json
[
  {
    "timestamp": "2026-02-15T12:15:23.456Z",
    "flow_rate": 3.2,
    "pressure": 110,
    "water_level": 8.76,
    "ml_confidence": 0.94,
    "water_saved": 12.5
  }
]
```

---

### `GET /system/status`
Edge device and sensor health.

```json
{
  "edge_model": "v1.0",
  "edge_last_inference": "2026-02-15T12:34:56Z",
  "sensor_status": {
    "flow": "ok",
    "pressure": "ok",
    "vibration": "ok",
    "ultrasonic": "ok"
  }
}
```

---

### `GET /dashboard`
All widget data in one aggregated response (useful for initial page load).

---

## Database

Default: **SQLite** (`aquaguard.db` created automatically on first run).

To switch to PostgreSQL, update `DATABASE_URL` in `.env`:
```
DATABASE_URL=postgresql://user:password@localhost:5432/aquaguard
```

---

## ESP32 Integration

Point the ESP32 HTTP client to:
```
POST http://<server-ip>:8000/sensor-data
Content-Type: application/json
```

Send the JSON payload above after every inference cycle.

---

## Production Deployment

```bash
uvicorn app.main:app --host 0.0.0.0 --port 8000 --workers 4
```

For production, set `DEBUG=false` in `.env` and switch to PostgreSQL.
