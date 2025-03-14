import React from "react";
import { GoogleMap, Marker, useLoadScript } from "@react-google-maps/api";
import { useNavigate } from "react-router-dom";

// const libraries = ["places"]; // Required for Places API

const Map = ({ events }) => {
  const navigate = useNavigate();
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
    libraries: ["places"],
  });

  const mapContainerStyle = {
    width: "100%",
    height: "400px",
    borderRadius: "12px",
  };

  const center =
    events?.length > 0
      ? {
          lat: events[0]?.coordinates?.coordinates[1] ?? 6.68848,
          lng: events[0]?.coordinates?.coordinates[0] ?? -1.62443,
        }
      : {
          lat: 6.68848,
          lng: -1.62443, // Default to Kumasi
        };

  if (loadError) return <div>Error loading map</div>;
  if (!isLoaded) return <div>Loading map...</div>;

  return (
    <div className="sticky top-4 h-[600px]">
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        center={center}
        zoom={12}
      >
        {events?.map((event) => (
          <Marker
            key={event.id}
            position={{
              lat: event?.coordinates?.coordinates[1] ?? 6.68848,
              lng: event?.coordinates?.coordinates[0] ?? -1.62443,
            }}
            title={event.title}
            onClick={() => navigate(`/event/${event.id}`)}
          />
        ))}
      </GoogleMap>
    </div>
  );
};

export default Map;
