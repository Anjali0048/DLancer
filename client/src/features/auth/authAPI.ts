import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { ethers } from "ethers";
import { setWalletAddress } from "./authSlice";

export const authAPI = createApi({
  reducerPath: "authAPI",
  baseQuery: fetchBaseQuery({ baseUrl: "/" }),
  endpoints: (builder) => ({
    connectWallet: builder.mutation<string, void>({
      queryFn: async () => {
        try {
          if (!window.ethereum) {
            return { error: { status: 400, data: "MetaMask not installed" } };
          }

          const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
          const walletAddress = ethers.getAddress(accounts[0]);

          window.ethereum.on("accountsChanged", async (newAccounts: string[]) => {
            if (newAccounts.length > 0) {
              const newWallet = ethers.getAddress(newAccounts[0]);
              setWalletAddress(newWallet);
            } 
          });

          return { data: walletAddress };
        } catch (error: any) {
          return { error: { status: 500, data: error.message } };
        }
      },
    }),
  }),
});

export const { useConnectWalletMutation } = authAPI;
