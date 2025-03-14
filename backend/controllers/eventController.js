import Event from "../models/Event.js";
import { NotFoundError } from "../utils/errors.js";
import { geocodeAddress } from "../utils/geocode.js";

// Creating a new event
export const createEvent = async (req, res) => {
  try {
    const { location, ...eventData } = req.body;

    // Geocode location
    const coordinates = await geocodeAddress(location);

    const event = await Event.create({
      ...eventData,
      location,
      coordinates,
      organizer: req.user._id,
    });

    res.status(201).json({
      status: "success",
      event,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Getting all events (with search/filters)
export const getEvents = async (req, res) => {
  try {
    // Filtering
    const queryObj = { ...req.query };
    const excludedFields = ["page", "sort", "limit", "fields", "radius"];
    excludedFields.forEach((el) => delete queryObj[el]);

    // Advanced Filtering
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);

    let query = (
      await Event.find(JSON.parse(queryStr)).populate("organizer", "name email")
    ).populate("attendees", "name email");

    // Sorting
    if (req.query.sort) {
      const sortBy = req.query.sort.split(",").join(" ");
      query = query.sort(sortBy);
    } else {
      query = query.sort("-createdAt");
    }

    // Pagination
    const page = req.query.page * 1 || 1;
    const limit = req.query.limit * 1 || 20;
    const skip = (page - 1) * limit;

    query = query.skip(skip).limit(limit);

    // Geospatial Query
    if (req.query.radius && req.query.coordinates) {
      const [lng, lat] = req.query.coordinates.split(",").map(parseFloat);
      if (isNaN(lng) || isNaN(lat)) {
        return res.status(400).json({ message: "Invalid coordinate format" });
      }
      const radius = parseFloat(req.query.radius) * 1000; // Coverting to meters

      query = query.find({
        coordinates: {
          $nearSphere: {
            $geometry: {
              type: "Point",
              coordinates: [lng, lat],
            },
            $maxDistance: radius,
          },
        },
      });
    }

    const events = await query;

    res.status(200).json({
      status: "success",
      results: events.length,
      events,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const getEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id)
      .populate("organizer", "name email")
      .populate("attendees", "name email");

    if (!event) {
      throw new NotFoundError("Event not found!");
    }

    res.status(200).json({
      status: "success",
      event,
    });
  } catch (error) {
    res.status(error.statusCode || 400).json({ message: error.message });
  }
};

export const updateEvent = async (req, res) => {
  try {
    let updateData = req.body;

    // Geocoding location
    if (req.body.location) {
      updateData.coordinates = await geocodeAddress(req.body.location);
    }

    const event = await Event.findById(req.params.id);
    if (!event) {
      throw new NotFoundError("Event not found!");
    }

    // Checking if the user is the organizer of the event
    if (event.organizer.toString() !== req.user._id.toString()) {
      throw new Error("You are not authorized to update this event!");
    }

    const updatedEvent = await Event.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    res.status(200).json({
      status: "success",
      event: updatedEvent,
    });
  } catch (error) {
    res.status(error.statusCode || 400).json({ message: error.message });
  }
};

export const deleteEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      throw new NotFoundError("Event not found!");
    }

    // Checking if the user is the organizer of the event
    if (event.organizer.toString() !== req.user._id.toString()) {
      throw new Error("You are not authorized to delete this event!");
    }

    await Event.findByIdAndDelete(req.params.id);

    res.status(204).json({
      status: "success",
      data: null,
    });
  } catch (error) {
    res.status(error.statusCode || 400).json({ message: error.message });
  }
};
