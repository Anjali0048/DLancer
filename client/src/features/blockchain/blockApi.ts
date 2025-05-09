import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { ethers } from "ethers";
import config from "../../config.json";
import EscrowFactoryABI from "../../abi/EscrowFactory.json";
import EscrowABI from "../../abi/Escrow.json";
import MockUsdcABI from "../../abi/mockUSDC.json";

const tokens = (n: Number) => {
    return ethers.parseUnits(n.toString(), "ether");
};

const loadBlockchain = async (): Promise<{ signer: ethers.JsonRpcSigner; address: string; network: ethers.Network }> => {
    if (!window.ethereum) {
        throw new Error("Ethereum provider is not available. Please install MetaMask.");
    }
    await window.ethereum.request({ method: 'eth_requestAccounts' });
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    const address = await signer.getAddress();
    const network = await provider.getNetwork();

    return { signer, address, network };
};

const loadMockUSDC = async (): Promise<ethers.Contract> => {
    const { signer, network } = await loadBlockchain();
    const chainId = network.chainId.toString() as keyof typeof config;
    const mockUSDCContractAddress = config[chainId]?.mockUSDC?.address;
    // console.log("mockUSDCContractAddress: ", mockUSDCContractAddress)
    
    if (!mockUSDCContractAddress) throw new Error("MockUSDCContract address not found for this network");
    return new ethers.Contract(mockUSDCContractAddress, MockUsdcABI.abi, signer);
};

const loadEscrowFactory = async (): Promise<ethers.Contract> => {
    const { signer, network } = await loadBlockchain();
    const chainId = network.chainId.toString() as keyof typeof config;
    const escrowFactoryAddress = config[chainId]?.EscrowFactory?.address;
    // console.log("escrowFactoryAddress: ", escrowFactoryAddress)

    if (!escrowFactoryAddress) throw new Error("EscrowContract address not found for this network");
    return new ethers.Contract(escrowFactoryAddress, EscrowFactoryABI.abi, signer);
};

// const listenForEscrowCreation  = async () => {
//     const contract = await loadEscrowFactory();

//     contract.on("EscrowCreated", (escrowAddress, client, freelancer, amount) => {
//       console.log("New Escrow Deployed at:", escrowAddress);
//     });
// };

const loadEscrowContract = async (escrowAddress: string) => {
    const { signer } = await loadBlockchain();
    return new ethers.Contract(escrowAddress, EscrowABI.abi, signer);
};

