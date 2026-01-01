import { useState, useMemo } from 'react';
import Header from '@/shared/components/Header';
import SimpleFilterBar from '@/shared/components/SimpleFilterBar';
import IncubatorGrid from '../components/IncubatorGrid';
import Pagination from '@/shared/components/Pagination';
import Footer from '@/shared/components/Footer';
import incubatorsData from '@/data/incubators.json';
import type { Incubator } from '../types';
import type { SortOrder } from '@/shared/types';
import { useLanguage } from '@/i18n/LanguageContext';

const incubators: Incubator[] = incubatorsData;

const ITEMS_PER_PAGE = 9;

const Incubators = () => {
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCity, setSelectedCity] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const { t } = useLanguage()

  // Extract unique cities from incubators
  const availableCities = useMemo(() => {
    const cities = incubators
      .map((incubator) => incubator.city)
      .filter((city): city is string => Boolean(city))
      .filter((city, index, self) => self.indexOf(city) === index)
      .sort();
    return cities;
  }, []);

  const filteredAndSortedIncubators = useMemo(() => {
    let result = [...incubators];

    // Filter by city
    if (selectedCity !== 'all') {
      result = result.filter((incubator) => incubator.city === selectedCity);
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      result = result.filter((incubator) =>
        incubator.name.toLowerCase().includes(query) ||
        (incubator.city && incubator.city.toLowerCase().includes(query))
      );
    }

    // Sort by founded year
    result.sort((a, b) => {
      return sortOrder === 'desc'
        ? b.foundedYear - a.foundedYear
        : a.foundedYear - b.foundedYear;
    });

    return result;
  }, [sortOrder, searchQuery, selectedCity]);

  // Pagination
  const totalPages = Math.ceil(filteredAndSortedIncubators.length / ITEMS_PER_PAGE);
  const paginatedIncubators = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredAndSortedIncubators.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredAndSortedIncubators, currentPage]);

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1);
  };

  const handleCityChange = (city: string) => {
    setSelectedCity(city);
    setCurrentPage(1);
  };

  const handleClearFilters = () => {
    setSearchQuery('');
    setSelectedCity('all');
    setCurrentPage(1);
  };

  return (
    <div className="min-h-screen bg-background">
      <main className="container py-4 sm:py-6 px-4 sm:px-6">
        <Header
          title="incubators"
          description="incubatorsDesc"
        />

        <section className="space-y-4 sm:space-y-6">
          <SimpleFilterBar
            sortOrder={sortOrder}
            onSortOrderChange={setSortOrder}
            searchQuery={searchQuery}
            onSearchChange={handleSearchChange}
            totalCount={incubators.length}
            filteredCount={filteredAndSortedIncubators.length}
            searchPlaceholder="Search incubators..."
            cities={availableCities}
            selectedCity={selectedCity}
            onCityChange={handleCityChange}
          />

          <IncubatorGrid
            incubators={paginatedIncubators}
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

export default Incubators;

