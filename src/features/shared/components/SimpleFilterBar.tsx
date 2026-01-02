import { Search, X, ArrowUpDown, MapPin } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import type { SortOrder } from '@/features/shared/types';

interface SimpleFilterBarProps {
  sortOrder: SortOrder;
  onSortOrderChange: (order: SortOrder) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  totalCount: number;
  filteredCount: number;
  searchPlaceholder?: string;
  cities?: string[];
  selectedCity?: string;
  onCityChange?: (city: string) => void;
}

const SimpleFilterBar = ({
  sortOrder,
  onSortOrderChange,
  searchQuery,
  onSearchChange,
  totalCount,
  filteredCount,
  searchPlaceholder = "Search...",
  cities,
  selectedCity,
  onCityChange,
}: SimpleFilterBarProps) => {
  return (
    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
      {/* Search Input */}
      <div className="relative flex-1 min-w-0">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
        <Input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder={searchPlaceholder}
          className="pl-10 pr-10 h-10 bg-background border-border"
        />
        {searchQuery && (
          <button
            onClick={() => onSearchChange('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
            aria-label="Clear search"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* City Filter */}
      {cities && cities.length > 0 && onCityChange && (
        <Select value={selectedCity || 'all'} onValueChange={onCityChange}>
          <SelectTrigger className="w-full sm:w-[160px] h-10 bg-background border-border">
            <MapPin className="w-4 h-4 mr-2 text-muted-foreground" />
            <SelectValue placeholder="All Cities" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Cities</SelectItem>
            {cities.map((city) => (
              <SelectItem key={city} value={city}>
                {city}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}

      {/* Sort */}
      <Select value={sortOrder} onValueChange={(value) => onSortOrderChange(value as SortOrder)}>
        <SelectTrigger className="w-full sm:w-[180px] h-10 bg-background border-border">
          <ArrowUpDown className="w-4 h-4 mr-2 text-muted-foreground" />
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="desc">Newest First</SelectItem>
          <SelectItem value="asc">Oldest First</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};

export default SimpleFilterBar;