export const blockApi = createApi({
    reducerPath: "blockApi",
    baseQuery: fetchBaseQuery({ baseUrl: "https://testnet-rpc.coinex.net" }),
    tagTypes: ["MockUSDC", "EscrowFactory"],
    endpoints: (builder) => ({
        loadMockUSDCContract: builder.query<ethers.Contract, void>({
            queryFn: async () => {
                try {
                    const contract = await loadMockUSDC();
                    return { data: contract };
                } catch (error: any) {
                    return { error: { status: "FETCH_ERROR", data: error.message, error: error.name || "Unknown Error" } };
                }
            },
            providesTags: ["MockUSDC"],
        }),

        loadEscrowFactoryContract: builder.query<ethers.Contract, void>({
            queryFn: async () => {
                try {
                    const contract = await loadEscrowFactory();
                    return { data: contract };
                } catch (error: any) {
                    return { error: { status: "FETCH_ERROR", data: error.message, error: error.name || "Unknown Error" } };
                }
            },
            providesTags: ["EscrowFactory"],
        }),

        mintToken: builder.mutation<string, { to: string; amount: number }>({
            queryFn: async ({ to, amount }) => {
                try {
                    const contract = await loadMockUSDC();
                    const tx = await contract.mint(to, tokens(amount));
                    console.log("minted client: ", to);
                    console.log("minted amount: ", tokens(amount));
                    await tx.wait();
                    return { data: tx.hash };
                } catch (error: any) {
                    return { error: { status: "FETCH_ERROR", data: error.message, error: error.name || "Unknown Error" } };
                }
            }
        }),

        createEscrow: builder.mutation<string, { freelancer: string; amount: number; days: number }>({
            queryFn: async ({ freelancer, amount, days }) => {
                try {
                    const contract = await loadEscrowFactory();
                    await contract.createEscrow(freelancer, ethers.parseUnits(amount.toString(), 18), days);        
                    const { signer } = await loadBlockchain();
                    const latestBlock = await signer.provider.getBlockNumber();
        
                    let eventLogs: any = [];
                    for (let i = 0; i < 5; i++) { 
                        await new Promise(resolve => setTimeout(resolve, 2000));
                        
                        eventLogs = await contract.queryFilter(contract.filters.EscrowCreated(), latestBlock - 10, "latest");
        
                        if (eventLogs.length > 0) break;
                    }
        
                    if (eventLogs.length === 0) throw new Error("EscrowCreated event not found!");
        
                    const escrowAddress = eventLogs[0].args[0];
                    console.log("Escrow created at:", escrowAddress);
        
                    return { data: escrowAddress };
                } catch (error: any) {
                    console.error("Error in createEscrow:", error);
                    return { error: { status: "FETCH_ERROR", data: error.message, error: error.name || "Unknown Error" } };
                }
            },
            invalidatesTags: ["EscrowFactory"],
        }),

        getAllEscrows: builder.query<string[], void>({
            queryFn: async () => {
                try {
                    const contract = await loadEscrowFactory();
                    const escrows = await contract.getAllEscrows();
                    return { data: escrows };
                } catch (error: any) {
                    return { error: { status: "FETCH_ERROR", data: error.message, error: error.name || "Unknown Error" } };
                }
            }
        }),

        balanceOf: builder.query<number, string>({
            queryFn: async (walletAddress) => {
                try {
                    const contract = await loadMockUSDC();
                    const balance = await contract.balanceOf(walletAddress);
                    return { data: Number(balance) };
                }
                catch (error: any) {
                    return { error: { status: "FETCH_ERROR", data: error.message, error: error.name || "Unknown Error" } };
                }
            }
        }),

        fundEscrow: builder.mutation<string, { escrowAddress: string; amount: number }>({
            queryFn: async ({ escrowAddress, amount }) => {
                try {
                    const usdcContract = await loadMockUSDC(); 
                    const escrowContract = await loadEscrowContract(escrowAddress);
        
                    console.log(`Approving USDC transfer of ${amount} to ${escrowAddress}...`);
                    const approveTx = await usdcContract.approve(escrowAddress, ethers.parseUnits(amount.toString(), 18));
                    await approveTx.wait();
        
                    console.log("USDC approved! Now funding escrow...");
                    const tx = await escrowContract.fundEscrow();
                    await tx.wait();
        
                    console.log("Escrow funded successfully!");
                    return { data: tx.hash };
                } catch (error: any) {
                    console.error("Error funding escrow:", error);
                    return { error: { status: "FETCH_ERROR", data: error.message, error: error.name || "Unknown Error" } };
                }
            }
        }),

        submitWork: builder.mutation<string, { escrowAddress: string; submissionLink: string }>({
            queryFn: async ({ escrowAddress, submissionLink }) => {
                try {
                    const escrowContract = await loadEscrowContract(escrowAddress);
                    const tx = await escrowContract.submitWork(submissionLink);
                    await tx.wait();
                    return { data: tx.hash };
                } catch (error: any) {
                    return { error: { status: "FETCH_ERROR", data: error.message, error: error.name || "Unknown Error" } };
                }
            }
        }),

        releasePayment: builder.mutation<string, string>({
            queryFn: async (escrowAddress) => {
                try {
                    const escrowContract = await loadEscrowContract(escrowAddress);
                    const tx = await escrowContract.releasePayment();
                    await tx.wait();
                    return { data: tx.hash };
                }
                catch (error: any) {
                    return { error: { status: "FETCH_ERROR", data: error.message, error: error.name || "Unknown Error" } };
                }
            }
        }),   

        raiseDispute: builder.mutation<string, string> ({
            queryFn: async (escrowAddress) => {
                try {
                    const escrowContract = await loadEscrowContract(escrowAddress);
                    const tx = await escrowContract.raiseDispute();
                    await tx.wait();
                    return { data: tx.hash };
                }
                catch (error: any) {
                    return { error: { status: "FETCH_ERROR", data: error.message, error: error.name || "Unknown Error" } };
                }
            }
        }),

        
        vote: builder.mutation<string, { escrowAddress: string; inFavor: boolean }>({
            queryFn: async ({ escrowAddress, inFavor }) => {
                try {
                    const escrowContract = await loadEscrowContract(escrowAddress);
                    console.log("Escrow address: ", escrowAddress);
                    console.log("In favor: ", inFavor);
                    const tx = await escrowContract.vote(inFavor);
                    await tx.wait();
                    console.log("Vote transaction hash: ", tx.hash);
                    console.log("Vote transaction confirmed!");
                    return { data: tx.hash };
                } catch (error: any) {
                    return { error: { status: "FETCH_ERROR", data: error.message, error: error.name || "Unknown Error" } };
                }
            }
        }),
        
        getEscrowState: builder.query<any, string>({
            queryFn: async (escrowAddress) => {
                try {
                    const escrowContract = await loadEscrowContract(escrowAddress);
                    
                    const stateIndex  = await escrowContract.getEscrowState();
                    const stateMapping = ["AWAITING_PAYMENT", "AWAITING_DELIVERY", "WORK_SUBMITTED", "COMPLETE", "REFUNDED", "IN_DISPUTE"];

                    return { data: stateMapping[stateIndex] };
                }
                catch (error: any) {
                    return { error: { status: "FETCH_ERROR", data: error.message, error: error.name || "Unknown Error" } };
                }
            }
        }),


    }),
});

export const { 
    useLoadMockUSDCContractQuery,  
    useLoadEscrowFactoryContractQuery, 
    useMintTokenMutation, 
    useCreateEscrowMutation, 
    useGetAllEscrowsQuery,
    useBalanceOfQuery,
    useFundEscrowMutation,
    useSubmitWorkMutation,
    useReleasePaymentMutation,
    useRaiseDisputeMutation,
    useVoteMutation,
    useGetEscrowStateQuery,
} = blockApi;
