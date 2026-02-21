r"""
Full diagnostic test for AquaGuard backend.
Run: venv\Scripts\python diagnose.py
"""
import urllib.request
import urllib.error
import json
import sys
import time

BASE = "http://127.0.0.1:8000"
PASS = "\033[92m PASS\033[0m"
FAIL = "\033[91m FAIL\033[0m"

results = []

def check(label, fn):
    try:
        val = fn()
        print(f"  {PASS}  {label}")
        results.append((label, True, None))
        return val
    except Exception as e:
        print(f"  {FAIL}  {label}  →  {e}")
        results.append((label, False, str(e)))
        return None

def get(path):
    r = urllib.request.urlopen(f"{BASE}{path}", timeout=10)
    return json.loads(r.read())

def post(path, data):
    body = json.dumps(data).encode()
    req = urllib.request.Request(
        f"{BASE}{path}", data=body, method="POST",
        headers={"Content-Type": "application/json"},
    )
    r = urllib.request.urlopen(req, timeout=10)
    return json.loads(r.read())

print("\n" + "="*60)
print("  AquaGuard Backend Diagnostic")
print("="*60)

# ── 1. Health ────────────────────────────────────────────────────────────────
print("\n[1] Health")
root = check("GET /", lambda: get("/"))
check("Root has 'status'", lambda: root["status"] == "running")
check("Root has 'ws_clients'", lambda: "ws_clients" in root)

# ── 2. Sensor ingest ─────────────────────────────────────────────────────────
print("\n[2] POST /sensor-data")
NORMAL = {"flow_rate":2.5,"pressure":118,"vibration":0.32,
          "water_level":12.6,"leak_detected":False,"pump_state":"ON","ml_confidence":0.72}
LEAK   = {"flow_rate":18.0,"pressure":240,"vibration":3.5,
          "water_level":8.0,"leak_detected":True,"pump_state":"OFF","ml_confidence":0.96}

ack1 = check("POST normal reading",    lambda: post("/sensor-data", NORMAL))
ack2 = check("POST leak reading",      lambda: post("/sensor-data", LEAK))
check("ACK status='ok'",               lambda: ack1["status"] == "ok")

# ── 3. Live analytics ────────────────────────────────────────────────────────
print("\n[3] GET /analytics/live")
live = check("GET /analytics/live",     lambda: get("/analytics/live"))
if live:
    check("live.flow_rate present",     lambda: "flow_rate" in live)
    check("live.severity present",      lambda: "severity" in live)
    check("live.pump_state present",    lambda: "pump_state" in live)
    check("live.timestamp present",     lambda: "timestamp" in live)
    check("live.ml_confidence 0-1",     lambda: 0 <= live["ml_confidence"] <= 1)

# ── 4. Summary ───────────────────────────────────────────────────────────────
print("\n[4] GET /analytics/summary")
summ = check("GET /analytics/summary", lambda: get("/analytics/summary"))
if summ:
    check("summary.total_water_saved",          lambda: summ["total_water_saved"] >= 0)
    check("summary.total_energy_saved_kwh",     lambda: summ["total_energy_saved_kwh"] >= 0)
    check("summary.total_co2_saved_kg",         lambda: summ["total_co2_saved_kg"] >= 0)
    check("summary.efficiency_percent 0-100",   lambda: 0 <= summ["efficiency_percent"] <= 100)
    check("summary.severity_breakdown dict",    lambda: isinstance(summ["severity_breakdown"], dict))
    check("severity_breakdown has LOW key",     lambda: "LOW" in summ["severity_breakdown"])
    check("severity_breakdown has CRITICAL key",lambda: "CRITICAL" in summ["severity_breakdown"])

# ── 5. Events ────────────────────────────────────────────────────────────────
print("\n[5] GET /analytics/events")
evts = check("GET /analytics/events",   lambda: get("/analytics/events"))
if evts and len(evts) > 0:
    e = evts[0]
    check("event.severity present",     lambda: "severity" in e)
    check("event.water_saved present",  lambda: "water_saved" in e)
    check("event.energy_saved_kwh",     lambda: "energy_saved_kwh" in e)
    check("event.co2_saved_kg",         lambda: "co2_saved_kg" in e)
    check("event.severity is valid",
          lambda: e["severity"] in ("LOW","MEDIUM","HIGH","CRITICAL"))

# Severity filter
evts_c = check("GET /analytics/events?severity=CRITICAL",
               lambda: get("/analytics/events?severity=CRITICAL"))
if evts_c is not None:
    check("All events are CRITICAL",
          lambda: all(e["severity"]=="CRITICAL" for e in evts_c))

# ── 6. System status ─────────────────────────────────────────────────────────
print("\n[6] GET /system/status")
sys_s = check("GET /system/status",    lambda: get("/system/status"))
if sys_s:
    check("system.edge_model present",  lambda: "edge_model" in sys_s)
    check("system.sensor_status dict",  lambda: isinstance(sys_s["sensor_status"], dict))
    check("sensor_status.flow present", lambda: "flow" in sys_s["sensor_status"])
    check("sensor_status values valid",
          lambda: all(v in ("ok","warning","critical","unknown")
                      for v in sys_s["sensor_status"].values()))

# ── 7. Dashboard ─────────────────────────────────────────────────────────────
print("\n[7] GET /dashboard")
dash = check("GET /dashboard",         lambda: get("/dashboard"))
if dash:
    check("dashboard.live present",     lambda: "live" in dash)
    check("dashboard.summary present",  lambda: "summary" in dash)
    check("dashboard.system present",   lambda: "system" in dash)
    check("dashboard.recent_events",    lambda: isinstance(dash["recent_events"], list))

# ── 8. WebSocket info ────────────────────────────────────────────────────────
print("\n[8] GET /ws/info")
wsi = check("GET /ws/info",            lambda: get("/ws/info"))
if wsi:
    check("ws_clients_connected key",  lambda: "ws_clients_connected" in wsi)

# ── 9. Input validation ──────────────────────────────────────────────────────
print("\n[9] Input validation")
def expect_422(payload):
    try:
        post("/sensor-data", payload)
        raise AssertionError("Should have returned 422")
    except urllib.error.HTTPError as e:
        if e.code == 422:
            return True
        raise

check("Reject ml_confidence > 1",
      lambda: expect_422({**NORMAL, "ml_confidence": 2.0}))
check("Reject negative flow_rate",
      lambda: expect_422({**NORMAL, "flow_rate": -5}))
check("Reject invalid pump_state",
      lambda: expect_422({**NORMAL, "pump_state": "MAYBE"}))

# ── Summary ──────────────────────────────────────────────────────────────────
passed = sum(1 for _, ok, _ in results if ok)
failed = sum(1 for _, ok, _ in results if not ok)
total  = len(results)

print("\n" + "="*60)
print(f"  Results: {passed}/{total} passed", end="")
if failed:
    failures = [l for l, ok, _ in results if not ok]
    print(f"  |  {failed} FAILED:")
    for f in failures:
        print(f"    ✗ {f}")
else:
    print("  — ALL CHECKS PASSED ✅")
print("="*60 + "\n")

sys.exit(0 if failed == 0 else 1)
