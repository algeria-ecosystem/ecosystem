import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "@/hooks/use-theme";
import About from "@/features/shared/pages/About";
import NotFound from "@/features/shared/pages/NotFound";
import EntityListPage from "@/features/shared/pages/EntityListPage";
import AdminLayout from "@/features/admin/layouts/AdminLayout";
import AdminDashboard from "@/features/admin/pages/AdminDashboard";
import EntityTypesManager from "@/features/admin/pages/EntityTypesManager";
import EntitiesManager from "@/features/admin/pages/EntitiesManager";
import GenericLookupManager from "@/features/admin/pages/GenericLookupManager";
import SubmitEntityPage from "@/features/shared/pages/SubmitEntityPage";
import LoginPage from "@/features/auth/pages/LoginPage";
import { RequireAuth } from "@/features/auth/components/RequireAuth";

const queryClient = new QueryClient();

const App = () => (
  <ThemeProvider defaultTheme="light" storageKey="algeria-ecosystem-theme">
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Navigate to="/entities/all" replace />} />
            <Route path="/entities/:type" element={<EntityListPage />} />
            <Route path="/about" element={<About />} />
            <Route path="/submit" element={<SubmitEntityPage />} />
            <Route path="/login" element={<LoginPage />} />

            {/* Protected Admin Routes */}
            <Route path="/admin" element={
              <RequireAuth>
                <AdminLayout />
              </RequireAuth>
            }>
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
