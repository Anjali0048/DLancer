export interface Job {
    id: string;
    title: string;
    description: string;
    budget: number;
    category: string;
    skills: string[];
    postedDate: string;
    deadline: string;
    clientId: string;
  }
  
  export interface Profile {
    id: string;
    name: string;
    title: string;
    hourlyRate: number;
    rating: number;
    skills: string[];
    completedJobs: number;
    avatar: string;
  }
  
  export interface Category {
    id: string;
    name: string;
    icon: string;
  }