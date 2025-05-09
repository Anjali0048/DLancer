import { Star } from 'lucide-react';
import { Profile } from '../types';

interface FreelancerCardProps {
  profile: Profile;
}

export default function FreelancerCard({ profile }: FreelancerCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow">
      <div className="flex items-center mb-4">
        <img
          src={profile.avatar}
          alt={profile.name}
          className="h-12 w-12 rounded-full object-cover"
        />
        <div className="ml-4">
          <h3 className="text-lg font-semibold text-gray-900">{profile.name}</h3>
          <p className="text-sm text-gray-600">{profile.title}</p>
        </div>
      </div>

      <div className="flex items-center mb-4">
        <Star className="h-4 w-4 text-yellow-400 fill-current" />
        <span className="ml-1 text-sm text-gray-600">{profile.rating.toFixed(1)}</span>
        <span className="mx-2 text-gray-300">•</span>
        <span className="text-sm text-gray-600">${profile.hourlyRate}/hr</span>
      </div>

      <div className="flex flex-wrap gap-2 mb-4">
        {profile.skills.map((skill) => (
          <span
            key={skill}
            className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full"
          >
            {skill}
          </span>
        ))}
      </div>

      <div className="text-sm text-gray-500">
        {profile.completedJobs} jobs completed
      </div>
    </div>
  );
}