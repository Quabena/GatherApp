import { Client } from "@googlemaps/google-maps-services-js";

const client = new Client({});

const API_KEY = process.env.GOOGLE_MAPS_API_KEY;

export const geocodeAddress = async (address) => {
  if (!API_KEY) {
    console.error("Google Maps API key is not configured");
    throw new Error("Google Maps API key is not configured");
  }

  if (!address) {
    throw new Error("Address is required");
  }

  try {
    const response = await client.geocode({
      params: {
        address: address,
        key: API_KEY,
      },
    });

    if (response.data.status === "REQUEST_DENIED") {
      console.error(
        "Google Maps API request was denied:",
        response.data.error_message
      );
      throw new Error("Location service is temporarily unavailable");
    }

    if (response.data.status !== "OK" || !response.data.results.length) {
      console.error("Geocoding failed:", response.data.status);
      throw new Error("Could not find location. Please check the address");
    }

    const { lat, lng } = response.data.results[0].geometry.location;

    // Validate coordinates
    if (typeof lat !== "number" || typeof lng !== "number") {
      throw new Error("Invalid coordinates received");
    }

    return {
      type: "Point",
      coordinates: [lng, lat], // MongoDB expects [longitude, latitude]
    };
  } catch (error) {
    console.error("Geocoding error:", error);

    // Handle specific error types
    if (error.response?.status === 403) {
      throw new Error("Google Maps API key is invalid or restricted");
    }

    if (error.response?.status === 429) {
      throw new Error("Too many requests. Please try again later");
    }

    throw new Error(error.message || "Failed to process location");
  }
};
