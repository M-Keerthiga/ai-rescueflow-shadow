import os
import json
import yaml

class DatasetLoader:
    def __init__(self, config_path="ml/training/config.yaml"):
        if os.path.exists(config_path):
            with open(config_path, "r") as f:
                self.config = yaml.safe_load(f)
        else:
            self.config = {
                "dataset": {
                    "raw_dir": "ml/datasets/raw",
                    "processed_dir": "ml/datasets/processed",
                    "annotations_dir": "ml/datasets/annotations"
                }
            }

    def verify_dataset_structure(self):
        dirs = [
            self.config["dataset"]["raw_dir"],
            self.config["dataset"]["processed_dir"],
            self.config["dataset"]["annotations_dir"]
        ]
        for d in dirs:
            os.makedirs(d, exist_ok=True)
        return True

    def scan_raw_annotations(self):
        raw_dir = self.config["dataset"]["raw_dir"]
        files = os.listdir(raw_dir) if os.path.exists(raw_dir) else []
        return {
            "total_raw_files": len(files),
            "files": files[:10]
        }

if __name__ == "__main__":
    loader = DatasetLoader()
    loader.verify_dataset_structure()
    print("✅ Dataset directory structure verified.")
