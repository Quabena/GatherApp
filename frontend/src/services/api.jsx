import axiosInstance from "../api/axios";

export const loginUser = async (credentials) => {
  try {
    const response = await axiosInstance.post("/auth/login", credentials);
    return response.data;
  } catch (error) {
    throw new Error(`Login Failed! Reason: ${error.message}`);
  }
};
