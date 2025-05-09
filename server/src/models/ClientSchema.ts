import mongoose, { Schema } from "mongoose";

export interface ClientProfile extends Document {
    clientName: string;
    companyName: string;
    projectsPosted: string[];
    paymentHistory: string[];
}

const ClientSchema: Schema = new Schema({
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
  
  export default mongoose.model<ClientProfile>('Client', ClientSchema);
  