"""
Production-grade Uvicorn launcher.
Run directly:  python uvicorn_conf.py
Or via CLI:    uvicorn app.main:app --reload
"""

import uvicorn

if __name__ == "__main__":
    uvicorn.run(
        "app.main:app",
        host="0.0.0.0",
        port=8000,
        reload=True,          # auto-reload on code changes (dev)
        log_level="info",
        access_log=True,
    )
