import axios from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

export const loginUser = async (credentials) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL})/auth/login`,
      credentials
    );
    return response.data;
  } catch (error) {
    throw new Error("Login Failed!");
  }
};
