import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { FreelancerProposal, Gig, Proposal } from "./types";

export const gigAPI = createApi ({
    reducerPath: "gigAPI",
    baseQuery: fetchBaseQuery({ baseUrl: `http://localhost:9999/api/gig`}),
    endpoints: (builder) => ({

        getGigsByWallet: builder.query<Gig[], string>({
          query: (walletAddress) => `/client/${walletAddress}`,
        }),

        getAllGigs: builder.query<Gig[], void>({
          query: () => `/`
        }),

        getGigById: builder.query<Gig[], string> ({
          query: (gigId) => `/${gigId}`
        }),
        
        createGig: builder.mutation({
          query: (gigData) => ({
            url: `/addGig`,
            method: "POST",
            body: gigData,
          })
        }),

        submitProposal: builder.mutation<Proposal, { gigId: string; freelancerAddress: string; file: string }>({
          query: ({ gigId, freelancerAddress, file }) => ({
              url: `/${gigId}/submitProposal`,
              method: "POST",
              body: { freelancerAddress, file },
          }),
        }),

        acceptProposal: builder.mutation<Proposal, {gigId: string; proposalId: string}>({
          query: ({ gigId, proposalId }) => ({
            url: `/${gigId}/proposals/${proposalId}/accept`,
            method: "PATCH",
          }),
        }),

        getFreelancerProposals: builder.query<FreelancerProposal, string> ({
          query: (walletAddress) => `/proposals/${walletAddress}`
        }),

        editGig: builder.mutation<any, { gigId: string; updates: Record<string, any>  }> ({
          query: ({ gigId, updates  }) => ({
              url: `/edit/${gigId}`,
              method: "PUT",
              body: updates ,
          }),
        }),

    }),
})

export const { 
  useGetGigsByWalletQuery, 
  useCreateGigMutation, 
  useGetGigByIdQuery, 
  useGetAllGigsQuery, 
  useSubmitProposalMutation, 
  useAcceptProposalMutation, 
  useGetFreelancerProposalsQuery,
  useEditGigMutation,
} = gigAPI;