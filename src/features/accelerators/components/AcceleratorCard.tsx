import { useState } from "react";
import { ExternalLink, Linkedin, Calendar, MapPin, Map } from "lucide-react";
import type { Accelerator } from "../types";

interface AcceleratorCardProps {
  accelerator: Accelerator;
}

const AcceleratorCard = ({ accelerator }: AcceleratorCardProps) => {
  const [imageError, setImageError] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  let domain = "";
  try {
    if (accelerator.website) {
      domain = new URL(accelerator.website).hostname.replace(/^www\./, "");
    }
  } catch {
    domain = "";
  }
  const faviconUrl = domain
    ? `https://fetchfavicon.com/i/${domain}?size=64`
    : "";

  // Check if description is long enough to need truncation (approximately 100 characters for 2 lines)
  const needsTruncation = accelerator.description.length > 100;
  const displayDescription =
    isExpanded || !needsTruncation
      ? accelerator.description
      : accelerator.description.substring(0, 100);

  return (
    <article className="group relative bg-card rounded-2xl border border-border/60 p-6 transition-all duration-300 hover:border-primary/40 hover:shadow-lg hover:shadow-primary/5 hover:-translate-y-1 flex flex-col h-full">
      <div className="flex items-start gap-4 mb-5 flex-grow min-h-0">
        {imageError || !faviconUrl ? (
          <div className="flex-shrink-0 w-16 h-16 rounded-xl bg-secondary/40 flex items-center justify-center">
            <span className="text-xl font-bold text-primary">
              {accelerator.name.charAt(0).toUpperCase()}
            </span>
          </div>
        ) : (
          <img
            src={faviconUrl}
            alt={`${accelerator.name} logo`}
            className="flex-shrink-0 w-10 h-10 rounded-xl object-contain"
            onError={() => setImageError(true)}
          />
        )}

        <div className="flex flex-col h-full min-w-0">
          <h3 className="font-bold text-lg text-card-foreground truncate mb-1 group-hover:text-primary transition-colors duration-300">
            {accelerator.name}
          </h3>
          {accelerator.city && (
            <p className="text-sm font-medium text-primary/80 flex items-center gap-1 mb-2">
              <MapPin className="w-3 h-3" />
              {accelerator.city}
            </p>
          )}
          <p className="text-sm text-muted-foreground flex-grow">
            {displayDescription}
            {needsTruncation && !isExpanded && "... "}
            {needsTruncation && isExpanded && " "}
            {needsTruncation && (
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="text-xs text-primary hover:text-primary/80 font-medium transition-colors inline"
              >
                {isExpanded ? "Show less" : "Show more"}
              </button>
            )}
          </p>
        </div>

        {accelerator.website && (
          <a
            href={accelerator.website}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-shrink-0 w-9 h-9 rounded-xl border border-border/60 flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary/60 hover:bg-primary/5 transition-all duration-300 group-hover:scale-110"
            aria-label={`Visit ${accelerator.name} website`}
          >
            <ExternalLink className="w-4 h-4" />
          </a>
        )}
      </div>

      <div className="flex items-center justify-between pt-5 border-t border-border/40">
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-muted-foreground" />
          <div>
            <p className="text-xs text-muted-foreground mb-0.5">Founded</p>
            <p className="text-sm font-semibold text-foreground">
              {accelerator.foundedYear}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {accelerator.mapLocation && (
            <a
              href={accelerator.mapLocation}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium text-muted-foreground hover:text-primary hover:bg-primary/5 border border-transparent hover:border-primary/20 transition-all duration-300"
              aria-label={`View ${accelerator.name} on map`}
            >
              <Map className="w-4 h-4" />
              <span>Map</span>
            </a>
          )}
          {accelerator.linkedin && (
            <a
              href={accelerator.linkedin}
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
    </article>
  );
};

export default AcceleratorCard;
