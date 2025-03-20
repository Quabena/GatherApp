import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FiSearch, FiMapPin } from "react-icons/fi";
import { motion } from "framer-motion";

const categories = [
  "All",
  "Technology",
  "Music",
  "Networking",
  "Sports",
  "Art",
  "Food",
  "Business",
];

const events = [
  {
    id: 1,
    name: "Tech Conference 2025",
    category: "Technology",
    location: "New York",
    image: "https://picsum.photos/1920/1080?random=1",
  },
  {
    id: 2,
    name: "Music Festival",
    category: "Music",
    location: "Los Angeles",
    image: "https://picsum.photos/1920/1080?random=2",
  },
  {
    id: 3,
    name: "Startup Meetup",
    category: "Networking",
    location: "San Francisco",
    image: "https://picsum.photos/1920/1080?random=3",
  },
  {
    id: 4,
    name: "Art Exhibition",
    category: "Art",
    location: "Paris",
    image: "https://picsum.photos/1920/1080?random=4",
  },
  {
    id: 5,
    name: "Food Festival",
    category: "Food",
    location: "Tokyo",
    image: "https://picsum.photos/1920/1080?random=5",
  },
];

const ExplorePage = () => {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const filteredEvents = events.filter(
    (event) =>
      (selectedCategory === "All" || event.category === selectedCategory) &&
      event.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900">Explore Events</h1>
        <p className="text-gray-600 mt-2">
          Find events that match your interests.
        </p>
      </div>

      {/* Search Bar */}
      <div className="flex items-center bg-white p-4 rounded-full shadow-md mt-6 w-full md:w-2/3 mx-auto">
        <FiSearch className="text-gray-500 mr-3" />
        <input
          type="text"
          placeholder="Search events..."
          className="w-full outline-none bg-transparent"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Categories */}
      <div className="mt-8">
        <h2 className="text-lg font-semibold text-gray-900 mb-3">Categories</h2>
        <div className="flex space-x-3 overflow-x-auto pb-2">
          {categories.map((category) => (
            <motion.div
              key={category}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className={`px-4 py-2 rounded-full cursor-pointer whitespace-nowrap shadow-md transition text-white ${
                selectedCategory === category
                  ? "bg-blue-600"
                  : "bg-blue-500 hover:bg-blue-700"
              }`}
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </motion.div>
          ))}
        </div>
      </div>

      {/* Trending Events */}
      <div className="mt-8">
        <h2 className="text-lg font-semibold text-gray-900 mb-3">
          Trending Events
        </h2>
        <div className="grid md:grid-cols-3 gap-6">
          {filteredEvents.length > 0 ? (
            filteredEvents.map((event) => (
              <motion.div
                key={event.id}
                whileHover={{ scale: 1.05 }}
                className="bg-white p-4 rounded-lg shadow-lg transform transition overflow-hidden"
              >
                <img
                  src={event.image}
                  alt={event.name}
                  className="w-full h-44 object-cover rounded-lg"
                />
                <h3 className="text-lg font-bold mt-2">{event.name}</h3>
                <p className="text-gray-500 text-sm flex items-center">
                  <FiMapPin className="mr-1 text-blue-500" /> {event.location}
                </p>
                <p className="mt-1 text-sm text-blue-600">{event.category}</p>
                <Link
                  to={`/event/${event.id}`}
                  className="mt-3 inline-block text-blue-600 hover:underline"
                >
                  View Details
                </Link>
              </motion.div>
            ))
          ) : (
            <p className="text-gray-500">No events found.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ExplorePage;
