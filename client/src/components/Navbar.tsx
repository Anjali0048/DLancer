import { Menu, Search, User } from "lucide-react";
import { useDispatch } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { useConnectWalletMutation } from "../features/auth/authAPI";
import { setWalletAddress } from "../features/auth/authSlice";
import { useEffect, useRef, useState } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export default function Navbar() {
  const dropdownRef = useRef<HTMLDivElement>(null);
  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [connectWallet, { data: walletAddress }] =
    useConnectWalletMutation();
  const [isOpen, setIsOpen] = useState(false);

  const switchToClient = () => {
    navigate("/client-dashboard");
  };

  const switchToFreelancerDashboard = () => {
    navigate("/freelancer-dashboard");
  };

  const switchToArbiterDashboard = () => {
    navigate("/arbiter");
  };

  const navigateToHome = () => {
    navigate("/");
  };

  const handleConnect = async () => {
    const response = await connectWallet().unwrap();
    if (response) {
      dispatch(setWalletAddress(response));
    }
  };

  // useEffect(() => {
  //   connectWallet();
  // }, []);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <nav className="fixed top-0 left-0 w-full z-20 h-[80px] flex justify-between items-center bg-white shadow-sm">
      <div className="w-full mx-auto px-4 sm:px-6 lg:px-36 flex justify-between">
        <div className="w-full flex justify-between h-16 items-center">
          <div className="flex items-center">
            <button className="p-2 rounded-md text-gray-400 lg:hidden">
              <Menu className="h-6 w-6" />
            </button>
            <div
              className="text-2xl font-bold text-indigo-600 ml-2 cursor-pointer"
              onClick={navigateToHome}
            >
              DLancer
            </div>
          </div>

          <div className="hidden lg:flex flex-1 items-center justify-center px-8">
            <div className="max-w-lg w-full">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  placeholder="Search for projects..."
                  type="search"
                />
              </div>
            </div>
          </div>

          <div className="relative flex items-center space-x-4 " ref={dropdownRef}>
            {
              location.pathname !== "/client-dashboard" && location.pathname !== "/freelancer-dashboard" && (
                <button onClick={switchToClient}>Dashboard</button>
              )
            }
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button onClick={handleConnect}>
                    {walletAddress
                      ? `${walletAddress.slice(0, 6)}...${walletAddress.slice(
                          -4
                        )}`
                      : "Connect"}
                  </button>
                </TooltipTrigger>
                {walletAddress && (
                  <TooltipContent>
                    <p>{walletAddress}</p>
                  </TooltipContent>
                )}
              </Tooltip>
            </TooltipProvider>

            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-full text-gray-400 hover:text-gray-500"
            >
              <User className="h-6 w-6" />
            </button>

            {/* Dropdown Menu */}
            {isOpen && (
              <div className="absolute right-0 top-12 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                <ul>
                  <li
                    onClick={() => {
                      switchToClient();
                      setIsOpen(false);
                    }}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
                  >
                    Switch as Client
                  </li>
                  <li
                    onClick={() => {
                      switchToFreelancerDashboard();
                      setIsOpen(false);
                    }}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
                  >
                    Switch as Freelancer
                  </li>
                  <li
                    onClick={() => {
                      switchToArbiterDashboard();
                      setIsOpen(false);
                    }}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
                  >
                    Switch as Arbiter
                  </li>
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
