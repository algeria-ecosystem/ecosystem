import type { Job } from '../types';
import BaseCard from '@/shared/components/BaseCard';

interface JobCardProps {
  job: Job;
}

const JobCard = ({ job }: JobCardProps) => {
  return (
    <BaseCard
      name={job.name}
      description={job.description}
      url={job.url}
      externalLinkLabel={`Visit ${job.name} website`}
    />
  );
};

export default JobCard;

