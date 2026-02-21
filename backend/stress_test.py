"""
AquaGuard Edge AI — Backend Stress Test
════════════════════════════════════════
Sends N POST /sensor-data requests with randomised payloads using a
thread-pool, then hits every GET endpoint under load.

Metrics reported
───────────────
  • Total duration
  • Requests / second (throughput)
  • Success rate
  • Latency: p50, p75, p90, p95, p99, max
  • Error breakdown

Run
───
  python stress_test.py [--requests 5000] [--workers 50] [--url http://127.0.0.1:8000]
"""

import argparse
import json
import random
import statistics
import sys
import time
import urllib.error
import urllib.request
from concurrent.futures import ThreadPoolExecutor, as_completed
from dataclasses import dataclass, field
from typing import List, Optional


# ─── CLI args ─────────────────────────────────────────────────────────────────

def parse_args() -> argparse.Namespace:
    p = argparse.ArgumentParser(description="AquaGuard stress test")
    p.add_argument("--requests", type=int, default=5000, help="Total POST requests to send")
    p.add_argument("--workers",  type=int, default=50,   help="Concurrent threads")
    p.add_argument("--url",      type=str, default="http://127.0.0.1:8000", help="Base URL")
    p.add_argument("--get-rounds", type=int, default=3, help="GET endpoint rounds after POST phase")
    return p.parse_args()


# ─── Data generation ──────────────────────────────────────────────────────────

PUMP_STATES = ["ON", "OFF"]
SEVERITY_PROFILES = [
    # (flow, pressure, vibration, ml_confidence, leak_prob)
    (1.5,  118, 0.20, 0.55, 0.05),   # normal
    (2.5,  115, 0.30, 0.72, 0.15),   # mild anomaly
    (5.0,  210, 0.80, 0.86, 0.40),   # moderate leak – HIGH pressure
    (18.0, 240, 3.50, 0.93, 0.70),   # major burst – HIGH flow + vibration
    (22.0, 260, 5.00, 0.97, 0.90),   # critical
]

def random_payload() -> dict:
    base_flow, base_pres, base_vib, base_conf, leak_prob = random.choice(SEVERITY_PROFILES)
    # Add ±10 % jitter
    jitter = lambda v: round(v * random.uniform(0.90, 1.10), 4)
    leak = random.random() < leak_prob
    return {
        "flow_rate":    jitter(base_flow),
        "pressure":     jitter(base_pres),
        "vibration":    jitter(base_vib),
        "water_level":  round(random.uniform(5, 30), 2),
        "leak_detected": leak,
        "pump_state":   "OFF" if leak else "ON",
        "ml_confidence": min(1.0, jitter(base_conf)),
    }


# ─── Result tracking ──────────────────────────────────────────────────────────

@dataclass
class Result:
    success: bool
    latency_ms: float
    status_code: Optional[int] = None
    error: Optional[str] = None


def send_one(base_url: str) -> Result:
    payload = json.dumps(random_payload()).encode()
    req = urllib.request.Request(
        f"{base_url}/sensor-data",
        data=payload,
        method="POST",
        headers={"Content-Type": "application/json"},
    )
    t0 = time.perf_counter()
    try:
        with urllib.request.urlopen(req, timeout=10) as resp:
            _ = resp.read()
            return Result(success=True, latency_ms=(time.perf_counter() - t0) * 1000,
                          status_code=resp.status)
    except urllib.error.HTTPError as e:
        return Result(success=False, latency_ms=(time.perf_counter() - t0) * 1000,
                      status_code=e.code, error=str(e))
    except Exception as e:
        return Result(success=False, latency_ms=(time.perf_counter() - t0) * 1000,
                      error=str(e))


# ─── Reporting ────────────────────────────────────────────────────────────────

def percentile(data: List[float], pct: float) -> float:
    if not data:
        return 0.0
    data_s = sorted(data)
    idx = int(len(data_s) * pct / 100)
    idx = min(idx, len(data_s) - 1)
    return round(data_s[idx], 2)


def bar(value: float, max_val: float, width: int = 30) -> str:
    filled = int((value / max_val) * width) if max_val else 0
    return "█" * filled + "░" * (width - filled)


def print_section(title: str) -> None:
    print(f"\n{'═' * 60}")
    print(f"  {title}")
    print(f"{'═' * 60}")


