import { ExternalLink, Linkedin, Calendar, Building2 } from 'lucide-react';
import type { Startup, Category } from '@/types';

interface StartupCardProps {
  startup: Startup;
  category: Category | undefined;
}

const StartupCard = ({ startup, category }: StartupCardProps) => {
  const faviconUrl = `https://www.google.com/s2/favicons?domain=${startup.website}&sz=64`;

  return (
    <article className="group relative bg-card rounded-lg border border-border p-5 card-shadow transition-smooth hover:card-shadow-hover hover:border-primary/20">
      <div className="flex items-start gap-4">
        {/* Logo */}
        <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-secondary flex items-center justify-center overflow-hidden">
          <img
            src={faviconUrl}
            alt={`${startup.name} logo`}
            className="w-8 h-8 object-contain"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.style.display = 'none';
              target.parentElement!.innerHTML = `<span class="text-lg font-semibold text-muted-foreground">${startup.name.charAt(0)}</span>`;
            }}
          />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-card-foreground truncate group-hover:text-primary transition-smooth">
            {startup.name}
          </h3>
          
          <div className="flex items-center gap-3 mt-1.5 text-sm text-muted-foreground">
            {category && (
              <span className="inline-flex items-center gap-1">
                <Building2 className="w-3.5 h-3.5" />
                {category.name}
              </span>
            )}
            <span className="inline-flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" />
              {startup.foundedYear}
            </span>
          </div>
        </div>
      </div>

      {/* Links */}
      <div className="flex items-center gap-2 mt-4 pt-4 border-t border-border">
        <a
          href={startup.website}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:text-primary/80 transition-smooth"
        >
          <ExternalLink className="w-4 h-4" />
          Website
        </a>
        
        {startup.linkedin && (
          <a
            href={startup.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground transition-smooth ml-auto"
          >
            <Linkedin className="w-4 h-4" />
            LinkedIn
          </a>
        )}
      </div>
    </article>
  );
};

export default StartupCard;
