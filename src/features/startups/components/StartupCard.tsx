import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ExternalLink, Linkedin, Calendar } from 'lucide-react';
import { slugify } from '@/shared/utils/slug';
import type { Startup, Category } from '../types';

interface StartupCardProps {
  startup: Startup;
  categories: Category[];
}

const StartupCard = ({ startup, categories }: StartupCardProps) => {
  const [imageError, setImageError] = useState(false);
  const website = startup.website || '';

  let domain = '';
  if (website) {
    try {
      const url = new URL(website.startsWith('http') ? website : `https://${website}`);
      domain = url.hostname.replace(/^www\./, '');
    } catch {
      // If URL parsing fails, try simple string replacement
      domain = website.replace(/^https?:\/\//, '').replace(/^www\./, '').replace(/\/$/, '').split('/')[0];
    }
  }

  const faviconUrl = domain ? `https://fetchfavicon.com/i/${domain}?size=64` : '';

  const startupCategories = categories.filter((cat) =>
    startup.categoryIds.includes(cat.id)
  );

  const detailsUrl = `/startup/${slugify(startup.name)}`;

  return (
    <article className="group relative bg-card rounded-2xl border border-border/60 p-6 transition-all duration-300 hover:border-primary/40 hover:shadow-lg hover:shadow-primary/5 hover:-translate-y-1 h-full flex flex-col">
      <div className="flex items-start gap-4 mb-5">
        {imageError || !faviconUrl ? (
          <div className="flex-shrink-0 w-16 h-16 rounded-xl bg-secondary/40 flex items-center justify-center">
            <span className="text-xl font-bold text-primary">{startup.name.charAt(0).toUpperCase()}</span>
          </div>
        ) : (
          <img
            src={faviconUrl}
            alt={`${startup.name} logo`}
            className="flex-shrink-0 w-10 h-10 rounded-xl object-contain"
            onError={() => setImageError(true)}
          />
        )}

        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-lg text-card-foreground truncate mb-1 group-hover:text-primary transition-colors duration-300">
            {startup.name}
          </h3>
          <Link to={detailsUrl} className="absolute inset-0 z-0">
            <span className="sr-only">View details for {startup.name}</span>
          </Link>
          {startupCategories.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-1">
              {startupCategories.map((category) => (
                <span
                  key={category.id}
                  className="text-xs font-medium text-primary/80 bg-primary/10 px-2 py-0.5 rounded-md"
                >
                  {category.name}
                </span>
              ))}
            </div>
          )}
        </div>

        {website && (
          <a
            href={website}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-shrink-0 w-9 h-9 rounded-xl border border-border/60 flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary/60 hover:bg-primary/5 transition-all duration-300 group-hover:scale-110 relative z-10"
            aria-label={`Visit ${startup.name} website`}
          >
            <ExternalLink className="w-4 h-4" />
          </a>
        )}
      </div>

      <div className="flex items-center justify-between pt-5 border-t border-border/40 mt-auto">
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-muted-foreground" />
          <div>
            <p className="text-xs text-muted-foreground mb-0.5">Founded</p>
            <p className="text-sm font-semibold text-foreground">{startup.foundedYear}</p>
          </div>
        </div>

        {startup.linkedin && (
          <a
            href={startup.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium text-muted-foreground hover:text-primary hover:bg-primary/5 border border-transparent hover:border-primary/20 transition-all duration-300 relative z-10"
            onClick={(e) => e.stopPropagation()}
          >
            <Linkedin className="w-4 h-4" />
            <span>LinkedIn</span>
          </a>
        )}
      </div>
    </article>
  );
};

export default StartupCard;

