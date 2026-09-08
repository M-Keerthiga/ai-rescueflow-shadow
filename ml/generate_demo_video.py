import cv2
import numpy as np
import os
import imageio_ffmpeg

def create_master_demo_video():
    output_dir = os.path.join(os.getcwd(), "public", "demo")
    os.makedirs(output_dir, exist_ok=True)
    output_path = os.path.join(output_dir, "master-demo.mp4")

    width, height = 1280, 720
    fps = 30
    duration_sec = 75
    total_frames = fps * duration_sec

    print(f"Generating H.264 video: {total_frames} frames ({duration_sec}s @ {fps}fps) to {output_path}...")

    # Use imageio_ffmpeg writer for native browser-compatible libx264 encoding
    writer = imageio_ffmpeg.write_frames(
        output_path,
        (width, height),
        fps=fps,
        codec='libx264',
        pix_fmt_in='rgb24',
        quality=7
    )
    writer.send(None) # Initialize generator writer

    # Define key landmark coordinates in 1280x720
    for frame_idx in range(total_frames):
        t = frame_idx / fps # time in seconds

        # 1. Background: Dark Asphalt Road & Urban Intersection (RGB format for ffmpeg)
        img = np.zeros((height, width, 3), dtype=np.uint8)
        img[0:height, 0:width] = (40, 35, 30) # Slate dark landscape (RGB)
        img[0:220, 0:width] = (30, 25, 20) # Distant sky/horizon

        # Draw Asphalt Roads (T-shaped / Cross Intersection)
        cv2.rectangle(img, (480, 0), (800, height), (60, 55, 50), -1)
        cv2.rectangle(img, (0, 260), (width, 580), (60, 55, 50), -1)

        # Sidewalk / Curbs
        cv2.rectangle(img, (460, 0), (480, height), (90, 85, 80), -1)
        cv2.rectangle(img, (800, 0), (820, height), (90, 85, 80), -1)
        cv2.rectangle(img, (0, 240), (width, 260), (90, 85, 80), -1)
        cv2.rectangle(img, (0, 580), (width, 600), (90, 85, 80), -1)

        # Lane Markings (Dashed Yellow Centerline & White Solid Lines)
        for y in range(0, height, 40):
            cv2.line(img, (640, y), (640, min(y+20, height)), (255, 215, 0), 3) # Yellow line RGB
        for x in range(0, width, 40):
            cv2.line(img, (x, 420), (min(x+20, width), 420), (255, 215, 0), 3)

        # Crosswalks
        for x in range(480, 800, 25):
            cv2.rectangle(img, (x, 220), (x+12, 255), (220, 220, 220), -1)
            cv2.rectangle(img, (x, 585), (x+12, 620), (220, 220, 220), -1)
        for y in range(260, 580, 25):
            cv2.rectangle(img, (445, y), (475, y+12), (220, 220, 220), -1)
            cv2.rectangle(img, (805, y), (835, y+12), (220, 220, 220), -1)

        # Draw Conflict Zone Box
        cv2.rectangle(img, (560, 340), (720, 500), (70, 40, 40), -1)

        # 2. Vehicle Trajectories based on Timeline t

        # BUS #7 (Yellow/Amber Bus moving downward-right across intersection)
        if t < 35:
            bus_x = int(320 + t * 9.5)
            bus_y = int(120 + t * 9.0)
        elif t < 45:
            bus_x = int(320 + 35 * 9.5 + (t - 35) * 2.0)
            bus_y = int(120 + 35 * 9.0 + (t - 35) * 1.8)
        else:
            bus_x = int(320 + 35 * 9.5 + 10 * 2.0)
            bus_y = int(120 + 35 * 9.0 + 10 * 1.8)

        # CAR #12 (Cyan Sedan moving leftward into intersection)
        if t < 35:
            car_x = int(1050 - t * 13.0)
            car_y = int(410 + np.sin(t * 0.5) * 10)
        elif t < 45:
            car_x = int(1050 - 35 * 13.0 - (t - 35) * 2.5)
            car_y = int(410)
        else:
            car_x = int(1050 - 35 * 13.0 - 10 * 2.5)
            car_y = int(410)

        # Render Bus #7 Body (Amber / Gold Large Rectangle in RGB)
        bw, bh = 140, 70
        cv2.rectangle(img, (bus_x, bus_y), (bus_x + bw, bus_y + bh), (240, 160, 30), -1) # RGB Amber
        cv2.rectangle(img, (bus_x, bus_y), (bus_x + bw, bus_y + bh), (255, 200, 0), 3)
        # Bus Windows
        cv2.rectangle(img, (bus_x + 10, bus_y + 10), (bus_x + bw - 10, bus_y + 25), (100, 100, 100), -1)
        # Bus Roof text
        cv2.putText(img, "BUS #7", (bus_x + 30, bus_y + 55), cv2.FONT_HERSHEY_SIMPLEX, 0.6, (0, 0, 0), 2)

        # Render Car #12 Body (Cyan Sedan in RGB)
        cw, ch = 100, 55
        cv2.rectangle(img, (car_x, car_y), (car_x + cw, car_y + ch), (30, 180, 220), -1) # RGB Cyan
        cv2.rectangle(img, (car_x, car_y), (car_x + cw, car_y + ch), (0, 230, 255), 2)
        # Windshield
        cv2.rectangle(img, (car_x + 15, car_y + 8), (car_x + cw - 15, car_y + 22), (80, 80, 80), -1)
        cv2.putText(img, "CAR #12", (car_x + 15, car_y + 42), cv2.FONT_HERSHEY_SIMPLEX, 0.5, (0, 0, 0), 2)

        # Headlights & Motion Tails
        cv2.circle(img, (bus_x + bw, bus_y + 15), 6, (255, 255, 200), -1)
        cv2.circle(img, (bus_x + bw, bus_y + bh - 15), 6, (255, 255, 200), -1)

        cv2.circle(img, (car_x, car_y + 12), 5, (200, 255, 255), -1)
        cv2.circle(img, (car_x, car_y + ch - 12), 5, (200, 255, 255), -1)

        # Overlay Camera Watermark & Live HUD Stats
        time_str = f"CAM-04 | TIME: {t:.1f}s | H.264 1080p@30FPS"
        cv2.putText(img, time_str, (30, 40), cv2.FONT_HERSHEY_SIMPLEX, 0.6, (255, 255, 0), 2)

        if 20 <= t < 45:
            cv2.putText(img, "CRITICAL CONFLICT DETECTED", (width - 420, 40), cv2.FONT_HERSHEY_SIMPLEX, 0.6, (255, 0, 0), 2)
        elif t >= 45:
            cv2.putText(img, "INCIDENT / RESCUEFLOW MODE", (width - 420, 40), cv2.FONT_HERSHEY_SIMPLEX, 0.6, (0, 255, 0), 2)

        writer.send(img)

        if frame_idx % (fps * 10) == 0:
            print(f"Generated {frame_idx}/{total_frames} frames ({int(frame_idx/total_frames*100)}%)...")

    writer.close()
    print("Browser-compatible H.264 video creation complete:", output_path)
    return True

if __name__ == "__main__":
    create_master_demo_video()
