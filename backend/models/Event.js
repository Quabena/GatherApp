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
      coordinates: [Number],
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
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    reviews: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
        text: {
          type: String,
          required: true,
        },
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    capacity: {
      type: Number,
      default: 100,
    },
    registeredCount: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

// Indexes
eventSchema.index({ coordinates: "2dsphere" });
eventSchema.index({ category: 1, date: 1 });
eventSchema.index({ price: 1 });

export default mongoose.model("Event", eventSchema);
