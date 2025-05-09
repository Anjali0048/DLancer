import { Profile } from "../types";
import FreelancerCard from "./FreelancerCard";

const topFreelancers: Profile[] = [
    {
      id: "1",
      name: "Sarah Johnson",
      title: "Full Stack Developer",
      hourlyRate: 65,
      rating: 4.9,
      skills: ["React", "Node.js", "TypeScript"],
      completedJobs: 127,
      avatar:
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    },
    {
      id: "2",
      name: "Michael Chen",
      title: "UI/UX Designer",
      hourlyRate: 55,
      rating: 4.8,
      skills: ["UI Design", "Figma", "Adobe XD"],
      completedJobs: 93,
      avatar:
        "https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    },
  ];

const TopFreelancers = () => {
  return (
    <section className="gap_section">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Top Freelancers</h2>
          {/* <button className="text-indigo-600 hover:text-indigo-500 font-medium">
            View all
          </button> */}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {topFreelancers.map((profile) => (
            <FreelancerCard key={profile.id} profile={profile} />
          ))}
        </div>
      </section>
  )
}

export default TopFreelancers
