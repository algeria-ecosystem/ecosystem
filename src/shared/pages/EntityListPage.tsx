import { useState, useMemo, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import Header from '@/shared/components/Header';
import Footer from '@/shared/components/Footer';
import FilterBar from '@/shared/components/FilterBar';
import EntityCard from '@/shared/components/EntityCard';
import Pagination from '@/shared/components/Pagination';
import EmptyState from '@/shared/components/EmptyState';
import { Loader2, Plus } from 'lucide-react';
import type { Entity } from '@/shared/types/entity';

type FilterType = 'category' | 'wilaya' | 'media_type' | 'none';
type SortOrder = 'asc' | 'desc';

interface EntityListPageProps {
  entityTypeSlug: string;
  title: string;
  description?: string;
  filterType?: FilterType;
  filterLabel?: string;
}

const ITEMS_PER_PAGE = 9;

const EntityListPage = ({
  entityTypeSlug,
  title,
  description,
  filterType = 'none',
  filterLabel = 'Filter'
}: EntityListPageProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');
  const [currentPage, setCurrentPage] = useState(1);

  // 1. Fetch Entity Type ID
  const { data: entityType } = useQuery({
    queryKey: ['entityType', entityTypeSlug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('entity_types')
        .select('id')
        .eq('slug', entityTypeSlug)
        .single();
      if (error) throw error;
      return data;
    }
  });

  // 2. Fetch Entities
  const { data: entities, isLoading: isLoadingEntities } = useQuery({
    queryKey: ['entities', entityTypeSlug, entityType?.id],
    enabled: !!entityType?.id,
    queryFn: async () => {
      const query = supabase
        .from('entities')
        .select(`
          *,
          wilaya:wilayas(*),
          entity_categories(category:categories(*)),
          entity_media_types(media_type:media_types(*))
        `)
        .eq('type_id', entityType?.id)
        .eq('status', 'approved');

      const { data, error } = await query;
      if (error) throw error;
      return data as Entity[];
    }
  });

  // 3. Fetch Filter Options (Categories, Wilayas, etc.)
  const { data: filterOptions } = useQuery({
    queryKey: ['filters', filterType],
    enabled: filterType !== 'none',
    queryFn: async () => {
      if (filterType === 'category') {
        const { data } = await supabase.from('categories').select('*').order('name');
        return data?.map(c => ({ value: c.id, label: c.name })) || [];
      }
      if (filterType === 'wilaya') {
        const { data } = await supabase.from('wilayas').select('*').order('name');
        return data?.map(w => ({ value: w.id, label: w.name })) || [];
      }
      if (filterType === 'media_type') {
        const { data } = await supabase.from('media_types').select('*').order('name');
        return data?.map(m => ({ value: m.id, label: m.name })) || [];
      }
      return [];
    }
  });

  // Client-side Filtering & Sorting
  const filteredEntities = useMemo(() => {
    if (!entities) return [];

    let result = [...entities];

    // Search
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(e => e.name.toLowerCase().includes(q));
    }

    // Filter
    if (selectedFilter !== 'all') {
      if (filterType === 'category') {
        result = result.filter(e => e.entity_categories?.some(ec => ec.category.id === selectedFilter));
      } else if (filterType === 'wilaya') {
        result = result.filter(e => e.wilaya_id === selectedFilter);
      } else if (filterType === 'media_type') {
        result = result.filter(e => e.entity_media_types?.some(emt => emt.media_type.id === selectedFilter));
      }
    }

    // Sort
    result.sort((a, b) => {
      const yearA = a.founded_year || 0;
      const yearB = b.founded_year || 0;
      if (sortOrder === 'desc') return yearB - yearA;
      return yearA - yearB;
    });

    return result;
  }, [entities, searchQuery, selectedFilter, sortOrder, filterType]);

  // Pagination
  const totalPages = Math.ceil(filteredEntities.length / ITEMS_PER_PAGE);
  const paginatedEntities = filteredEntities.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  // Handlers
  const handleSearchChange = (q: string) => { setSearchQuery(q); setCurrentPage(1); };
  const handleFilterChange = (v: string) => { setSelectedFilter(v); setCurrentPage(1); };
  const handleClearFilters = () => { setSearchQuery(''); setSelectedFilter('all'); setCurrentPage(1); };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <div className="container py-4 sm:py-6 px-4 sm:px-6 flex-1 flex flex-col">
        <Header />

        <div className="space-y-6 mt-6 flex-1">
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
            {description && <p className="text-muted-foreground max-w-2xl mx-auto">{description}</p>}
          </div>

          {/* Contribution CTA */}
          {location.pathname !== '/about' && (
            <div className="mt-4 sm:mt-5 px-4 flex justify-center">
              <a
                href="https://forms.gle/AiACXXFWwA1inGPJA"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs sm:text-sm text-primary hover:bg-primary/10 font-medium transition-colors"
              >
                <Plus className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                <span>Submit Data</span>
              </a>
            </div>
          )}

          <FilterBar
            searchQuery={searchQuery}
            onSearchChange={handleSearchChange}
            sortOrder={sortOrder}
            onSortOrderChange={setSortOrder}
            filterOptions={filterOptions}
            selectedFilter={selectedFilter}
            onFilterChange={handleFilterChange}
            filterPlaceholder={filterLabel}
            searchPlaceholder={`Search ${title.toLowerCase()}...`}
          />

          {isLoadingEntities ? (
            <div className="flex justify-center py-20">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : filteredEntities.length === 0 ? (
            <EmptyState onClearFilters={handleClearFilters} message={`No ${title.toLowerCase()} found`} />
          ) : (
            <>
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {paginatedEntities.map((entity, i) => (
                  <div key={entity.id} className="animate-fade-in" style={{ animationDelay: `${i * 50}ms` }}>
                    <EntityCard entity={entity} />
                  </div>
                ))}
              </div>

              {totalPages > 1 && (
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={setCurrentPage}
                />
              )}
            </>
          )}
        </div>

        <div className="mt-auto pt-10">
          <Footer />
        </div>
      </div>
    </div>
  );
};

export default EntityListPage;
