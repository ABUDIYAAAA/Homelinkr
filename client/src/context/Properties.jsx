"use client";
import { createContext, useContext, useState, useCallback } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "../lib/axios";

const BASE_API = import.meta.env.VITE_API_URL;
export const PropertyContext = createContext();

export function PropertyContextProvider({ children }) {
  const queryClient = useQueryClient();

  // Selected property state
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [selectedPropertyId, setSelectedPropertyId] = useState(null);

  // Filter state
  const [filters, setFilters] = useState({
    priceRange: { min: null, max: null },
    propertyTypes: [],
    amenities: [],
    areaRange: { min: null, max: null },
  });

  const updateFilters = useCallback((newFilters) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  }, []);

  const clearFilters = useCallback(() => {
    setFilters({
      priceRange: { min: null, max: null },
      propertyTypes: [],
      amenities: [],
      areaRange: { min: null, max: null },
    });
  }, []);
  const useListings = (routeFilters = {}) => {
    const query = useQuery({
      queryKey: ["listings", routeFilters.listingStatus || "all"], // Use 'all' as default
      queryFn: async () => {
        const params = new URLSearchParams();

        // Only add route-based filters (from URL) to API call
        if (routeFilters.listingStatus) {
          params.append("listingStatus", routeFilters.listingStatus);
        }

        const queryString = params.toString();
        const url = `${BASE_API}/listings${
          queryString ? `?${queryString}` : ""
        }`;
        const res = await axiosInstance.get(url);
        return res.data;
      },
      staleTime: 1000 * 60 * 2, // 2 minutes
      refetchOnWindowFocus: false,
    });

    // Client-side filtering based on sidebar filters
    const filteredData = query.data
      ? query.data.filter((property) => {
          // Price filtering
          if (
            filters.priceRange.min !== null ||
            filters.priceRange.max !== null
          ) {
            const propertyPrice = property.price || property.rentalPrice;
            if (!propertyPrice) return false;

            if (
              filters.priceRange.min !== null &&
              propertyPrice < filters.priceRange.min
            ) {
              return false;
            }
            if (
              filters.priceRange.max !== null &&
              propertyPrice > filters.priceRange.max
            ) {
              return false;
            }
          }

          // Property type filtering
          if (filters.propertyTypes.length > 0) {
            const typeMapping = {
              "Single Family Home": "house",
              Apartment: "flat",
              "Condo/Townhouse": "flat",
              Bungalow: "house",
            };
            const mappedTypes = filters.propertyTypes.map(
              (type) => typeMapping[type] || type.toLowerCase()
            );
            if (!mappedTypes.includes(property.type?.toLowerCase())) {
              return false;
            }
          }

          // Amenities filtering
          if (filters.amenities.length > 0) {
            const propertyAmenities = property.amenities || [];
            if (
              !filters.amenities.some((amenity) =>
                propertyAmenities.includes(amenity)
              )
            ) {
              return false;
            }
          }

          // Area filtering
          if (
            filters.areaRange.min !== null ||
            filters.areaRange.max !== null
          ) {
            const propertyArea = property.squareFeet;
            if (!propertyArea) return false;

            if (
              filters.areaRange.min !== null &&
              propertyArea < filters.areaRange.min
            ) {
              return false;
            }
            if (
              filters.areaRange.max !== null &&
              propertyArea > filters.areaRange.max
            ) {
              return false;
            }
          }

          return true;
        })
      : query.data;

    return {
      ...query,
      data: filteredData,
    };
  };

  // 🔹 Fetch single listing by ID
  const useListing = (id) =>
    useQuery({
      queryKey: ["listing", id],
      queryFn: async () => {
        const res = await axiosInstance.get(`${BASE_API}/listings/${id}`);
        return res.data;
      },
      enabled: !!id, // only fetch when id exists
      staleTime: 1000 * 60 * 5,
    });

  // 🔹 Create new listing (mutation)
  const useCreateListing = () =>
    useMutation({
      mutationFn: async (data) => {
        const res = await axiosInstance.post(`${BASE_API}/listings`, data);
        return res.data;
      },
      onSuccess: () => {
        // Invalidate and refetch all listings after successful creation
        queryClient.invalidateQueries(["listings"]);
      },
    });

  // Selected property functions
  const selectProperty = (property) => {
    setSelectedProperty(property);
    setSelectedPropertyId(property?.id);
  };

  const clearSelection = () => {
    setSelectedProperty(null);
    setSelectedPropertyId(null);
  };

  // Provide everything via context
  return (
    <PropertyContext.Provider
      value={{
        useListings,
        useListing,
        useCreateListing,
        selectedProperty,
        selectedPropertyId,
        selectProperty,
        clearSelection,
        filters,
        updateFilters,
        clearFilters,
      }}
    >
      {children}
    </PropertyContext.Provider>
  );
}

export const useProperty = () => {
  const ctx = useContext(PropertyContext);
  if (!ctx)
    throw new Error("useProperty must be used within PropertyContextProvider");
  return ctx;
};
