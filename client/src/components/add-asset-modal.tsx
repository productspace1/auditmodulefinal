import { useState } from "react";
import { X, QrCode, Camera } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useCamera } from "@/hooks/use-camera";

interface AddAssetModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
  isSubmitting: boolean;
}

const assetCategories = [
  { value: "battery", label: "Battery" },
  { value: "charger", label: "Charger" },
  { value: "soc-meter", label: "SOC Meter" },
  { value: "harness", label: "Harness" },
];

const assetStatusOptions = [
  { value: "rtb-franchise", label: "RTB at Franchise" },
  { value: "rmt-franchise", label: "RMT at Franchise" },
  { value: "deployed-driver", label: "Deployed to Driver" },
  { value: "idle-franchise", label: "Idle at Franchise" },
  { value: "theft", label: "Theft" },
  { value: "burnt-franchise", label: "Burnt & at Franchise" },
  { value: "burnt-wh-plant", label: "Burnt & WH/Plant" },
  { value: "police-custody", label: "Police Custody" },
  { value: "financer-custody", label: "Financer Custody" },
  { value: "not-at-franchise", label: "Not at Franchise" },
];

export default function AddAssetModal({
  isOpen,
  onClose,
  onSubmit,
  isSubmitting
}: AddAssetModalProps) {
  const [formData, setFormData] = useState({
    assetCategory: "",
    serialNumber: "",
    assetMake: "",
    assetModel: "",
    iotNumber: "",
    qrAvailable: "",
    assetStatus: "",
    photoUrl: ""
  });

  const { capturePhoto, isCapturing } = useCamera();

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

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
        handleInputChange('photoUrl', result.url);
      }
    } catch (error) {
      console.error('Failed to capture photo:', error);
    }
  };

  const handleSubmit = () => {
    const submitData = {
      ...formData,
      qrCodeAvailable: formData.qrAvailable === 'yes'
    };
    
    onSubmit(submitData);
    
    // Reset form
    setFormData({
      assetCategory: "",
      serialNumber: "",
      assetMake: "",
      assetModel: "",
      iotNumber: "",
      qrAvailable: "",
      assetStatus: "",
      photoUrl: ""
    });
  };

  const isFormValid = formData.assetCategory && 
                     formData.serialNumber && 
                     formData.assetMake && 
                     formData.assetModel && 
                     formData.qrAvailable && 
                     formData.assetStatus && 
                     formData.photoUrl;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            Add New Asset
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Asset Category */}
          <div>
            <Label className="text-sm font-medium text-gray-700 mb-2 block">
              Asset Category
            </Label>
            <Select value={formData.assetCategory} onValueChange={(value) => handleInputChange('assetCategory', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select category..." />
              </SelectTrigger>
              <SelectContent>
                {assetCategories.map((category) => (
                  <SelectItem key={category.value} value={category.value}>
                    {category.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Serial Number */}
          <div>
            <Label className="text-sm font-medium text-gray-700 mb-2 block">
              Serial Number
            </Label>
            <div className="flex space-x-2">
              <Input
                placeholder="Enter or scan serial number"
                value={formData.serialNumber}
                onChange={(e) => handleInputChange('serialNumber', e.target.value)}
                className="flex-1"
              />
              <Button type="button" size="sm" className="bg-primary">
                <QrCode className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Asset Make */}
          <div>
            <Label className="text-sm font-medium text-gray-700 mb-2 block">
              Asset Make
            </Label>
            <Input
              placeholder="Enter asset make"
              value={formData.assetMake}
              onChange={(e) => handleInputChange('assetMake', e.target.value)}
            />
          </div>

          {/* Asset Model */}
          <div>
            <Label className="text-sm font-medium text-gray-700 mb-2 block">
              Asset Model
            </Label>
            <Input
              placeholder="Enter asset model"
              value={formData.assetModel}
              onChange={(e) => handleInputChange('assetModel', e.target.value)}
            />
          </div>

          {/* IOT Number */}
          <div>
            <Label className="text-sm font-medium text-gray-700 mb-2 block">
              IOT Number (Optional)
            </Label>
            <Input
              placeholder="Enter IOT number"
              value={formData.iotNumber}
              onChange={(e) => handleInputChange('iotNumber', e.target.value)}
            />
          </div>

          {/* QR Code Available */}
          <div>
            <Label className="text-sm font-medium text-gray-700 mb-2 block">
              QR Code Available
            </Label>
            <RadioGroup value={formData.qrAvailable} onValueChange={(value) => handleInputChange('qrAvailable', value)}>
              <div className="flex space-x-4">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="yes" id="add-qr-yes" />
                  <Label htmlFor="add-qr-yes">Yes</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="no" id="add-qr-no" />
                  <Label htmlFor="add-qr-no">No</Label>
                </div>
              </div>
            </RadioGroup>
          </div>

          {/* Asset Status */}
          <div>
            <Label className="text-sm font-medium text-gray-700 mb-2 block">
              Asset Status
            </Label>
            <Select value={formData.assetStatus} onValueChange={(value) => handleInputChange('assetStatus', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select status..." />
              </SelectTrigger>
              <SelectContent>
                {assetStatusOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Photo Upload */}
          <div>
            <Label className="text-sm font-medium text-gray-700 mb-2 block">
              Asset Photo
            </Label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
              {formData.photoUrl ? (
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
                  <Camera className="h-6 w-6 text-gray-400 mx-auto mb-2" />
                  <div className="text-sm text-gray-600 mb-2">Required for verification</div>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleCapturePhoto}
                    disabled={isCapturing}
                  >
                    <Camera className="h-4 w-4 mr-2" />
                    {isCapturing ? "Capturing..." : "Take Photo"}
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
              {isSubmitting ? "Adding..." : "Add Asset"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
