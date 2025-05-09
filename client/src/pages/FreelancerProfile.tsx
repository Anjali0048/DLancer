import ProfileHeader from '../components/profile/ProfileHeader';
import ProfileStats from '../components/profile/ProfileStats';
import SkillsList from '../components/profile/SkillsList';
import { Profile } from '../types';

const profileData: Profile = {
  id: '1',
  name: 'Sarah Johnson',
  title: 'Full Stack Developer',
  hourlyRate: 65,
  rating: 4.9,
  skills: ['React', 'Node.js', 'TypeScript', 'MongoDB', 'AWS', 'Docker'],
  completedJobs: 127,
  avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
};

export default function FreelancerProfile() {
  return (
    <div className="gap_section px-4 sm:px-6 lg:px-8 py-8">
      <ProfileHeader profile={profileData} />
      <ProfileStats
        rating={profileData.rating}
        completedJobs={profileData.completedJobs}
        hourlyRate={profileData.hourlyRate}
      />
      <SkillsList skills={profileData.skills} />
    </div>
  );
}