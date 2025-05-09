import React, { useEffect } from "react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { useNavigate } from "react-router-dom";
import { Gig } from "@/features/gig/types";
import { Tag } from "lucide-react";

type GigProps = {
    gig: Gig;
};
  
const GigCard:React.FC<GigProps> = ({gig}) => {

    const navigate = useNavigate();

    useEffect(() => {
      console.log("Gig Data:", gig);
    }, [gig]);
    
    console.log("Gig Data:", gig);
console.log("Image URL:", gig.images?.[0]);

  return (
    <div>
      <Card key={(gig as any)._id} className="p-4 border rounded-lg shadow-sm">
        <h2 className="text-lg font-semibold">{gig.title}</h2>
        <div className="flex items-center">
          <Tag className="h-4 w-4 mr-1" />
          <span>{gig.category}</span>
        </div>
        
        {/* <img src={gig.images?.[0] || "/default-image.jpeg"} alt="Gig Preview" className="w-full h-40 object-cover mt-2 rounded-lg"/> */}

        <p className="text-sm text-gray-700">${gig.price}</p>

        <div className="flex flex-wrap gap-2 mb-4">
          {gig.features.map((feat) => (
            <span
              key={feat}
              className="px-2 py-1 bg-indigo-50 text-indigo-700 text-xs rounded-full"
            >
              {feat}
            </span>
          ))}
        </div>

        <Button
          variant="outline"
          className="mt-4 w-full text-black"
          onClick={() => navigate(`/gig/${(gig as any)._id}`)}
        >
          View Details
        </Button>
      </Card>
    </div>
  );
};

export default GigCard;
