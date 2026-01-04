import type { Community } from '../types';
import BaseCard from '@/shared/components/BaseCard';

interface CommunityCardProps {
  community: Community;
}

const CommunityCard = ({ community }: CommunityCardProps) => {
  return (
    <BaseCard
      name={community.name}
      description={community.description}
      url={community.url}
    />
  );
};

export default CommunityCard;
