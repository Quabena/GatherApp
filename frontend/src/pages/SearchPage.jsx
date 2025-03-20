import React, { useState } from "react";
import { FiSearch, FiSliders, FiX } from "react-icons/fi";
import EventList from "../components/EventList/EventList";
import Button from "../components/Button/Button";

// Mock data (replace with API data in Phase 3)
const allEvents = [
  {
    id: 1,
    title: "Jazz Night Live",
    date: "2023-11-05",
    location: "SG Mall, Kumasi",
    category: "Music",
    price: 100,
    distance: 2.5,
    image: "https://picsum.photos/1920/1080?random",
  },
  {
    id: 2,
    title: "ALX Tech Startup Workshop",
    date: "2023-11-12",
    location: "Tech Hub, Accra",
    category: "Workshop",
    price: 0,
    distance: 5.1,
    image: "https://picsum.photos/1920/1080?random",
  },
];

const SearchPage = () => {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filters, setFilters] = useState({
    searchQuery: "",
    category: "all",
    date: "",
    priceRange: [0, 100],
    distance: "any",
  });

  // Filtering Evenst
  const filteredEvents = allEvents.filter((event) => {
    const matchesSearch =
      event.title.toLowerCase().includes(filters.searchQuery.toLowerCase()) ||
      event.location.toLowerCase().includes(filters.searchQuery.toLowerCase());

    const matchesCategory =
      filters.category == "all" || event.category === filters.category;
    const matchesDate = !filters.date || event.date === filters.date;
    const matchesPrice =
      event.price >= filters.priceRange[0] &&
      event.price <= filters.priceRange[1];
    const matchesDistance =
      filters.distance === "any" ||
      event.distance <= parseInt(filters.distance);

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

        {/* Filters and Resutls */}
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
                <option value="Entertainment">Entertainment</option>
                <option value="Sports">Sports</option>
                <option value="all">All Categories</option>
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
                <option value="25">Within 20 Miels</option>
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
              {/* Sorting Dropdowm to be implemented later */}
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
