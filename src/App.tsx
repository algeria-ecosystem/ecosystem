import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/hooks/use-theme";
import Index from "@/features/startups/pages/Index";
import Incubators from "@/features/incubators/pages/Incubators";
import Accelerators from "@/features/accelerators/pages/Accelerators";
import CoworkingSpaces from "@/features/coworking-spaces/pages/CoworkingSpaces";
import Media from "@/features/media/pages/Index";
import Jobs from "@/features/jobs/pages/Index";
import Communities from "@/features/communities/pages/Index";
import Events from "@/features/events/pages/Index";
import Resources from "@/features/resources/pages/Index";
import About from "@/shared/pages/About";
import NotFound from "@/shared/pages/NotFound";
import { LanguageProvider } from "./i18n/LanguageContext";

const queryClient = new QueryClient();

const App = () => (
  <ThemeProvider defaultTheme="light" storageKey="algeria-ecosystem-theme">
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <LanguageProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/incubators" element={<Incubators />} />
              <Route path="/accelerators" element={<Accelerators />} />
              <Route path="/coworking-spaces" element={<CoworkingSpaces />} />
              <Route path="/media" element={<Media />} />
              <Route path="/jobs" element={<Jobs />} />
              <Route path="/communities" element={<Communities />} />
              <Route path="/events" element={<Events />} />
              <Route path="/resources" element={<Resources />} />
              <Route path="/about" element={<About />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </LanguageProvider>
      </TooltipProvider>
    </QueryClientProvider>
  </ThemeProvider>
);

export default App;
