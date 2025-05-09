import { Star, Clock, DollarSign } from 'lucide-react';

interface ProfileStatsProps {
  rating: number;
  completedJobs: number;
  hourlyRate: number;
}

export default function ProfileStats({ rating, completedJobs, hourlyRate }: ProfileStatsProps) {
  return (
    <div className="grid grid-cols-3 gap-4 mb-6">
      <div className="bg-white rounded-lg shadow-sm p-4">
        <div className="flex items-center mb-2">
          <Star className="h-5 w-5 text-yellow-400" />
          <span className="ml-2 font-semibold">Rating</span>
        </div>
        <p className="text-2xl font-bold">{rating.toFixed(1)}/5.0</p>
      </div>
      <div className="bg-white rounded-lg shadow-sm p-4">
        <div className="flex items-center mb-2">
          <Clock className="h-5 w-5 text-indigo-500" />
          <span className="ml-2 font-semibold">Jobs Done</span>
        </div>
        <p className="text-2xl font-bold">{completedJobs}</p>
      </div>
      <div className="bg-white rounded-lg shadow-sm p-4">
        <div className="flex items-center mb-2">
          <DollarSign className="h-5 w-5 text-green-500" />
          <span className="ml-2 font-semibold">Hourly Rate</span>
        </div>
        <p className="text-2xl font-bold">${hourlyRate}</p>
      </div>
    </div>
  );
}