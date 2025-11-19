import { useState, useEffect, useCallback } from "react";
import axiosInstance from "../lib/axios";

// Custom hook for debounced address autocomplete using backend API
export const useAddressAutocomplete = (debounceDelay = 300) => {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Debounce function
  const debounce = useCallback((func, delay) => {
    let timeoutId;
    return (...args) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => func.apply(this, args), delay);
    };
  }, []);

  const fetchSuggestions = async (searchQuery) => {
    if (!searchQuery.trim() || searchQuery.length < 2) {
      setSuggestions([]);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      let latitude, longitude;
      if (navigator.geolocation) {
        try {
          const position = await new Promise((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(resolve, reject, {
              timeout: 3000,
              enableHighAccuracy: false,
            });
          });
          latitude = position.coords.latitude;
          longitude = position.coords.longitude;
        } catch (geoError) {}
      }

      const response = await axiosInstance.get("/utils/address/autocomplete", {
        params: {
          query: searchQuery.trim(),
          ...(latitude && longitude && { latitude, longitude }),
        },
        timeout: 8000,
      });

      setSuggestions(response?.data?.data);
    } catch (err) {
      console.error("Address autocomplete error:", err);

      // Don't show errors to user, just clear suggestions
      setSuggestions([]);

      // Only set error for authentication issues
      if (err.response?.status === 401) {
        setError("Please login to use address search");
      }
    } finally {
      setLoading(false);
    }
  };

  // Debounced fetch function
  const debouncedFetchSuggestions = useCallback(
    debounce(fetchSuggestions, debounceDelay),
    [debounceDelay]
  );

  // Effect to trigger API call when query changes
  useEffect(() => {
    if (query.length >= 2) {
      debouncedFetchSuggestions(query);
    } else {
      setSuggestions([]);
      setLoading(false);
      setError(null);
    }
  }, [query, debouncedFetchSuggestions]);

  // Function to update query
  const updateQuery = (newQuery) => {
    setQuery(newQuery);
  };

  // Function to clear suggestions
  const clearSuggestions = () => {
    setSuggestions([]);
  };

  // Function to get place details
  const getPlaceDetails = async (placeId) => {
    if (!placeId) return null;

    setLoading(true);
    setError(null);

    try {
      const response = await axiosInstance.get(
        `/utils/address/details/${placeId}`
      );

      return response.data.data || null;
    } catch (err) {
      console.error("Place details error:", err);
      setError("Failed to fetch place details");
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    query,
    suggestions,
    loading,
    error,
    updateQuery,
    clearSuggestions,
    getPlaceDetails,
  };
};
