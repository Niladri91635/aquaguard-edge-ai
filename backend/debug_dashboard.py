import urllib.request, json

BASE = "http://127.0.0.1:8000"

try:
    r = urllib.request.urlopen(f"{BASE}/dashboard", timeout=10)
    print("Status:", r.status)
    print(json.dumps(json.loads(r.read()), indent=2))
except urllib.error.HTTPError as e:
    print("HTTP Error:", e.code)
    print(e.read().decode())
except Exception as ex:
    print("Error:", ex)
