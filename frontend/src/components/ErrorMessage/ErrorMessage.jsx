import React from "react";
import { FiAlertTriangle } from "react-icons/fi";

const ErrorMessage = ({ message }) => (
  <div className="flex justify-center items-center min-h-screen">
    <div className="bg-red-50 p-4 rounded-lg flex items-center gap-2">
      <FiAlertTriangle className="text-red-600" />
      <span className="text-red-600">{message}</span>
    </div>
  </div>
);

export default ErrorMessage;
