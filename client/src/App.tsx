import Navbar from "./components/Navbar";
import { Route, Routes } from "react-router-dom";
import FreelancerProfile from "./pages/FreelancerProfile";
import CreateGig from "./pages/CreateGig";
import Landing from "./pages/Landing";
import ClientDashboard from "./pages/ClientDashboard";
import AllGigsPage from "./pages/AllGigsPage";
import GigDetails from "./components/GigDetails";
import ProposalForm from "./components/ProposalForm";
import FreelancerDashboard from "./pages/FreelancerDashboard";
import ArbiterPage from "./pages/ArbiterPage";

function App() {
  return (
    <div className="min-h-screen min-w-full ">
      <Navbar />

      <Routes>
        <Route path="/" element={<Landing/>} />
        <Route path="/profile" element={<FreelancerProfile />} />
        <Route path="/create-gig" element={<CreateGig isOpen={false} onClose={() => {}} />} />
        <Route path="/client-dashboard" element={<ClientDashboard />} />
        <Route path="/freelancer-dashboard" element={<FreelancerDashboard />} />
        <Route path="/allgigs" element={<AllGigsPage />} />
        <Route path="/gig/:gigId" element={<GigDetails />} />
        <Route path="/proposal-form" element={<ProposalForm />} />
        <Route path="/arbiter" element={<ArbiterPage />} />

      </Routes>
      
    </div>
  );
}

export default App;
