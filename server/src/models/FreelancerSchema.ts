import mongoose, { Schema } from "mongoose";

export interface FreelancerProfile extends Document {
    freelancerName: string;
    skills: string[];
    portfolio: string[];
    hourlyRate: number;
    availability: boolean;
}

const FreelancerSchema: Schema = new Schema({
    walletAddress: {
        type: String,
        required: true,
        unique: true,
    },
    freelancerName: { 
        type: String, 
        required: true 
    },
    skills: [String],
    portfolio: [String],
    hourlyRate: Number,
    availability: Boolean,
  }, { timestamps: true });
  
  export default mongoose.model<FreelancerProfile>('Freelancer', FreelancerSchema);
  