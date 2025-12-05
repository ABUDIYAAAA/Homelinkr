import InfoBar from "../components/InfoBar";
import Properties from "../components/Properties";
import Sidebar from "../components/Sidebar";
import { useLocation } from "react-router-dom";

export default function Home() {
  const location = useLocation();

  // Determine filter based on current route
  const getPropertyFilter = () => {
    const path = location.pathname;
    if (path === "/buy") return { listingStatus: "mortgage" };
    if (path === "/rent") return { listingStatus: "rent" };
    return {}; // Show all properties for root path
  };

  const propertyFilter = getPropertyFilter();
  return (
    <div className="flex flex-1 overflow-hidden h-screen">
      <div className="w-80 bg-white shadow-sm shrink-0 overflow-y-auto">
        <Sidebar />
      </div>

      <div className="flex-1 overflow-hidden">
        <div className="p-4 h-full">
          <div className="grid grid-cols-1 lg:grid-cols-6 xl:gap-6 gap-4 h-full">
            <div className="lg:col-span-4 overflow-hidden">
              <div className="h-full overflow-y-auto properties-scroll pr-2">
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 pb-4">
                  <Properties filter={propertyFilter} />
                </div>
              </div>
            </div>

            {/* InfoBar Column: Increased from 1/4 to 2/6 (1/3) */}
            <div className="lg:col-span-2 overflow-hidden">
              <div className="sticky top-0 h-full max-h-[90vh] overflow-hidden">
                <div className="h-full overflow-y-auto">
                  <InfoBar />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
