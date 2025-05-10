import mongoose, { Schema } from "mongoose";
const ClientSchema = new Schema({
    walletAddress: {
        type: String,
        required: true,
        unique: true,
    },
    clientName: String,
    companyName: String,
    projectsPosted: [String],
    paymentHistory: [String],
}, { timestamps: true });
export default mongoose.model('Client', ClientSchema);
