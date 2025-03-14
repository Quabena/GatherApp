import React from "react";
import EventCard from "../EventCard/EventCard";
import Button from "../Button/Button";
import { FiCheckCircle } from "react-icons/fi";

// Mock data
const pastEvents = [
  {
    id: 3,
    title: "Live Band Session",
    date: "2023-09-20",
    location: "Yke's Cafe, Kumasi",
    image: "https://picsum.photos/1920/1080?random",
  },
  {
    id: 4,
    title: "Free Medical Screening",
    date: "2024-10-21",
    location: "Okomfo Anokye Teaching Hospital, Kumasi",
    image: "https://picsum.photos/1920/1080?random",
  },
];

const PastEvents = () => {
  return (
    <div className="max-w-4xl">
      <h1 className="text-3xl font-bold mb-8 flex items-center">
        <FiCheckCircle className="mr-3 text-green-600" /> Past Events
      </h1>
      <div className="space-y-6">
        {pastEvents.map((event) => (
          <div key={event.id} className="bg-white rounded-xl shadow-sm p-6">
            <EventCard event={event} />
            <div className="mt-4 flex justify-end">
              <Button variant="secondary" className="mr-2">
                Leave A Review
              </Button>
              <Button variant="primary">View Photos</Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PastEvents;
