import time
from flask import Flask, request, jsonify
from flask_cors import CORS

from ml.inference.detector import detector
from ml.inference.tracker import tracker
from ml.inference.telemetry import estimate_telemetry

app = Flask(__name__)
CORS(app)

@app.route('/health', methods=['GET'])
def health():
    return jsonify({
        "status": "ONLINE",
        "service": "AI RESCUEFLOW COMPUTER VISION SERVICE",
        "modelStatus": detector.model_status,
        "trainedBinaryPresent": detector.is_trained,
        "timestamp": time.time()
    })

@app.route('/status', methods=['GET'])
def status():
    return jsonify({
        "modelStatus": detector.model_status,
        "isTrained": detector.is_trained
    })

@app.route('/predict', methods=['POST'])
def predict():
    try:
        data = request.json or {}
        confidence = data.get("confidenceThreshold", 0.5)

        # 1. Computer Vision Detection
        raw_detections = detector.detect_frame(confidence_thresh=confidence)

        # 2. Object Tracking (Persistent Vehicle IDs)
        tracked_objs = tracker.update(raw_detections)

        # 3. Homography Telemetry Estimation
        telemetry_objs = estimate_telemetry(tracked_objs)

        return jsonify({
            "status": "SUCCESS",
            "modelStatus": detector.model_status,
            "timestamp": time.time(),
            "telemetry": {
                "timestamp": int(time.time()),
                "objects": telemetry_objs
            }
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    print("🚀 Python Computer Vision ML Service listening on http://localhost:8000")
    app.run(host='0.0.0.0', port=8000)
