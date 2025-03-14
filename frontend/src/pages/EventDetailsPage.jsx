import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
  FiArrowLeft,
  FiCalendar,
  FiMapPin,
  FiUser,
  FiMail,
} from "react-icons/fi";
import { GoogleMap, Marker, useLoadScript } from "@react-google-maps/api";
import Button from "../components/Button/Button";
import "./EventDetails.css";

// Mock event data (replace with API call in Phase 3)
const mockEvent = {
  id: 1,
  title: "Local Music Festival",
  date: "2023-10-15T19:00:00",
  location: "Ratray Park, Kumasi",
  description:
    "Join us for an unforgettable evening of live music featuring top artists from around the world!",
  organizer: "Celebrity Innovations Group (CIG)",
  image: "https://picsum.photos/1920/1080?random",
  price: "Free",
  requiresRegistration: true,
  coordinates: { lat: 5.5545, lng: -0.19296 },
};

const EventDetailsPage = () => {
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [activeTab, setActiveTab] = useState("details");
  const [formData, setFormData] = useState({ name: "", email: "" });

  useEffect(() => {
    // Simulating API call (replace with real API call later)
    setTimeout(() => {
      setEvent(mockEvent);
    }, 500);
  }, [id]); // Moved inside `useEffect`

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY, // Vite format
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Registration data:", formData);
  };

  if (!event) return <div className="min-h-screen bg-gray-50">Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="relative h-96 w-full hero-section">
        <img
          src={event.image}
          alt={event.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center hero-overlay">
          <div className="text-center text-white max-w-4xl px-4">
            <h1 className="text-4xl font-bold mb-4">{event.title}</h1>
            <div className="flex justify-center items-center gap-6 mb-6">
              <div className="flex items-center">
                <FiCalendar className="mr-2" />
                <span>
                  {event.date
                    ? new Date(event.date).toLocaleDateString("en-US", {
                        weekday: "long",
                        month: "long",
                        day: "numeric",
                        hour: "numeric",
                        minute: "numeric",
                      })
                    : "Date to be announced soon!"}
                </span>
              </div>
              <div className="flex items-center">
                <FiMapPin className="mr-2" />
                <span>{event.location}</span>
              </div>
            </div>
            <Button variant="primary">
              {event.price === "Free"
                ? "Get Free Tickets"
                : `Buy Tickets ($${event.price})`}
            </Button>
          </div>
        </div>
      </div>

      {/* Back Button */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <Link
          to="/"
          className="flex items-center text-gray-600 hover:text-blue-600"
        >
          <FiArrowLeft className="mr-2" /> Back to Events
        </Link>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8 grid md:grid-cols-3 gap-8">
        {/* Left Column */}
        <div className="md:col-span-2 space-y-8">
          {/* Tabs */}
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8">
              <button
                onClick={() => setActiveTab("details")}
                className={`pb-4 px-1 ${
                  activeTab === "details"
                    ? "border-b-2 border-blue-600 text-blue-600"
                    : "text-gray-500"
                }`}
              >
                Event Details
              </button>
              {event.requiresRegistration && (
                <button
                  onClick={() => setActiveTab("register")}
                  className={`pb-4 px-1 ${
                    activeTab === "register"
                      ? "border-b-2 border-blue-600 text-blue-600"
                      : "text-gray-500"
                  }`}
                >
                  Register
                </button>
              )}
            </nav>
          </div>

          {/* Tab Content */}
          {activeTab === "details" ? (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold">About This Event</h2>
              <p className="text-gray-600 leading-relaxed">
                {event.description}
              </p>

              <div className="bg-blue-50 p-6 rounded-lg">
                <h3 className="text-lg font-semibold mb-4">Event Organizer</h3>
                <div className="flex items-center">
                  <FiUser className="mr-2 text-blue-600" />
                  <span className="text-gray-700">{event.organizer}</span>
                </div>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6 max-w-md">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                />
              </div>
              <Button type="submit" variant="primary" className="w-full">
                Complete Registration
              </Button>
            </form>
          )}
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Map */}
          {isLoaded && (
            <div className="h-64 rounded-lg overflow-hidden">
              <div style={{ width: "100%", height: "100%", minWidth: "300px" }}>
                <GoogleMap
                  mapContainerStyle={{ width: "100%", height: "100%" }}
                  center={event.coordinates}
                  zoom={15}
                >
                  <Marker position={event.coordinates} />
                </GoogleMap>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EventDetailsPage;
