import React, { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import {
  Search,
  MapPin,
  Calendar,
  Users,
  ArrowRight,
  Loader2,
  RefreshCw,
} from "lucide-react";
import axios from "axios";
import { format } from "date-fns";

const categories = [
  "All",
  "Music",
  "Movie",
  "Art",
  "Workshop",
  "Sports",
  "History",
  "Food",
  "Culture",
  "Tech",
  "Festival",
  "Fun-Games",
  "Fashion",
  "Adventure",
  "Church",
  "Business",
  "General Gathering",
];

const ExplorePage = () => {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [view, setView] = useState("grid");
  const [sortBy, setSortBy] = useState("date");

  const fetchEvents = useCallback(async () => {
    try {
      setLoading(true);
      const params = {
        category: selectedCategory === "All" ? undefined : selectedCategory,
        status: "upcoming",
        sort:
          sortBy === "date"
            ? "date"
            : sortBy === "popularity"
            ? "-attendees"
            : sortBy === "price"
            ? "price"
            : undefined,
      };

      const response = await axios.get("http://localhost:5000/api/events", {
        params,
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      setEvents(response.data.events || []);
      setError(null);
    } catch (err) {
      console.error("Error fetching events:", err);
      setError(err.response?.data?.message || "Failed to fetch events");
    } finally {
      setLoading(false);
    }
  }, [selectedCategory, sortBy]);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  const filteredEvents = events.filter((event) =>
    event.title.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-blue-500 mx-auto" />
          <p className="mt-4 text-gray-600">Loading amazing events...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="bg-red-50 p-6 rounded-lg">
            <p className="text-red-600 mb-4">{error}</p>
            <button
              onClick={fetchEvents}
              className="inline-flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      {/* Header */}
      <div className="text-center max-w-4xl mx-auto">
        <h1 className="text-5xl font-bold text-gray-900 mb-4">
          Discover Amazing Events
        </h1>
        <p className="text-gray-600 text-lg max-w-2xl mx-auto">
          Find and join exciting events happening around you. From music
          festivals to tech workshops, we've got something for everyone.
        </p>
      </div>

      {/* Search and Filters */}
      <div className="mt-12 max-w-4xl mx-auto">
        <div className="bg-white p-4 rounded-2xl shadow-lg border border-gray-100">
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search events by name, location, or description..."
              className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {/* Filters */}
          <div className="mt-4 flex flex-wrap items-center gap-4">
            <div className="flex-1">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="date">Sort by Date</option>
                <option value="popularity">Sort by Popularity</option>
                <option value="price">Sort by Price</option>
              </select>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setView("grid")}
                className={`p-2 rounded-lg ${
                  view === "grid"
                    ? "bg-blue-100 text-blue-600"
                    : "bg-gray-100 text-gray-600"
                }`}
              >
                Grid
              </button>
              <button
                onClick={() => setView("list")}
                className={`p-2 rounded-lg ${
                  view === "list"
                    ? "bg-blue-100 text-blue-600"
                    : "bg-gray-100 text-gray-600"
                }`}
              >
                List
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Categories */}
      <div className="mt-8 max-w-7xl mx-auto">
        <div className="flex flex-wrap gap-3 justify-center">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-6 py-2 rounded-full transition-all ${
                selectedCategory === category
                  ? "bg-blue-600 text-white shadow-lg shadow-blue-200"
                  : "bg-white text-gray-700 hover:bg-gray-50"
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Events Display */}
      <div className="mt-12 max-w-7xl mx-auto">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          {filteredEvents.length > 0
            ? `${filteredEvents.length} Events Found`
            : "No Events Found"}
        </h2>

        {view === "grid" ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEvents.map((event) => (
              <Link
                key={event._id}
                to={`/event/${event._id}`}
                className="group bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100"
              >
                <div className="relative aspect-video overflow-hidden">
                  <img
                    src={
                      event.image ||
                      "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80"
                    }
                    alt={event.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute top-4 right-4 bg-black/70 backdrop-blur-sm text-white px-3 py-1 rounded-full text-xs">
                    {event.price === 0 || !event.price
                      ? "Free"
                      : `GH₵${event.price}.00`}
                  </div>
                </div>

                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                    {event.title}
                  </h3>

                  <div className="mt-4 space-y-2">
                    <div className="flex items-center text-gray-600">
                      <Calendar className="w-4 h-4 mr-2" />
                      <span>
                        {format(
                          new Date(event.date),
                          "MMM d, yyyy 'at' h:mm a"
                        )}
                      </span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <MapPin className="w-4 h-4 mr-2" />
                      <span className="truncate">{event.location}</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <Users className="w-4 h-4 mr-2" />
                      <span>{event.attendees?.length || 0} attending</span>
                    </div>
                  </div>

                  <div className="mt-6 flex items-center justify-between">
                    <span className="text-sm font-medium text-blue-600">
                      {event.category}
                    </span>
                    <span className="text-gray-600 group-hover:text-blue-600 transition-colors inline-flex items-center">
                      View Details
                      <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredEvents.map((event) => (
              <Link
                key={event._id}
                to={`/event/${event._id}`}
                className="block bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100"
              >
                <div className="flex">
                  <div className="w-48 h-48 flex-shrink-0">
                    <img
                      src={
                        event.image ||
                        "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80"
                      }
                      alt={event.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 p-6">
                    <div className="flex justify-between items-start">
                      <h3 className="text-xl font-semibold text-gray-900">
                        {event.title}
                      </h3>
                      <span className="bg-black/70 backdrop-blur-sm text-white px-3 py-1 rounded-full text-xs">
                        {event.price === 0 || !event.price
                          ? "Free"
                          : `GH₵${event.price}.00`}
                      </span>
                    </div>

                    <div className="mt-4 space-y-2">
                      <div className="flex items-center text-gray-600">
                        <Calendar className="w-4 h-4 mr-2" />
                        <span>
                          {format(
                            new Date(event.date),
                            "MMM d, yyyy 'at' h:mm a"
                          )}
                        </span>
                      </div>
                      <div className="flex items-center text-gray-600">
                        <MapPin className="w-4 h-4 mr-2" />
                        <span className="truncate">{event.location}</span>
                      </div>
                      <div className="flex items-center text-gray-600">
                        <Users className="w-4 h-4 mr-2" />
                        <span>{event.attendees?.length || 0} attending</span>
                      </div>
                    </div>

                    <div className="mt-4 flex items-center justify-between">
                      <span className="text-sm font-medium text-blue-600">
                        {event.category}
                      </span>
                      <span className="text-gray-600 hover:text-blue-600 transition-colors inline-flex items-center">
                        View Details
                        <ArrowRight className="w-4 h-4 ml-1" />
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        {filteredEvents.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">
              No events match your search criteria.
            </p>
            <button
              onClick={() => {
                setSearch("");
                setSelectedCategory("All");
              }}
              className="mt-4 text-blue-600 hover:text-blue-700 font-medium"
            >
              Clear filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ExplorePage;
