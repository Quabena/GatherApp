import React, { useState } from "react";
import {
  GoogleMap,
  Marker,
  InfoWindow,
  useLoadScript,
} from "@react-google-maps/api";
import { useNavigate } from "react-router-dom";

const Map = ({ events }) => {
  const navigate = useNavigate();
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
    libraries: ["places"],
  });

  const [selectedEvent, setSelectedEvent] = useState(null);

  const mapContainerStyle = {
    width: "100%",
    height: "500px",
    borderRadius: "16px",
    boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
    transition: "all 0.3s ease",
  };

  const defaultCenter = {
    lat: 6.68848,
    lng: -1.62443, // Default to Kumasi
  };

  const center =
    events?.length > 0
      ? {
          lat: events[0]?.coordinates?.coordinates[1] || defaultCenter.lat,
          lng: events[0]?.coordinates?.coordinates[0] || defaultCenter.lng,
        }
      : defaultCenter;

  if (loadError)
    return <div className="text-red-500">⚠️ Error loading map</div>;
  if (!isLoaded) return <div className="text-gray-600">⏳ Loading map...</div>;

  return (
    <div className="sticky top-4 h-[600px] rounded-xl overflow-hidden bg-white shadow-lg p-3">
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        center={center}
        zoom={12}
      >
        {events?.map((event) => (
          <Marker
            key={event.id}
            position={{
              lat: event?.coordinates?.coordinates[1] || defaultCenter.lat,
              lng: event?.coordinates?.coordinates[0] || defaultCenter.lng,
            }}
            title={event.title}
            onClick={() => setSelectedEvent(event)}
            icon={{
              url: "https://maps.google.com/mapfiles/ms/icons/red-dot.png",
              scaledSize: new window.google.maps.Size(40, 40),
            }}
          />
        ))}

        {/* Info Window when Marker is clicked */}
        {selectedEvent && (
          <InfoWindow
            position={{
              lat:
                selectedEvent.coordinates.coordinates[1] || defaultCenter.lat,
              lng:
                selectedEvent.coordinates.coordinates[0] || defaultCenter.lng,
            }}
            onCloseClick={() => setSelectedEvent(null)}
          >
            <div className="p-2">
              <h3 className="text-lg font-semibold">{selectedEvent.title}</h3>
              <p className="text-sm text-gray-600">
                {new Date(selectedEvent.date).toLocaleDateString()}
              </p>
              <button
                className="mt-2 bg-blue-600 text-white px-4 py-1 rounded-lg hover:bg-blue-700"
                onClick={() => navigate(`/event/${selectedEvent.id}`)}
              >
                View Details
              </button>
            </div>
          </InfoWindow>
        )}
      </GoogleMap>
    </div>
  );
};

export default Map;
