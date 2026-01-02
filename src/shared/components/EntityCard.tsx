import { useState } from 'react';
import { ExternalLink, Linkedin, Calendar, MapPin } from 'lucide-react';
import type { Entity } from '../types/entity';

interface EntityCardProps {
  entity: Entity;
}

const EntityCard = ({ entity }: EntityCardProps) => {
  const [imageError, setImageError] = useState(false);
  const website = entity.website || '';

  let domain = '';
  if (website) {
    try {
      const url = new URL(website.startsWith('http') ? website : `https://${website}`);
      domain = url.hostname.replace(/^www\./, '');
    } catch {
      domain = website.replace(/^https?:\/\//, '').replace(/^www\./, '').replace(/\/$/, '').split('/')[0];
    }
  }

  const faviconUrl = domain ? `https://fetchfavicon.com/i/${domain}?size=64` : '';

  // Collect tags from categories or media types
  const tags = [
    ...(entity.entity_categories?.map(c => c.category) || []),
    ...(entity.entity_media_types?.map(m => m.media_type) || [])
  ];

  return (
    <article className="group relative bg-card rounded-2xl border border-border/60 p-6 transition-all duration-300 hover:border-primary/40 hover:shadow-lg hover:shadow-primary/5 hover:-translate-y-1 flex flex-col h-full">
      <div className="flex items-center justify-between gap-4 mb-4">

        <div className="flex items-center gap-4">
          {entity.image_url && !imageError ? (
            <img
              src={entity.image_url}
              alt={`${entity.name} logo`}
              className="flex-shrink-0 w-16 h-16 rounded-xl object-contain bg-secondary/20"
              onError={() => setImageError(true)}
            />
          ) : (
            imageError || !faviconUrl ? (
              <div className="flex-shrink-0 w-16 h-16 rounded-xl bg-secondary/40 flex items-center justify-center">
                <span className="text-xl font-bold text-primary">{entity.name.charAt(0).toUpperCase()}</span>
              </div>
            ) : (
              <img
                src={faviconUrl}
                alt={`${entity.name} logo`}
                className="flex-shrink-0 w-16 h-16 rounded-xl object-contain"
                onError={() => setImageError(true)}
              />
            )
          )}

          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-lg text-card-foreground truncate mb-1 group-hover:text-primary transition-colors duration-300">
              {entity.name}
            </h3>
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-1">
                {tags.map((tag) => (
                  <span
                    key={tag.id}
                    className="text-xs font-medium text-primary/80 bg-primary/10 px-2 py-0.5 rounded-md"
                  >
                    {tag.name}
                  </span>
                ))}
              </div>
            )}
            {entity.description && (
              <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                {entity.description}
              </p>
            )}
          </div>
        </div>

        {website && (
          <a
            href={website}
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted-foreground hover:text-primary transition-colors"
            title="Website"
          >
            <ExternalLink className="w-4 h-4" />
          </a>
        )}

      </div>

      <div className="mt-auto pt-4 border-t border-border/40 flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            {entity.founded_year && (
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground" title="Founded Year">
                <Calendar className="w-3.5 h-3.5" />
                <span>{entity.founded_year}</span>
              </div>
            )}
            {entity.wilaya && (
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground" title="Location">
                <MapPin className="w-3.5 h-3.5" />
                <span>{entity.wilaya.name}</span>
              </div>
            )}
          </div>

          <div className="flex items-center gap-2">
            {entity.map_location && (
              <a
                href={entity.map_location}
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-colors"
                title="View on Map"
              >
                <MapPin className="w-4 h-4" />
              </a>
            )}

            {entity.linkedin && (
              <a
                href={entity.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium text-muted-foreground hover:text-primary hover:bg-primary/5 border border-transparent hover:border-primary/20 transition-all duration-300"
              >
                <Linkedin className="w-4 h-4" />
                <span>LinkedIn</span>
              </a>
            )}

          </div>
        </div>
      </div>
    </article>
  );
};

export default EntityCard;
