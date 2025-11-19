"use client";
import { createContext, useContext, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "../lib/axios";

const BASE_API = import.meta.env.VITE_API_URL;
export const PropertyContext = createContext();

export function PropertyContextProvider({ children }) {
  const queryClient = useQueryClient();

  // Selected property state
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [selectedPropertyId, setSelectedPropertyId] = useState(null);
  const useListings = () =>
    useQuery({
      queryKey: ["listings"],
      queryFn: async () => {
        const res = await axiosInstance.get(`${BASE_API}/listings`);
        return res.data;
      },
      staleTime: 1000 * 60 * 2, // 2 minutes
      refetchOnWindowFocus: false,
    });

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
