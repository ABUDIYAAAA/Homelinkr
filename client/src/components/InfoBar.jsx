import React, { useState } from "react";
import { MapPin, Bed, Bath, Home, Maximize, Car } from "lucide-react";

export default function InfoBar() {
  const [activeTab, setActiveTab] = useState("overview");

  return (
    <div className="max-w-lg mx-auto bg-white rounded-3xl shadow-lg overflow-hidden">
      {/* Image Gallery */}
      <div className="relative">
        <div className="grid grid-cols-2 gap-2 p-4">
          <div className="col-span-2 row-span-2">
            <img
              src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80"
              alt="Midnight Ridge Villa exterior"
              className="w-full h-64 object-cover rounded-2xl"
            />
          </div>
          <div>
            <img
              src="https://images.unsplash.com/photo-1616594039964-ae9021a400a0?w=400&q=80"
              alt="Bedroom"
              className="w-full h-28 object-cover rounded-2xl"
            />
          </div>
          <div>
            <img
              src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=400&q=80"
              alt="Living room"
              className="w-full h-28 object-cover rounded-2xl"
            />
          </div>
        </div>
      </div>

      {/* Property Info - Title, Location, and Price in one line */}
      <div className="px-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Midnight Ridge Villa
        </h1>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center text-blue-600">
            <MapPin className="w-4 h-4 mr-1" />
            <span className="text-sm">440 Thamrin Jakarta, Indonesia</span>
          </div>
          <div className="text-right">
            <span className="text-3xl font-bold text-gray-900">$ 452.00</span>
            <span className="text-gray-500">/month</span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200 px-6">
        <button
          onClick={() => setActiveTab("overview")}
          className={`flex-1 py-3 text-sm font-medium transition-colors relative ${
            activeTab === "overview"
              ? "text-blue-600"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          Overview
          {activeTab === "overview" && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600"></div>
          )}
        </button>
        <button
          onClick={() => setActiveTab("reviews")}
          className={`flex-1 py-3 text-sm font-medium transition-colors relative ${
            activeTab === "reviews"
              ? "text-blue-600"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          Reviews
          {activeTab === "reviews" && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600"></div>
          )}
        </button>
        <button
          onClick={() => setActiveTab("about")}
          className={`flex-1 py-3 text-sm font-medium transition-colors relative ${
            activeTab === "about"
              ? "text-blue-600"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          About
          {activeTab === "about" && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600"></div>
          )}
        </button>
      </div>

      {/* Tab Content */}
      <div className="px-6 py-5">
        {activeTab === "overview" && (
          <>
            <h3 className="text-sm font-semibold text-gray-900 mb-3">
              Description :
            </h3>
            <p className="text-sm text-gray-600 mb-5 leading-relaxed">
              Welcome to Midnight Ridge Villa 🏡🌲 Experience a peaceful escape
              at Midnight Ridge Villa, a modern retreat set on a quiet hillside
              with stunning views of valleys and starry nights.
            </p>

            {/* Amenities Grid */}
            <div className="grid grid-cols-3 gap-4 mb-5">
              <div className="flex items-center gap-2 text-sm text-gray-700">
                <Home className="w-5 h-5 text-gray-400" />
                <span>6 Rooms</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-700">
                <Bed className="w-5 h-5 text-gray-400" />
                <span>4 Beds</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-700">
                <Bath className="w-5 h-5 text-gray-400" />
                <span>2 Baths</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-700">
                <Home className="w-5 h-5 text-gray-400" />
                <span>2 Kitchen</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-700">
                <Maximize className="w-5 h-5 text-gray-400" />
                <span>2,820 sqft</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-700">
                <Car className="w-5 h-5 text-gray-400" />
                <span>1 Garage</span>
              </div>
            </div>
          </>
        )}

        {activeTab === "reviews" && (
          <div className="space-y-4">
            <div className="border-b border-gray-100 pb-4">
              <div className="flex items-center mb-2">
                <div className="flex text-yellow-400 text-sm mb-1">
                  {"★★★★★".split("").map((star, i) => (
                    <span key={i}>{star}</span>
                  ))}
                </div>
                <span className="ml-2 text-sm text-gray-600">5.0</span>
              </div>
              <p className="text-sm text-gray-700 font-medium mb-1">
                Sarah Johnson
              </p>
              <p className="text-xs text-gray-500 mb-2">2 weeks ago</p>
              <p className="text-sm text-gray-600">
                Absolutely stunning property! The views are breathtaking and the
                villa exceeded all our expectations. Perfect retreat for
                families.
              </p>
            </div>
            <div className="border-b border-gray-100 pb-4">
              <div className="flex items-center mb-2">
                <div className="flex text-yellow-400 text-sm mb-1">
                  {"★★★★☆".split("").map((star, i) => (
                    <span key={i}>{star}</span>
                  ))}
                </div>
                <span className="ml-2 text-sm text-gray-600">4.0</span>
              </div>
              <p className="text-sm text-gray-700 font-medium mb-1">
                Michael Chen
              </p>
              <p className="text-xs text-gray-500 mb-2">1 month ago</p>
              <p className="text-sm text-gray-600">
                Great location and very spacious. The modern amenities were
                excellent. Only minor issue was the distance from the city
                center.
              </p>
            </div>
            <div>
              <div className="flex items-center mb-2">
                <div className="flex text-yellow-400 text-sm mb-1">
                  {"★★★★★".split("").map((star, i) => (
                    <span key={i}>{star}</span>
                  ))}
                </div>
                <span className="ml-2 text-sm text-gray-600">5.0</span>
              </div>
              <p className="text-sm text-gray-700 font-medium mb-1">
                Emily Rodriguez
              </p>
              <p className="text-xs text-gray-500 mb-2">1 month ago</p>
              <p className="text-sm text-gray-600">
                Perfect for a peaceful getaway. The starry nights mentioned in
                the description are real! Highly recommend for nature lovers.
              </p>
            </div>
          </div>
        )}

        {activeTab === "about" && (
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-semibold text-gray-900 mb-2">
                Property Details
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Midnight Ridge Villa is a contemporary hillside retreat offering
                the perfect blend of modern comfort and natural beauty. Built in
                2020, this property features high-end finishes throughout and
                smart home technology for your convenience.
              </p>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-900 mb-2">
                Location Highlights
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Situated in the prestigious Thamrin area of Jakarta, this villa
                offers quick access to shopping, dining, and entertainment while
                maintaining a serene atmosphere away from the city bustle.
              </p>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-900 mb-2">
                Included Amenities
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                High-speed WiFi, air conditioning, fully equipped kitchens,
                premium bedding, smart TV in every room, private parking, 24/7
                security, and landscaped gardens.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3 px-6 pb-5">
        <button className="flex-1 py-3 text-blue-600 bg-blue-50 rounded-full font-medium hover:bg-blue-100 transition-colors">
          Contact Agent
        </button>
        <button className="flex-1 py-3 text-white bg-blue-600 rounded-full font-medium hover:bg-blue-700 transition-colors">
          Order Now
        </button>
      </div>

      {/* Map Placeholder */}
      <div className="h-64 bg-gray-100 relative">
        {/* Empty div for map - ready for integration */}
        <div className="absolute inset-0 flex items-center justify-center text-gray-400 text-sm">
          Map placeholder
        </div>
      </div>
    </div>
  );
}
