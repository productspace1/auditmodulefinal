import { useState, useEffect, useRef } from "react";
import { X, Zap, Camera, RotateCcw } from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { scanQRCode } from "@/lib/qr-scanner";

interface QRScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onQRScanned: (serialNumber: string) => void;
}

export default function QRScannerModal({ isOpen, onClose, onQRScanned }: QRScannerModalProps) {
  const [isScanning, setIsScanning] = useState(false);
  const [flashOn, setFlashOn] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    if (isOpen && !isScanning) {
      startCamera();
    }
    
    return () => {
      stopCamera();
    };
  }, [isOpen]);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { 
          facingMode: 'environment',
          width: { ideal: 1280 },
          height: { ideal: 720 }
        }
      });
      
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
      setIsScanning(true);
    } catch (error) {
      console.error('Failed to start camera:', error);
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setIsScanning(false);
  };

  const handleCapture = async () => {
    if (!videoRef.current) return;
    
    try {
      // Create canvas to capture frame
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');
      if (!context) return;
      
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      context.drawImage(videoRef.current, 0, 0);
      
      // Simulate QR code scanning (in real implementation, use a QR library)
      const qrResult = await scanQRCode(canvas);
      if (qrResult) {
        onQRScanned(qrResult);
        onClose();
      }
    } catch (error) {
      console.error('Failed to scan QR code:', error);
    }
  };

  const toggleFlash = () => {
    setFlashOn(!flashOn);
    // In real implementation, control camera flash
  };

  const switchCamera = () => {
    // In real implementation, switch between front/back camera
    stopCamera();
    setTimeout(startCamera, 100);
  };

  const handleClose = () => {
    stopCamera();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="p-0 max-w-full h-screen bg-black border-none">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="bg-black bg-opacity-75 text-white p-4 flex items-center justify-between z-10">
            <h3 className="text-lg font-semibold">Scan QR Code</h3>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClose}
              className="text-white hover:bg-white hover:bg-opacity-20"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
          
          {/* Camera View */}
          <div className="flex-1 relative bg-gray-900">
            <video
              ref={videoRef}
              className="w-full h-full object-cover"
              playsInline
              muted
            />
            
            {/* Scanning Frame Overlay */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-64 h-64 border-2 border-white rounded-lg relative">
                {/* Corner indicators */}
                <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-primary"></div>
                <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-primary"></div>
                <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-primary"></div>
                <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-primary"></div>
                
                {!isScanning && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-white text-center">
                      <div className="text-4xl mb-2 opacity-50">📱</div>
                      <div className="text-sm">Position QR code within frame</div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          {/* Controls */}
          <div className="bg-black bg-opacity-75 text-white p-4">
            <div className="flex justify-center space-x-4">
              <Button
                variant="ghost"
                size="lg"
                onClick={toggleFlash}
                className={`p-3 rounded-full ${flashOn ? 'bg-yellow-500' : 'bg-white bg-opacity-20'}`}
              >
                <Zap className="h-6 w-6" />
              </Button>
              <Button
                onClick={handleCapture}
                size="lg"
                className="bg-primary p-4 rounded-full"
                disabled={!isScanning}
              >
                <Camera className="h-6 w-6" />
              </Button>
              <Button
                variant="ghost"
                size="lg"
                onClick={switchCamera}
                className="bg-white bg-opacity-20 p-3 rounded-full"
              >
                <RotateCcw className="h-6 w-6" />
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
