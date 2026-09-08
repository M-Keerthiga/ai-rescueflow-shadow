import math

class VehicleTracker:
    """
    Tracks bounding boxes across consecutive frames and assigns persistent Vehicle IDs.
    Computes trajectory vectors and heading angles.
    """
    def __init__(self):
        self.next_id = 1
        self.tracked_objects = {} # id: {class, last_pos, trajectory, speed, distance}

    def update(self, detections, time_delta=0.1):
        """
        detections: list of dicts {class, bbox: [x1, y1, x2, y2], confidence}
        """
        updated_objects = []

        for det in detections:
            bbox = det["bbox"]
            cls_name = det["class"]
            cx = (bbox[0] + bbox[2]) / 2.0
            cy = (bbox[1] + bbox[3]) / 2.0

            # Match with existing tracked object
            matched_id = None
            min_dist = 60.0 # Pixel distance threshold

            for obj_id, obj_data in self.tracked_objects.items():
                if obj_data["class"] == cls_name:
                    last_cx, last_cy = obj_data["last_pos"]
                    dist = math.sqrt((cx - last_cx)**2 + (cy - last_cy)**2)
                    if dist < min_dist:
                        min_dist = dist
                        matched_id = obj_id

            if matched_id is None:
                # Assign new persistent ID
                matched_id = self.next_id
                self.next_id += 1

            # Update trajectory history
            prev_history = self.tracked_objects.get(matched_id, {}).get("history", [])
            history = (prev_history + [(cx, cy)])[-10:] // keep last 10 points

            self.tracked_objects[matched_id] = {
                "id": matched_id,
                "class": cls_name,
                "last_pos": (cx, cy),
                "bbox": bbox,
                "history": history
            }

            updated_objects.append({
                "id": matched_id,
                "class": cls_name,
                "bbox": bbox,
                "center": (cx, cy),
                "trajectory": history
            })

        return updated_objects

tracker = VehicleTracker()