def print_results(results: List[Result], total_seconds: float, n_workers: int) -> None:
    latencies = [r.latency_ms for r in results]
    success_latencies = [r.latency_ms for r in results if r.success]
    n_total   = len(results)
    n_success = sum(1 for r in results if r.success)
    n_fail    = n_total - n_success
    throughput = n_total / total_seconds

    # Error breakdown
    errors: dict[str, int] = {}
    for r in results:
        if not r.success:
            key = r.error or f"HTTP {r.status_code}"
            errors[key] = errors.get(key, 0) + 1

    print_section("📊  STRESS TEST RESULTS")
    print(f"  Total requests : {n_total:,}")
    print(f"  Workers        : {n_workers}")
    print(f"  Duration       : {total_seconds:.2f} s")
    print(f"  Throughput     : {throughput:,.1f} req/s")
    print()
    print(f"  ✅ Succeeded   : {n_success:,}  ({100 * n_success / n_total:.1f} %)")
    print(f"  ❌ Failed      : {n_fail:,}  ({100 * n_fail / n_total:.1f} %)")

    if success_latencies:
        print_section("⏱️  LATENCY (successful requests only)")
        p_vals = [50, 75, 90, 95, 99]
        max_p = percentile(success_latencies, 99)
        for p in p_vals:
            v = percentile(success_latencies, p)
            print(f"  p{p:<3}  {bar(v, max_p)}  {v:.1f} ms")
        print(f"  avg  {' ' * 30}  {statistics.mean(success_latencies):.1f} ms")
        print(f"  max  {bar(max(success_latencies), max(success_latencies))}  {max(success_latencies):.1f} ms")

    if errors:
        print_section("🔴  ERROR BREAKDOWN")
        for err, count in sorted(errors.items(), key=lambda x: -x[1]):
            print(f"  {count:>6}×  {err}")

    grade = "🟢 EXCELLENT" if n_fail == 0 and throughput > 500 else \
            "🟡 GOOD"      if n_fail / n_total < 0.01 else \
            "🔴 DEGRADED"
    print_section(f"VERDICT:  {grade}")
    if n_fail == 0:
        print(f"  Zero errors across {n_total:,} requests. System is stable.")
    else:
        print(f"  {n_fail} failures ({100*n_fail/n_total:.2f} %).")
    print()


# ─── GET endpoint smoke test ──────────────────────────────────────────────────

GET_ENDPOINTS = [
    "/analytics/live",
    "/analytics/summary",
    "/analytics/events?limit=50",
    "/system/status",
    "/dashboard",
]

def smoke_get(base_url: str, path: str) -> tuple[bool, float, str]:
    t0 = time.perf_counter()
    try:
        with urllib.request.urlopen(f"{base_url}{path}", timeout=10) as r:
            body = json.loads(r.read())
            ms = (time.perf_counter() - t0) * 1000
            return True, ms, ""
    except Exception as e:
        return False, (time.perf_counter() - t0) * 1000, str(e)


def run_get_rounds(base_url: str, rounds: int) -> None:
    print_section(f"🌐  GET ENDPOINT VERIFICATION  ({rounds} round(s))")
    for path in GET_ENDPOINTS:
        successes, lats = 0, []
        for _ in range(rounds):
            ok, ms, err = smoke_get(base_url, path)
            if ok:
                successes += 1
                lats.append(ms)
        avg = f"{statistics.mean(lats):.1f} ms" if lats else "—"
        status = "✅" if successes == rounds else f"❌ {rounds - successes}/{rounds} failed"
        print(f"  {status}  GET {path:<35} avg {avg}")


# ─── WebSocket smoke check ────────────────────────────────────────────────────

def check_ws(base_url: str) -> None:
    """
    Quick WebSocket handshake check using the /ws/info REST endpoint
    (avoids needing the websockets library in the test environment).
    """
    print_section("🔌  WEBSOCKET INFO")
    try:
        ws_url = base_url.replace("http://", "ws://") + "/ws"
        with urllib.request.urlopen(f"{base_url}/ws/info", timeout=5) as r:
            info = json.loads(r.read())
        print(f"  WebSocket URL         : {ws_url}")
        print(f"  Active WS connections : {info.get('ws_clients_connected', 0)}")
        print(f"  ℹ  Connect from frontend with:  new WebSocket('{ws_url}')")
    except Exception as e:
        print(f"  /ws/info check failed: {e}")


# ─── Main ─────────────────────────────────────────────────────────────────────

def main() -> None:
    args = parse_args()
    print(f"\n🚀  AquaGuard Stress Test")
    print(f"    Target  : {args.url}")
    print(f"    Requests: {args.requests:,}")
    print(f"    Workers : {args.workers}")

    # ── Warm-up: verify server is up ──────────────────────────────────────────
    try:
        urllib.request.urlopen(f"{args.url}/", timeout=5)
    except Exception:
        print(f"\n❌  Cannot reach {args.url}  — is the server running?")
        sys.exit(1)

    # ── POST phase ────────────────────────────────────────────────────────────
    print(f"\n⏳  Sending {args.requests:,} sensor readings …\n")
    results: List[Result] = []

    done = 0
    start = time.perf_counter()

    with ThreadPoolExecutor(max_workers=args.workers) as pool:
        futures = [pool.submit(send_one, args.url) for _ in range(args.requests)]
        for fut in as_completed(futures):
            results.append(fut.result())
            done += 1
            if done % 500 == 0 or done == args.requests:
                elapsed = time.perf_counter() - start
                rps = done / elapsed if elapsed else 0
                pct = 100 * done / args.requests
                print(f"  [{pct:5.1f}%]  {done:,} / {args.requests:,}  —  {rps:,.0f} req/s", end="\r")

    total_seconds = time.perf_counter() - start
    print()

    # ── Report ────────────────────────────────────────────────────────────────
    print_results(results, total_seconds, args.workers)

    # ── GET verification ──────────────────────────────────────────────────────
    run_get_rounds(args.url, args.get_rounds)

    # ── WS info ───────────────────────────────────────────────────────────────
    check_ws(args.url)


if __name__ == "__main__":
    main()
