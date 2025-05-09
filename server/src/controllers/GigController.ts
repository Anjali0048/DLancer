import { Request, Response } from "express";
import { Gig, IProposal } from "../models/GigSchema";

export const addGig = async (req: Request, res: Response) => {
    try {
        const gig = new Gig(req.body);
        const savedGig = await gig.save();
        res.status(201).json(savedGig);
    } catch (error: any) {
        console.log("error: ", error.message)
        res.status(400).json({ error: error.message })
    }
}

export const addFreelancerAddress = async (req: Request, res: Response) => {
    const { gigId, freelancerAddress } = req.body;
    try {
        const updatedGig = await Gig.findByIdAndUpdate(
            gigId,
            { freelancerAddress },
            { new: true }
        );
        res.status(200).json(updatedGig);
    } catch (error: any) {
        res.status(400).json({ error: error.message });
    }
};

export const getUserAuthGigs = async (req: Request, res: Response) => {
    const { walletAddress } = req.params;
    try {
        const gigs = await Gig.find({ walletAddress });
        res.status(200).json(gigs);
    } catch (error: any) {
        res.status(400).json({ error: error.message });
    }
};

export const getGigData = async (req: Request, res: Response): Promise<any | undefined> => {
    const { gigId } = req.params;
    try {
        const gig = await Gig.findById(gigId);
        if (!gig) {
            return res.status(404).json({ message: "Gig not found" });
        }
        return res.status(200).json(gig);
    } catch (error: any) {
        return res.status(400).json({ error: error.message });
    }
};

export const getGigsByWallet = async (req: Request, res: Response): Promise<void> => {
    const { walletAddress } = req.params; 

    if (!walletAddress || typeof walletAddress !== "string") {
        res.status(400).json({ message: "Invalid wallet address" });
        return;
    }

    try {
        const gigs = await Gig.find({ walletAddress: walletAddress });

        if (gigs.length === 0) {
            res.status(404).json({ message: "No gigs found for this client" });
            return;
        }

        res.status(200).json(gigs);
    } catch (error: any) {
        console.error("Error fetching gigs:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};


export const getAllGigData = async (req: Request, res: Response): Promise<any | undefined> => {
    try {
        const gig = await Gig.find();
        if (!gig) {
            return res.status(404).json({ message: "Gig not found" });
        }
        return res.status(200).json(gig);
    } catch (error: any) {
        return res.status(400).json({ error: error.message });
    }
};



export const editGig = async (req: Request, res: Response): Promise<any | undefined> => {
    const { gigId } = req.params;
    try {
        const updatedGig = await Gig.findByIdAndUpdate(
            gigId,
            req.body,
            { new: true }
        );
        if (!updatedGig) {
            return res.status(404).json({ message: "Gig not found" });
        }
        return res.status(200).json(updatedGig);
    } catch (error: any) {
        return res.status(400).json({ error: error.message });
    }
};





export const submitProposal = async (req: Request, res: Response): Promise<any | undefined> => {
    const { gigId } = req.params;
    const { freelancerAddress, file } = req.body;
    // const file= req.file?.path; // use a middleware multer for file upload

    if (!file) {
        return res.status(400).json({ message: "File is required" });
    }

    try {
        const gig = await Gig.findById(gigId);
        if (!gig) {
            return res.status(404).json({ message: "Gig not found" });
        }

        const proposal = { freelancerAddress, file, status: "pending" };
        gig.proposals?.push(proposal as IProposal);

        await gig.save();
        return res.status(200).json({ message: "Proposal submitted successfully", proposal });
    } catch (error: any) {
        return res.status(500).json({ error: error.message });
    }
};


export const acceptProposal = async (req: Request, res: Response): Promise<any | undefined> => {
    const { gigId, proposalId } = req.params;

    try {
        const gig = await Gig.findById(gigId);
        if (!gig) {
            return res.status(404).json({ message: "Gig not found" });
        }

        const proposal = gig.proposals?.find((proposal) => (proposal)._id.toString() === proposalId);
        if (!proposal) {
            return res.status(404).json({ message: "Proposal not found" });
        }

        proposal.status = "accepted";
        gig.status = "assigned";
        gig.freelancerAddress = proposal.freelancerAddress;

        gig.proposals?.forEach((p) => {
            if ((p as IProposal)._id.toString() !== proposalId) {
                p.status = "rejected";
            }
        });

        await gig.save();
        return res.status(200).json({ message: "Proposal accepted", gig });
    } catch (error: any) {
        return res.status(500).json({ error: error.message });
    }
};

export const getProposals = async (req: Request, res: Response): Promise<any | undefined> => {
    const { gigId } = req.params;

    try {
        const gig = await Gig.findById(gigId).select("proposals");
        if (!gig) {
            return res.status(404).json({ message: "Gig not found" });
        }

        return res.status(200).json(gig.proposals);
    } catch (error: any) {
        return res.status(500).json({ error: error.message });
    }
};

export const getProposalsByWalletAddress = async (req: Request, res: Response): Promise<any | undefined> => {
    const { walletAddress } = req.params;
    try {
        const gigs = await Gig.find({ "proposals.freelancerAddress" : walletAddress });
        // console.log("gigs: ",gigs)

        const proposals = gigs.flatMap(gig => {
            return (gig.proposals ?? []) 
                .filter((proposal: any) => proposal.freelancerAddress === walletAddress)
                .map((proposal: any) => ({
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
    } catch (error: any) {
        console.error("Error fetching freelancer proposals:", error);
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
};