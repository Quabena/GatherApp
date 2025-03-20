import React from "react";
import { useNavigate } from "react-router-dom";
import EventCard from "../EventCard/EventCard";
import Button from "../Button/Button";
import { FiCheckCircle } from "react-icons/fi";
import { motion } from "framer-motion";
import Gallery from "../Gallery/Gallery";

// Mock data
const pastEvents = [
  {
    id: 3,
    title: "Live Band Session",
    date: "2023-09-20",
    location: "Yke's Cafe, Kumasi",
    image: [
      "https://picsum.photos/800/500?random=1",
      "https://picsum.photos/800/500?random=2",
      "https://picsum.photos/800/500?random=3",
    ],
  },
  {
    id: 4,
    title: "Free Medical Screening",
    date: "2024-10-21",
    location: "Okomfo Anokye Teaching Hospital, Kumasi",
    image: [
      "https://picsum.photos/800/500?random=4",
      "https://picsum.photos/800/500?random=5",
      "https://picsum.photos/800/500?random=6",
    ],
  },
];

const PastEvents = () => {
  const navigate = useNavigate();

  return (
    <div className="max-w-5xl mx-auto px-6 py-10">
      <motion.h1
        className="text-4xl font-bold mb-8 flex items-center text-gray-800"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <FiCheckCircle className="mr-3 text-green-600" /> Past Events
      </motion.h1>

      <div className="space-y-10">
        {pastEvents.map((event) => (
          <motion.div
            key={event.id}
            className="bg-white rounded-xl shadow-lg p-6"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <EventCard event={event} />
            <Gallery images={event.image} />
            <div className="mt-4 flex justify-end space-x-3">
              <Button
                variant="secondary"
                onClick={() => navigate(`/event/${event.id}`)}
              >
                Leave A Review
              </Button>

              <Button
                variant="primary"
                onClick={() => navigate(`/events/${event.id.photos}`)}
              >
                View More Photos
              </Button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default PastEvents;
