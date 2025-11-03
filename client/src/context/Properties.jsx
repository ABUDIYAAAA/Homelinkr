import { useState, createContext, useContext, useEffect } from "react";

import axiosInstance from "../lib/axios";
export const PropertyContext = createContext();
const BASE_API = import.meta.env.VITE_API_URL;

export function PropertyContextProvider({ children }) {
  const [props, setProps] = useState([]);
  const [loading, setLoading] = useState();
  const [error, setError] = useState();
  const fetchedProps = [
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
  useEffect(() => {
    setProps([...fetchedProps]);
  }, []);

  return (
    <PropertyContext.Provider value={{ props, error, loading }}>
      {children}
    </PropertyContext.Provider>
  );
}

export const useProperty = () => {
  const ctx = useContext(PropertyContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
