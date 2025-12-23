import StartupCard from './StartupCard';
import EmptyState from './EmptyState';
import type { Startup, Category } from '@/types';

interface StartupGridProps {
  startups: Startup[];
  categories: Category[];
  onClearFilters: () => void;
}

const StartupGrid = ({ startups, categories, onClearFilters }: StartupGridProps) => {
  const getCategoryById = (id: string) => categories.find((c) => c.id === id);

  if (startups.length === 0) {
    return <EmptyState onClearFilters={onClearFilters} />;
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {startups.map((startup, index) => (
        <div
          key={startup.name}
          className="animate-fade-in"
          style={{ animationDelay: `${index * 50}ms` }}
        >
          <StartupCard
            startup={startup}
            category={getCategoryById(startup.categoryId)}
          />
        </div>
      ))}
    </div>
  );
};

export default StartupGrid;
