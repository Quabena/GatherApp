import React, { useState } from "react";
import Navbar from "../components/Navbar/Navbar";
import SearchFilters from "../components/SearchFilters/SearchFilters";
import EventList from "../components/EventList/EventList";
import Map from "../components/Map/Map";
import Loader from "../components/Loader/Loader";

// Mock event data (to be replaced with API data later)
const mockEvents = [
  {
    id: 1,
    title: "Local Music Festival",
    date: "2023-10-15",
    location: "Ratray Park, Kumasi",
    category: "Entertainment",
    image: "https://picsum.photos/1920/1080?random",
  },
  {
    id: 2,
    title: "Telecel Ghana Music Awards",
    date: "2024-11-14",
    location: "Accra International Conference Center, Accra",
    category: "Entertainment",
    image: "https://picsum.photos/1920/1080?random",
  },
  {
    id: 3,
    title: "Tech Startup Workshop",
    date: "2024-12-27",
    location: "ALX Tech Hub, Accra",
    category: "Tech",
    image: "https://picsum.photos/1920/1080?random",
  },
];

const HomePage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedDate, setSelectedDate] = useState("");

  // Filtering events based on search, category, and date
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
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 py-8">
        <SearchFilters
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          selectedDate={selectedDate}
          setSelectedDate={setSelectedDate}
        />
        <div className="grid md:grid-cols-2 gap-8">
          <EventList events={filteredEvents} />
          <Map events={filteredEvents} />
        </div>
      </div>
    </div>
  );
};

export default HomePage;
