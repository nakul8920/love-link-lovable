import { useEffect } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Index from "./pages/Index.tsx";
import CreatePage from "./pages/CreatePage.tsx";
import WishViewer from "./pages/WishViewer.tsx";
import SuccessPage from "./pages/SuccessPage.tsx";
import AdminPage from "./pages/AdminPage.tsx";
import NotFound from "./pages/NotFound.tsx";
import Login from "./pages/auth/Login.tsx";

import Profile from "./pages/Profile.tsx";
import SupportPage from "./pages/SupportPage.tsx";
import RequireAuth from "@/components/RequireAuth";

const queryClient = new QueryClient();

/** App data lives in sessionStorage only; strip legacy keys from localStorage on load. */
const LEGACY_LOCAL_KEYS = ["token", "userInfo", "adminToken", "wishlink_pages"] as const;

const App = () => {
  useEffect(() => {
    try {
      LEGACY_LOCAL_KEYS.forEach((k) => localStorage.removeItem(k));
    } catch {
      /* ignore */
    }
  }, []);

  return (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/login" element={<Login />} />
          <Route path="/support" element={<SupportPage />} />

          <Route
            path="/create"
            element={
              <RequireAuth>
                <CreatePage />
              </RequireAuth>
            }
          />
          <Route path="/p/:slug" element={<WishViewer />} />
          <Route path="/success/:slug" element={<SuccessPage />} />
          <Route path="/master420" element={<AdminPage />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
  );
};

export default App;
