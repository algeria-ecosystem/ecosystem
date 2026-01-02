import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/hooks/use-theme";
import About from "@/shared/pages/About";
import NotFound from "@/shared/pages/NotFound";
import EntityListPage from "@/shared/pages/EntityListPage";
import AdminLayout from "@/features/admin/layouts/AdminLayout";
import AdminDashboard from "@/features/admin/pages/AdminDashboard";
import EntityTypesManager from "@/features/admin/pages/EntityTypesManager";
import EntitiesManager from "@/features/admin/pages/EntitiesManager";
import GenericLookupManager from "@/features/admin/pages/GenericLookupManager";
import SubmitEntityPage from "@/shared/pages/SubmitEntityPage";

const queryClient = new QueryClient();

const App = () => (
  <ThemeProvider defaultTheme="light" storageKey="algeria-ecosystem-theme">
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={
              <EntityListPage
                entityTypeSlug="startup"
                title="Algerian Startups"
                description="Discover the innovative startups shaping Algeria's future."
                filterType="category"
                filterLabel="All Sectors"
              />
            } />
            <Route path="/incubators" element={
              <EntityListPage
                entityTypeSlug="incubator"
                title="Incubators"
                description="Find the perfect incubator to nurture your startup idea."
                filterType="wilaya"
                filterLabel="All Cities"
              />
            } />
            <Route path="/accelerators" element={
              <EntityListPage
                entityTypeSlug="accelerator"
                title="Accelerators"
                description="Programs designed to accelerate your startup's growth."
                filterType="wilaya"
                filterLabel="All Cities"
              />
            } />
            <Route path="/coworking-spaces" element={
              <EntityListPage
                entityTypeSlug="coworking-space"
                title="Coworking Spaces"
                description="Find your ideal workspace in Algeria."
                filterType="wilaya"
                filterLabel="All Cities"
              />
            } />
            <Route path="/media" element={
              <EntityListPage
                entityTypeSlug="media"
                title="Media & Podcasts"
                description="Stay updated with the latest in the Algerian tech ecosystem."
                filterType="media_type"
                filterLabel="All Types"
              />
            } />
            <Route path="/jobs" element={
              <EntityListPage
                entityTypeSlug="job_portal"
                title="Job Portals"
                description="Find your next career opportunity."
                filterType="none"
              />
            } />
            <Route path="/communities" element={
              <EntityListPage
                entityTypeSlug="community"
                title="Communities"
                description="Join vibrant tech communities across Algeria."
                filterType="none"
              />
            } />
            <Route path="/events" element={
              <EntityListPage
                entityTypeSlug="event"
                title="Events"
                description="Don't miss out on upcoming tech events."
                filterType="none"
              />
            } />
            <Route path="/resources" element={
              <EntityListPage
                entityTypeSlug="resource"
                title="Resources"
                description="Essential resources for every entrepreneur."
                filterType="none"
              />
            } />

            <Route path="/about" element={<About />} />
            <Route path="/submit" element={<SubmitEntityPage />} />

            {/* Admin Routes */}
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<AdminDashboard />} />
              <Route path="entity-types" element={<EntityTypesManager />} />
              <Route path="entities" element={<EntitiesManager />} />
              <Route path="categories" element={<GenericLookupManager tableName="categories" title="Categories" />} />
              <Route path="media-types" element={<GenericLookupManager tableName="media_types" title="Media Types" fields={[{ key: 'icon_url', label: 'Icon URL' }, { key: 'icon_emoji', label: 'Emoji' }]} />} />
              <Route path="wilayas" element={<GenericLookupManager tableName="wilayas" title="Wilayas" fields={[{ key: 'code', label: 'Code', type: 'number' }]} />} />
            </Route>

            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </ThemeProvider>
);

export default App;
