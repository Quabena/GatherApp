import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { UnauthorizedError } from "../utils/errors.js";

/**
 * Middleware to authenticate JWT tokens and handle token refresh
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
const authenticateJWT = async (req, res, next) => {
  try {
    // Extract tokens from cookies
    const { accessToken, refreshToken } = req.cookies;

    // If no access token is present, user needs to authenticate
    if (!accessToken) {
      throw new UnauthorizedError("Authentication required");
    }

    try {
      // Attempt to verify the access token
      const decoded = jwt.verify(accessToken, process.env.JWT_ACCESS_SECRET);

      // Find and attach user to request
      const user = await User.findById(decoded.userId).select(
        "-password -refreshTokens"
      );
      if (!user) {
        throw new UnauthorizedError("User not found");
      }

      req.user = user;
      next();
    } catch (error) {
      // Handle expired access token
      if (error.name === "TokenExpiredError" && refreshToken) {
        try {
          // Verify refresh token
          const decoded = jwt.verify(
            refreshToken,
            process.env.JWT_REFRESH_SECRET
          );

          // Find user and validate refresh token
          const user = await User.findById(decoded.userId);
          if (!user || !user.refreshTokens.includes(refreshToken)) {
            throw new UnauthorizedError("Invalid refresh token");
          }

          // Generate new access token
          const newAccessToken = jwt.sign(
            { userId: user._id },
            process.env.JWT_ACCESS_SECRET,
            { expiresIn: "1h" } // Industry standard: 1 hour
          );

          // Set new access token in cookie
          res.cookie("accessToken", newAccessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 60 * 60 * 1000, // 1 hour
          });

          // Attach user to request and continue
          req.user = user;
          next();
        } catch (refreshError) {
          throw new UnauthorizedError("Session expired. Please login again.");
        }
      } else {
        throw error;
      }
    }
  } catch (error) {
    // Clear cookies on authentication failure
    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");

    // Handle specific error types
    if (error.name === "JsonWebTokenError") {
      throw new UnauthorizedError("Invalid token");
    }

    throw new UnauthorizedError(error.message || "Authentication failed");
  }
};

export default authenticateJWT;
