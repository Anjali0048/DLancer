"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getProposalsByWalletAddress = exports.getProposals = exports.acceptProposal = exports.submitProposal = exports.editGig = exports.getAllGigData = exports.getGigsByWallet = exports.getGigData = exports.getUserAuthGigs = exports.addFreelancerAddress = exports.addGig = void 0;
const GigSchema_1 = require("../models/GigSchema");
const addGig = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const gig = new GigSchema_1.Gig(req.body);
        const savedGig = yield gig.save();
        res.status(201).json(savedGig);
    }
    catch (error) {
        console.log("error: ", error.message);
        res.status(400).json({ error: error.message });
    }
});
exports.addGig = addGig;
const addFreelancerAddress = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { gigId, freelancerAddress } = req.body;
    try {
        const updatedGig = yield GigSchema_1.Gig.findByIdAndUpdate(gigId, { freelancerAddress }, { new: true });
        res.status(200).json(updatedGig);
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
});
exports.addFreelancerAddress = addFreelancerAddress;
const getUserAuthGigs = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { walletAddress } = req.params;
    try {
        const gigs = yield GigSchema_1.Gig.find({ walletAddress });
        res.status(200).json(gigs);
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
});
exports.getUserAuthGigs = getUserAuthGigs;
const getGigData = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { gigId } = req.params;
    try {
        const gig = yield GigSchema_1.Gig.findById(gigId);
        if (!gig) {
            return res.status(404).json({ message: "Gig not found" });
        }
        return res.status(200).json(gig);
    }
    catch (error) {
        return res.status(400).json({ error: error.message });
    }
});
exports.getGigData = getGigData;
const getGigsByWallet = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { walletAddress } = req.params;
    if (!walletAddress || typeof walletAddress !== "string") {
        res.status(400).json({ message: "Invalid wallet address" });
        return;
    }
    try {
        const gigs = yield GigSchema_1.Gig.find({ walletAddress: walletAddress });
        if (gigs.length === 0) {
            res.status(404).json({ message: "No gigs found for this client" });
            return;
        }
        res.status(200).json(gigs);
    }
    catch (error) {
        console.error("Error fetching gigs:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});
exports.getGigsByWallet = getGigsByWallet;
const getAllGigData = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const gig = yield GigSchema_1.Gig.find();
        if (!gig) {
            return res.status(404).json({ message: "Gig not found" });
        }
        return res.status(200).json(gig);
    }
    catch (error) {
        return res.status(400).json({ error: error.message });
    }
});
exports.getAllGigData = getAllGigData;
const editGig = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { gigId } = req.params;
    try {
        const updatedGig = yield GigSchema_1.Gig.findByIdAndUpdate(gigId, req.body, { new: true });
        if (!updatedGig) {
            return res.status(404).json({ message: "Gig not found" });
        }
        return res.status(200).json(updatedGig);
    }
    catch (error) {
        return res.status(400).json({ error: error.message });
    }
});
exports.editGig = editGig;
const submitProposal = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { gigId } = req.params;
    const { freelancerAddress, file } = req.body;
    // const file= req.file?.path; // use a middleware multer for file upload
    if (!file) {
        return res.status(400).json({ message: "File is required" });
    }
    try {
        const gig = yield GigSchema_1.Gig.findById(gigId);
        if (!gig) {
            return res.status(404).json({ message: "Gig not found" });
        }
        const proposal = { freelancerAddress, file, status: "pending" };
        (_a = gig.proposals) === null || _a === void 0 ? void 0 : _a.push(proposal);
        yield gig.save();
        return res.status(200).json({ message: "Proposal submitted successfully", proposal });
    }
    catch (error) {
        return res.status(500).json({ error: error.message });
    }
});
exports.submitProposal = submitProposal;
const acceptProposal = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const { gigId, proposalId } = req.params;
    try {
        const gig = yield GigSchema_1.Gig.findById(gigId);
        if (!gig) {
            return res.status(404).json({ message: "Gig not found" });
        }
        const proposal = (_a = gig.proposals) === null || _a === void 0 ? void 0 : _a.find((proposal) => (proposal)._id.toString() === proposalId);
        if (!proposal) {
            return res.status(404).json({ message: "Proposal not found" });
        }
        proposal.status = "accepted";
        gig.status = "assigned";
        gig.freelancerAddress = proposal.freelancerAddress;
        (_b = gig.proposals) === null || _b === void 0 ? void 0 : _b.forEach((p) => {
            if (p._id.toString() !== proposalId) {
                p.status = "rejected";
            }
        });
        yield gig.save();
        return res.status(200).json({ message: "Proposal accepted", gig });
    }
    catch (error) {
        return res.status(500).json({ error: error.message });
    }
});
exports.acceptProposal = acceptProposal;
const getProposals = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { gigId } = req.params;
    try {
        const gig = yield GigSchema_1.Gig.findById(gigId).select("proposals");
        if (!gig) {
            return res.status(404).json({ message: "Gig not found" });
        }
        return res.status(200).json(gig.proposals);
    }
    catch (error) {
        return res.status(500).json({ error: error.message });
    }
});
exports.getProposals = getProposals;
const getProposalsByWalletAddress = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { walletAddress } = req.params;
    try {
        const gigs = yield GigSchema_1.Gig.find({ "proposals.freelancerAddress": walletAddress });
        // console.log("gigs: ",gigs)
        const proposals = gigs.flatMap(gig => {
            var _a;
            return ((_a = gig.proposals) !== null && _a !== void 0 ? _a : [])
                .filter((proposal) => proposal.freelancerAddress === walletAddress)
                .map((proposal) => ({
                proposalId: proposal._id,
                gigId: gig._id,
                gigTitle: gig.title,
                gigCategory: gig.category,
                gigPrice: gig.price,
                clientAddress: gig.walletAddress,
                status: gig.freelancerAddress === walletAddress ? "accepted" : proposal.status,
                file: proposal.file
            }));
        });
        if (proposals.length === 0) {
            return res.status(404).json({ message: "No proposals found for this freelancer" });
        }
        res.status(200).json(proposals);
    }
    catch (error) {
        console.error("Error fetching freelancer proposals:", error);
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
});
exports.getProposalsByWalletAddress = getProposalsByWalletAddress;
