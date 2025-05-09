import { useGetAllGigsQuery } from "@/features/gig/gigAPI";
import { useNavigate } from "react-router-dom";
import GigCard from "@/components/GigCard";

export default function AllGigs() {
  const { data: gigs, error, isLoading } = useGetAllGigsQuery();
  const navigate = useNavigate();

  const visibleGigs = 6;    
  // console.log("Gigs: ", gigs?.length);

  if (isLoading) return <p className="mt-[80px]">Loading gigs...</p>;
  if (error) return <p className="mt-[80px]">Error fetching gigs</p>;

  const showMoreGigCards = () => {
    navigate('/allgigs');
  }

  return (
    <div className="gap_section mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Featured Gigs</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {gigs?.slice(0, visibleGigs).map((gig) => (
          gig.status==='pending' && (<GigCard gig={gig}/>)
        ))}

      </div>
        {
          gigs && gigs.length > visibleGigs && (
            <div className="mt-4 w-full">
              <button onClick={showMoreGigCards}>
                Show more...
              </button>
            </div>
          )
        }
    </div>
  );
}
