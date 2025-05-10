import mongoose, { Schema } from "mongoose";
const FreelancerSchema = new Schema({
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
export default mongoose.model('Freelancer', FreelancerSchema);
