import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Calendar, MapPin, Users, Clock, Heart, Share2 } from "lucide-react";
import { format, formatDistanceToNow } from "date-fns";
import axios from "axios";
import toast from "react-hot-toast";

const EventCard = ({ event }) => {
  const [isLiked, setIsLiked] = useState(event?.userLiked || false);
  const [likeCount, setLikeCount] = useState(event?.likes?.length || 0);
  const [registeredCount] = useState(event?.registeredCount || 0);

  // Format date and time
  const eventDate = new Date(event.date);
  const formattedDate = format(eventDate, "MMM d, yyyy");
  const formattedTime = format(eventDate, "h:mm a");
  const timeFromNow = formatDistanceToNow(eventDate, { addSuffix: true });

  // Calculate price display
  const priceDisplay = event.price === 0 ? "Free" : `GH₵${event.price}`;

  // Handle share click
  const handleShare = async (e) => {
    e.preventDefault();
    try {
      await navigator.share({
        title: event.title,
        text: event.description,
        url: `${window.location.origin}/event/${event._id}`,
      });
    } catch (err) {
      console.error("Share failed:", err);
      toast.error("Sharing not supported or failed");
    }
  };

  // Handle like click
  const handleLike = async (e) => {
    e.preventDefault();
    try {
      const endpoint = isLiked
        ? `http://localhost:5000/api/events/${event._id}/unlike`
        : `http://localhost:5000/api/events/${event._id}/like`;

      const response = await axios.post(
        endpoint,
        {},
        {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      setIsLiked(!isLiked);
      setLikeCount(response.data.likes);
    } catch (err) {
      console.error("Error toggling like:", err);
      toast.error(err.response?.data?.message || "Failed to update like");
    }
  };

  // Get event status
  const getEventStatus = () => {
    if (!event?.date) return "upcoming";
    const now = new Date();
    const eventDate = new Date(event.date);
    const endTime = new Date(eventDate.getTime() + 5 * 60 * 60 * 1000);

    if (now > endTime) return "ended";
    if (now >= eventDate && now <= endTime) return "ongoing";
    return "upcoming";
  };

  const eventStatus = getEventStatus();
  const statusColors = {
    upcoming: "bg-green-100 text-green-800",
    ongoing: "bg-yellow-100 text-yellow-800",
    ended: "bg-red-100 text-red-800",
  };

  return (
    <Link
      to={`/event/${event._id}`}
      className="group relative bg-white rounded-xl overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
    >
      {/* Status Badge */}
      <span
        className={`absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-medium ${statusColors[eventStatus]}`}
      >
        {eventStatus.charAt(0).toUpperCase() + eventStatus.slice(1)}
      </span>

      {/* Image Container */}
      <div className="relative aspect-[16/9] overflow-hidden">
        <img
          src={
            event.image ||
            "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80"
          }
          alt={event.title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />

        {/* Category Badge */}
        <span className="absolute top-4 left-4 bg-blue-600/90 backdrop-blur-sm text-white px-3 py-1 rounded-full text-xs font-medium uppercase tracking-wide">
          {event.category}
        </span>

        {/* Price Badge */}
        <span className="absolute top-4 right-4 bg-black/70 backdrop-blur-sm text-white px-3 py-1 rounded-full text-xs font-medium">
          {priceDisplay}
        </span>

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>

      {/* Content */}
      <div className="p-5">
        {/* Title */}
        <h3 className="text-lg font-semibold text-gray-900 line-clamp-2 mb-3 group-hover:text-blue-600 transition-colors">
          {event.title}
        </h3>

        {/* Meta Information */}
        <div className="space-y-2 text-sm">
          <div className="flex items-center text-gray-600">
            <Calendar className="w-4 h-4 mr-2" />
            <span>{formattedDate}</span>
          </div>

          <div className="flex items-center text-gray-600">
            <Clock className="w-4 h-4 mr-2" />
            <span>{formattedTime}</span>
            <span className="ml-2 text-xs text-gray-500">({timeFromNow})</span>
          </div>

          <div className="flex items-center text-gray-600">
            <MapPin className="w-4 h-4 mr-2" />
            <span className="truncate">{event.location}</span>
          </div>

          <div className="flex items-center text-gray-600">
            <Users className="w-4 h-4 mr-2" />
            <span>
              {registeredCount} / {event.capacity || 100} registered
            </span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="h-1 bg-gray-200 rounded-full overflow-hidden mt-3">
          <div
            className="h-full bg-blue-600 rounded-full"
            style={{
              width: `${(registeredCount / (event.capacity || 100)) * 100}%`,
            }}
          />
        </div>

        {/* Action Buttons */}
        <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-100">
          <div className="flex items-center gap-1 text-sm text-gray-500">
            <Heart
              className={`w-4 h-4 ${
                isLiked ? "text-red-500 fill-current" : ""
              }`}
            />
            <span>{likeCount}</span>
          </div>

          <div className="flex gap-2">
            <button
              onClick={handleLike}
              className={`p-2 rounded-full transition-colors ${
                isLiked
                  ? "text-red-500 bg-red-50 hover:bg-red-100"
                  : "text-gray-400 hover:text-red-500 hover:bg-gray-100"
              }`}
            >
              <Heart
                className="w-5 h-5"
                fill={isLiked ? "currentColor" : "none"}
              />
            </button>

            <button
              onClick={handleShare}
              className="p-2 rounded-full text-gray-400 hover:text-blue-500 hover:bg-gray-100 transition-colors"
            >
              <Share2 className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default EventCard;
