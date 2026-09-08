import os
import json

def validate_model():
    meta_path = "ml/models/metadata/model_info.json"
    if os.path.exists(meta_path):
        with open(meta_path, "r") as f:
            data = json.load(f)
            print("📊 Current Model Validation Metadata:", json.dumps(data, indent=2))
            return data
    print("⚠️ No model metadata found.")
    return None

if __name__ == "__main__":
    validate_model()
