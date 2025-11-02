import { createContext, useState, useContext, useEffect } from "react";
import axiosInstance from "../lib/axios";
export const AuthContext = createContext();
const BASE_API = import.meta.env.VITE_API_URL;
export function AuthContextProvider({ children }) {
  const [user, setUser] = useState();
  const [loading, setLoading] = useState();
  const [error, setError] = useState();
  const handleGoogleLogin = () => {
    window.location.href = `${BASE_API}/auth/google`;
  };
  const getMe = async () => {
    try {
      const response = await axiosInstance.get("/auth/me");
      if (response.data.data.user) {
        setUser(response.data.data.user);
      }
      return true;
    } catch (err) {
      setUser(null);
      return false;
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      await axiosInstance.post("/auth/logout");
      setUser(null);
      setError(null);
      setLoading(false);
      return true;
    } catch (err) {
      console.error("Logout error:", err);
      // Even if logout fails on server, clear user locally
      setUser(null);
      setError(null);
      setLoading(false);
      return false;
    }
  };

  const login = async ({ email, password }) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axiosInstance.post("/auth/login", {
        email,
        password,
      });
      if (response.data.data.user) {
        setUser(response.data.data.user);
        setLoading(false);
        return true;
      }
      setLoading(false);
      return false;
    } catch (err) {
      console.error("Login error:", err);

      // Extract proper error message
      let errorMessage = "Login failed.";

      if (err.response?.data?.message) {
        errorMessage = err.response.data.message;
      } else if (err.response?.data?.error) {
        errorMessage = err.response.data.error;
      } else if (err.response?.status === 401) {
        errorMessage = "Invalid email or password.";
      } else if (err.response?.status === 403) {
        errorMessage = "Account access restricted. Please try Google login.";
      } else if (err.response?.status >= 500) {
        errorMessage = "Server error. Please try again later.";
      } else if (err.message) {
        errorMessage = err.message;
      }

      setError(errorMessage);
      setUser(null);
      setLoading(false);
      return false;
    }
  };

  const signup = async ({ name, email, password }) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axiosInstance.post("/auth/signup", {
        name,
        email,
        password,
      });
      if (response.data.data.user) {
        setUser(response.data.data.user);
        setLoading(false);
        return true;
      }
      setLoading(false);
      return false;
    } catch (err) {
      console.error("Signup error:", err);

      // Extract proper error message
      let errorMessage = "Signup failed.";

      if (err.response?.data?.message) {
        errorMessage = err.response.data.message;
      } else if (err.response?.data?.error) {
        errorMessage = err.response.data.error;
      } else if (err.response?.status === 409) {
        errorMessage = "An account with this email already exists.";
      } else if (err.response?.status === 400) {
        errorMessage = "Please check your input and try again.";
      } else if (err.response?.status >= 500) {
        errorMessage = "Server error. Please try again later.";
      } else if (err.message) {
        errorMessage = err.message;
      }

      setError(errorMessage);
      setUser(null);
      setLoading(false);
      return false;
    }
  };

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        await getMe();
      } catch (error) {
        console.error("Failed to initialize auth:", error);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  return (
    <AuthContext.Provider
      value={{ handleGoogleLogin, user, error, loading, logout, login, signup }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
