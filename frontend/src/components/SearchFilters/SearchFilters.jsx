import React from "react";
import { FiSearch, FiFilter, FiCalendar } from "react-icons/fi";

const SearchFilters = ({
  searchQuery,
  setSearchQuery,
  selectedCategory,
  setSelectedCategory,
  selectedDate,
  setSelectedDate,
}) => {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm mb-8">
      <div className="flex flex-col md:flex-row gap-4 mb-4">
        <div className="flex items-center w-full bg-gray-100 rounded-lg px-4 py-2">
          <FiSearch className="text-gray-500 mr-2" />
          <input
            type="text"
            placeholder="Search events or locations..."
            className="w-full bg-transparent outline-none"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex gap-4">
          <div className="flex items-center bg-gray-100 rounded-lg px-4 py-2">
            <FiFilter className="text-gray-500 mr-2" />
            <select
              className="bg-transparent outline-none"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              <option value="all">All Categories</option>
              <option value="Entertainment">Entertainment</option>
              <option value="Tech">Tech</option>
            </select>
          </div>
          <div className="flex items-center bg-gray-100 rounded-lg px-4 py-2">
            <FiCalendar className="text-gray-500 mr-2" />
            <input
              type="date"
              className="bg-transparent outline-none"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchFilters;
