import { Job } from "../types";
import JobCard from "./JobCard";

const featuredJobs: Job[] = [
  {
    id: "1",
    title: "React Native Mobile App Development",
    description:
      "Looking for an experienced React Native developer to build a social networking app. Must have experience with Redux and API integration.",
    budget: 3000,
    category: "Development",
    skills: ["React Native", "Redux", "TypeScript"],
    postedDate: "2024-02-20",
    deadline: "2024-03-20",
    clientId: "client1",
  },
  {
    id: "2",
    title: "Website UI/UX Redesign",
    description:
      "Need a talented designer to redesign our company website. Focus on modern design principles and user experience.",
    budget: 2500,
    category: "Design",
    skills: ["UI Design", "UX Design", "Figma"],
    postedDate: "2024-02-19",
    deadline: "2024-03-15",
    clientId: "client2",
  },
];

const FeaturedJobs = () => {
  return (
    <section className="gap_section mb-12">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Featured Jobs</h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {featuredJobs.map((job) => (
          <JobCard key={job.id} job={job} />
        ))}
      </div>
    </section>
  );
};

export default FeaturedJobs;
