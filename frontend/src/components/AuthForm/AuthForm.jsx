import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../api/axios";

const AuthForm = ({ isLogin }) => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    name: "",
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const endpoint = isLogin ? "/auth/login" : "/auth/register";
      const { data } = await axiosInstance.post(endpoint, formData);

      // Redirect on success
      if (data.user) navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Authentication failed");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {!isLogin && (
        <input
          type="text"
          placeholder="Full Name"
          className="w-full p-2 border rounded"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        />
      )}
      <input
        type="email"
        placeholder="Email"
        className="w-full p-2 border rounded"
        value={formData.email}
        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
      />
      <input
        type="password"
        placeholder="Password"
        className="w-full p-2 border rounded"
        value={formData.password}
        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
      />
      {error && <p className="text-red-500">{error}</p>}
      <button
        type="submit"
        className="w-full p-2 bg-blue-500 text-white rounded"
      >
        {isLogin ? "Sign In" : "Sign Up"}
      </button>
    </form>
  );
};

export default AuthForm;
