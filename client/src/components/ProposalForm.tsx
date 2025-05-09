import { useSubmitProposalMutation } from "@/features/gig/gigAPI";
import { setFile, setProposalFreelancerAddress } from "@/features/gig/gigSlice";
import { RootState } from "@/features/store";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import { Input } from "./ui/input";
import { Label } from "./ui/label";

export default function ProposalForm() {

    const { gigId } = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const proposal = useSelector((state: RootState) => state.gig.proposal);
    const walletAddress = useSelector((state: RootState) => state.auth.walletAddress);

    // console.log(walletAddress)
    
    const [submitProposal, { isLoading, error }] = useSubmitProposalMutation();
    
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        dispatch(setFile(e.target.value));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        await submitProposal({ gigId: gigId as string, freelancerAddress: proposal.freelancerAddress, file: proposal.file }); 
        toast.success("Successfully request sent!", {position: "top-center"})    
        setTimeout(() => {
            navigate('/');
        }, 3000)
    };

    useEffect(() => {
        if (walletAddress) {
            dispatch(setProposalFreelancerAddress(walletAddress));
        }
    }, [walletAddress, dispatch]);

    return (
        <form onSubmit={handleSubmit} className="p-4 border rounded-lg">
            <ToastContainer aria-label={undefined} />
            
            <Label>File URL</Label>
            <Input
                type="text"
                name= "file"
                placeholder="File URL"
                value={proposal.file}
                onChange={handleFileChange}
                className="bg-white text-black"
            />

            <button type="submit" disabled={isLoading || !gigId} className="bg-blue-500 text-white p-2 w-full mt-4">
                {isLoading ? "Submitting..." : "Submit Proposal"}
            </button>
            {error && <p className="text-red-500">Error submitting proposal</p>}
        </form>

    );
}
