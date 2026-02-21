"""
AquaGuard Edge AI  –  FastAPI backend entry point.
Adds:
  • CORS middleware
  • WebSocket endpoint  ws://host/ws  (real-time sensor broadcast)
  • REST routers
"""

import asyncio
import logging

from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware

from app.config import settings
from app.database import create_tables
from app.routers import analytics, events, sensor, system
from app.ws_manager import ws_manager

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("aquaguard")

# ─── Application instance ─────────────────────────────────────────────────────
app = FastAPI(
    title=settings.APP_NAME,
    version=settings.APP_VERSION,
    description=(
        "REST + WebSocket backend for the AquaGuard Edge AI water-leak detection system. "
        "Accepts sensor data from ESP32 devices, classifies severity, estimates energy "
        "savings, and pushes real-time updates to the React dashboard via WebSocket."
    ),
    docs_url="/docs",
    redoc_url="/redoc",
)

# ─── CORS ─────────────────────────────────────────────────────────────────────
origins = [o.strip() for o in settings.CORS_ORIGINS.split(",") if o.strip()]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ─── Startup ──────────────────────────────────────────────────────────────────
@app.on_event("startup")
def on_startup():
    create_tables()
    logger.info("✅  %s %s started.", settings.APP_NAME, settings.APP_VERSION)
    logger.info("📄  Swagger UI  →  http://127.0.0.1:8000/docs")
    logger.info("🔌  WebSocket   →  ws://127.0.0.1:8000/ws")

# ─── REST Routers ─────────────────────────────────────────────────────────────
app.include_router(sensor.router)
app.include_router(analytics.router)
app.include_router(events.router)
app.include_router(system.router)

# ─── WebSocket endpoint ───────────────────────────────────────────────────────
@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    """
    Real-time sensor broadcast.

    Connect with:  ws://127.0.0.1:8000/ws

    Messages received:
      • type="sensor_update"  – every time POST /sensor-data is called
      • type="ping"           – keep-alive every 30 seconds

    The frontend should handle reconnect on close.
    """
    await ws_manager.connect(websocket)
    try:
        while True:
            # Keep the connection alive; client can send any text (ignored)
            try:
                await asyncio.wait_for(websocket.receive_text(), timeout=30)
            except asyncio.TimeoutError:
                # Send a keep-alive ping so proxies don't drop idle connections
                await ws_manager.broadcast_ping()
    except WebSocketDisconnect:
        ws_manager.disconnect(websocket)

# ─── Health check ─────────────────────────────────────────────────────────────
@app.get("/", tags=["Health"], summary="Health check")
def root():
    return {
        "service": settings.APP_NAME,
        "version": settings.APP_VERSION,
        "status": "running",
        "ws_clients": ws_manager.connection_count,
    }

@app.get("/ws/info", tags=["Health"], summary="WebSocket connection info")
def ws_info():
    """Returns the number of currently connected WebSocket clients."""
    return {"ws_clients_connected": ws_manager.connection_count}
