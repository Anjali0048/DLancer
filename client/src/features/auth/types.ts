
export interface FreelancerProfile {
    freelancerName: string;
    skills: string[];
    portfolio: string[];
    hourlyRate: number;
    availability: boolean;
}

export interface ClientProfile {
    clientName: string;
    companyName: string;
    projectsPosted: string[];
    paymentHistory: string[];
}

export interface AuthState {
    walletAddress: string | null;
    role: 'freelancer' | 'client';
}
