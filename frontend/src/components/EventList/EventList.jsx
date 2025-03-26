import React from "react";
import EventCard from "../EventCard/EventCard";
import { ChevronLeft, ChevronRight } from "lucide-react";

const EventList = ({
  events,
  currentPage = 1,
  totalPages = 1,
  onPageChange,
  onEventClick,
}) => {
  // Handle event click if provided
  const handleEventClick = (event) => {
    if (onEventClick) {
      onEventClick(event._id);
    }
  };

  return (
    <div className="space-y-10">
      {/* Events Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {events.map((event) => (
          <div
            key={event._id}
            onClick={() => handleEventClick(event)}
            className="transform transition-transform hover:scale-[1.02] cursor-pointer"
          >
            <EventCard event={event} />
          </div>
        ))}
      </div>

      {/* Pagination Controls - Only show if there are multiple pages */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 mt-8">
          {/* Previous Page Button */}
          <button
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className={`p-2 rounded-lg transition-all ${
              currentPage === 1
                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                : "bg-gray-100 hover:bg-gray-200 text-gray-600"
            }`}
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          {/* Page Numbers */}
          <div className="flex gap-2">
            {Array.from({ length: totalPages }, (_, i) => {
              const pageNumber = i + 1;
              // Show first page, last page, current page, and pages around current page
              if (
                pageNumber === 1 ||
                pageNumber === totalPages ||
                (pageNumber >= currentPage - 1 && pageNumber <= currentPage + 1)
              ) {
                return (
                  <button
                    key={pageNumber}
                    onClick={() => onPageChange(pageNumber)}
                    className={`min-w-[2.5rem] h-10 flex items-center justify-center rounded-lg transition-all ${
                      currentPage === pageNumber
                        ? "bg-blue-600 text-white"
                        : "bg-gray-100 hover:bg-gray-200 text-gray-700"
                    }`}
                  >
                    {pageNumber}
                  </button>
                );
              } else if (
                pageNumber === currentPage - 2 ||
                pageNumber === currentPage + 2
              ) {
                return (
                  <span
                    key={pageNumber}
                    className="flex items-center justify-center px-2 text-gray-400"
                  >
                    ...
                  </span>
                );
              }
              return null;
            })}
          </div>

          {/* Next Page Button */}
          <button
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className={`p-2 rounded-lg transition-all ${
              currentPage === totalPages
                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                : "bg-gray-100 hover:bg-gray-200 text-gray-600"
            }`}
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      )}

      {/* No Events Message */}
      {events.length === 0 && (
        <div className="text-center py-10">
          <p className="text-gray-500 text-lg">No events found</p>
        </div>
      )}
    </div>
  );
};

export default EventList;
