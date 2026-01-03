import type { Resource } from '../types';
import BaseCard from '@/shared/components/BaseCard';

interface ResourceCardProps {
  resource: Resource;
}

const ResourceCard = ({ resource }: ResourceCardProps) => {
  return (
    <BaseCard
      name={resource.name}
      description={resource.description}
      url={resource.url}
    />
  );
};

export default ResourceCard;