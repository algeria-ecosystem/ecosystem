import { useState, useMemo } from 'react';
import Header from '@/shared/components/Header';
import FilterBar from '../components/FilterBar';
import ResourceGrid from '../components/ResourceGrid';
import Pagination from '@/shared/components/Pagination';
import Footer from '@/shared/components/Footer';
import resourcesData from '@/data/resources.json';
import type { Resource } from '../types';
import { useLanguage } from '@/i18n/LanguageContext';

const resources: Resource[] = resourcesData;

const ITEMS_PER_PAGE = 9;

const Index = () => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const { t } = useLanguage()

  const filteredResources = useMemo(() => {
    let result = [...resources];

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      result = result.filter((item) =>
        item.name.toLowerCase().includes(query) ||
        item.description.toLowerCase().includes(query)
      );
    }

    return result;
  }, [searchQuery]);

  // Pagination
  const totalPages = Math.ceil(filteredResources.length / ITEMS_PER_PAGE);
  const paginatedResources = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredResources.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredResources, currentPage]);

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1);
  };

  const handleClearFilters = () => {
    setSearchQuery('');
    setCurrentPage(1);
  };

  return (
    <div className="min-h-screen bg-background">
      <main className="container py-4 sm:py-6 px-4 sm:px-6">
        <Header
          title="resources"
          description="resourcesDesc"
        />

        <section className="space-y-4 sm:space-y-6">
          <FilterBar
            searchQuery={searchQuery}
            onSearchChange={handleSearchChange}
            totalCount={resources.length}
            filteredCount={filteredResources.length}
          />

          <ResourceGrid
            resources={paginatedResources}
            onClearFilters={handleClearFilters}
          />

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </section>

        <Footer />
      </main>
    </div>
  );
};

export default Index;

