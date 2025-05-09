import GigForm from "../components/gig/GigForm";

interface CreateGigProps { isOpen: boolean; onClose: () => void; }

export default function CreateGig({ isOpen, onClose }: CreateGigProps) {
  if (!isOpen) return null;
  return (
    <div className="fixed h-full inset-0 flex items-start justify-center bg-black bg-opacity-50 backdrop-blur-sm z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg relative max-h-screen overflow-y-auto scrollbar-hide">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 bg-transparent hover:bg-transparent"
        >
          ✕
        </button>
        <h1 className="text-2xl font-bold mb-6">Create a New Project</h1>
        <GigForm />
      </div>
    </div>
  );
}
