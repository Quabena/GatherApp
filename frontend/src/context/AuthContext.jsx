import React, { createContext, useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { logoutUser } from "../services/api";
import axiosInstance from "../api/axios";

export const AuthContext = createContext();

/**
 * AuthProvider component for managing authentication state
 * @param {Object} props - Component props
 * @returns {JSX.Element} AuthProvider component
 */
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  /**
   * Handle API errors and authentication failures
   * @param {Error} error - Error object
   */
  const handleAuthError = useCallback(
    (error) => {
      if (error.response?.status === 401) {
        setUser(null);
        navigate("/auth", {
          state: {
            message: "Session expired. Please login again.",
            from: window.location.pathname,
          },
        });
      }
    },
    [navigate]
  );

  // Configure axios interceptor for handling auth errors
  useEffect(() => {
    const interceptor = axiosInstance.interceptors.response.use(
      (response) => response,
      (error) => {
        handleAuthError(error);
        return Promise.reject(error);
      }
    );

    return () => {
      axiosInstance.interceptors.response.eject(interceptor);
    };
  }, [handleAuthError]);

  // Check authentication status on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await axiosInstance.get("/auth/verify");
        setUser(response.data.user);
      } catch (error) {
        console.error("Auth check failed:", error);
        handleAuthError(error);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [handleAuthError]);

  /**
   * Handle user login
   * @param {Object} userData - User data from login response
   * @returns {Object} Login result
   */
  const login = async (userData) => {
    try {
      setLoading(true);
      const normalizedUser = {
        email: userData.email,
        name: userData.name || userData.email.split("@")[0],
        ...userData,
      };
      setUser(normalizedUser);
      return { success: true };
    } catch (error) {
      console.error("Login failed:", error);
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  /**
   * Handle user logout
   */
  const logout = async () => {
    try {
      await logoutUser();
      setUser(null);
      navigate("/auth");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
