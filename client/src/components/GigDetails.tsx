import { useParams } from "react-router-dom";
import { useGetGigByIdQuery } from "@/features/gig/gigAPI";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DollarSign } from "lucide-react";
import { useState } from "react";
import ProposalForm from "./ProposalForm";

export default function GigDetails() {
  const { gigId } = useParams();
  const { data: gigData, error, isLoading } = useGetGigByIdQuery(gigId!);
  const gig = Array.isArray(gigData) ? gigData[0] : gigData;

  const [ applyForGig, setApplyForGig ] = useState(false);

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error fetching gig details</p>;

  return (
    <div className="gap_section mx-auto px-4 py-8 ">
      <Card className="p-6 shadow-lg mt-[80px]">
        <div className="flex justify-between">

          <div>
            <h1 className="text-2xl font-bold">{gig?.title}</h1>
            <p className="text-gray-600 text-sm">{gig?.category}</p>
            <div className="flex items-center gap-2 text-lg font-semibold mt-2">
              <DollarSign className="w-5 h-5 text-green-600" />
              <span>${gig?.price}</span>
            </div>
            <p className="mt-4 text-gray-700">{gig?.description}</p>
            
            <div className="mt-6">
              <Button variant="default" onClick={()=>setApplyForGig(true)}>Apply for Gig</Button>
            </div>

            {
              applyForGig && <ProposalForm />
            }
          </div>

          <div>
            <img src={gig?.images[0]} alt="Gig Preview" className="w-full h-full object-cover mt-2 rounded-lg"/>
          </div>

        </div>

      </Card>
    </div>
  );
}
