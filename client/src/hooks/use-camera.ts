import { useState } from "react";

export function useCamera() {
  const [isCapturing, setIsCapturing] = useState(false);

  const capturePhoto = async (): Promise<Blob | null> => {
    setIsCapturing(true);
    
    try {
      // Get user media for camera access
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' }
      });

      // Create video element to capture from
      const video = document.createElement('video');
      video.srcObject = stream;
      video.play();

      // Wait for video to be ready
      await new Promise(resolve => {
        video.onloadedmetadata = resolve;
      });

      // Create canvas to capture frame
      const canvas = document.createElement('canvas');
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      const context = canvas.getContext('2d');
      if (!context) {
        throw new Error('Could not get canvas context');
      }
      
      context.drawImage(video, 0, 0);

      // Stop the video stream
      stream.getTracks().forEach(track => track.stop());

      // Convert canvas to blob
      return new Promise(resolve => {
        canvas.toBlob(resolve, 'image/jpeg', 0.8);
      });
      
    } catch (error) {
      console.error('Failed to capture photo:', error);
      return null;
    } finally {
      setIsCapturing(false);
    }
  };

  return { capturePhoto, isCapturing };
}
