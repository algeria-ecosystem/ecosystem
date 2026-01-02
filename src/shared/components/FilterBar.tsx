import { Search, X, ArrowUpDown } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';

type SortOrder = 'asc' | 'desc';

interface FilterOption {
  value: string;
  label: string;
}

interface FilterBarProps {
  filterOptions?: FilterOption[];
  selectedFilter?: string;
  onFilterChange?: (value: string) => void;
  filterPlaceholder?: string;

  sortOrder: SortOrder;
  onSortOrderChange: (order: SortOrder) => void;

  searchQuery: string;
  onSearchChange: (query: string) => void;
  searchPlaceholder?: string;

  className?: string;
}

const FilterBar = ({
  filterOptions,
  selectedFilter,
  onFilterChange,
  filterPlaceholder = "Filter",
  sortOrder,
  onSortOrderChange,
  searchQuery,
  onSearchChange,
  searchPlaceholder = "Search...",
  className
}: FilterBarProps) => {
  return (
    <div className={`flex flex-col sm:flex-row items-stretch sm:items-center gap-3 ${className}`}>
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

      {/* Dynamic Filter (Category/Wilaya) */}
      {filterOptions && onFilterChange && (
        <Select value={selectedFilter || 'all'} onValueChange={onFilterChange}>
          <SelectTrigger className="w-full sm:w-[200px] h-10 bg-background border-border">
            <SelectValue placeholder={filterPlaceholder} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            {filterOptions.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}

      {/* Sort */}
      <Select value={sortOrder} onValueChange={(value) => onSortOrderChange(value as SortOrder)}>
        <SelectTrigger className="w-full sm:w-[160px] h-10 bg-background border-border">
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

export default FilterBar;
