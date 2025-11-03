// src/pages/Home.jsx

import InfoBar from "../components/InfoBar";
import PropertyCard from "../components/PropertCard";
import Sidebar from "../components/Sidebar";
import { useProperty } from "../context/Properties";

export default function Home() {
  const props = useProperty();
  const properties = props.props;

  return (
    <div className="flex flex-1 overflow-hidden h-screen">
      <div className="w-80 bg-white shadow-sm shrink-0 overflow-y-auto">
        <Sidebar />
      </div>

      <div className="flex-1 overflow-y-auto overflow-x-hidden">
        <div className="p-6 h-full">
          <div className="grid grid-cols-1 lg:grid-cols-6 xl:gap-8 gap-6 h-full">
            <div className="lg:col-span-4 overflow-y-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {properties.map((property, index) => (
                  <PropertyCard key={index} {...property} />
                ))}
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
