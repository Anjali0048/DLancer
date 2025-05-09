import CategoryList from "../components/CategoryList";
import TopFreelancers from "../components/TopFreelancers";
import AllGigs from "./AllGigs";
import landingImage from "../assets/landing.png";

const Landing = () => {
  return (
    <>
      <div className="relative w-full h-[calc(100vh-80px)] mt-[80px]">
        <img
          src={landingImage}
          alt="Landing"
          className="absolute top-0 left-0 w-full h-full object-cover"
        />
        <div className="absolute top-0 left-0 w-full h-[calc(100vh-80px)] bg-black/20"></div>

        <div className="relative z-10 gap_section ">
          <section className="w-[50%] text-white py-40">
            <h1 className="text-5xl font-bold">
              Find the Best Freelancers for Your Projects
            </h1>
            <h2 className="text-3xl mt-4">
              A Decentralized Freelancing Platform
            </h2>
            <p className="mt-4 text-lg">
              Work without intermediaries. Secure payments & DAO-based dispute
              resolution.
            </p>
            <p className="mt-4 text-lg">
              Join thousands of clients & freelancers working together.
            </p>
            {/* <button className="mt-6 bg-white text-blue-600 px-6 py-2 rounded-full font-semibold hover:bg-gray-200">
              Get Started
            </button> */}
          </section>
        </div>
      </div>

      <div className="relative z-10">
        <CategoryList />
        <AllGigs />
        <TopFreelancers />
      </div>
    </>
  );
};

export default Landing;
