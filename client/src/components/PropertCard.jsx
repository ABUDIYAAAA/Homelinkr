import React, { useState } from "react";
import { MapPin, Star, Bookmark, Home, Building, MapIcon } from "lucide-react";
import { useProperty } from "../context/Properties";

export default function PropertyCard({ property, isBookmarked = false }) {
  // Destructure property fields from the database
  const {
    id,
    title,
    thumbnail,
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
  } = property || {};

  const { selectedPropertyId, selectProperty } = useProperty();
  const [bookmarked, setBookmarked] = useState(isBookmarked);

  // Check if this card is selected
  const isSelected = selectedPropertyId === id;

  // Determine the display price and whether it's a rental
  const isRental = listingStatus === "rent";
  const displayPrice = isRental ? rentalPrice : price;

  // Format the location display
  const locationDisplay =
    city && address
      ? `${address}, ${city}`
      : city || address || "Location not specified";

  // Get property type icon
  const getTypeIcon = () => {
    switch (type?.toLowerCase()) {
      case "house":
        return Home;
      case "flat":
      case "apartment":
        return Building;
      case "commercial":
        return Building;
      default:
        return Home;
    }
  };

  const TypeIcon = getTypeIcon();

  const handleCardClick = () => {
    selectProperty(property);
  };

  const handleBookmarkClick = (e) => {
    e.stopPropagation();
    setBookmarked(!bookmarked);
  };

  return (
    <div
      onClick={handleCardClick}
      className={`bg-white rounded-2xl overflow-hidden cursor-pointer transition-all duration-200 hover:shadow-lg ${
        isSelected ? "ring-2 ring-blue-600 shadow-lg" : "shadow-md"
      }`}
    >
      {/* Image Container */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={
            thumbnail ||
            "https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=600&h=400&fit=crop"
          }
          alt={title || "Property"}
          className="w-full h-full object-cover"
        />

        {/* Property Type Tag */}
        <div className="absolute top-3 left-3 bg-white rounded-full px-3 py-1 flex items-center gap-1 shadow-md">
          <TypeIcon className="w-3 h-3 text-blue-600" />
          <span className="text-xs font-medium text-gray-700 capitalize">
            {type || "Property"}
          </span>
        </div>

        {/* Listing Status Tag */}
        {listingStatus && (
          <div
            className={`absolute top-3 right-12 rounded-full px-2 py-1 text-xs font-medium shadow-md ${
              isRental
                ? "bg-green-100 text-green-800"
                : "bg-blue-100 text-blue-800"
            }`}
          >
            For {listingStatus === "rent" ? "Rent" : "Sale"}
          </div>
        )}

        {/* Bookmark Button */}
        <button
          onClick={handleBookmarkClick}
          className="absolute top-3 right-3 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-md hover:bg-gray-50 transition-colors"
        >
          <Bookmark
            className={`w-4 h-4 ${
              bookmarked ? "fill-blue-600 text-blue-600" : "text-gray-600"
            }`}
          />
        </button>
      </div>

      {/* Content Container */}
      <div className="p-4">
        {/* Title */}
        <h3 className="text-base font-semibold text-gray-900 mb-2 line-clamp-2">
          {title || "Property Listing"}
        </h3>

        {/* Location */}
        <div className="flex items-center gap-1.5 mb-3">
          <MapPin className="w-3.5 h-3.5 text-blue-600 shrink-0" />
          <span className="text-xs text-gray-600 line-clamp-1">
            {locationDisplay}
          </span>
        </div>

        {/* Property Details */}
        {(bedrooms || bathrooms || squareFeet) && (
          <div className="flex items-center gap-3 mb-3 text-xs text-gray-500">
            {bedrooms && (
              <span className="flex items-center gap-1">🛏️ {bedrooms} BR</span>
            )}
            {bathrooms && (
              <span className="flex items-center gap-1">🚿 {bathrooms} BA</span>
            )}
            {squareFeet && (
              <span className="flex items-center gap-1">
                📐 {squareFeet} sq ft
              </span>
            )}
          </div>
        )}

        {/* Price */}
        <div className="flex items-center justify-between">
          <div className="flex items-baseline gap-1">
            {displayPrice ? (
              <>
                <span className="text-xl font-bold text-gray-900">
                  ₹{displayPrice.toLocaleString()}
                </span>
                {isRental && (
                  <span className="text-sm text-gray-500">/month</span>
                )}
              </>
            ) : (
              <span className="text-lg font-medium text-gray-500">
                Price on request
              </span>
            )}
          </div>

          {furnishing && (
            <div className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
              {furnishing
                .replace("_", " ")
                .toLowerCase()
                .replace(/\b\w/g, (l) => l.toUpperCase())}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
