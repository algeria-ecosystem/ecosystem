import { useState, useMemo } from 'react';
import Header from '@/shared/components/Header';
import SimpleFilterBar from '@/shared/components/SimpleFilterBar';
import CoworkingSpaceGrid from '../components/CoworkingSpaceGrid';
import Pagination from '@/shared/components/Pagination';
import Footer from '@/shared/components/Footer';
import coworkingSpacesData from '@/data/coworking-spaces.json';
import type { CoworkingSpace } from '../types';
import type { SortOrder } from '@/shared/types';
import { useLanguage } from '@/i18n/LanguageContext';

const coworkingSpaces: CoworkingSpace[] = coworkingSpacesData;

const ITEMS_PER_PAGE = 9;

const CoworkingSpaces = () => {
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCity, setSelectedCity] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const { t } = useLanguage()

  // Extract unique cities from coworking spaces
  const availableCities = useMemo(() => {
    const cities = coworkingSpaces
      .map((space) => space.city)
      .filter((city): city is string => Boolean(city))
      .filter((city, index, self) => self.indexOf(city) === index)
      .sort();
    return cities;
  }, []);

  const filteredAndSortedCoworkingSpaces = useMemo(() => {
    let result = [...coworkingSpaces];

    // Filter by city
    if (selectedCity !== 'all') {
      result = result.filter((space) => space.city === selectedCity);
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      result = result.filter((space) =>
        space.name.toLowerCase().includes(query) ||
        (space.city && space.city.toLowerCase().includes(query))
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
  const totalPages = Math.ceil(filteredAndSortedCoworkingSpaces.length / ITEMS_PER_PAGE);
  const paginatedCoworkingSpaces = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredAndSortedCoworkingSpaces.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredAndSortedCoworkingSpaces, currentPage]);

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
          title="coworking"
          description="coworkingDesc"
        />

        <section className="space-y-4 sm:space-y-6">
          <SimpleFilterBar
            sortOrder={sortOrder}
            onSortOrderChange={setSortOrder}
            searchQuery={searchQuery}
            onSearchChange={handleSearchChange}
            totalCount={coworkingSpaces.length}
            filteredCount={filteredAndSortedCoworkingSpaces.length}
            searchPlaceholder="Search co-working spaces..."
            cities={availableCities}
            selectedCity={selectedCity}
            onCityChange={handleCityChange}
          />

          <CoworkingSpaceGrid
            coworkingSpaces={paginatedCoworkingSpaces}
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

export default CoworkingSpaces;

