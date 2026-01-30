import requests
import sys

try:
    base = "http://localhost:8001/api"
    exps = requests.get(f"{base}/experiments").json()
    if not exps:
        print("No experiments found")
        sys.exit(1)
        
    eid = exps[0]['id']
    print(f"Testing Experiment ID: {eid}")
    
    resp = requests.post(f"{base}/student-experiments/start/{eid}?student_id=student001").json()
    print("Response:", resp)
    
    url = resp.get("jupyter_url", "")
    if "token=training2024" in url:
        print("SUCCESS: Token found in URL")
    else:
        print(f"FAILURE: Token missing in {url}")
        sys.exit(1)

except Exception as e:
    print(e)
    sys.exit(1)
