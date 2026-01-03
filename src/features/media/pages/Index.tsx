import { useState, useMemo } from 'react';
import Header from '@/shared/components/Header';
import FilterBar from '../components/FilterBar';
import MediaGrid from '../components/MediaGrid';
import Pagination from '@/shared/components/Pagination';
import Footer from '@/shared/components/Footer';
import categoriesData from '@/data/media_category.json';
import mediaData from '@/data/media.json';
import type { MediaCategory, Media } from '../types';
import { useLanguage } from '@/i18n/LanguageContext';

const categories: MediaCategory[] = categoriesData;
const media: Media[] = mediaData;

const ITEMS_PER_PAGE = 9;

const Index = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const { t } = useLanguage()

  // Extract only used categories from media
  const usedCategories = useMemo(() => {
    const usedCategoryIds = new Set(media.map((item) => item.categoryId));
    return categories.filter((category) => usedCategoryIds.has(category.id));
  }, []);

  const filteredMedia = useMemo(() => {
    let result = [...media];

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      result = result.filter((item) =>
        item.title.toLowerCase().includes(query) ||
        item.description.toLowerCase().includes(query)
      );
    }

    // Filter by category
    if (selectedCategory !== 'all') {
      result = result.filter((item) => item.categoryId === Number(selectedCategory));
    }

    return result;
  }, [selectedCategory, searchQuery]);

  // Pagination
  const totalPages = Math.ceil(filteredMedia.length / ITEMS_PER_PAGE);
  const paginatedMedia = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredMedia.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredMedia, currentPage]);

  // Reset to page 1 when filters change
  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    setCurrentPage(1);
  };

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1);
  };

  const handleClearFilters = () => {
    setSelectedCategory('all');
    setSearchQuery('');
    setCurrentPage(1);
  };

  return (
    <div className="min-h-screen bg-background">
      <main className="container py-4 sm:py-6 px-4 sm:px-6">
        <Header
          title="media"
          description="mediaDesc"
        />

        <section className="space-y-4 sm:space-y-6">
          <FilterBar
            categories={usedCategories}
            selectedCategory={selectedCategory}
            onCategoryChange={handleCategoryChange}
            searchQuery={searchQuery}
            onSearchChange={handleSearchChange}
            totalCount={media.length}
            filteredCount={filteredMedia.length}
          />

          <MediaGrid
            media={paginatedMedia}
            categories={categories}
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

