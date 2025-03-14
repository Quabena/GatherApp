import React from "react";
import PropTypes from "prop-types";

const sizes = {
  default: "px-6 py-3",
  sm: "px-4 py-2 text-sm",
};

const Button = ({
  children,
  variant = "primary",
  size = "default",
  className = "",
  ...props
}) => {
  const baseStyles =
    "px-6 py-3 rounded-lg font-medium transition-colors duration-200 flex items-center justify-center gap-2";

  const variants = {
    primary: "bg-blue-600 text-white hover:bg-blue-700",
    secondary:
      "bg-white text-blue-600 border-2 border-blue-600 hover:bg-blue-50",
    outline: "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50",
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

Button.PropTypes = {
  variant: PropTypes.oneOf(["primary", "secondary"]),
  sizes: PropTypes.oneOf(["default", "sm"]),
  className: PropTypes.string,
  children: PropTypes.node.isRequired,
};

export default Button;
