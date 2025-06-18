import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Battery, User, Plus } from "lucide-react";
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

// CHANGED: Import the local JSON data files
import franchiseData from "@/data/franchise.json";
import assetsData from "@/data/assets.json";
import auditData from "@/data/audit.json";


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

  // CHANGED: Replaced API fetches with reads from our local JSON files.
  const { data: franchise } = useQuery<Franchise>({
    queryKey: ['franchise-data'],
    queryFn: async () => franchiseData
  });

  const { data: assets = [], isLoading: assetsLoading } = useQuery<Asset[]>({
    queryKey: ['assets-data'],
    queryFn: async () => assetsData
  });

  const { data: audit } = useQuery<Audit>({
    queryKey: ['audit-data'],
    queryFn: async () => auditData
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

  // CHANGED: Replaced the mutation function with a mock that pretends to work.
  const auditMutation = useMutation({
    mutationFn: async (data: { assetId: number; status: string; assetStatus?: string; verificationMethod: string; serialNumberScanned?: string; photoUrl?: string }) => {
      console.log("Mock Audit Submission (data would not be saved on static site):", data);
      // We can't save to a server, so we just pretend it worked.
      await new Promise(resolve => setTimeout(resolve, 500)); // fake delay
      return { success: true };
    },
    onSuccess: () => {
      // On a real app, we'd refetch data. Here, we just show a success message.
      // queryClient.invalidateQueries({ queryKey: ['assets-data'] }); // This won't do anything with static data
      // queryClient.invalidateQueries({ queryKey: ['audit-data'] });
      handleCloseModals();
      toast({
        title: "Audit Submitted (Demo)",
        description: "Asset audit has been submitted successfully.",
      });
    },
    onError: () => {
      // This is unlikely to be called now, but we'll leave it.
      toast({
        title: "Error",
        description: "Failed to submit audit. Please try again.",
        variant: "destructive",
      });
    }
  });

  // CHANGED: Replaced the mutation function with a mock.
  const addAssetMutation = useMutation({
    mutationFn: async (assetData: any) => {
      console.log("Mock Asset Add (data would not be saved on static site):", assetData);
      await new Promise(resolve => setTimeout(resolve, 500)); // fake delay
      return { success: true };
    },
    onSuccess: () => {
      handleCloseModals();
      toast({
        title: "Asset Added (Demo)",
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
          // CHANGED: This is also mocked
          console.log("Mock Quantity Update:", data);
          toast({
            title: "Quantities Updated (Demo)",
            description: "SOC Meter and Harness counts have been saved.",
          });
          handleCloseModals();
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