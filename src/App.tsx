import { Suspense, lazy } from "react";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { PopupProvider } from "@/contexts/PopupContext";
import { AdminThemeProvider } from "@/contexts/AdminThemeContext";
import { ThemeProvider } from "@/components/theme-provider";
import Index from "./pages/Index";
import Gamemode from "./pages/Gamemode";
import AdminPanel from "./pages/AdminPanel";
import About from "./pages/About";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AdminThemeProvider>
        <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
          <TooltipProvider>
            <PopupProvider>
              <BrowserRouter>
                <div className="min-h-screen bg-[#1C2526]">
                  <Routes>
                    <Route path="/" element={<Index />} />
                    <Route path="/admin" element={<AdminPanel />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/:gamemode" element={<Gamemode />} />
                  </Routes>
                </div>
              </BrowserRouter>
              <Toaster />
            </PopupProvider>
          </TooltipProvider>
        </ThemeProvider>
      </AdminThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
