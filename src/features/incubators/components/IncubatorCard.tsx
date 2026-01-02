import { useState } from 'react';
import { ExternalLink, Linkedin, MapPin, Map, Mail, Phone, Facebook, Instagram, Twitter, Globe } from 'lucide-react';
import type { Incubator } from '../types';

interface IncubatorCardProps {
  incubator: Incubator;
}

const IncubatorCard = ({ incubator }: IncubatorCardProps) => {
  const [imageError, setImageError] = useState(false);
  const domain = incubator.website?.replace(/^https?:\/\//, '').replace(/\/$/, '') || null;
  const faviconUrl = domain ? `https://fetchfavicon.com/i/${domain}?size=64` : '';

  const getSocialIcon = (url: string) => {
    if (url.includes('facebook')) return <Facebook className="w-4 h-4" />;
    if (url.includes('linkedin')) return <Linkedin className="w-4 h-4" />;
    if (url.includes('instagram')) return <Instagram className="w-4 h-4" />;
    if (url.includes('twitter')) return <Twitter className="w-4 h-4" />;
    return <Globe className="w-4 h-4" />;
  };

  return (
    <article className="group relative bg-card rounded-2xl border border-border/60 p-6 transition-all duration-300 hover:border-primary/40 hover:shadow-lg hover:shadow-primary/5 hover:-translate-y-1">
      <div className="flex items-start gap-4 mb-5">
        {imageError ? (
          <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-secondary/40 flex items-center justify-center">
            <span className="text-xl font-bold text-primary">{incubator.name.charAt(0).toUpperCase()}</span>
          </div>
        ) : (
          <img
            src={faviconUrl}
            alt={`${incubator.name} logo`}
            className="flex-shrink-0 w-10 h-10 rounded-xl object-contain"
            onError={() => setImageError(true)}
          />
        )}

        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-lg text-card-foreground truncate group-hover:text-primary transition-colors duration-300">
            {incubator.name}
          </h3>
          {(incubator.city || incubator.address) && (
            <div className="flex items-center gap-1 text-sm text-primary/80 mb-1">
              <MapPin className="w-3 h-3 flex-shrink-0" />
              <span className="truncate">{incubator.city || incubator.address}</span>
            </div>
          )}
          {incubator.incubator_type && (
            <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-primary/10 text-primary text-xs font-medium">
              {incubator.incubator_type}
            </span>
          )}
        </div>

        {incubator.website && (
          <a
            href={incubator.website}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-shrink-0 w-9 h-9 rounded-xl border border-border/60 flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary/60 hover:bg-primary/5 transition-all duration-300 group-hover:scale-110"
            aria-label={`Visit ${incubator.name} website`}
          >
            <ExternalLink className="w-4 h-4" />
          </a>
        )}
      </div>

      <div className="flex-1 mb-4">
        {incubator.description ? (
          <p className="text-sm text-muted-foreground line-clamp-3">
            {incubator.description}
          </p>
        ) : (
          <></>
        )}
      </div>

      <div className="flex items-center gap-2 flex-row-reverse border-t border-border/40 pt-4">
        {incubator.mapLocation && (
          <a
            href={incubator.mapLocation}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium text-muted-foreground hover:text-primary hover:bg-primary/5 border border-transparent hover:border-primary/20 transition-all duration-300"
            aria-label={`View ${incubator.name} on map`}
          >
            <Map className="w-4 h-4" />
            <span>Map</span>
          </a>
        )}

        {incubator.socials && incubator.socials.map((social, idx) => (
          <a
            key={idx}
            href={social}
            target="_blank"
            rel="noopener noreferrer"
            className="w-8 h-8 rounded-full flex items-center justify-center text-muted-foreground hover:text-primary hover:bg-primary/5 border border-transparent hover:border-primary/20 transition-all duration-300"
          >
            {getSocialIcon(social)}
          </a>
        ))}

        {incubator.email && (
          <a
            href={`mailto:${incubator.email}`}
            className="w-8 h-8 rounded-full flex items-center justify-center text-muted-foreground hover:text-primary hover:bg-primary/5 border border-transparent hover:border-primary/20 transition-all duration-300"
            title={incubator.email}
          >
            <Mail className="w-4 h-4" />
          </a>
        )}

        {incubator.phone && (
          <a
            href={`tel:${incubator.phone}`}
            className="w-8 h-8 rounded-full flex items-center justify-center text-muted-foreground hover:text-primary hover:bg-primary/5 border border-transparent hover:border-primary/20 transition-all duration-300"
            title={incubator.phone}
          >
            <Phone className="w-4 h-4" />
          </a>
        )}
      </div>
    </article>
  );
};

export default IncubatorCard;
