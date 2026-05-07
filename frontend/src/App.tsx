import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Index from "./pages/Index";
import Admin from "./pages/Admin";
import NotFound from "./pages/NotFound";
import Login from "./pages/b2b/Login";
import Register from "./pages/b2b/Register";
import ForgotPassword from "./pages/b2b/ForgotPassword";
import B2BDashboard from "./pages/b2b/Dashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import { AuthProvider } from "./contexts/AuthContext";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/admin" element={<Admin />} />
            
            {/* B2B Portal Routes */}
            <Route path="/b2b/login" element={<Login />} />
            <Route path="/b2b/register" element={<Register />} />
            <Route path="/b2b/forgot-password" element={<ForgotPassword />} />
            <Route
              path="/b2b/dashboard"
              element={
                <ProtectedRoute>
                  <B2BDashboard />
                </ProtectedRoute>
              }
            />
            <Route path="/b2b" element={<Navigate to="/b2b/dashboard" replace />} />

            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
