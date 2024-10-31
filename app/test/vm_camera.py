import cv2
import pyvirtualcam
import os
import time

# Path to the folder containing images
image_folder = 'img'

# Virtual camera settings
width, height, fps = 640, 480, 20

def main():
    # Get list of images in the folder
    image_files = [os.path.join(image_folder, img) for img in os.listdir(image_folder) if img.endswith(('.png', '.jpg', '.jpeg'))]
    if not image_files:
        print("No images found in the 'img' folder.")
        return

    # Sort images alphabetically or by creation date if desired
    image_files.sort()

    # Start the virtual camera
    with pyvirtualcam.Camera(width, height, fps, fmt=pyvirtualcam.PixelFormat.BGR) as cam:
        print(f'Using virtual camera: {cam.device}')
        
        # Loop through images indefinitely
        while True:
            for image_path in image_files:
                # Read and resize each image to fit the virtual camera resolution
                frame = cv2.imread(image_path)
                if frame is None:
                    print(f"Could not read image: {image_path}")
                    continue
                frame = cv2.resize(frame, (width, height))
                
                # Send the frame to the virtual camera
                cam.send(frame)
                cam.sleep_until_next_frame()

                # Pause between frames to match the frame rate
                time.sleep(1 / fps)

if __name__ == "__main__":
    main()
