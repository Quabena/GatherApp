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
      status, // Add status filter
    } = req.query;

    // Converting to numbers
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    // Constructing the filters
    const filters = {};
    if (category) filters.category = category;

    // Handle date filtering based on status
    if (status === "ended") {
      filters.date = { $lt: new Date() };
    } else if (status === "upcoming") {
      filters.date = { $gte: new Date() };
    } else if (date) {
      // Keep existing date filter if no status is specified
      filters.date = { $gte: new Date(date) };
    }

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

    // Generating a unique cache key including status
    const cacheKey = `events_${status || "all"}_${category || "all"}_${
      date || "all"
    }_${minPrice || "any"}_${maxPrice || "any"}_${longitude || "any"}_${
      latitude || "any"
    }_${radius || "any"}_${sort || "default"}_page${pageNum}_limit${limitNum}`;

    // Rest of the function remains the same...
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
    );

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

// Register for event
export const registerForEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) throw new NotFoundError("Event not found");

    // Check if already registered
    if (event.attendees.includes(req.user._id)) {
      throw new Error("You're already registered for this event");
    }

    // Check capacity
    if (event.capacity && event.attendees.length >= event.capacity) {
      throw new Error("This event has reached maximum capacity");
    }

    // Add registration
    event.attendees.push(req.user._id);
    event.registeredCount = event.attendees.length;
    await event.save();

    res.status(200).json({
      status: "success",
      event,
    });
  } catch (error) {
    res.status(error.statusCode || 400).json({ message: error.message });
  }
};

// Controller function for unregistering
export const unregisterFromEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) throw new NotFoundError("Event not found");

    // Check if user is registered
    if (!event.attendees.includes(req.user._id)) {
      throw new Error("You're not registered for this event");
    }

    // Remove registration
    event.attendees = event.attendees.filter(
      (attendee) => attendee.toString() !== req.user._id.toString()
    );
    event.registeredCount = event.attendees.length;
    await event.save();

    res.status(200).json({
      status: "success",
      message: "Successfully unregistered from event",
      eventId: req.params.id,
    });
  } catch (error) {
    res.status(error.statusCode || 400).json({ message: error.message });
  }
};

// Like event
export const likeEvent = async (req, res) => {
  try {
    const event = await Event.findByIdAndUpdate(
      req.params.id,
      {
        $addToSet: { likes: req.user._id }, // Prevent duplicates
        $inc: { likeCount: 1 },
      },
      { new: true }
    );

    res.status(200).json({
      status: "success",
      likes: event.likes.length,
    });
  } catch (error) {
    res.status(error.statusCode || 400).json({ message: error.message });
  }
};

// Unlike event
export const unlikeEvent = async (req, res) => {
  try {
    const event = await Event.findByIdAndUpdate(
      req.params.id,
      {
        $pull: { likes: req.user._id },
        $inc: { likeCount: -1 },
      },
      { new: true }
    );

    res.status(200).json({
      status: "success",
      likes: event.likes.length,
    });
  } catch (error) {
    res.status(error.statusCode || 400).json({ message: error.message });
  }
};

// Get event reviews
export const getEventReviews = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id)
      .populate({
        path: "reviews.user",
        select: "name email",
      })
      .select("reviews");

    if (!event) {
      throw new NotFoundError("Event not found");
    }

    res.status(200).json({
      status: "success",
      reviews: event.reviews,
    });
  } catch (error) {
    res.status(error.statusCode || 500).json({ message: error.message });
  }
};

// Add event review
export const addEventReview = async (req, res) => {
  try {
    const event = await Event.findByIdAndUpdate(
      req.params.id,
      {
        $push: {
          reviews: {
            user: req.user._id,
            text: req.body.text,
          },
        },
      },
      { new: true }
    ).populate({
      path: "reviews.user",
      select: "name",
    });

    if (!event) {
      throw new NotFoundError("Event not found");
    }

    // Get the newly added review (last one in the array)
    const newReview = event.reviews[event.reviews.length - 1];

    res.status(201).json({
      status: "success",
      review: {
        id: newReview._id,
        text: newReview.text,
        author: newReview.user.name,
        timestamp: newReview.createdAt.toLocaleString(),
      },
    });
  } catch (error) {
    res.status(error.statusCode || 500).json({ message: error.message });
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

// Register Event Controller
export const getRegisteredEvents = async (req, res) => {
  try {
    const events = await Event.find({ attendees: req.user._id })
      .populate("organizer", "name email")
      .sort("-date")
      .lean();

    res.status(200).json({
      status: "success",
      results: events.length,
      events,
    });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
};
