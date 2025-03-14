import { Client } from "@googlemaps/google-maps-services-js";

const client = new Client({});

const API_KEY = process.env.GOOGLE_MAPS_API_KEY;

export const geocodeAddress = async (address) => {
  try {
    const response = await client.geocode({
      params: {
        address: address,
        key: API_KEY,
      },
    });

    if (response.data.status !== "OK") {
      throw new Error("Could not geocode the address");
    }

    const { lat, lng } = response.data.results[0].geometry.location;
    return {
      type: "Point",
      coordinates: [lng, lat], // Longitude and Latitude for MongoDB
    };
  } catch (error) {
    console.error("Geocoding error:", error.message);
    throw new Error("Failed to process location");
  }
};
