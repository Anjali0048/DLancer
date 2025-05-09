import mongoose, { Document, Schema } from "mongoose";
import { FreelancerProfile } from "./FreelancerSchema";
import { ClientProfile } from "./ClientSchema";

export interface IUser extends Document {
    walletAddress: string;
    role: 'freelancer' | 'client';
    profile: FreelancerProfile | ClientProfile;
    createdAt: Date;
}

const UserSchema: Schema = new Schema ({
    walletAddress: {
        type: String,
        required: true,
        unique: true
    },
    role: {
        type: String,
        enum: ['freelancer', 'client'],
        default: 'freelancer'
    },
    profile: {
        type: Schema.Types.Mixed
    }
}, {timestamps: true});

export default mongoose.model<IUser>('User', UserSchema);