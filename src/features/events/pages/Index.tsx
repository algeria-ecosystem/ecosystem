import { useState, useMemo } from 'react';
import Header from '@/shared/components/Header';
import SimpleFilterBar from '@/shared/components/SimpleFilterBar';
import EventGrid from '../components/EventGrid';
import Pagination from '@/shared/components/Pagination';
import Footer from '@/shared/components/Footer';
import eventsData from '@/data/events.json';
import type { Event } from '../types';
import type { SortOrder } from '@/shared/types';
import { useLanguage } from '@/i18n/LanguageContext';

const events: Event[] = eventsData;

const ITEMS_PER_PAGE = 9;

const Index = () => {
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const { t } = useLanguage();

  const filteredAndSortedEvents = useMemo(() => {
    let result = [...events];

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      result = result.filter((event) =>
        event.name.toLowerCase().includes(query) ||
        event.description.toLowerCase().includes(query)
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
  const totalPages = Math.ceil(filteredAndSortedEvents.length / ITEMS_PER_PAGE);
  const paginatedEvents = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredAndSortedEvents.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredAndSortedEvents, currentPage]);

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
          title="events"
          description="eventsDesc"
        />

        <section className="space-y-4 sm:space-y-6">
          <SimpleFilterBar
            sortOrder={sortOrder}
            onSortOrderChange={setSortOrder}
            searchQuery={searchQuery}
            onSearchChange={handleSearchChange}
            totalCount={events.length}
            filteredCount={filteredAndSortedEvents.length}
            searchPlaceholder="Search events..."
          />

          <EventGrid
            events={paginatedEvents}
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

