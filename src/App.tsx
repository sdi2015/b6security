
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Guards from "./pages/Guards";
import Sites from "./pages/Sites";
import Schedule from "./pages/Schedule";
import Incidents from "./pages/Incidents";
import Reports from "./pages/Reports";
import Clients from "./pages/Clients";
import FieldOperations from "./pages/FieldOperations";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";
import { AccountProvider } from "@/context/AccountContext";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <AccountProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/guards" element={<Guards />} />
              <Route path="/sites" element={<Sites />} />
              <Route path="/schedule" element={<Schedule />} />
              <Route path="/incidents" element={<Incidents />} />
              <Route path="/reports" element={<Reports />} />
              <Route path="/clients" element={<Clients />} />
              <Route path="/field" element={<FieldOperations />} />
              <Route path="/settings" element={<Settings />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </AccountProvider>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
