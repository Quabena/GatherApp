import React, { createContext, useState /*useContext*/ } from "react";
import { loginUser } from "../services/api";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const login = async (credentials) => {
    try {
      const userData = await loginUser(credentials);
      setUser(userData);
    } catch (error) {
      console.log("Login failed!", error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, login }}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext };
