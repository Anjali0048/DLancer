import { useVoteMutation } from '@/features/blockchain/blockApi';
import { useGetAllGigsQuery } from '@/features/gig/gigAPI';
import { RootState } from '@/features/store';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

const arbitrators = [
    "0xf2808E6b28A2aA13A9Ce5dD330190dC992E4f57A",
    "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
    "0x70997970C51812dc3A010C7d01b50e0d17dc79C8"
];

const ArbiterPage = () => {
    const walletAddress = useSelector((state: RootState) => state.auth.walletAddress);  
    const isArbiter = walletAddress && arbitrators.includes(walletAddress);

    const [vote] = useVoteMutation();
    const { data: gigs } = useGetAllGigsQuery();
    // const [escrowState, setEscrowState] = useState("");
    
    const handleVote = async (gig: { _id: string; escrowAddress?: string }, inFavor: boolean) => {
        try {
            if (!gig?.escrowAddress) {
                toast.error("Escrow address is missing. Please try again later.");
                return;
            }
            // const { data: EscrowState } = useGetEscrowStateQuery(gig.escrowAddress);
            // setEscrowState(EscrowState);
            await vote({ escrowAddress: gig.escrowAddress, inFavor }).unwrap();
            toast.success("Vote submitted successfully!", { position: "top-center" });
        } catch (error) {
            console.error("Error submitting the vote:", error);
            toast.error("Failed to submit the vote. Please try again.");
        }
    };

    return (
        isArbiter && (
            <div className="gap_section flex flex-col items-center justify-center min-h-screen">
                <h1 className="text-2xl font-bold mb-4">Arbiter Voting Panel</h1>
                <Table className="w-3/4">
                    <TableHeader>
                        <TableRow>
                            <TableHead>Title</TableHead>
                            <TableHead>Description</TableHead>
                            <TableHead>Category</TableHead>
                            <TableHead>Submission Link</TableHead>
                            <TableHead>Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {gigs?.map((gig) => (
                            gig.status === 'dispute' && (
                                <TableRow key={gig._id}>
                                    <TableCell>{gig.title}</TableCell>
                                    <TableCell>{gig.description}</TableCell>
                                    <TableCell>{gig.category}</TableCell>
                                    <TableCell>{gig.submissionLink}</TableCell>
                                    <TableCell>
                                        <div
                                          className="flex items-center justify-between mb-2"
                                        >
                                          <a
                                            href={gig.submissionLink}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-blue-500 underline"
                                          >
                                            Submission Link
                                          </a>
                                        </div>
                                    </TableCell>
                                    <TableCell className='flex justify-center'>
                                        <button 
                                            onClick={() => handleVote({ _id: gig._id, escrowAddress: gig.escrowAddress }, true)} 
                                            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 mr-2"
                                        >
                                            In Favor
                                        </button>
                                        <button 
                                            onClick={() => handleVote({ _id: gig._id, escrowAddress: gig.escrowAddress }, false)} 
                                            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                                        >
                                            In Against
                                        </button>
                                    </TableCell>
                                </TableRow>
                            )
                        ))}
                    </TableBody>
                </Table>
            </div>
        )
    );
};

export default ArbiterPage;