from flask import Flask, request, jsonify
from datetime import datetime, timedelta

app = Flask(__name__)

@app.route("/analyze", methods=["POST"])
def analyze():
    data = request.json

    last_updated = data.get("lastUpdated")
    safety_status = "SAFE"
    alert = None

    if last_updated:
        last_time = datetime.fromisoformat(last_updated)
        now = datetime.utcnow()

        diff = now - last_time

        # 🚨 RULE 1: No movement > 2 hours
        if diff > timedelta(hours=2):
            safety_status = "RISK"
            alert = "No movement detected for more than 2 hours"

    return jsonify({
        "status": safety_status,
        "alert": alert
    })


if __name__ == "__main__":
    app.run(port=5000, debug=True)