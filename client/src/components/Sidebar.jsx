import React, { useState, useEffect } from "react";
import {
  MapPin,
  DollarSign,
  Maximize2,
  Home,
  Layers,
  X,
  IndianRupee,
} from "lucide-react";
import { useProperty } from "../context/Properties";

export default function Sidebar() {
  const { filters, updateFilters, clearFilters } = useProperty();

  const [selectedPriceRange, setSelectedPriceRange] = useState("All");
  const [minPrice, setMinPrice] = useState(10);
  const [maxPrice, setMaxPrice] = useState(50);
  const [minArea, setMinArea] = useState("");
  const [maxArea, setMaxArea] = useState("");
  const [selectedPropertyTypes, setSelectedPropertyTypes] = useState([]);
  const [selectedAmenities, setSelectedAmenities] = useState([]);

  // Update context filters when local state changes
  useEffect(() => {
    const newFilters = {
      priceRange: {
        min:
          selectedPriceRange === "Custom"
            ? minPrice * 1000
            : getPriceRangeValues(selectedPriceRange).min,
        max:
          selectedPriceRange === "Custom"
            ? maxPrice * 1000
            : getPriceRangeValues(selectedPriceRange).max,
      },
      propertyTypes: selectedPropertyTypes,
      amenities: selectedAmenities,
      areaRange: {
        min: minArea ? parseInt(minArea) : null,
        max: maxArea ? parseInt(maxArea) : null,
      },
    };
    updateFilters(newFilters);
  }, [
    selectedPriceRange,
    minPrice,
    maxPrice,
    minArea,
    maxArea,
    selectedPropertyTypes,
    selectedAmenities,
  ]);

  const getPriceRangeValues = (range) => {
    switch (range) {
      case "All":
        return { min: null, max: null };
      case "Under $1,000":
        return { min: null, max: 100000 };
      case "$1,000 - $15,000":
        return { min: 100001, max: 1500000 };
      case "More Than $15,000":
        return { min: 1500001, max: null };
      default:
        return { min: null, max: null };
    }
  };

  const handlePropertyTypeToggle = (type) => {
    if (selectedPropertyTypes.includes(type)) {
      setSelectedPropertyTypes(selectedPropertyTypes.filter((t) => t !== type));
    } else {
      setSelectedPropertyTypes([...selectedPropertyTypes, type]);
    }
  };

  const handleAmenityToggle = (amenity) => {
    if (selectedAmenities.includes(amenity)) {
      setSelectedAmenities(selectedAmenities.filter((a) => a !== amenity));
    } else {
      setSelectedAmenities([...selectedAmenities, amenity]);
    }
  };

  const clearAllFilters = () => {
    setSelectedPriceRange("All");
    setMinPrice(10);
    setMaxPrice(50);
    setMinArea("");
    setMaxArea("");
    setSelectedPropertyTypes([]);
    setSelectedAmenities([]);
    clearFilters(); // Clear context filters
  };

  const clearPriceRange = () => {
    setSelectedPriceRange("All");
    setMinPrice(10);
    setMaxPrice(50);
  };
  const clearLandArea = () => {
    setMinArea("");
    setMaxArea("");
  };
  const clearPropertyType = () => setSelectedPropertyTypes([]);
  const clearAmenities = () => setSelectedAmenities([]);

  return (
    <div className="w-76 bg-white p-6 overflow-y-auto">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-gray-900">Custom Filter</h2>
      </div>

      <div className="mb-6">
        <div className="flex items-center justify-between bg-gray-50 rounded-lg px-3 py-2.5 mb-3">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-700">
              Price Range
            </span>
          </div>
          <button
            onClick={clearPriceRange}
            className="text-gray-500 hover:text-gray-700"
          ></button>
        </div>
        <div className="space-y-2 pl-1">
          <label className="flex items-center gap-2 cursor-pointer group">
            <input
              type="radio"
              name="priceRange"
              checked={selectedPriceRange === "All"}
              onChange={() => setSelectedPriceRange("All")}
              className="w-4 h-4 text-blue-600 focus:ring-2 focus:ring-blue-500"
            />
            <span className="text-sm text-gray-700 group-hover:text-gray-900">
              All Prices
            </span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer group">
            <input
              type="radio"
              name="priceRange"
              checked={selectedPriceRange === "Under $1,000"}
              onChange={() => setSelectedPriceRange("Under $1,000")}
              className="w-4 h-4 text-blue-600 focus:ring-2 focus:ring-blue-500"
            />
            <span className="text-sm text-gray-700 group-hover:text-gray-900">
              Under ₹1,00,000
            </span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer group">
            <input
              type="radio"
              name="priceRange"
              checked={selectedPriceRange === "$1,000 - $15,000"}
              onChange={() => setSelectedPriceRange("$1,000 - $15,000")}
              className="w-4 h-4 text-blue-600 focus:ring-2 focus:ring-blue-500"
            />
            <span className="text-sm text-gray-700 group-hover:text-gray-900">
              ₹1,00,000 - ₹15,00,000
            </span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer group">
            <input
              type="radio"
              name="priceRange"
              checked={selectedPriceRange === "More Than $15,000"}
              onChange={() => setSelectedPriceRange("More Than $15,000")}
              className="w-4 h-4 text-blue-600 focus:ring-2 focus:ring-blue-500"
            />
            <span className="text-sm text-gray-700 group-hover:text-gray-900">
              More Than ₹15,00,000
            </span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer group">
            <input
              type="radio"
              name="priceRange"
              checked={selectedPriceRange === "Custom"}
              onChange={() => setSelectedPriceRange("Custom")}
              className="w-4 h-4 text-blue-600 focus:ring-2 focus:ring-blue-500"
            />
            <span className="text-sm text-gray-700 group-hover:text-gray-900">
              Custom
            </span>
          </label>

          {selectedPriceRange === "Custom" && (
            <div className="mt-4 pt-2">
              <div className="flex items-center justify-between text-xs text-gray-600 mb-2 px-1">
                <span>₹{minPrice}K</span>
                <span>₹{maxPrice}K</span>
              </div>
              <div className="relative px-1">
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={minPrice}
                  onChange={(e) =>
                    setMinPrice(Math.min(Number(e.target.value), maxPrice - 1))
                  }
                  className="absolute w-full h-1 bg-transparent appearance-none pointer-events-none z-20"
                  style={{
                    WebkitAppearance: "none",
                  }}
                />
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={maxPrice}
                  onChange={(e) =>
                    setMaxPrice(Math.max(Number(e.target.value), minPrice + 1))
                  }
                  className="absolute w-full h-1 bg-transparent appearance-none pointer-events-none z-20"
                  style={{
                    WebkitAppearance: "none",
                  }}
                />
                <div className="relative h-1 bg-gray-200 rounded-full">
                  <div
                    className="absolute h-1 bg-blue-600 rounded-full"
                    style={{
                      left: `${minPrice}%`,
                      right: `${100 - maxPrice}%`,
                    }}
                  />
                </div>
                <style jsx>{`
                  input[type="range"]::-webkit-slider-thumb {
                    appearance: none;
                    width: 14px;
                    height: 14px;
                    border-radius: 50%;
                    background: #2563eb;
                    cursor: pointer;
                    pointer-events: auto;
                    border: 2px solid white;
                    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
                  }
                  input[type="range"]::-moz-range-thumb {
                    width: 14px;
                    height: 14px;
                    border-radius: 50%;
                    background: #2563eb;
                    cursor: pointer;
                    pointer-events: auto;
                    border: 2px solid white;
                    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
                  }
                `}</style>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="mb-6">
        <div className="flex items-center justify-between bg-gray-50 rounded-lg px-3 py-2.5 mb-3">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-700">
              Type Of Place
            </span>
          </div>
          <button
            onClick={clearPropertyType}
            className="text-gray-500 hover:text-gray-700"
          ></button>
        </div>
        <div className="space-y-2 pl-1">
          <label className="flex items-center gap-2 cursor-pointer group">
            <input
              type="checkbox"
              checked={selectedPropertyTypes.includes("Single Family Home")}
              onChange={() => handlePropertyTypeToggle("Single Family Home")}
              className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-2 focus:ring-blue-500"
            />
            <span className="text-sm text-gray-700 group-hover:text-gray-900">
              Single Family Home
            </span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer group">
            <input
              type="checkbox"
              checked={selectedPropertyTypes.includes("Condo/Townhouse")}
              onChange={() => handlePropertyTypeToggle("Condo/Townhouse")}
              className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-2 focus:ring-blue-500"
            />
            <span className="text-sm text-gray-700 group-hover:text-gray-900">
              Condo/Townhouse
            </span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer group">
            <input
              type="checkbox"
              checked={selectedPropertyTypes.includes("Apartment")}
              onChange={() => handlePropertyTypeToggle("Apartment")}
              className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-2 focus:ring-blue-500"
            />
            <span className="text-sm text-gray-700 group-hover:text-gray-900">
              Apartment
            </span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer group">
            <input
              type="checkbox"
              checked={selectedPropertyTypes.includes("Bungalow")}
              onChange={() => handlePropertyTypeToggle("Bungalow")}
              className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-2 focus:ring-blue-500"
            />
            <span className="text-sm text-gray-700 group-hover:text-gray-900">
              Bungalow
            </span>
          </label>
        </div>
      </div>

      {/* Land Area Filter */}
      <div className="mb-6">
        <div className="flex items-center justify-between bg-gray-50 rounded-lg px-3 py-2.5 mb-3">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-700">Land Area</span>
          </div>
          <button
            onClick={clearLandArea}
            className="text-gray-500 hover:text-gray-700"
          ></button>
        </div>
        <div className="grid grid-cols-2 gap-2 pl-1">
          <div>
            <label className="block text-xs text-gray-600 mb-1">
              Min (sq ft)
            </label>
            <input
              type="number"
              value={minArea}
              onChange={(e) => setMinArea(e.target.value)}
              placeholder="Min area"
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              min={1}
            />
          </div>
          <div>
            <label className="block text-xs text-gray-600 mb-1">
              Max (sq ft)
            </label>
            <input
              type="number"
              value={maxArea}
              onChange={(e) => setMaxArea(e.target.value)}
              placeholder="Max area"
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              min={1}
            />
          </div>
        </div>
      </div>

      {/* Amenities Filter */}
      <div className="mb-6">
        <div className="flex items-center justify-between bg-gray-50 rounded-lg px-3 py-2.5 mb-3">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-700">Amenities</span>
          </div>
          <button
            onClick={clearAmenities}
            className="text-gray-500 hover:text-gray-700"
          ></button>
        </div>
        <div className="flex flex-wrap gap-2 pl-1">
          <button
            onClick={() => handleAmenityToggle("garden")}
            className={`px-4 py-2 text-sm font-medium rounded-full transition-colors ${
              selectedAmenities.includes("garden")
                ? "bg-blue-600 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            Garden
          </button>
          <button
            onClick={() => handleAmenityToggle("gym")}
            className={`px-4 py-2 text-sm font-medium rounded-full transition-colors ${
              selectedAmenities.includes("gym")
                ? "bg-blue-600 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            Gym
          </button>
          <button
            onClick={() => handleAmenityToggle("parking")}
            className={`px-4 py-2 text-sm font-medium rounded-full transition-colors ${
              selectedAmenities.includes("parking")
                ? "bg-blue-600 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            Parking
          </button>
          <button
            onClick={() => handleAmenityToggle("pool")}
            className={`px-4 py-2 text-sm font-medium rounded-full transition-colors ${
              selectedAmenities.includes("pool")
                ? "bg-blue-600 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            Pool
          </button>
          <button
            onClick={() => handleAmenityToggle("security")}
            className={`px-4 py-2 text-sm font-medium rounded-full transition-colors ${
              selectedAmenities.includes("security")
                ? "bg-blue-600 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            Security
          </button>
        </div>
      </div>
    </div>
  );
}
