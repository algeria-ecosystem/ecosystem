import { Linkedin, Calendar, MapPin, Map } from 'lucide-react';
import type { Accelerator } from '../types';
import BaseCard from '@/shared/components/BaseCard';

interface AcceleratorCardProps {
  accelerator: Accelerator;
}

const AcceleratorCard = ({ accelerator }: AcceleratorCardProps) => {
  const subtitle = accelerator.city && (
    <p className="text-sm font-medium text-primary/80 flex items-center gap-1 mb-2">
      <MapPin className="w-3 h-3" />
      {accelerator.city}
    </p>
  );

  const footer = (
    <>
      <div className="flex items-center gap-2">
        <Calendar className="w-4 h-4 text-muted-foreground" />
        <div>
          <p className="text-xs text-muted-foreground mb-0.5">Founded</p>
          <p className="text-sm font-semibold text-foreground">{accelerator.foundedYear}</p>
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
    </>
  );

  return (
    <BaseCard
      name={accelerator.name}
      description={accelerator.description}
      url={accelerator.website}
      subtitle={subtitle}
      footer={footer}
    />
  );
};

export default AcceleratorCard;

