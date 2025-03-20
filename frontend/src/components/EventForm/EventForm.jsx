import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FiAlertCircle } from "react-icons/fi";

const EventForm = () => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    date: "",
    location: "",
    category: "Music",
    price: 0,
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("/api/events", formData, {
        withCredentials: true,
      });
      navigate(`/event/${response.data.event._id}`);
    } catch (err) {
      setError(err.message?.data?.message || "Failed to create event");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl mx-auto">
      {error && (
        <div className="bg-red-50 p-3 rounded-lg flex items-center gap-2 text-red-600">
          <FiAlertCircle /> {error}
        </div>
      )}

      {/* Title */}
      <div>
        <label className="block text-sm font-medium mb-2">Event Title</label>
        <input
          type="text"
          required
          className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
        />
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm font-medium mb-2">Description</label>
        <textarea
          required
          className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
          value={formData.description}
          onChange={(e) =>
            setFormData({ ...formData, description: e.target.value })
          }
          rows="4"
        />
      </div>

      {/* Date */}
      <div>
        <label className="block text-sm font-medium mb-2">Date & Time</label>
        <input
          type="datetime-local"
          required
          className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
          value={formData.date}
          onChange={(e) => setFormData({ ...formData, date: e.target.value })}
        />
      </div>

      {/* Location */}
      <div>
        <label className="block text-sm font-medium mb-2">Address</label>
        <input
          type="text"
          required
          className="w-full px-4 py-2 border rounded-lg"
          value={formData.location}
          onChange={(e) =>
            setFormData({ ...formData, location: e.target.value })
          }
        />
        <p className="text-sm text-gray-500 mt-1">
          Enter a valid address (e.g., "Conference Center, Accra.")
        </p>
      </div>

      {/* Category */}
      <div>
        <label className="block text-sm font-medium mb-2">Category</label>
        <select
          className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
          value={formData.category}
          onChange={(e) =>
            setFormData({ ...formData, category: e.target.value })
          }
        >
          <option value="Music">Music</option>
          <option value="Movies">Movies</option>
          <option value="Sports">Sports</option>
          <option value="Food">Food</option>
          <option value="Tech">Tech</option>
        </select>
      </div>

      {/* Price */}
      <div>
        <label className="block text-sm font-medium mb-2">Price (GH₵)</label>
        <input
          type="number"
          min="0"
          required
          className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
          value={formData.price}
          onChange={(e) => setFormData({ ...formData, price: e.target.value })}
        />
      </div>

      <button
        type="submit"
        className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
      >
        Create Event
      </button>
    </form>
  );
};

export default EventForm;
