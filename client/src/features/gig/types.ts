export interface Proposal {
    _id: string;
    freelancerAddress: string;
    file: string;
    status: "pending" | "accepted" | "rejected";
}

export interface Gig {
    _id: string;
    walletAddress: string;
    title: string;
    description: string;
    category: string;
    deliveryTime: number;
    revisions?: number;
    features: string[];
    price: number;
    shortDesc?: string;
    createdAt?: Date;
    images: string[];
    freelancerAddress?: string;
    proposals?: Proposal[];
    submissionLink?: string;
    escrowAddress?: string;
    status: 'pending' | 'assigned' | 'funded' | 'submitted' | 'completed' | 'dispute';
}

export interface FreelancerProposal {
    proposalId: string,
    gigId: string,
    gigTitle: string,
    gigCategory: string,
    gigPrice: number,
    clientAddress: string,
    status: "pending" | "accepted" | "rejected";
    file: string
} 