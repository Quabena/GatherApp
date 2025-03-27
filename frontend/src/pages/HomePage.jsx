import React, { useState, useRef, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Search } from "lucide-react";
import Navbar from "../components/Navbar/Navbar";
import SearchFilters from "../components/SearchFilters/SearchFilters";
import EventList from "../components/EventList/EventList";
import Map from "../components/Map/Map";
import Loader from "../components/Loader/Loader";

const HighlightEvents = ({ events }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const navigate = useNavigate();

  // Memoize shuffled events to prevent unnecessary re-renders
  const shuffledEvents = useMemo(() => {
    if (!events.length) return [];
    const array = [...events];
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }, [events]);

  // Auto-rotate events
  useEffect(() => {
    if (shuffledEvents.length === 0) return;

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % shuffledEvents.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [shuffledEvents.length]);

  const handleEventClick = (eventId) => {
    navigate(`/event/${eventId}`);
  };

  return (
    <div className="relative w-full h-[400px] overflow-hidden rounded-lg">
      <div
        className="absolute inset-0 flex transition-transform ease-in-out duration-1000"
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {shuffledEvents.map((event) => (
          <div
            key={event._id}
            className="w-full flex-shrink-0 relative cursor-pointer group"
            onClick={() => handleEventClick(event._id)}
          >
            <img
              src={event.image || "https://picsum.photos/1920/1080"}
              alt={event.title}
              className="w-full h-[400px] object-cover shadow-lg transition-transform duration-300 group-hover:scale-105"
            />
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent text-white p-6">
              <h3 className="text-xl font-bold mb-2">{event.title}</h3>
              <p className="text-sm opacity-90">
                {new Date(event.date).toLocaleDateString()} - {event.location}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation Dots */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {shuffledEvents.map((_, index) => (
          <button
            key={index}
            className={`w-2 h-2 rounded-full transition-all ${
              index === currentIndex ? "bg-white w-4" : "bg-white/50"
            }`}
            onClick={() => setCurrentIndex(index)}
          />
        ))}
      </div>
    </div>
  );
};

const MapSearchBar = ({ onSearch }) => {
  const [query, setQuery] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(query);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="absolute top-4 left-4 right-4 z-10 max-w-md mx-auto"
    >
      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search for a location..."
          className="w-full px-4 py-2 pl-10 pr-12 rounded-lg border border-gray-300 shadow-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
        <button
          type="submit"
          className="absolute right-2 top-1/2 transform -translate-y-1/2 px-3 py-1 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700 transition-colors"
        >
          Search
        </button>
      </div>
    </form>
  );
};

const HomePage = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedDate, setSelectedDate] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const [mapCenter, setMapCenter] = useState(null);
  const navigate = useNavigate();
  const searchRef = useRef(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        const response = await axios.get("http://localhost:5000/api/events", {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setEvents(response.data.events);
      } catch (err) {
        console.error("Error fetching events:", err);
        setError(err.response?.data?.message || "Failed to fetch events");
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  useEffect(() => {
    function handleClickOutside(event) {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSearch(false);
      }
    }

    if (showSearch) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showSearch]);

  const handleMapSearch = async (query) => {
    try {
      const response = await axios.get(
        `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
          query
        )}&key=${import.meta.env.VITE_GOOGLE_MAPS_API_KEY}`
      );

      if (response.data.results.length > 0) {
        const { lat, lng } = response.data.results[0].geometry.location;
        setMapCenter({ lat, lng });
      }
    } catch (error) {
      console.error("Error searching location:", error);
    }
  };

  const filteredEvents = useMemo(() => {
    return events.filter((event) => {
      const matchesSearch =
        event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.location.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCategory =
        selectedCategory === "all" || event.category === selectedCategory;

      const matchesDate =
        !selectedDate ||
        new Date(event.date).toISOString().split("T")[0] === selectedDate;

      return matchesSearch && matchesCategory && matchesDate;
    });
  }, [events, searchQuery, selectedCategory, selectedDate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-600">
        {error}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100">
      <Navbar setShowSearch={setShowSearch} />

      {/* Hero Section */}
      <div className="text-center py-16 px-6 pt-24">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-800">
          Find the Best Events Near You
        </h1>
        <p className="text-gray-600 mt-4 text-lg">
          Explore exciting events happening around you in just a few clicks.
        </p>
      </div>

      {/* Highlight Events Slider */}
      <div className="max-w-7xl mx-auto px-6 py-10">
        <HighlightEvents events={events} />
      </div>

      {/* Search Bar */}
      {showSearch && (
        <div
          ref={searchRef}
          className="fixed top-16 left-1/2 transform -translate-x-1/2 z-50 flex justify-center px-4"
        >
          <div className="w-full max-w-4xl bg-white bg-opacity-90 backdrop-blur-md shadow-lg rounded-xl p-4">
            <SearchFilters
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              selectedCategory={selectedCategory}
              setSelectedCategory={setSelectedCategory}
              selectedDate={selectedDate}
              setSelectedDate={setSelectedDate}
            />
          </div>
        </div>
      )}

      {/* Events Section */}
      <div className="max-w-7xl mx-auto px-6 py-10">
        <div className="bg-white rounded-2xl shadow-xl p-6">
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">
            Featured Events
          </h2>
          {filteredEvents.length > 0 ? (
            <EventList
              events={filteredEvents}
              onEventClick={(eventId) => navigate(`/event/${eventId}`)}
            />
          ) : (
            <p className="text-gray-500">
              No events found matching your search.
            </p>
          )}
        </div>
      </div>

      {/* Map Section */}
      <div className="max-w-7xl mx-auto px-6 py-10">
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">
          Explore Events on the Map
        </h2>
        <div className="rounded-2xl shadow-xl overflow-hidden relative">
          <MapSearchBar onSearch={handleMapSearch} />
          <Map
            events={filteredEvents}
            onMarkerClick={(eventId) => navigate(`/event/${eventId}`)}
            center={mapCenter}
          />
        </div>
      </div>
    </div>
  );
};

export default HomePage;
