import React, { useState } from "react";
import EventCard from "../EventCard/EventCard";
import Button from "../Button/Button";
import { FiBookmark } from "react-icons/fi";

// Mock data (to be replaced with API data later)
const initialEvents = [
  {
    id: 1,
    title: "Drum-Off / Jazz Night",
    date: "2025-01-18",
    location: "Virtual Sound Studios, Kumasi",
    image: "https://picsum.photos/1920/1080?random",
  },
  {
    id: 2,
    title: "Covenant Praise",
    date: "2025-02-28",
    location: "Christ Resurrection Church, Kotei - Kumasi",
    image: "https://picsum.photos/1920/1080?random",
  },
];

const SavedEvents = () => {
  const [savedEvents, setSavedEvents] = useState(initialEvents);

  const handleUnsave = (id) => {
    setSavedEvents(savedEvents.filter((event) => event.id !== id));
  };

  return (
    <div className="max-w-4xl">
      <h1 className="text-3xl font-bold mb-8 flex items-center">
        <FiBookmark className="mr-3 text-blue-600" /> Saved Events
      </h1>
      <div className="space-y-6">
        {savedEvents.length > 0 ? (
          savedEvents.map((event) => (
            <div key={event.id} className="relative">
              <EventCard event={event} />
              <div className="absolute top-4 right-4">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => handleUnsave(event.id)}
                >
                  Unsave
                </Button>
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-500">No saved events yet.</p>
        )}
      </div>
    </div>
  );
};

export default SavedEvents;
