import { Battery, Plug, Gauge, Cable, QrCode, CheckCircle, AlertTriangle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { Asset } from "@shared/schema";

interface AssetCardProps {
  asset: Asset;
  onInitiateAudit: () => void;
}

const getAssetIcon = (category: string) => {
  switch (category) {
    case 'battery':
      return <Battery className="h-5 w-5 text-primary" />;
    case 'charger':
      return <Plug className="h-5 w-5 text-primary" />;
    case 'soc-meter':
      return <Gauge className="h-5 w-5 text-primary" />;
    case 'harness':
      return <Cable className="h-5 w-5 text-primary" />;
    default:
      return <Battery className="h-5 w-5 text-primary" />;
  }
};

const getStatusBadge = (status: string) => {
  switch (status) {
    case 'verified':
      return <Badge className="bg-green-100 text-green-800">Verified</Badge>;
    case 'pending':
      return <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>;
    case 'mismatch':
      return <Badge className="bg-red-100 text-red-800">Mismatch</Badge>;
    default:
      return <Badge variant="secondary">Unknown</Badge>;
  }
};

const getAssetStatusText = (assetStatus?: string | null) => {
  if (!assetStatus) return null;
  
  const statusMap: Record<string, string> = {
    'rtb-franchise': 'RTB at Franchise',
    'rmt-franchise': 'RMT at Franchise',
    'deployed-driver': 'Deployed to Driver',
    'idle-franchise': 'Idle at Franchise',
    'theft': 'Theft',
    'burnt-franchise': 'Burnt & at Franchise',
    'burnt-wh-plant': 'Burnt & WH/Plant',
    'police-custody': 'Police Custody',
    'financer-custody': 'Financer Custody',
    'not-at-franchise': 'Not at Franchise'
  };
  
  return statusMap[assetStatus] || assetStatus;
};

export default function AssetCard({ asset, onInitiateAudit }: AssetCardProps) {
  const assetStatusText = getAssetStatusText(asset.assetStatus);
  
  return (
    <Card className="shadow-sm">
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-1">
              {getAssetIcon(asset.assetCategory)}
              <span className="font-semibold text-gray-900">{asset.serialNumber}</span>
              <Badge variant="secondary" className="bg-gray-100 text-gray-600 text-xs">
                {asset.assetCategory.charAt(0).toUpperCase() + asset.assetCategory.slice(1)}
              </Badge>
            </div>
            <div className="text-sm text-gray-600 space-y-1">
              <div><span className="font-medium">Make:</span> {asset.assetMake}</div>
              <div><span className="font-medium">Model:</span> {asset.assetModel}</div>
              {asset.iotNumber && (
                <div><span className="font-medium">IOT:</span> {asset.iotNumber}</div>
              )}
            </div>
          </div>
          <div className="flex flex-col items-end space-y-2">
            {getStatusBadge(asset.status)}
            {asset.status === 'pending' ? (
              <Button onClick={onInitiateAudit} size="sm" className="bg-primary">
                Initiate Audit
              </Button>
            ) : asset.status === 'verified' ? (
              <div className="flex items-center text-sm text-gray-500">
                {asset.qrCodeAvailable ? (
                  <>
                    <QrCode className="h-4 w-4 mr-1" />
                    QR Scanned
                  </>
                ) : (
                  <>
                    <CheckCircle className="h-4 w-4 mr-1" />
                    Manual Entry
                  </>
                )}
              </div>
            ) : (
              <Button variant="outline" size="sm">
                Resolve Issue
              </Button>
            )}
          </div>
        </div>
        
        {(asset.status === 'verified' || asset.status === 'mismatch') && (
          <div className="border-t pt-3 mt-3">
            {asset.status === 'verified' && assetStatusText ? (
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">
                  Status: <span className="font-medium text-green-600">{assetStatusText}</span>
                </span>
                <span className="text-gray-500">
                  {new Date(asset.updatedAt || '').toLocaleTimeString()}
                </span>
              </div>
            ) : asset.status === 'mismatch' ? (
              <div className="flex items-center text-sm text-red-600">
                <AlertTriangle className="h-4 w-4 mr-2" />
                Serial number mismatch detected
              </div>
            ) : null}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
