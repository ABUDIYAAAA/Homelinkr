import React, { useState, useRef, useEffect } from "react";
import { Search, X, MessageSquare, Bell, ChevronDown } from "lucide-react";
import { useAuth } from "../context/Auth";
import { useNavigate, useLocation, Link } from "react-router-dom";

export default function Navbar() {
  const [searchValue, setSearchValue] = useState("");
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const auth = useAuth();

  const defaultImgUrl = "https://placehold.co/32x32/1d4ed8/ffffff?text=JD";
  let imgUrl = auth.user?.image || defaultImgUrl;

  const profileRef = useRef(null);

  // Determine active page based on current route
  const getActivePage = () => {
    const path = location.pathname;
    if (path === "/sell") return "Sell";
    if (path === "/rent") return "Rent";
    if (path === "/mortgage") return "Mortgage";
    return "Buy";
  };

  const activePage = getActivePage();

  const handleLogout = async () => {
    setIsProfileOpen(false);
    const success = await auth.logout();
    if (success) {
      navigate("/login");
    }
  };

  const handleBlur = (e) => {
    if (profileRef.current && !profileRef.current.contains(e.relatedTarget)) {
      setTimeout(() => setIsProfileOpen(false), 150);
    }
  };

  const handleSignInClick = () => {
    navigate("/login");
  };

  const handleNavClick = (page) => {
    const routes = {
      Buy: "/",
      Rent: "/rent",
      Sell: "/sell",
      Mortgage: "/mortgage",
    };
    navigate(routes[page]);
  };

  return (
    <nav className="w-full bg-white border-b border-gray-200">
      <div className="max-w-full px-6 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-8">
            <Link className="flex items-center gap-2" to="/">
              <svg
                width="36"
                height="36"
                xmlns="http://www.w3.org/2000/svg"
                className="rounded-lg"
              >
                <rect width="100%" height="100%" fill="black" />
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  className="w-6 h-6"
                  stroke="white"
                  strokeWidth="2"
                  x="6"
                  y="6"
                >
                  <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                  <polyline points="9 22 9 12 15 12 15 22" />
                </svg>
              </svg>
              <span className="text-xl font-semibold text-gray-900">
                HomeLinkr
              </span>
            </Link>

            <div className="hidden md:flex items-center gap-1">
              {["Buy", "Rent", "Mortgage", "Sell"].map((page) => (
                <button
                  key={page}
                  onClick={() => handleNavClick(page)}
                  className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                    activePage === page
                      ? "text-blue-600 bg-blue-50 hover:bg-blue-100"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  {page}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="relative hidden lg:block">
              <div className="flex items-center gap-2 bg-gray-100 rounded-lg px-4 py-2 w-72 border border-gray-200">
                <Search className="w-4 h-4 text-gray-500" />
                <input
                  type="text"
                  placeholder="Search Anything..."
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                  className="bg-transparent border-none outline-none text-sm text-gray-700 placeholder-gray-600 flex-1"
                />
                {searchValue && (
                  <button
                    onClick={() => setSearchValue("")}
                    className="hover:bg-gray-200 rounded p-0.5"
                  >
                    <X className="w-4 h-4 text-gray-500" />
                  </button>
                )}
              </div>
            </div>

            <button className="p-2 hover:bg-gray-100 rounded-full transition-colors hidden md:block">
              <MessageSquare className="w-5 h-5 text-gray-700" />
            </button>
            <button className="p-2 hover:bg-gray-100 rounded-full transition-colors hidden md:block">
              <Bell className="w-5 h-5 text-gray-700" />
            </button>

            <div className="hidden md:block w-px h-6 bg-gray-200"></div>

            <div className="relative" ref={profileRef}>
              {auth.user ? (
                <button
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  onBlur={handleBlur}
                  className="flex items-center gap-3 hover:bg-gray-50 rounded-lg pl-1 pr-3 py-1 transition-colors"
                >
                  <img
                    src={imgUrl}
                    alt={auth.user.name}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = defaultImgUrl;
                    }}
                    className="w-8 h-8 rounded-full object-cover"
                  />
                  <div className="text-left hidden lg:block">
                    <div className="text-sm font-medium text-gray-900 truncate max-w-[100px]">
                      {auth.user.name}
                    </div>
                  </div>
                  <ChevronDown
                    className={`w-4 h-4 text-gray-500 transition-transform ${
                      isProfileOpen ? "rotate-180" : "rotate-0"
                    }`}
                  />
                </button>
              ) : (
                <button
                  onClick={handleSignInClick}
                  className="border border-black px-4 py-2 text-sm font-medium rounded-lg hover:bg-black hover:text-white transition-colors"
                >
                  Sign in
                </button>
              )}

              {auth.user && isProfileOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
                  <button
                    onClick={handleLogout}
                    className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-gray-50 transition-colors"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
