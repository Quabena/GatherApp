import Event from "../models/Event.js";
import { NotFoundError } from "../utils/errors.js";
import { geocodeAddress } from "../utils/geocode.js";
import { getOrSetCache } from "../services/cache.js";

// Creating a new event
export const createEvent = async (req, res) => {
  try {
    const { location, ...eventData } = req.body;

    // Geocoding the provided location
    const coordinates = await geocodeAddress(location);

    const event = await Event.create({
      ...eventData,
      location,
      coordinates,
      organizer: req.user._id,
    });

    res.status(201).json({ status: "success", event });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Getting all events with caching, filtering, sorting, pagination & geospatial query
export const getEvents = async (req, res) => {
  try {
    const {
      category,
      date,
      minPrice,
      maxPrice,
      longitude,
      latitude,
      radius,
      sort,
      page = 1,
      limit = 10,
    } = req.query;

    // Converting to numbers
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    // Constructing the filters
    const filters = {};
    if (category) filters.category = category;
    if (date) filters.date = { $gte: new Date(date) };
    if (minPrice || maxPrice) {
      filters.price = {};
      if (minPrice) filters.price.$gte = parseFloat(minPrice);
      if (maxPrice) filters.price.$lte = parseFloat(maxPrice);
    }
    if (longitude && latitude && radius) {
      filters.coordinates = {
        $nearSphere: {
          $geometry: {
            type: "Point",
            coordinates: [parseFloat(longitude), parseFloat(latitude)],
          },
          $maxDistance: parseFloat(radius) * 1000, // Convert km to meters
        },
      };
    }

    // Generating a unique cache key based on query params
    const cacheKey = `events_${category || "all"}_${date || "all"}_${
      minPrice || "any"
    }_${maxPrice || "any"}_${longitude || "any"}_${latitude || "any"}_${
      radius || "any"
    }_${sort || "default"}_page${pageNum}_limit${limitNum}`;

    // Retrieving cached data if available
    const data = await getOrSetCache(
      cacheKey,
      async () => {
        const query = Event.find(filters)
          .populate("organizer", "name email")
          .populate("attendees", "name email")
          .skip(skip)
          .limit(limitNum)
          .sort(sort ? sort.split(",").join(" ") : "-createdAt")
          .lean();

        // Counting only if not cached
        const [events, total] = await Promise.all([
          query,
          Event.countDocuments(filters),
        ]);

        return {
          status: "success",
          results: events.length,
          total,
          currentPage: pageNum,
          totalPages: Math.ceil(total / limitNum),
          events,
        };
      },
      300
    ); // Setting cache expiry to 300 seconds (5 minutes)

    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
};

// Getting a single event by ID
export const getEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id)
      .populate("organizer", "name email")
      .populate("attendees", "name email");

    if (!event) {
      throw new NotFoundError("Event not found!");
    }

    res.status(200).json({ status: "success", event });
  } catch (error) {
    res.status(error.statusCode || 400).json({ message: error.message });
  }
};

// Updating an event
export const updateEvent = async (req, res) => {
  try {
    let updateData = req.body;

    // If updating location, geocode the new address
    if (req.body.location) {
      updateData.coordinates = await geocodeAddress(req.body.location);
    }

    const event = await Event.findById(req.params.id);
    if (!event) throw new NotFoundError("Event not found!");

    // Checking if the user is the event organizer
    if (event.organizer.toString() !== req.user._id.toString()) {
      throw new Error("You are not authorized to update this event!");
    }

    const updatedEvent = await Event.findByIdAndUpdate(
      req.params.id,
      updateData,
      {
        new: true,
        runValidators: true,
      }
    );

    res.status(200).json({ status: "success", event: updatedEvent });
  } catch (error) {
    res.status(error.statusCode || 400).json({ message: error.message });
  }
};

// Deleting an event
export const deleteEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) throw new NotFoundError("Event not found!");

    // Ensuring only the organizer can delete the event
    if (event.organizer.toString() !== req.user._id.toString()) {
      throw new Error("You are not authorized to delete this event!");
    }

    await Event.findByIdAndDelete(req.params.id);
    res.status(204).json({ status: "success", data: null });
  } catch (error) {
    res.status(error.statusCode || 400).json({ message: error.message });
  }
};
