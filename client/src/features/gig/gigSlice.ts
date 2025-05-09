import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Gig, Proposal } from "./types";

interface GigState {
    gig: Gig;
    proposal: Proposal;
}

const initialState: GigState = {
    gig: {
        _id: "",
        walletAddress: "",
        title: "",
        description: "",
        category: "",
        deliveryTime: 0,
        revisions: 0,
        features: [],
        price: 0,
        shortDesc: "",
        createdAt: undefined,
        images: [],
        freelancerAddress: undefined,
        submissionLink: "",
        proposals: [], 
        escrowAddress: "",
        status: "pending",
    },
    proposal: {
        _id: "", 
        freelancerAddress: "",
        file: "",
        status: "pending", 
    }
};

const gigSlice = createSlice({
    name: "gig",
    initialState,
    reducers: {
        setGigData: (state, action: PayloadAction<Partial<Gig>>) => {
            state.gig = { ...state.gig, ...action.payload };
        },

        resetGigData: (state) => {
            state.gig = { ...initialState.gig }; 
        },

        setFile: (state, action) => {
            state.proposal.file = action.payload;
        },

        setProposalFreelancerAddress: (state, action) => {
            state.proposal.freelancerAddress = action.payload;
        },

        setStatus:(state, action) => {
            state.proposal.status = action.payload;
        },

        resetProposalForm: (state) => {
            state.proposal = { ...initialState.proposal }; 
        },

        setEscrowContractAddress: (state, action) => {
            state.gig.escrowAddress = action.payload;
        },
        

    }
});

export const { setGigData, resetGigData, setFile, setProposalFreelancerAddress, setStatus, resetProposalForm, setEscrowContractAddress } = gigSlice.actions;
export default gigSlice.reducer;
