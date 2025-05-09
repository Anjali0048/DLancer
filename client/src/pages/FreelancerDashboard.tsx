import { useSelector } from "react-redux";
import { RootState } from "../features/store";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useEditGigMutation, useGetAllGigsQuery, useGetFreelancerProposalsQuery } from "@/features/gig/gigAPI";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useBalanceOfQuery, useSubmitWorkMutation } from "@/features/blockchain/blockApi";
import { toast, ToastContainer } from "react-toastify";

export default function FreelancerDashboard() {  
  const walletAddress = useSelector((state: RootState) => state.auth.walletAddress);
  const { data: gigs } = useGetAllGigsQuery();

  const [submissionLink, setSubmissionLink] = useState<{ [key: string]: string }>({});
  const [clicked, setClicked] = useState(false);
  const [balance, setBalance] = useState(0);
  
  const { data: proposals, error, isLoading } = useGetFreelancerProposalsQuery(walletAddress!, { skip: !walletAddress });
  const [ submitWork ] = useSubmitWorkMutation();
  const [editGig] = useEditGigMutation();
  const {data: balanceOf} = useBalanceOfQuery(walletAddress!, {skip: !walletAddress,});
  
  if (!Array.isArray(proposals) || proposals.length === 0) {
    return <div className="w-full min-h-[calc(100vh)] flex items-center justify-center font-semibold text-2xl">No proposals found</div>;
  }

  console.log("proposals: ", proposals);

  const handleSubmissionChange = (gigId: string, value: string) => {
    setSubmissionLink((prev) => ({
      ...prev,
      [gigId]: value,
    }));
  };
  
  console.log("gigData: ", gigs);

  const handleSubmitButton = async (gig: { _id: string; escrowAddress?: string }) => {
    const link = submissionLink[gig._id]; 
    if (!link?.trim()) { 
      toast.error("Please enter a submission link before submitting.");
      return;
    }
    
    try {
      if (!gig?.escrowAddress) {
        toast.error("Escrow address is missing. Please try again later.");
        return;
      }
      await submitWork({ escrowAddress: gig.escrowAddress, submissionLink: link }).unwrap();
      await editGig({ gigId: gig._id, updates: { submissionLink: link, status: "submitted" } }).unwrap();
      toast.success("Submission link submitted successfully!", {position: "top-center"});
    } catch (error) {
      console.error("Error submitting the link:", error);
      toast.error("Failed to submit the link. Please try again.");
    }
  };


  const handleClick = () => {
    const balance = Number(balanceOf ?? 0) / 10 ** 18;
    setBalance(balance);
    setClicked(true);
  };
  

  if (isLoading) return <p>Loading proposals...</p>;
  if (error) return <p>Error fetching proposals</p>;

  return (
    <div className="gap_section mt-[1000px]">
      <button 
        onClick={handleClick} 
        className="mt-[120px] focus:outline-none text-white bg-blue-700 hover:bg-blue-800 font-medium text-lg px-10 py-3 rounded-md"
      >
        {clicked ? `Token Balance : ${balance}` : 'Get Token Balance'}
      </button>
      <Card className="p-6">
      <ToastContainer aria-label={undefined} />
        <h2 className="text-2xl font-bold mb-6">Freelancer Dashboard</h2>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Price ($)</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Client Address</TableHead>
              <TableHead>Proposal File</TableHead>
              <TableHead>Submission Link</TableHead>
              <TableHead>Action</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>            
            {
                gigs?.map((gig) => (
                    gig.proposals?.map((prop) => (
                      prop.freelancerAddress === walletAddress && (
                        <TableRow key={prop._id}>
                            <TableCell>{gig.title}</TableCell>
                            <TableCell>{gig.category}</TableCell>
                            <TableCell>{gig.price}</TableCell>
                            <TableCell>
                              {
                                gig.status === "pending" || gig.status === "assigned" ? (
                                  <Badge
                                    variant={prop.status === "pending" ? "gray" : prop.status === "rejected" ? "destructive" : "green"}
                                  >
                                    {prop.status}
                                  </Badge>
                                ) : (
                                  <Badge
                                    variant={gig.status === "funded" ? "yellow" : gig.status === "submitted" ? "purple" : "green"}
                                  >
                                    {gig.status}
                                  </Badge>
                                )
                              }
                            </TableCell>
                            <TableCell>
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <span>{`${gig.walletAddress.slice(0, 6)}...${gig.walletAddress.slice(-4)}`}</span>
                                  </TooltipTrigger>
                                  {gig.walletAddress && (
                                    <TooltipContent>
                                      <p>{gig.walletAddress}</p>
                                    </TooltipContent>
                                  )}
                                </Tooltip>
                              </TooltipProvider>
                            </TableCell>
                            <TableCell>
                              <a href={prop.file} target="_blank" rel="noopener noreferrer" className="text-blue-500 underline">
                                View File
                              </a>
                            </TableCell>
                              
                            {prop.status === "accepted" && gig.status==="funded" && (
                              <>
                                <TableCell>
                                  <Input
                                    type="text"
                                    placeholder="Enter the Submission link"
                                    value={submissionLink[gig._id] || ""}
                                    onChange={(e) => handleSubmissionChange(gig._id, e.target.value)}
                                  />
                                </TableCell>
                                <TableCell>
                                  <Button onClick={() => handleSubmitButton({ _id: gig._id, escrowAddress: gig.escrowAddress })}>Submit</Button>
                                </TableCell>
                              </>
                            )}
                        </TableRow>
                    )                    
                  ))
              ))
            }
           
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
