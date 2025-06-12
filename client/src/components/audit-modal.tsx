import { useState } from "react";
import { QrCode, Keyboard, X } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import type { Asset } from "@shared/schema";

interface AuditModalProps {
  isOpen: boolean;
  onClose: () => void;
  asset: Asset | null;
  onOpenQRScanner: () => void;
  onOpenManualEntry: () => void;
  onSubmit: (data: { status: string; assetStatus?: string; verificationMethod: string }) => void;
  isSubmitting: boolean;
}

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

export default function AuditModal({
  isOpen,
  onClose,
  asset,
  onOpenQRScanner,
  onOpenManualEntry,
  onSubmit,
  isSubmitting
}: AuditModalProps) {
  const [assetStatus, setAssetStatus] = useState<string>("");

  const handleSubmit = () => {
    if (!assetStatus) return;
    
    onSubmit({
      status: 'verified',
      assetStatus,
      verificationMethod: 'qr-scan'
    });
  };

  if (!asset) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            Audit Asset
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </DialogTitle>
        </DialogHeader>

        {/* Asset Info */}
        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <div className="flex items-center space-x-3 mb-3">
            <div className="p-2 bg-primary rounded-lg">
              <div className="h-5 w-5 bg-white rounded text-primary flex items-center justify-center text-xs font-bold">
                {asset.assetCategory.charAt(0).toUpperCase()}
              </div>
            </div>
            <div>
              <div className="font-semibold text-gray-900">{asset.serialNumber}</div>
              <div className="text-sm text-gray-600">{asset.assetMake} {asset.assetModel}</div>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Badge variant="secondary">{asset.assetCategory}</Badge>
            {asset.qrCodeAvailable && (
              <Badge variant="outline" className="text-green-600 border-green-600">
                QR Available
              </Badge>
            )}
          </div>
        </div>

        {/* QR Scanner Section */}
        <div className="mb-6">
          <Label className="text-sm font-medium text-gray-700 mb-3 block">
            Asset Verification
          </Label>
          <div className="space-y-3">
            <Button
              onClick={onOpenQRScanner}
              className="w-full bg-primary text-white py-3 px-4 rounded-lg font-medium flex items-center justify-center"
            >
              <QrCode className="h-5 w-5 mr-2" />
              Scan QR Code
            </Button>
            <div className="text-center text-gray-500 text-sm">or</div>
            <Button
              onClick={onOpenManualEntry}
              variant="outline"
              className="w-full py-3 px-4 rounded-lg font-medium flex items-center justify-center"
            >
              <Keyboard className="h-5 w-5 mr-2" />
              Manual Entry
            </Button>
          </div>
        </div>

        {/* Asset Status Selection */}
        <div className="mb-6">
          <Label className="text-sm font-medium text-gray-700 mb-2 block">
            Asset Status
          </Label>
          <Select value={assetStatus} onValueChange={setAssetStatus}>
            <SelectTrigger>
              <SelectValue placeholder="Select asset status..." />
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

        {/* Action Buttons */}
        <div className="flex space-x-3">
          <Button variant="outline" className="flex-1" onClick={onClose}>
            Cancel
          </Button>
          <Button
            className="flex-1 bg-primary"
            onClick={handleSubmit}
            disabled={!assetStatus || isSubmitting}
          >
            {isSubmitting ? "Submitting..." : "Submit Audit"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
