import { ExternalLink, Linkedin } from 'lucide-react';
import type { Startup, Category } from '@/types';

interface StartupCardProps {
  startup: Startup;
  category: Category | undefined;
}

const StartupCard = ({ startup, category }: StartupCardProps) => {
  const faviconUrl = `https://www.google.com/s2/favicons?domain=${startup.website}&sz=64`;

  return (
    <article className="group relative bg-card rounded-xl border border-border p-5 transition-smooth hover:border-primary/30 hover:card-shadow-hover">
      {/* Header: Logo + Name + External Link */}
      <div className="flex items-start gap-4">
        {/* Logo */}
        <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-secondary/50 flex items-center justify-center overflow-hidden">
          <img
            src={faviconUrl}
            alt={`${startup.name} logo`}
            className="w-7 h-7 object-contain"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.style.display = 'none';
              target.parentElement!.innerHTML = `<span class="text-base font-semibold text-primary">${startup.name.charAt(0)}</span>`;
            }}
          />
        </div>

        {/* Name & Category */}
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-card-foreground truncate">
            {startup.name}
          </h3>
          {category && (
            <p className="text-sm text-primary mt-0.5">{category.name}</p>
          )}
        </div>

        {/* External Link */}
        <a
          href={startup.website}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-shrink-0 w-8 h-8 rounded-lg border border-border flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary/50 transition-smooth"
          aria-label={`Visit ${startup.name} website`}
        >
          <ExternalLink className="w-4 h-4" />
        </a>
      </div>

      {/* Details */}
      <div className="flex items-center gap-8 mt-5 pt-4 border-t border-border/50">
        <div>
          <p className="text-xs text-muted-foreground mb-1">Founded</p>
          <p className="text-sm font-medium text-primary">{startup.foundedYear}</p>
        </div>
        
        {startup.linkedin && (
          <a
            href={startup.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary transition-smooth ml-auto"
          >
            <Linkedin className="w-4 h-4" />
            <span className="text-xs">LinkedIn</span>
          </a>
        )}
      </div>
    </article>
  );
};

export default StartupCard;
