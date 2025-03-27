import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import EventCard from "../EventCard/EventCard";
import Button from "../Button/Button";
import { FiCheckCircle } from "react-icons/fi";
import { motion } from "framer-motion";
import Gallery from "../Gallery/Gallery";
import { FaSpinner } from "react-icons/fa";
import { AlertCircle } from "react-feather";

const PastEvents = () => {
  const navigate = useNavigate();
  const [pastEvents, setPastEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPastEvents = async () => {
      try {
        setLoading(true);
        const response = await axios.get("http://localhost:5000/api/events", {
          params: {
            status: "ended", // Add query parameter instead of path parameter
          },
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setPastEvents(response.data.events);
      } catch (err) {
        console.error("Error fetching past events:", err);
        setError(err.response?.data?.message || "Failed to load past events");
      } finally {
        setLoading(false);
      }
    };

    fetchPastEvents();
  }, []);

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto px-6 py-10 flex justify-center items-center h-64">
        <FaSpinner className="animate-spin text-4xl text-blue-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-5xl mx-auto px-6 py-10">
        <div className="bg-red-50 border-l-4 border-red-500 p-4">
          <div className="flex items-center">
            <AlertCircle className="h-5 w-5 text-red-500 mr-3" />
            <div>
              <p className="text-sm text-red-700">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="mt-2 text-sm text-red-600 hover:text-red-800 font-medium"
              >
                Try again
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (pastEvents.length === 0) {
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
        <div className="bg-white rounded-xl shadow-lg p-8 text-center">
          <p className="text-gray-600 text-lg">
            No past events found. Check back later!
          </p>
          <Button
            variant="primary"
            className="mt-4"
            onClick={() => navigate("/explore")}
          >
            Browse Upcoming Events
          </Button>
        </div>
      </div>
    );
  }

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
            key={event._id}
            className="bg-white rounded-xl shadow-lg p-6"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <EventCard event={event} />
            {event.images && event.images.length > 0 && (
              <Gallery images={event.images} />
            )}
            <div className="mt-4 flex justify-end space-x-3">
              <Button
                variant="secondary"
                onClick={() => navigate(`/event/${event._id}`)}
              >
                Leave A Review
              </Button>

              {event.images && event.images.length > 0 && (
                <Button
                  variant="primary"
                  onClick={() => navigate(`/event/${event._id}/gallery`)}
                >
                  View More Photos
                </Button>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default PastEvents;
