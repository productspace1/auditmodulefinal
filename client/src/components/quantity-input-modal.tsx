import { useState } from "react";
import { X } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface QuantityInputModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: { socMeterCount: number; harnessCount: number }) => void;
}

export default function QuantityInputModal({
  isOpen,
  onClose,
  onSubmit
}: QuantityInputModalProps) {
  const [socMeterCount, setSocMeterCount] = useState<number>(0);
  const [harnessCount, setHarnessCount] = useState<number>(0);

  const handleSubmit = () => {
    onSubmit({ socMeterCount, harnessCount });
    setSocMeterCount(0);
    setHarnessCount(0);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            Additional Asset Counts
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </DialogTitle>
        </DialogHeader>

        <div className="text-center mb-6">
          <p className="text-sm text-gray-600">Enter quantity for SOC Meters and Harnesses</p>
        </div>

        <div className="space-y-4 mb-6">
          <div>
            <Label htmlFor="socMeter" className="text-sm font-medium text-gray-700 mb-2 block">
              SOC Meter Count
            </Label>
            <Input
              id="socMeter"
              type="number"
              min="0"
              placeholder="0"
              value={socMeterCount}
              onChange={(e) => setSocMeterCount(parseInt(e.target.value) || 0)}
            />
          </div>
          
          <div>
            <Label htmlFor="harness" className="text-sm font-medium text-gray-700 mb-2 block">
              Harness Count
            </Label>
            <Input
              id="harness"
              type="number"
              min="0"
              placeholder="0"
              value={harnessCount}
              onChange={(e) => setHarnessCount(parseInt(e.target.value) || 0)}
            />
          </div>
        </div>

        <div className="flex space-x-3">
          <Button variant="outline" className="flex-1" onClick={onClose}>
            Cancel
          </Button>
          <Button className="flex-1 bg-primary" onClick={handleSubmit}>
            Save Counts
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
