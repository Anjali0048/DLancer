import { useGetAllGigsQuery } from "@/features/gig/gigAPI";
import GigCard from "@/components/GigCard";

export default function AllGigsPage() {
  const { data: gigs, error, isLoading } = useGetAllGigsQuery();

  console.log("Gigs: ", gigs?.length);

  if (isLoading) return <p>Loading gigs...</p>;
  if (error) return <p>Error fetching gigs</p>;

  return (
    <div className="gap_section mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">All Gigs</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {gigs?.map((gig) => (
          gig.status==='pending' && (<GigCard gig={gig}/>)
        ))}
      </div>
    </div>
  );
}
