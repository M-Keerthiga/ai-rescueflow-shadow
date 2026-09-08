from ml.inference.calibration import calibrator

def estimate_telemetry(tracked_objects, fps=30):
    """
    Computes ESTIMATED SPEED, ESTIMATED DISTANCE, and heading for tracked vehicles.
    """
    telemetry_objects = []

    for obj in tracked_objects:
        obj_id = obj["id"]
        cls = obj["class"]
        cx, cy = obj["center"]

        # Convert pixel position to road distance in meters via homography calibration
        dist_m, rel_x, rel_y = calibrator.pixel_to_road(cx, cy)

        # Estimate speed from trajectory history displacement
        history = obj.get("trajectory", [])
        speed_kmh = 25 # fallback base speed

        if len(history) >= 2:
            p1 = history[0]
            p2 = history[-1]
            pixel_disp = ((p2[0] - p1[0])**2 + (p2[1] - p1[1])**2)**0.5
            dt = len(history) / fps
            meters_disp = pixel_disp * 0.15
            speed_ms = meters_disp / max(0.01, dt)
            speed_kmh = round(speed_ms * 3.6, 1)

        # Heading angle estimation
        heading = 0
        if len(history) >= 2:
            p1, p2 = history[-2], history[-1]
            dx, dy = p2[0] - p1[0], p2[1] - p1[1]
            if dx != 0 or dy != 0:
                import math
                heading = round(math.degrees(math.atan2(dy, dx)), 1)

        telemetry_objects.append({
            "id": obj_id,
            "class": cls,
            "speedKmh": speed_kmh,
            "distanceM": dist_m,
            "heading": heading,
            "bbox": obj["bbox"]
        })

    return telemetry_objects
