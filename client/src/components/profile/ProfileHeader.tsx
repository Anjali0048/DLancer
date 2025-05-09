import { MapPin, Mail, Link as LinkIcon } from 'lucide-react';
import { Profile } from '../../types';

interface ProfileHeaderProps {
  profile: Profile;
}

export default function ProfileHeader({ profile }: ProfileHeaderProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
      <div className="flex items-start">
        <img
          src={profile.avatar}
          alt={profile.name}
          className="h-24 w-24 rounded-full object-cover"
        />
        <div className="ml-6">
          <h1 className="text-2xl font-bold text-gray-900">{profile.name}</h1>
          <p className="text-lg text-gray-600 mb-2">{profile.title}</p>
          <div className="flex flex-wrap gap-4 text-sm text-gray-500">
            <div className="flex items-center">
              <MapPin className="h-4 w-4 mr-1" />
              <span>New York, USA</span>
            </div>
            <div className="flex items-center">
              <Mail className="h-4 w-4 mr-1" />
              <span>Contact</span>
            </div>
            <div className="flex items-center">
              <LinkIcon className="h-4 w-4 mr-1" />
              <span>Portfolio</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}