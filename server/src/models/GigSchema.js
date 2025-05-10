import mongoose, { Schema } from "mongoose";
const ProposalSchema = new Schema({
    freelancerAddress: { type: String, required: true },
    file: { type: String, required: true },
    status: { type: String, enum: ["pending", "accepted", "rejected"], default: "pending" },
});
const GigSchema = new Schema({
    walletAddress: { type: String, requied: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    category: { type: String, required: true },
    deliveryTime: { type: Number, required: true },
    revisions: { type: Number },
    features: { type: [String], required: true },
    price: { type: Number, required: true },
    shortDesc: { type: String },
    createdAt: { type: Date, default: Date.now },
    images: { type: [String], required: true },
    freelancerAddress: { type: String, default: null },
    proposals: { type: [ProposalSchema], default: [] },
    submissionLink: { type: String },
    escrowAddress: { type: String },
    status: {
        type: String,
        enum: ['pending', 'assigned', 'completed'],
        default: 'pending'
    },
}, { timestamps: true });
export const Gig = mongoose.model("Gig", GigSchema);
