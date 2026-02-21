"""
WebSocket Connection Manager
────────────────────────────
Maintains a list of active WebSocket connections and broadcasts
new sensor data to all connected frontend clients in real time.

Usage
-----
  from app.ws_manager import ws_manager

  # In a WebSocket endpoint:
  await ws_manager.connect(websocket)

  # After persisting a sensor reading:
  await ws_manager.broadcast(payload_dict)
"""

import asyncio
import json
import logging
from typing import List

from fastapi import WebSocket

logger = logging.getLogger("aquaguard.ws")


class ConnectionManager:
    def __init__(self) -> None:
        self._connections: List[WebSocket] = []

    # ── Connection lifecycle ──────────────────────────────────────────────────

    async def connect(self, websocket: WebSocket) -> None:
        await websocket.accept()
        self._connections.append(websocket)
        logger.info("WS client connected  – total: %d", len(self._connections))

    def disconnect(self, websocket: WebSocket) -> None:
        if websocket in self._connections:
            self._connections.remove(websocket)
        logger.info("WS client disconnected – total: %d", len(self._connections))

    # ── Broadcasting ──────────────────────────────────────────────────────────

    async def broadcast(self, data: dict) -> None:
        """
        Send `data` as a JSON string to every active connection.
        Dead/stale connections are silently pruned.
        """
        if not self._connections:
            return

        message = json.dumps(data, default=str)   # default=str handles datetimes
        dead: List[WebSocket] = []

        for ws in list(self._connections):
            try:
                await ws.send_text(message)
            except Exception as exc:
                logger.debug("WS send failed (%s) – marking for removal", exc)
                dead.append(ws)

        for ws in dead:
            self.disconnect(ws)

    async def broadcast_ping(self) -> None:
        """Send a keep-alive ping to all clients."""
        await self.broadcast({"type": "ping"})

    # ── Info ──────────────────────────────────────────────────────────────────

    @property
    def connection_count(self) -> int:
        return len(self._connections)


# Singleton – imported by routers
ws_manager = ConnectionManager()
