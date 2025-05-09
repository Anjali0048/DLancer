import { Clock, DollarSign, Tag } from 'lucide-react';
import { Job } from '../types';

interface JobCardProps {
  job: Job;
}

export default function JobCard({ job }: JobCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow">
      <h3 className="text-lg font-semibold text-gray-900 mb-2">{job.title}</h3>
      <p className="text-gray-600 text-sm mb-4 line-clamp-2">{job.description}</p>
      
      <div className="flex flex-wrap gap-2 mb-4">
        {job.skills.map((skill) => (
          <span
            key={skill}
            className="px-2 py-1 bg-indigo-50 text-indigo-700 text-xs rounded-full"
          >
            {skill}
          </span>
        ))}
      </div>
      
      <div className="flex items-center justify-between text-sm text-gray-500">
        <div className="flex items-center">
          <DollarSign className="h-4 w-4 mr-1" />
          <span>${job.budget}</span>
        </div>
        <div className="flex items-center">
          <Clock className="h-4 w-4 mr-1" />
          <span>{job.deadline}</span>
        </div>
        <div className="flex items-center">
          <Tag className="h-4 w-4 mr-1" />
          <span>{job.category}</span>
        </div>
      </div>
    </div>
  );
}