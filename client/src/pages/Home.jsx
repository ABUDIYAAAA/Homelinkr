import Navbar from "../components/Navbar";
import PropertyCard from "../components/PropertCard";
import Sidebar from "../components/Sidebar";

export default function Home() {
  const properties = [
    {
      image:
        "https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=600&h=400&fit=crop",
      title: "Dream House Reality",
      location: "Evergreen 14, Jakarta, Indonesia",
      price: "367.00",
      rating: "4.9",
    },
    {
      image:
        "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=600&h=400&fit=crop",
      title: "Modern Villa Paradise",
      location: "Sunset Boulevard, Bali, Indonesia",
      price: "425.00",
      rating: "4.8",
    },
    {
      image:
        "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=600&h=400&fit=crop",
      title: "Cozy Family Home",
      location: "Palm Street, Surabaya, Indonesia",
      price: "299.00",
      rating: "4.7",
    },
  ];
  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      {/* Navbar - Fixed height */}
      <div className="bg-white shadow-md">
        <Navbar />
      </div>

      {/* Main content area */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar - Fixed width with internal scroll */}
        <div className="w-80 bg-white shadow-sm shrink-0 overflow-y-auto">
          <Sidebar />
        </div>

        {/* Main Display Area */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-6">
            {/* Main Grid: Property List (Left) + Detail Panel (Right) */}
            <div className="grid grid-cols-1 lg:grid-cols-4 xl:gap-8 gap-6">
              {/* A. Property Listings Column (3/4 width on desktop) */}
              <div className="lg:col-span-3">
                {/* Card Grid: 3 columns of cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {properties.map((property, index) => (
                    <PropertyCard key={index} {...property} />
                  ))}
                </div>
              </div>

              {/* B. Detail Panel Column (1/4 width on desktop) */}
              <div className="lg:col-span-1">
                <div className="sticky top-6 bg-blue-500 text-white p-4 rounded-lg shadow-xl h-96">
                  <h3 className="font-bold mb-2">3. Detail Panel / Map</h3>
                  <p className="text-sm">
                    Property Overview, Map, and Contact info.
                  </p>
                  <p className="text-sm mt-2">(This section is **sticky**.)</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
