import { Switch, Route, Router } from "wouter"; // <--- 1. UPDATED IMPORT
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import AuditDashboard from "@/pages/audit-dashboard";

// 2. RENAMED THE FUNCTION
function AppRoutes() {
  return (
    <Switch>
      <Route path="/" component={AuditDashboard} />
      <Route path="/audit" component={AuditDashboard} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        {/* 3. WRAPPED with ROUTER and added the BASE property */}
        <Router base="/auditmodulefinal">
          <AppRoutes />
        </Router>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;