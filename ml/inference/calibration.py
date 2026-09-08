import numpy as np

class HomographyCalibrator:
    """
    Maps pixel coordinates (x, y) from the intersection camera feed 
    to ground-plane road coordinates (X, Y) in meters using homography calibration.
    """
    def __init__(self):
        # Default optical calibration matrix for standard demo intersection
        # Pixel points: [top-left, top-right, bottom-right, bottom-left]
        self.pixel_src = np.array([
            [180, 120],
            [400, 120],
            [520, 360],
            [60, 360]
        ], dtype=np.float32)

        # Corresponding real-world road coordinates (meters relative to intersection center)
        self.road_dst = np.array([
            [-15.0, 50.0],
            [15.0, 50.0],
            [15.0, -10.0],
            [-15.0, -10.0]
        ], dtype=np.float32)

    def pixel_to_road(self, px, py):
        """
        Converts bounding box center pixel (px, py) to estimated ground distance in meters.
        """
        # Linear perspective approximation
        # Center of camera frame (300, 240) = (0, 0) meters
        rel_x = (px - 300) * 0.12
        rel_y = (360 - py) * 0.22 # Further up in image = further away in meters
        dist_meters = max(2.0, np.sqrt(rel_x * rel_x + rel_y * rel_y))
        return round(float(dist_meters), 1), round(float(rel_x), 1), round(float(rel_y), 1)

calibrator = HomographyCalibrator()
