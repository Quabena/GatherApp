import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import EventCard from "../EventCard/EventCard";
import Button from "../Button/Button";
import { Bookmark, Loader2, AlertCircle, ArrowRight } from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast";

const SavedEvents = () => {
  const [registeredEvents, setRegisteredEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [unregisteringId, setUnregisteringId] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    fetchRegisteredEvents();

    if (location.state?.message) {
      toast.success(location.state.message);
      // Clear the state after showing the message
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location.state?.message, location.pathname, navigate]);

  const fetchRegisteredEvents = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get(
        "http://localhost:5000/api/events/user/registered",
        {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setRegisteredEvents(response.data.events || []);
    } catch (err) {
      console.error("Error fetching registered events:", err);
      setError(
        err.response?.data?.message || "Failed to fetch registered events"
      );
      toast.error(
        err.response?.data?.message || "Failed to load your registered events"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleUnregister = async (eventId) => {
    try {
      setUnregisteringId(eventId);
      await axios.post(
        `http://localhost:5000/api/events/${eventId}/unregister`,
        {},
        {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      setRegisteredEvents(
        registeredEvents.filter((event) => event._id !== eventId)
      );
      toast.success("Successfully unregistered from the event");
    } catch (err) {
      console.error("Error unregistering from event:", err);
      toast.error(
        err.response?.data?.message || "Failed to unregister from event"
      );
    } finally {
      setUnregisteringId(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <p className="text-red-600 mb-6">{error}</p>
          <Button variant="primary" onClick={fetchRegisteredEvents}>
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold flex items-center text-gray-900">
          <Bookmark className="w-8 h-8 mr-3 text-blue-600" />
          My Registered Events
        </h1>
        <p className="mt-2 text-gray-600">
          Events you've successfully registered for.
        </p>
      </div>

      {registeredEvents.length > 0 ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {registeredEvents.map((event) => (
            <div key={event._id} className="relative group">
              <EventCard event={event} />
              <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => handleUnregister(event._id)}
                  className="bg-white/90 backdrop-blur-sm hover:bg-white"
                  disabled={unregisteringId === event._id}
                >
                  {unregisteringId === event._id ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    "Unregister"
                  )}
                </Button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-white rounded-xl shadow-sm border border-gray-100">
          <Bookmark className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No registered events yet
          </h3>
          <p className="text-gray-600 mb-6">
            Register for events to see them listed here.
          </p>
          <Button
            variant="primary"
            onClick={() => navigate("/explore")}
            className="inline-flex items-center"
          >
            Browse Events <ArrowRight className="ml-2 w-4 h-4" />
          </Button>
        </div>
      )}
    </div>
  );
};

export default SavedEvents;
