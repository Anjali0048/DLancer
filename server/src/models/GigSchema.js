"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Gig = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const ProposalSchema = new mongoose_1.Schema({
    freelancerAddress: { type: String, required: true },
    file: { type: String, required: true },
    status: { type: String, enum: ["pending", "accepted", "rejected"], default: "pending" },
});
const GigSchema = new mongoose_1.Schema({
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
exports.Gig = mongoose_1.default.model("Gig", GigSchema);
