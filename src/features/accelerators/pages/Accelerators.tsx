import { useState, useMemo } from 'react';
import Header from '@/shared/components/Header';
import SimpleFilterBar from '@/shared/components/SimpleFilterBar';
import AcceleratorGrid from '../components/AcceleratorGrid';
import Pagination from '@/shared/components/Pagination';
import Footer from '@/shared/components/Footer';
import acceleratorsData from '@/data/accelerators.json';
import type { Accelerator } from '../types';
import type { SortOrder } from '@/shared/types';
import { useLanguage } from '@/i18n/LanguageContext';

const accelerators: Accelerator[] = acceleratorsData;

const ITEMS_PER_PAGE = 9;

const Accelerators = () => {
  const { t } = useLanguage();
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCity, setSelectedCity] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState<number>(1);

  const availableCities = useMemo(() => {
    const cities = accelerators
      .map((accelerator) => accelerator.city)
      .filter((city): city is string => Boolean(city))
      .filter((city, index, self) => self.indexOf(city) === index)
      .sort();
    return cities;
  }, []);

  const filteredAndSortedAccelerators = useMemo(() => {
    let result = [...accelerators];

    if (selectedCity !== 'all') {
      result = result.filter((accelerator) => accelerator.city === selectedCity);
    }

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      result = result.filter(
        (accelerator) =>
          accelerator.name.toLowerCase().includes(query) ||
          accelerator.description.toLowerCase().includes(query) ||
          (accelerator.city && accelerator.city.toLowerCase().includes(query))
      );
    }

    result.sort((a, b) =>
      sortOrder === 'desc'
        ? b.foundedYear - a.foundedYear
        : a.foundedYear - b.foundedYear
    );

    return result;
  }, [sortOrder, searchQuery, selectedCity]);

  const totalPages = Math.ceil(filteredAndSortedAccelerators.length / ITEMS_PER_PAGE);
  const paginatedAccelerators = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredAndSortedAccelerators.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredAndSortedAccelerators, currentPage]);

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
          title="accelerators"
          description="acceleratorsDesc"
        />

        <section className="space-y-4 sm:space-y-6">
          <SimpleFilterBar
            sortOrder={sortOrder}
            onSortOrderChange={setSortOrder}
            searchQuery={searchQuery}
            onSearchChange={handleSearchChange}
            totalCount={accelerators.length}
            filteredCount={filteredAndSortedAccelerators.length}
            searchPlaceholder="Search accelerators..."
            cities={availableCities}
            selectedCity={selectedCity}
            onCityChange={handleCityChange}
          />

          <AcceleratorGrid
            accelerators={paginatedAccelerators}
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

export default Accelerators;
