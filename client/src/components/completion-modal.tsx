import { Check } from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import type { Audit } from "@shared/schema";

interface CompletionModalProps {
  isOpen: boolean;
  onClose: () => void;
  auditData?: Audit | null;
}

export default function CompletionModal({
  isOpen,
  onClose,
  auditData
}: CompletionModalProps) {
  const handleGenerateReport = () => {
    // In real implementation, generate and download the audit report
    console.log('Generating audit report...');
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <div className="text-center">
          <div className="mb-6">
            <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <Check className="h-8 w-8 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Audit Complete</h3>
            <p className="text-sm text-gray-600">
              All assets have been successfully audited. Ready to generate final report.
            </p>
          </div>

          {auditData && (
            <Card className="mb-6">
              <CardContent className="p-4">
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="text-xl font-bold text-green-600">{auditData.verifiedAssets}</div>
                    <div className="text-xs text-gray-500">Verified</div>
                  </div>
                  <div>
                    <div className="text-xl font-bold text-yellow-600">{auditData.pendingAssets}</div>
                    <div className="text-xs text-gray-500">Pending</div>
                  </div>
                  <div>
                    <div className="text-xl font-bold text-red-600">{auditData.mismatchAssets}</div>
                    <div className="text-xs text-gray-500">Issues</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          <div className="space-y-3">
            <Button 
              className="w-full bg-primary" 
              onClick={handleGenerateReport}
            >
              Generate Final Report
            </Button>
            <Button 
              variant="outline" 
              className="w-full" 
              onClick={onClose}
            >
              Continue Auditing
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
