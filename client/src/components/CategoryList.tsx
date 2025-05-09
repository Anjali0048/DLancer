import { useState } from "react";
import { useGetAllGigsQuery } from "@/features/gig/gigAPI";
import {
  Code,
  Paintbrush,
  Camera,
  PenTool,
  Globe,
  MessageSquare,
} from "lucide-react";
import { Category } from "../types";
import GigCard from "./GigCard";

const categories: Category[] = [
  { id: "1", name: "Development", icon: "Code" },
  { id: "2", name: "Design", icon: "Paintbrush" },
  { id: "3", name: "Photography", icon: "Camera" },
  { id: "4", name: "Writing", icon: "PenTool" },
  { id: "5", name: "Translation", icon: "Globe" },
  { id: "6", name: "Marketing", icon: "MessageSquare" },
];

const iconMap = {
  Code,
  Paintbrush,
  Camera,
  PenTool,
  Globe,
  MessageSquare,
};

export default function CategoryList() {
  const { data: gigs, error, isLoading } = useGetAllGigsQuery();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const filteredGigs = selectedCategory? gigs?.filter((gig) => gig.category.toLowerCase() === selectedCategory.toLowerCase()) : "";

  return (
    <main className="gap_section mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Categories Section */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Browse Categories</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories.map((category) => {
            const Icon = iconMap[category.icon as keyof typeof iconMap];
            return (
              <button
                key={category.id}
                className={`flex flex-col cursor-pointer items-center p-4 bg-white rounded-lg shadow-sm 
                  hover:shadow-md hover:bg-white transition-shadow ${
                    selectedCategory === category.name ? "bg-indigo-100" : ""
                  }`}
                onClick={() => setSelectedCategory(category.name)}
              >
                <Icon className="h-6 w-6 text-indigo-600 mb-2" />
                <span className="text-sm font-medium text-gray-900">{category.name}</span>
              </button>
            );
          })}
        </div>
      </section>

      {/* Gigs Section */}
      <section>
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          {selectedCategory ? `${selectedCategory} Gigs` : ""}
        </h2>
        {isLoading ? (
          <p>Loading gigs...</p>
        ) : error ? (
          <p>Error fetching gigs.</p>
        ) : filteredGigs && filteredGigs.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredGigs.map((gig) => (
              gig.status==='pending' && (<GigCard gig={gig}/>)
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
