import React from "react";
import EventCard from "../EventCard/EventCard";

const EventList = ({ events, currentPage, totalPages, onPageChange }) => {
  return (
    <div className="space-y-10">
      {/* Events Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {events.map((event) => (
          <EventCard key={event._id} event={event} />
        ))}
      </div>

      {/* Pagination Controls */}
      <div className="flex justify-center gap-2 mt-6">
        {Array.from({ length: totalPages }, (_, i) => (
          <button
            key={i + 1}
            onClick={() => onPageChange(i + 1)}
            className={`px-4 py-2 rounded-lg transition-all ${
              currentPage === i + 1
                ? "bg-blue-600 text-white"
                : "bg-gray-100 hover:bg-gray-200"
            }`}
          >
            {i + 1}
          </button>
        ))}
      </div>
    </div>
  );
};

export default EventList;
