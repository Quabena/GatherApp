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
      className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200"
    >
      <div className="flex">
        <img
          src={event.image}
          alt={event.title}
          className="w-32 h-32 object-cover rounded-l-xl"
        />
        <div className="p-4">
          <h3 className="text-xl font-semibold mb-2">{event.title}</h3>
          <div className="flex items-center text-gray-600 mb-2">
            <FiCalendar className="mr-2" />
            <span>{new Date(event.date).toLocaleDateString()}</span>
          </div>
          <div className="flex items-center text-gray-600">
            <FiMapPin className="mr-2" />
            <span>{calculateDistance(userLocation, event.coordinates)}</span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default EventCard;
