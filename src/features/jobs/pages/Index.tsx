import { useState, useMemo } from 'react';
import Header from '@/shared/components/Header';
import SimpleFilterBar from '@/shared/components/SimpleFilterBar';
import JobGrid from '../components/JobGrid';
import Pagination from '@/shared/components/Pagination';
import Footer from '@/shared/components/Footer';
import jobsData from '@/data/jobs.json';
import type { Job } from '../types';
import type { SortOrder } from '@/shared/types';
import { useLanguage } from '@/i18n/LanguageContext';

const jobs: Job[] = jobsData;

const ITEMS_PER_PAGE = 9;

const Index = () => {
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const { t } = useLanguage()

  const filteredAndSortedJobs = useMemo(() => {
    let result = [...jobs];

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      result = result.filter((job) =>
        job.name.toLowerCase().includes(query) ||
        job.description.toLowerCase().includes(query)
      );
    }

    // Sort by name (alphabetically)
    result.sort((a, b) => {
      return sortOrder === 'desc'
        ? b.name.localeCompare(a.name) // Z-A
        : a.name.localeCompare(b.name); // A-Z
    });

    return result;
  }, [sortOrder, searchQuery]);

  // Pagination
  const totalPages = Math.ceil(filteredAndSortedJobs.length / ITEMS_PER_PAGE);
  const paginatedJobs = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredAndSortedJobs.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredAndSortedJobs, currentPage]);

  // Reset to page 1 when filters change
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
          title="jobs"
          description="jobsDesc"
        />

        <section className="space-y-4 sm:space-y-6">
          <SimpleFilterBar
            sortOrder={sortOrder}
            onSortOrderChange={setSortOrder}
            searchQuery={searchQuery}
            onSearchChange={handleSearchChange}
            totalCount={jobs.length}
            filteredCount={filteredAndSortedJobs.length}
            searchPlaceholder="Search job portals..."
          />

          <JobGrid
            jobs={paginatedJobs}
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

