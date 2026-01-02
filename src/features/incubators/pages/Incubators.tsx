import { useState, useMemo } from 'react';
import Header from '@/shared/components/Header';
import SimpleFilterBar from '@/shared/components/SimpleFilterBar';
import IncubatorGrid from '../components/IncubatorGrid';
import Pagination from '@/shared/components/Pagination';
import Footer from '@/shared/components/Footer';
import incubatorsData from '@/data/incubators.json';
import type { Incubator } from '../types';

const incubators: Incubator[] = incubatorsData;

const ITEMS_PER_PAGE = 9;

const Incubators = () => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCity, setSelectedCity] = useState<string>('all');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState<number>(1);

  // Extract unique cities from incubators
  const availableCities = useMemo(() => {
    const cities = incubators
      .map((incubator) => incubator.city)
      .filter((city): city is string => Boolean(city))
      .filter((city, index, self) => self.indexOf(city) === index)
      .sort();
    return cities;
  }, []);

  // Extract unique types from incubators
  const availableTypes = useMemo(() => {
    const types = incubators
      .map((incubator) => incubator.incubator_type)
      .filter((type): type is string => Boolean(type))
      .filter((type, index, self) => self.indexOf(type) === index)
      .sort();
    return types;
  }, []);

  const filteredIncubators = useMemo(() => {
    let result = [...incubators];

    // Filter by city
    if (selectedCity !== 'all') {
      result = result.filter((incubator) => incubator.city === selectedCity);
    }

    // Filter by type
    if (selectedType !== 'all') {
      result = result.filter((incubator) => incubator.incubator_type === selectedType);
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      result = result.filter((incubator) =>
        incubator.name.toLowerCase().includes(query) ||
        (incubator.city && incubator.city.toLowerCase().includes(query)) ||
        (incubator.description && incubator.description.toLowerCase().includes(query))
      );
    }

    // Sort alphabetically by name
    result.sort((a, b) => a.name.localeCompare(b.name));

    return result;
  }, [searchQuery, selectedCity, selectedType]);

  // Pagination
  const totalPages = Math.ceil(filteredIncubators.length / ITEMS_PER_PAGE);
  const paginatedIncubators = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredIncubators.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredIncubators, currentPage]);

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1);
  };

  const handleCityChange = (city: string) => {
    setSelectedCity(city);
    setCurrentPage(1);
  };

  const handleTypeChange = (type: string) => {
    setSelectedType(type);
    setCurrentPage(1);
  };

  const handleClearFilters = () => {
    setSearchQuery('');
    setSelectedCity('all');
    setSelectedType('all');
    setCurrentPage(1);
  };

  return (
    <div className="min-h-screen bg-background">
      <main className="container py-4 sm:py-6 px-4 sm:px-6">
        <Header
          title="Incubators"
          description="Discover incubators supporting and nurturing startups across Algeria."
        />

        <section className="space-y-4 sm:space-y-6">
          <SimpleFilterBar
            searchQuery={searchQuery}
            onSearchChange={handleSearchChange}
            totalCount={incubators.length}
            filteredCount={filteredIncubators.length}
            searchPlaceholder="Search incubators..."
            cities={availableCities}
            selectedCity={selectedCity}
            onCityChange={handleCityChange}
            types={availableTypes}
            selectedType={selectedType}
            onTypeChange={handleTypeChange}
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

