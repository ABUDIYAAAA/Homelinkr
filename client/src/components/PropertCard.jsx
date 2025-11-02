import React, { useState } from "react";
import { MapPin, Star, Bookmark } from "lucide-react";

export default function PropertyCard({
  image,
  title,
  location,
  price,
  rating,
  isBookmarked = false,
  onClick,
}) {
  const [selected, setSelected] = useState(false);
  const [bookmarked, setBookmarked] = useState(isBookmarked);

  const handleCardClick = () => {
    setSelected(!selected);
    if (onClick) onClick();
  };

  const handleBookmarkClick = (e) => {
    e.stopPropagation();
    setBookmarked(!bookmarked);
  };

  return (
    <div
      onClick={handleCardClick}
      className={`bg-white rounded-2xl overflow-hidden cursor-pointer transition-all duration-200 hover:shadow-lg ${
        selected ? "ring-2 ring-blue-600 shadow-lg" : "shadow-md"
      }`}
    >
      {/* Image Container */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={
            image ||
            "https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=600&h=400&fit=crop"
          }
          alt={title}
          className="w-full h-full object-cover"
        />

        {/* Home Tag */}
        <div className="absolute top-3 left-3 bg-white rounded-full px-3 py-1 flex items-center gap-1 shadow-md">
          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
          <span className="text-xs font-medium text-gray-700">Home</span>
        </div>

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
        <h3 className="text-base font-semibold text-gray-900 mb-2 line-clamp-1">
          {title || "Dream House Reality"}
        </h3>

        {/* Location */}
        <div className="flex items-center gap-1.5 mb-3">
          <MapPin className="w-3.5 h-3.5 text-blue-600 shrink-0" />
          <span className="text-xs text-gray-600 line-clamp-1">
            {location || "Evergreen 14, Jakarta, Indonesia"}
          </span>
        </div>

        {/* Price and Rating */}
        <div className="flex items-center justify-between">
          {/* Price */}
          <div className="flex items-baseline gap-1">
            <span className="text-xl font-bold text-gray-900">
              ${price || "367.00"}
            </span>
            <span className="text-sm text-gray-500">/month</span>
          </div>

          {/* Rating */}
          <div className="flex items-center gap-1 bg-yellow-50 px-2 py-1 rounded-lg">
            <Star className="w-3.5 h-3.5 text-yellow-500 fill-yellow-500" />
            <span className="text-sm font-medium text-gray-900">
              {rating || "4.9"}/5
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
