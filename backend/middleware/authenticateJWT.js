import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { UnauthorizedError } from "../utils/errors.js";

const authenticateJWT = async (req, res, next) => {
  try {
    // Check if the accessToken cookie exists
    const accessToken = req.cookies.accessToken;
    if (!accessToken) {
      console.error("Access token missing in cookies");
      throw new UnauthorizedError("Authentication required!");
    }

    // Verify the token
    const decoded = jwt.verify(accessToken, process.env.JWT_ACCESS_SECRET);
    console.log("Decoded token:", decoded);

    // Find the user in the database
    const user = await User.findById(decoded.userId).select(
      "-password -refreshTokens"
    );
    if (!user) {
      console.error("User not found for ID:", decoded.userId);
      throw new UnauthorizedError("User not found");
    }

    // Attach the user to the request object
    req.user = user;
    next();
  } catch (error) {
    console.error("JWT verification error:", error);

    if (error.name === "TokenExpiredError") {
      throw new UnauthorizedError("Session expired");
    }
    if (error.name === "JsonWebTokenError") {
      throw new UnauthorizedError("Invalid token");
    }
    throw new UnauthorizedError("Authentication failed");
  }
};

export default authenticateJWT;
