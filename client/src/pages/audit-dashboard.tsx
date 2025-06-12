import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Battery, User, Plus, Home, List, Calculator, BarChart3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import AssetCard from "@/components/asset-card";
import AuditModal from "@/components/audit-modal";
import QRScannerModal from "@/components/qr-scanner-modal";
import ManualEntryModal from "@/components/manual-entry-modal";
import AddAssetModal from "@/components/add-asset-modal";
import QuantityInputModal from "@/components/quantity-input-modal";
import CompletionModal from "@/components/completion-modal";
import BottomNavigation from "@/components/bottom-navigation";
import { useToast } from "@/hooks/use-toast";
import type { Asset, Audit, Franchise } from "@shared/schema";

export default function AuditDashboard() {
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null);
  const [showAuditModal, setShowAuditModal] = useState(false);
  const [showQRModal, setShowQRModal] = useState(false);
  const [showManualModal, setShowManualModal] = useState(false);
  const [showAddAssetModal, setShowAddAssetModal] = useState(false);
  const [showQuantityModal, setShowQuantityModal] = useState(false);
  const [showCompletionModal, setShowCompletionModal] = useState(false);
  const [activeFilter, setActiveFilter] = useState<'all' | 'pending' | 'verified'>('all');
  
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch franchise data (using franchise ID 1 for demo)
  const { data: franchise } = useQuery<Franchise>({
    queryKey: ['/api/franchise/1'],
  });

  // Fetch assets for the franchise
  const { data: assets = [], isLoading: assetsLoading } = useQuery<Asset[]>({
    queryKey: ['/api/assets/franchise/1'],
  });

  // Fetch current audit
  const { data: audit } = useQuery<Audit>({
    queryKey: ['/api/audit/franchise/1'],
  });

  // Filter assets based on active filter
  const filteredAssets = assets.filter(asset => {
    if (activeFilter === 'all') return true;
    if (activeFilter === 'pending') return asset.status === 'pending';
    if (activeFilter === 'verified') return asset.status === 'verified';
    return true;
  });

  const handleInitiateAudit = (asset: Asset) => {
    setSelectedAsset(asset);
    setShowAuditModal(true);
  };

  const handleOpenQRScanner = () => {
    setShowAuditModal(false);
    setShowQRModal(true);
  };

  const handleOpenManualEntry = () => {
    setShowAuditModal(false);
    setShowManualModal(true);
  };

  const handleCloseModals = () => {
    setShowAuditModal(false);
    setShowQRModal(false);
    setShowManualModal(false);
    setShowAddAssetModal(false);
    setShowQuantityModal(false);
    setShowCompletionModal(false);
    setSelectedAsset(null);
  };

  const auditMutation = useMutation({
    mutationFn: async (data: { assetId: number; status: string; assetStatus?: string; verificationMethod: string; serialNumberScanned?: string; photoUrl?: string }) => {
      // Update asset status
      await fetch(`/api/assets/${data.assetId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: data.status,
          assetStatus: data.assetStatus
        })
      });

      // Create audit entry
      const auditResponse = await fetch('/api/audit-entries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          auditId: audit?.id,
          assetId: data.assetId,
          verificationMethod: data.verificationMethod,
          serialNumberScanned: data.serialNumberScanned,
          photoUrl: data.photoUrl
        })
      });

      return auditResponse.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/assets/franchise/1'] });
      queryClient.invalidateQueries({ queryKey: ['/api/audit/franchise/1'] });
      handleCloseModals();
      toast({
        title: "Audit Submitted",
        description: "Asset audit has been submitted successfully.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to submit audit. Please try again.",
        variant: "destructive",
      });
    }
  });

  const addAssetMutation = useMutation({
    mutationFn: async (assetData: any) => {
      const response = await fetch('/api/assets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...assetData,
          franchiseId: 1,
          status: 'pending'
        })
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/assets/franchise/1'] });
      handleCloseModals();
      toast({
        title: "Asset Added",
        description: "New asset has been added for verification.",
      });
    }
  });

  const progress = audit ? Math.round((audit.verifiedAssets / audit.totalAssets) * 100) : 0;

  if (assetsLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Battery className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
          <p>Loading audit data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-primary text-white shadow-lg sticky top-0 z-40">
        <div className="px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Battery className="h-6 w-6" />
              <div>
                <h1 className="text-lg font-semibold">Battery Audit</h1>
                <p className="text-xs opacity-90">{franchise?.name}</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <div className="bg-white bg-opacity-20 rounded-full px-2 py-1">
                <span className="text-xs font-medium">
                  {audit?.verifiedAssets || 0}/{audit?.totalAssets || 0}
                </span>
              </div>
              <Button variant="ghost" size="sm" className="p-2 hover:bg-white hover:bg-opacity-20 rounded-full">
                <User className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="px-4 py-6 pb-20">
        {/* Audit Progress Card */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Audit Progress</h2>
              <Badge variant="secondary" className="bg-blue-100 text-primary">
                In Progress
              </Badge>
            </div>
            
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Assets Audited</span>
                <span className="font-semibold text-gray-900">
                  {audit?.verifiedAssets || 0} / {audit?.totalAssets || 0}
                </span>
              </div>
              
              <Progress value={progress} className="w-full" />
              
              <div className="grid grid-cols-3 gap-4 pt-2">
                <div className="text-center">
                  <div className="text-xl font-bold text-green-600">{audit?.verifiedAssets || 0}</div>
                  <div className="text-xs text-gray-500">Verified</div>
                </div>
                <div className="text-center">
                  <div className="text-xl font-bold text-yellow-600">{audit?.pendingAssets || 0}</div>
                  <div className="text-xs text-gray-500">Pending</div>
                </div>
                <div className="text-center">
                  <div className="text-xl font-bold text-red-600">{audit?.mismatchAssets || 0}</div>
                  <div className="text-xs text-gray-500">Mismatch</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center">
                <div className="p-3 bg-blue-100 rounded-lg mr-3">
                  <Battery className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <div className="text-sm text-gray-500">Total Assets</div>
                  <div className="text-xl font-bold text-gray-900">{audit?.totalAssets || 0}</div>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center">
                <div className="p-3 bg-green-100 rounded-lg mr-3">
                  <div className="h-5 w-5 bg-green-600 rounded text-white flex items-center justify-center text-xs">
                    QR
                  </div>
                </div>
                <div>
                  <div className="text-sm text-gray-500">QR Scanned</div>
                  <div className="text-xl font-bold text-gray-900">
                    {assets.filter(a => a.status === 'verified' && a.qrCodeAvailable).length}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Assets Section */}
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Assets to Audit</h3>
          <Button onClick={() => setShowAddAssetModal(true)} className="bg-primary">
            <Plus className="h-4 w-4 mr-2" />
            Add Asset
          </Button>
        </div>

        {/* Filter Tabs */}
        <div className="flex space-x-1 bg-gray-100 rounded-lg p-1 mb-4">
          <Button
            variant={activeFilter === 'all' ? 'default' : 'ghost'}
            size="sm"
            className={`flex-1 ${activeFilter === 'all' ? 'bg-white text-primary shadow-sm' : 'text-gray-600'}`}
            onClick={() => setActiveFilter('all')}
          >
            All ({assets.length})
          </Button>
          <Button
            variant={activeFilter === 'pending' ? 'default' : 'ghost'}
            size="sm"
            className={`flex-1 ${activeFilter === 'pending' ? 'bg-white text-primary shadow-sm' : 'text-gray-600'}`}
            onClick={() => setActiveFilter('pending')}
          >
            Pending ({assets.filter(a => a.status === 'pending').length})
          </Button>
          <Button
            variant={activeFilter === 'verified' ? 'default' : 'ghost'}
            size="sm"
            className={`flex-1 ${activeFilter === 'verified' ? 'bg-white text-primary shadow-sm' : 'text-gray-600'}`}
            onClick={() => setActiveFilter('verified')}
          >
            Verified ({assets.filter(a => a.status === 'verified').length})
          </Button>
        </div>

        {/* Asset Cards */}
        <div className="space-y-3">
          {filteredAssets.map((asset) => (
            <AssetCard
              key={asset.id}
              asset={asset}
              onInitiateAudit={() => handleInitiateAudit(asset)}
            />
          ))}
        </div>
      </div>

      {/* Modals */}
      <AuditModal
        isOpen={showAuditModal}
        onClose={handleCloseModals}
        asset={selectedAsset}
        onOpenQRScanner={handleOpenQRScanner}
        onOpenManualEntry={handleOpenManualEntry}
        onSubmit={(data) => {
          if (selectedAsset) {
            auditMutation.mutate({
              assetId: selectedAsset.id,
              ...data
            });
          }
        }}
        isSubmitting={auditMutation.isPending}
      />

      <QRScannerModal
        isOpen={showQRModal}
        onClose={() => {
          setShowQRModal(false);
          setShowAuditModal(true);
        }}
        onQRScanned={(serialNumber) => {
          if (selectedAsset && serialNumber === selectedAsset.serialNumber) {
            auditMutation.mutate({
              assetId: selectedAsset.id,
              status: 'verified',
              verificationMethod: 'qr-scan',
              serialNumberScanned: serialNumber
            });
          } else {
            toast({
              title: "QR Code Mismatch",
              description: "Scanned serial number doesn't match the expected asset.",
              variant: "destructive",
            });
          }
        }}
      />

      <ManualEntryModal
        isOpen={showManualModal}
        onClose={() => {
          setShowManualModal(false);
          setShowAuditModal(true);
        }}
        onSubmit={(data) => {
          if (selectedAsset) {
            auditMutation.mutate({
              assetId: selectedAsset.id,
              status: 'pending',
              verificationMethod: 'manual-entry',
              serialNumberScanned: data.serialNumber,
              photoUrl: data.photoUrl
            });
          }
        }}
        isSubmitting={auditMutation.isPending}
      />

      <AddAssetModal
        isOpen={showAddAssetModal}
        onClose={handleCloseModals}
        onSubmit={(data) => addAssetMutation.mutate(data)}
        isSubmitting={addAssetMutation.isPending}
      />

      <QuantityInputModal
        isOpen={showQuantityModal}
        onClose={handleCloseModals}
        onSubmit={(data) => {
          // Update audit with quantities
          if (audit) {
            fetch(`/api/audits/${audit.id}`, {
              method: 'PATCH',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(data)
            }).then(() => {
              queryClient.invalidateQueries({ queryKey: ['/api/audit/franchise/1'] });
              handleCloseModals();
              toast({
                title: "Quantities Updated",
                description: "SOC Meter and Harness counts have been saved.",
              });
            });
          }
        }}
      />

      <CompletionModal
        isOpen={showCompletionModal}
        onClose={handleCloseModals}
        auditData={audit}
      />

      {/* Bottom Navigation */}
      <BottomNavigation
        onShowQuantity={() => setShowQuantityModal(true)}
        onShowCompletion={() => setShowCompletionModal(true)}
      />
    </div>
  );
}
