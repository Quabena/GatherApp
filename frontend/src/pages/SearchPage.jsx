import React, { useState, useEffect } from "react";
import { FiSearch, FiSliders, FiX } from "react-icons/fi";
import EventList from "../components/EventList/EventList";
import Button from "../components/Button/Button";
import axios from "axios";

const SearchPage = () => {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filters, setFilters] = useState({
    searchQuery: "",
    category: "all",
    date: "",
    priceRange: [0, 100],
    distance: "any",
  });
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
        setError(null);
      } catch (err) {
        console.error("Error fetching events:", err);
        setError(err.response?.data?.message || "Failed to fetch events");
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  // Filtering Events
  const filteredEvents = events.filter((event) => {
    const matchesSearch =
      event.title.toLowerCase().includes(filters.searchQuery.toLowerCase()) ||
      event.location.toLowerCase().includes(filters.searchQuery.toLowerCase());

    const matchesCategory =
      filters.category === "all" || event.category === filters.category;
    const matchesDate = !filters.date || event.date.includes(filters.date);
    const matchesPrice =
      event.price >= filters.priceRange[0] &&
      event.price <= filters.priceRange[1];
    // Note: Distance filtering would require actual location data
    const matchesDistance = true; // Temporary since we don't have distance data from API

    return (
      matchesSearch &&
      matchesCategory &&
      matchesDate &&
      matchesPrice &&
      matchesDistance
    );
  });

  const handleFilterChange = (field, value) => {
    setFilters((prev) => ({ ...prev, [field]: value }));
  };

  const resetFilters = () => {
    setFilters({
      searchQuery: "",
      category: "all",
      date: "",
      priceRange: [0, 100],
      distance: "any",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading events...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* The Search Header */}
        <div className="bg-white p-6 rounded-xl shadow-sm mb-8">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-bold">Find Events</h1>

            <Button
              variant="secondary"
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className="md:hidden"
            >
              <FiSliders className="mr-2" /> Filters
            </Button>
          </div>

          {/* The Search Bar */}
          <div className="relative">
            <input
              type="text"
              placeholder="Search events..."
              className="w-full p-4 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
              value={filters.searchQuery}
              onChange={(e) =>
                handleFilterChange("searchQuery", e.target.value)
              }
            />
            <FiSearch className="absolute right-4 top-4 text-gray-400" />
          </div>
        </div>

        {/* Filters and Results */}
        <div className="grid md:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          <div
            className={`md:col-span-1 bg-white p-6 rounded-xl shadow-sm md:block ${
              isFilterOpen ? "block" : "hidden"
            }`}
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">Filters</h2>

              <button
                onClick={() => setIsFilterOpen(false)}
                className="md:hidden text-gray-500 hover:text-gray-700"
              >
                <FiX size={20} />
              </button>
            </div>

            {/* Category Filter */}
            <div className="mb-6">
              <label className="block text-sm font-medium mb-2">Category</label>
              <select
                className="w-full p-2 border border-gray-300 rounded-lg"
                value={filters.category}
                onChange={(e) => handleFilterChange("category", e.target.value)}
              >
                <option value="all">All Categories</option>
                <option value="Music">Music</option>
                <option value="Tech">Tech</option>
                <option value="Movie">Movie</option>
                <option value="Art">Art</option>
                <option value="Sports">Sports</option>
                <option value="Workshop">Workshop</option>
                <option value="History">History</option>
                <option value="Food">Food</option>
                <option value="Culture">Culture</option>
                <option value="Festival">Festival</option>
                <option value="Fun-Games">Fun-Games</option>
                <option value="Fashion">Fashion</option>
                <option value="Adventure">Adventure</option>
                <option value="Church">Church</option>
                <option value="Business">Business</option>
                <option value="General Gathering">General Gathering</option>
              </select>
            </div>

            {/* Date Filter */}
            <div className="mb-6">
              <label className="block text-sm font-medium mb-2">Date</label>
              <input
                type="date"
                className="w-full p-2 border border-gray-300 rounded-lg"
                value={filters.date}
                onChange={(e) => handleFilterChange("date", e.target.value)}
              />
            </div>

            {/* Price Filter */}
            <div className="mb-6">
              <label className="block text-sm font-medium mb-2">
                Price Range: GH₵ {filters.priceRange[0]} -{" "}
                {filters.priceRange[1]}
              </label>
              <input
                type="range"
                min="0"
                max="500"
                step="10"
                value={filters.priceRange[1]}
                onChange={(e) =>
                  handleFilterChange("priceRange", [
                    0,
                    parseInt(e.target.value),
                  ])
                }
                className="w-full"
              />
            </div>

            {/* Distance Filter */}
            <div className="mb-6">
              <label className="block text-sm font-medium mb-2">Distance</label>
              <select
                className="w-full p-2 border border-gray-300 rounded-lg"
                value={filters.distance}
                onChange={(e) => handleFilterChange("distance", e.target.value)}
              >
                <option value="any">Any Distance</option>
                <option value="2">Within 2 Miles</option>
                <option value="5">Within 5 Miles</option>
                <option value="10">Within 10 Miles</option>
                <option value="25">Within 20 Miles</option>
              </select>
            </div>

            <Button
              variant="secondary"
              onClick={resetFilters}
              className="w-full"
            >
              Clear Filters
            </Button>
          </div>

          {/* Results */}
          <div className="md:col-span-3">
            <div className="flex items-center justify-between mb-6">
              <span className="text-gray-600">
                Showing {filteredEvents.length} results
              </span>
              <select className="p-2 border border-gray-300 rounded-lg">
                <option>Sort by: Newest</option>
                <option>Sort by: Price</option>
                <option>Sort by: Distance</option>
              </select>
            </div>
            <EventList events={filteredEvents} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchPage;
