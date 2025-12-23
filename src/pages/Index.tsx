import { useState, useMemo } from 'react';
import Header from '@/components/Header';
import FilterBar from '@/components/FilterBar';
import StartupGrid from '@/components/StartupGrid';
import Footer from '@/components/Footer';
import categoriesData from '@/data/categories.json';
import startupsData from '@/data/startups.json';
import type { Category, Startup, SortOrder } from '@/types';

const categories: Category[] = categoriesData;
const startups: Startup[] = startupsData;

const Index = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');

  const filteredAndSortedStartups = useMemo(() => {
    let result = [...startups];

    // Filter by category
    if (selectedCategory !== 'all') {
      result = result.filter((startup) => startup.categoryId === selectedCategory);
    }

    // Sort by founded year
    result.sort((a, b) => {
      return sortOrder === 'desc'
        ? b.foundedYear - a.foundedYear
        : a.foundedYear - b.foundedYear;
    });

    return result;
  }, [selectedCategory, sortOrder]);

  const handleClearFilters = () => {
    setSelectedCategory('all');
  };

  return (
    <div className="min-h-screen bg-background">
      <main className="container py-6">
        <Header />
        
        <section className="space-y-6">
          <FilterBar
            categories={categories}
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
            sortOrder={sortOrder}
            onSortOrderChange={setSortOrder}
            totalCount={startups.length}
            filteredCount={filteredAndSortedStartups.length}
          />
          
          <StartupGrid
            startups={filteredAndSortedStartups}
            categories={categories}
            onClearFilters={handleClearFilters}
          />
        </section>
        
        <Footer />
      </main>
    </div>
  );
};

export default Index;
