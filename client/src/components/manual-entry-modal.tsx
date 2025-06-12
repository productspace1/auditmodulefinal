import { useState } from "react";
import { X, Camera } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useCamera } from "@/hooks/use-camera";

interface ManualEntryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: { serialNumber: string; qrAvailable: boolean; photoUrl?: string }) => void;
  isSubmitting: boolean;
}

export default function ManualEntryModal({
  isOpen,
  onClose,
  onSubmit,
  isSubmitting
}: ManualEntryModalProps) {
  const [serialNumber, setSerialNumber] = useState("");
  const [qrAvailable, setQrAvailable] = useState<string>("");
  const [photoUrl, setPhotoUrl] = useState<string>("");
  const { capturePhoto, isCapturing } = useCamera();

  const handleCapturePhoto = async () => {
    try {
      const photo = await capturePhoto();
      if (photo) {
        // Upload photo (mock implementation)
        const formData = new FormData();
        formData.append('photo', photo);
        
        const response = await fetch('/api/upload', {
          method: 'POST',
          body: formData
        });
        
        const result = await response.json();
        setPhotoUrl(result.url);
      }
    } catch (error) {
      console.error('Failed to capture photo:', error);
    }
  };

  const handleSubmit = () => {
    if (!serialNumber || !qrAvailable) return;
    
    onSubmit({
      serialNumber,
      qrAvailable: qrAvailable === 'yes',
      photoUrl: photoUrl || undefined
    });
    
    // Reset form
    setSerialNumber("");
    setQrAvailable("");
    setPhotoUrl("");
  };

  const isFormValid = serialNumber.trim() && qrAvailable && photoUrl;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            Manual Entry
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Serial Number Input */}
          <div>
            <Label htmlFor="serialNumber" className="text-sm font-medium text-gray-700 mb-2 block">
              Serial Number
            </Label>
            <Input
              id="serialNumber"
              type="text"
              placeholder="Enter serial number"
              value={serialNumber}
              onChange={(e) => setSerialNumber(e.target.value)}
            />
          </div>

          {/* QR Code Available */}
          <div>
            <Label className="text-sm font-medium text-gray-700 mb-2 block">
              QR Code Available
            </Label>
            <RadioGroup value={qrAvailable} onValueChange={setQrAvailable}>
              <div className="flex space-x-4">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="yes" id="qr-yes" />
                  <Label htmlFor="qr-yes">Yes</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="no" id="qr-no" />
                  <Label htmlFor="qr-no">No</Label>
                </div>
              </div>
            </RadioGroup>
          </div>

          {/* Photo Upload */}
          <div>
            <Label className="text-sm font-medium text-gray-700 mb-2 block">
              Asset Photo
            </Label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              {photoUrl ? (
                <div className="space-y-2">
                  <div className="text-green-600 text-sm">✓ Photo captured successfully</div>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleCapturePhoto}
                    disabled={isCapturing}
                  >
                    <Camera className="h-4 w-4 mr-2" />
                    Retake Photo
                  </Button>
                </div>
              ) : (
                <div>
                  <Camera className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                  <div className="text-sm text-gray-600 mb-2">Take a photo of the asset</div>
                  <Button
                    type="button"
                    onClick={handleCapturePhoto}
                    disabled={isCapturing}
                    className="bg-primary text-white"
                  >
                    <Camera className="h-4 w-4 mr-2" />
                    {isCapturing ? "Capturing..." : "Capture Photo"}
                  </Button>
                </div>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-3 pt-4">
            <Button variant="outline" className="flex-1" onClick={onClose}>
              Cancel
            </Button>
            <Button
              className="flex-1 bg-primary"
              onClick={handleSubmit}
              disabled={!isFormValid || isSubmitting}
            >
              {isSubmitting ? "Submitting..." : "Submit for Approval"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
