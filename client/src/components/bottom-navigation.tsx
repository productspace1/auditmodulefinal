import { Home, List, Calculator, BarChart3 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface BottomNavigationProps {
  onShowQuantity: () => void;
  onShowCompletion: () => void;
}

export default function BottomNavigation({ onShowQuantity, onShowCompletion }: BottomNavigationProps) {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-2 safe-area-pb">
      <div className="flex items-center justify-between">
        <Button variant="ghost" className="flex flex-col items-center py-2 px-3 text-primary">
          <Home className="h-5 w-5 mb-1" />
          <span className="text-xs">Dashboard</span>
        </Button>
        <Button variant="ghost" className="flex flex-col items-center py-2 px-3 text-gray-500">
          <List className="h-5 w-5 mb-1" />
          <span className="text-xs">Assets</span>
        </Button>
        <Button 
          variant="ghost" 
          className="flex flex-col items-center py-2 px-3 text-gray-500"
          onClick={onShowQuantity}
        >
          <Calculator className="h-5 w-5 mb-1" />
          <span className="text-xs">Counts</span>
        </Button>
        <Button 
          variant="ghost" 
          className="flex flex-col items-center py-2 px-3 text-gray-500"
          onClick={onShowCompletion}
        >
          <BarChart3 className="h-5 w-5 mb-1" />
          <span className="text-xs">Reports</span>
        </Button>
      </div>
    </div>
  );
}
