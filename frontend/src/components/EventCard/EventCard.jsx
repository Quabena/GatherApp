import React from "react";
import { Link } from "react-router-dom";
import { FiCalendar, FiMapPin } from "react-icons/fi";

// Distance Calculation
const calculateDistance = (userLocation, eventLocation) => {
  if (!userLocation || !eventLocation) return "Distance unavailable";

  const R = 6371; // Earth radius in km
  const dLat = (eventLocation.lat - userLocation.lat) * (Math.PI / 180);
  const dLon = (eventLocation.lng - userLocation.lng) * (Math.PI / 180);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(userLocation.lat * (Math.PI / 180)) *
      Math.cos(eventLocation.lat * (Math.PI / 180)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return `${Math.round(c * 100)} km away`;
};

const EventCard = ({ event, userLocation }) => {
  return (
    <Link
      to={`/event/${event.id}`}
      className="relative bg-white rounded-2xl shadow-md overflow-hidden transform transition-transform duration-300 hover:scale-105 hover:shadow-lg"
    >
      {/* Event Image */}
      <div className="relative">
        <img
          src={event.image}
          alt={event.title}
          className="w-full h-56 object-cover"
        />
        <span className="absolute top-4 left-4 bg-blue-600 text-white px-3 py-1 rounded-full text-xs uppercase">
          {event.category}
        </span>
      </div>

      {/* Event Details */}
      <div className="p-5">
        <h3 className="text-lg font-semibold text-gray-900 mb-2 truncate">
          {event.title}
        </h3>
        <div className="flex items-center text-gray-500 text-sm mb-2">
          <FiCalendar className="mr-2" />
          <span>{new Date(event.date).toLocaleDateString()}</span>
        </div>
        <div className="flex items-center text-gray-500 text-sm">
          <FiMapPin className="mr-2" />
          <span>{calculateDistance(userLocation, event.coordinates)}</span>
        </div>
      </div>
    </Link>
  );
};

export default EventCard;
