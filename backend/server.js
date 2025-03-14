import dotenv from "dotenv";
import app from "./app.js";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import cors from "cors";
import authRoutes from "./routes/authRoutes.js";
import errorHandler from "./middleware/errorHandler.js";
import eventRoutes from "./routes/eventsRoutes.js";

// For Environment variables
dotenv.config();

// Middleware
app.use(cookieParser());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/events", eventRoutes);

// Error Handling
app.use(errorHandler);

// Loading environment variables
const PORT = Number(process.env.PORT) || 5000;
const MONGO_URI = process.env.MONGO_URI;

const startServer = async () => {
  try {
    if (!MONGO_URI) {
      throw new Error("MONGO_URI is not defined in environment variables.");
    }
    await mongoose.connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
};

startServer();

// Connecting to MongoDB
// mongoose.connect(MONGO_URI).then(() => {
//     console.log('Connected to MongoDB');
//     // Starting the Server
//     app.listen(PORT, () => {
//         console.log(`Server running on port ${PORT}`);
//     });
// }).catch((err) => {
//     console.log('Error connecting to MongoDB:', err);
// });
