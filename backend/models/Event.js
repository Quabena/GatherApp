import mongoose from "mongoose";

const eventSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required!"],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Description is required!"],
      trim: true,
    },
    date: {
      type: Date,
      required: [true, "Event date is required!"],
    },
    location: {
      type: String,
      required: [true, "Location is required!"],
    },
    coordinates: {
      type: {
        type: String,
        default: "Point",
        enum: ["Point"],
      },
      coordinates: [Number], // (Longitude and latitude)
    },
    category: {
      type: String,
      required: [true, "Category is required!"],
      enum: [
        "Music",
        "Movie",
        "Art",
        "Workshop",
        "Sports",
        "History",
        "Food",
        "Culture",
        "Tech",
        "Festival",
        "Fun-Games",
        "Fashion",
        "Adventure",
        "Church",
        "Business",
        "General Gathering",
      ],
    },
    price: {
      type: Number,
      required: [true, "Price is required!"],
      min: [0, "Price cannot be negative"],
    },
    organizer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Organizer is required!"],
    },
    image: {
      type: String,
      default: "https://picsum.photos/1920/1080?random",
    },
    attendees: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  { timestamps: true }
);

// Creating indexes for performance optimization
eventSchema.index({ coordinates: "2dsphere" }); // Geospatial index
eventSchema.index({ category: 1, date: 1 }); // For category/date filters
eventSchema.index({ price: 1 }); // For price sorting

export default mongoose.model("Event", eventSchema);
