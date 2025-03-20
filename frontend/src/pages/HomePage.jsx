import React, { useState, useRef, useEffect } from "react";
import Navbar from "../components/Navbar/Navbar";
import SearchFilters from "../components/SearchFilters/SearchFilters";
import EventList from "../components/EventList/EventList";
import Map from "../components/Map/Map";

const mockEvents = [
  {
    id: 1,
    title: "Local Music Festival",
    date: "2023-10-15",
    location: "Ratray Park, Kumasi",
    category: "Entertainment",
    image: "https://picsum.photos/1920/1080?random=1",
  },
  {
    id: 2,
    title: "Telecel Ghana Music Awards",
    date: "2024-11-14",
    location: "Accra International Conference Center, Accra",
    category: "Entertainment",
    image: "https://picsum.photos/1920/1080?random=2",
  },
  {
    id: 3,
    title: "Tech Startup Workshop",
    date: "2024-12-27",
    location: "ALX Tech Hub, Accra",
    category: "Tech",
    image: "https://picsum.photos/1920/1080?random=3",
  },
  {
    id: 1,
    title: "Local Music Festival",
    date: "2023-10-15",
    location: "Ratray Park, Kumasi",
    category: "Entertainment",
    image: "https://picsum.photos/1920/1080?random=4",
  },
  {
    id: 2,
    title: "Telecel Ghana Music Awards",
    date: "2024-11-14",
    location: "Accra International Conference Center, Accra",
    category: "Entertainment",
    image: "https://picsum.photos/1920/1080?random=5",
  },
  {
    id: 3,
    title: "Tech Startup Workshop",
    date: "2024-12-27",
    location: "ALX Tech Hub, Accra",
    category: "Tech",
    image: "https://picsum.photos/1920/1080?random=6",
  },
];

const HighlightEvents = ({ events }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % events.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [events.length]);

  return (
    <div className="relative w-full h-[400px] overflow-hidden">
      <div
        className="absolute inset-0 flex transition-transform ease-in-out duration-1000"
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {events.map((event) => (
          <div key={event.id} className="w-full flex-shrink-0 relative">
            <img
              src={event.image}
              alt={event.title}
              className="w-full h-[400px] object-cover rounded-lg shadow-lg"
            />
            <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white p-4">
              <h3 className="text-lg font-bold">{event.title}</h3>
              <p className="text-sm">
                {event.date} - {event.location}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const HomePage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedDate, setSelectedDate] = useState("");
  const [showSearch, setShowSearch] = useState(false);

  const searchRef = useRef(null);

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

  const filteredEvents = mockEvents.filter((event) => {
    const matchesSearch =
      event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.location.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory =
      selectedCategory === "all" || event.category === selectedCategory;

    const matchesDate = !selectedDate || event.date === selectedDate;

    return matchesSearch && matchesCategory && matchesDate;
  });

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
        <HighlightEvents events={mockEvents} />
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
            <EventList events={filteredEvents} />
          ) : (
            <p className="text-gray-500">No events found.</p>
          )}
        </div>
      </div>

      {/* Map Section (Moved Below) */}
      <div className="max-w-7xl mx-auto px-6 py-10">
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">
          Explore Events on the Map
        </h2>
        <div className="rounded-2xl shadow-xl overflow-hidden">
          <Map events={filteredEvents} />
        </div>
      </div>
    </div>
  );
};

export default HomePage;
