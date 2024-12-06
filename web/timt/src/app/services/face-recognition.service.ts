import { Injectable } from "@angular/core";
import * as faceapi from 'face-api.js';

@Injectable({
    providedIn: 'root'
})
export class FaceRecognitionService {
    private modelsLoaded: boolean = false; // Flag to check model load status

    async loadModels() {
        try {
            await faceapi.nets.tinyFaceDetector.loadFromUri('/models');
            await faceapi.nets.faceLandmark68Net.loadFromUri('/models');
            this.modelsLoaded = true;
            console.log("Models loaded successfully");
        } catch (error) {
            console.error("Error loading face recognition models:", error);
        }
    }

    async detectBestFace(video: HTMLVideoElement) {
        if (!this.modelsLoaded) {
            console.warn("Models are not loaded yet. Please wait.");
            return null;
        }

        const options = new faceapi.TinyFaceDetectorOptions({ inputSize: 128, scoreThreshold: 0.5 });

        const detections = await faceapi.detectAllFaces(video, options).withFaceLandmarks();
        if (detections.length === 0) return null;

        const bestFace = detections.reduce((largest: any, current: any) => {
            return current.detection.box.width * current.detection.box.height >
                   largest.detection.box.width * largest.detection.box.height
                   ? current : largest;
        });

        return {
            box: bestFace.detection.box,
            landmarks: bestFace.landmarks.positions
        };
    }
}