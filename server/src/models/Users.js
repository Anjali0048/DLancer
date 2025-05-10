import mongoose, { Schema } from "mongoose";
const UserSchema = new Schema({
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
}, { timestamps: true });
export default mongoose.model('User', UserSchema);
