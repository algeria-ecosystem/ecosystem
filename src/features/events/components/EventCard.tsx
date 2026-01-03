import type { Event } from '../types';
import BaseCard from '@/shared/components/BaseCard';

interface EventCardProps {
  event: Event;
}

const EventCard = ({ event }: EventCardProps) => {
  return (
    <BaseCard
      name={event.name}
      description={event.description}
      url={event.url}
    />
  );
};

export default EventCard;

