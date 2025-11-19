import React, { useState } from "react";
import {
  MapPin,
  Bed,
  Bath,
  Home,
  Maximize,
  Car,
  Building,
  Users,
} from "lucide-react";
import { useProperty } from "../context/Properties";

export default function InfoBar() {
  const [activeTab, setActiveTab] = useState("overview");
  const { selectedProperty, selectedPropertyId, useListing } = useProperty();

  // Fetch detailed property data if we have a selected ID
  const {
    data: detailedProperty,
    isLoading,
    error,
  } = useListing(selectedPropertyId);

  // Use detailed property data if available, otherwise fall back to selected property
  const property = detailedProperty || selectedProperty;

  if (!property) {
    return (
      <div
        className="max-w-lg mx-auto bg-white rounded-3xl shadow-lg overflow-hidden"
        style={{ height: "900px" }}
      >
        <div className="flex items-center justify-center h-full p-8">
          <div className="text-center">
            <Home className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-600 mb-2">
              No Property Selected
            </h3>
            <p className="text-gray-500">
              Click on a property card to view details
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div
        className="max-w-lg mx-auto bg-white rounded-3xl shadow-lg overflow-hidden"
        style={{ height: "900px" }}
      >
        <div className="flex items-center justify-center h-full p-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-500">Loading property details...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div
        className="max-w-lg mx-auto bg-white rounded-3xl shadow-lg overflow-hidden"
        style={{ height: "900px" }}
      >
        <div className="flex items-center justify-center h-full p-8">
          <div className="text-center">
            <div className="text-red-500 mb-2">⚠️</div>
            <p className="text-gray-600">Error loading property details</p>
          </div>
        </div>
      </div>
    );
  }

  const {
    title,
    description,
    thumbnail,
    images = [],
    price,
    rentalPrice,
    listingStatus,
    type,
    city,
    address,
    bedrooms,
    bathrooms,
    squareFeet,
    furnishing,
    amenities = [],
    user,
  } = property;

  const isRental = listingStatus === "rent";
  const displayPrice = isRental ? rentalPrice : price;
  const locationDisplay =
    city && address
      ? `${address}, ${city}`
      : city || address || "Location not specified";

  // Prepare images for display
  const allImages = [thumbnail, ...images].filter(Boolean);
  const displayImages =
    allImages.length > 0
      ? allImages
      : [
          "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80",
        ];

  return (
    <div
      className="max-w-lg mx-auto bg-white rounded-3xl shadow-lg overflow-hidden"
      style={{ height: "900px" }}
    >
      {/* Image Gallery */}
      <div className="relative">
        <div className="grid grid-cols-2 gap-2 p-4">
          <div className="col-span-2 row-span-2">
            <img
              src={displayImages[0]}
              alt={title || "Property"}
              className="w-full h-64 object-cover rounded-2xl"
            />
          </div>
          {displayImages.length > 1 && (
            <>
              <div>
                <img
                  src={displayImages[1] || displayImages[0]}
                  alt="Property view 1"
                  className="w-full h-28 object-cover rounded-2xl"
                />
              </div>
              <div>
                <img
                  src={displayImages[2] || displayImages[0]}
                  alt="Property view 2"
                  className="w-full h-28 object-cover rounded-2xl"
                />
              </div>
            </>
          )}
        </div>
      </div>

      {/* Property Info - Title, Location, and Price */}
      <div className="px-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          {title || "Property Listing"}
        </h1>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center text-blue-600 flex-1 mr-4">
            <MapPin className="w-4 h-4 mr-1 shrink-0" />
            <span className="text-sm truncate">{locationDisplay}</span>
          </div>
          <div className="text-right">
            {displayPrice ? (
              <>
                <span className="text-3xl font-bold text-gray-900">
                  ₹{displayPrice.toLocaleString()}
                </span>
                {isRental && <span className="text-gray-500">/month</span>}
              </>
            ) : (
              <span className="text-lg font-medium text-gray-500">
                Price on request
              </span>
            )}
          </div>
        </div>

        {/* Property Type & Status */}
        <div className="flex items-center gap-2 mb-4">
          <div className="flex items-center gap-1 bg-blue-50 text-blue-700 px-2 py-1 rounded-full text-xs">
            {type === "house" ? (
              <Home className="w-3 h-3" />
            ) : (
              <Building className="w-3 h-3" />
            )}
            <span className="capitalize">{type || "Property"}</span>
          </div>
          {listingStatus && (
            <div
              className={`px-2 py-1 rounded-full text-xs font-medium ${
                isRental
                  ? "bg-green-50 text-green-700"
                  : "bg-orange-50 text-orange-700"
              }`}
            >
              For {listingStatus === "rent" ? "Rent" : "Sale"}
            </div>
          )}
          {furnishing && (
            <div className="bg-gray-50 text-gray-600 px-2 py-1 rounded-full text-xs">
              {furnishing
                .replace("_", " ")
                .toLowerCase()
                .replace(/\b\w/g, (l) => l.toUpperCase())}
            </div>
          )}
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
            {description && (
              <>
                <h3 className="text-sm font-semibold text-gray-900 mb-3">
                  Description :
                </h3>
                <p className="text-sm text-gray-600 mb-5 leading-relaxed">
                  {description}
                </p>
              </>
            )}

            {/* Property Details Grid */}
            <div className="grid grid-cols-3 gap-4 mb-5">
              {bedrooms && (
                <div className="flex items-center gap-2 text-sm text-gray-700">
                  <Bed className="w-5 h-5 text-gray-400" />
                  <span>
                    {bedrooms} Bed{bedrooms !== 1 ? "s" : ""}
                  </span>
                </div>
              )}
              {bathrooms && (
                <div className="flex items-center gap-2 text-sm text-gray-700">
                  <Bath className="w-5 h-5 text-gray-400" />
                  <span>
                    {bathrooms} Bath{bathrooms !== 1 ? "s" : ""}
                  </span>
                </div>
              )}
              {squareFeet && (
                <div className="flex items-center gap-2 text-sm text-gray-700">
                  <Maximize className="w-5 h-5 text-gray-400" />
                  <span>{squareFeet.toLocaleString()} sqft</span>
                </div>
              )}
              {type && (
                <div className="flex items-center gap-2 text-sm text-gray-700">
                  {type === "house" ? (
                    <Home className="w-5 h-5 text-gray-400" />
                  ) : (
                    <Building className="w-5 h-5 text-gray-400" />
                  )}
                  <span className="capitalize">{type}</span>
                </div>
              )}
            </div>

            {/* Amenities */}
            {amenities.length > 0 && (
              <>
                <h3 className="text-sm font-semibold text-gray-900 mb-3">
                  Amenities :
                </h3>
                <div className="flex flex-wrap gap-2 mb-5">
                  {amenities.map((amenity, index) => (
                    <span
                      key={index}
                      className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-xs"
                    >
                      {amenity}
                    </span>
                  ))}
                </div>
              </>
            )}
          </>
        )}

        {activeTab === "about" && (
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-semibold text-gray-900 mb-2">
                Property Details
              </h3>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="text-gray-600">
                  <span className="font-medium">Type:</span>{" "}
                  {type ? type.charAt(0).toUpperCase() + type.slice(1) : "N/A"}
                </div>
                <div className="text-gray-600">
                  <span className="font-medium">Status:</span>{" "}
                  {listingStatus
                    ? `For ${listingStatus === "rent" ? "Rent" : "Sale"}`
                    : "N/A"}
                </div>
                {squareFeet && (
                  <div className="text-gray-600">
                    <span className="font-medium">Size:</span>{" "}
                    {squareFeet.toLocaleString()} sq ft
                  </div>
                )}
                {furnishing && (
                  <div className="text-gray-600">
                    <span className="font-medium">Furnishing:</span>{" "}
                    {furnishing
                      .replace("_", " ")
                      .toLowerCase()
                      .replace(/\b\w/g, (l) => l.toUpperCase())}
                  </div>
                )}
              </div>
            </div>

            {user && (
              <div>
                <h3 className="text-sm font-semibold text-gray-900 mb-2">
                  Listed by
                </h3>
                <div className="flex items-center gap-3">
                  {user.image ? (
                    <img
                      src={user.image}
                      alt={user.name}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                      <Users className="w-5 h-5 text-blue-600" />
                    </div>
                  )}
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {user.name || "Property Owner"}
                    </p>
                    {user.email && (
                      <p className="text-xs text-gray-500">{user.email}</p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {amenities.length > 0 && (
              <div>
                <h3 className="text-sm font-semibold text-gray-900 mb-2">
                  Available Amenities
                </h3>
                <div className="text-sm text-gray-600 leading-relaxed">
                  {amenities.join(", ")}
                </div>
              </div>
            )}
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
