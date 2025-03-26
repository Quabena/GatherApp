import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
  ArrowLeft,
  Calendar,
  MapPin,
  User,
  Mail,
  Send,
  Clock,
  DollarSign,
  Users,
  Share2,
  Heart,
  MessageSquare,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { GoogleMap, Marker, useLoadScript } from "@react-google-maps/api";
import axios from "axios";

const EventDetailsPage = () => {
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("details");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    specialRequirements: "",
  });
  const [reviews, setReviews] = useState([]);
  const [newReview, setNewReview] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [registrationSuccess, setRegistrationSuccess] = useState(false);

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
  });

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `http://localhost:5000/api/events/${id}`,
          {
            withCredentials: true,
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setEvent(response.data.event);
        setLikeCount(Math.floor(Math.random() * 100) + 50);
        setError(null);
      } catch (err) {
        console.error("Error fetching event:", err);
        setError(err.response?.data?.message || "Failed to fetch event data");
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await axios.post(
        `http://localhost:5000/api/events/${id}/register`,
        formData,
        {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setRegistrationSuccess(true);
      setFormData({ name: "", email: "", phone: "", specialRequirements: "" });
    } catch (err) {
      console.error("Registration failed:", err);
      setError("Registration failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReviewSubmit = (e) => {
    e.preventDefault();
    if (!newReview.trim()) return;

    const review = {
      id: Date.now(),
      text: newReview,
      timestamp: new Date().toLocaleString(),
      author: "Anonymous User",
    };

    setReviews([review, ...reviews]);
    setNewReview("");
  };

  const handleShare = async () => {
    try {
      await navigator.share({
        title: event?.title,
        text: event?.description,
        url: window.location.href,
      });
    } catch (err) {
      console.error("Share failed:", err);
    }
  };

  const getEventStatus = () => {
    if (!event?.date) return "upcoming";

    const eventDate = new Date(event.date);
    const now = new Date();
    const endTime = new Date(eventDate.getTime() + 5 * 60 * 60 * 1000);

    if (now > endTime) return "ended";
    if (now >= eventDate && now <= endTime) return "ongoing";
    return "upcoming";
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <p className="text-red-600">{error}</p>
        </div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-600">Event not found</p>
      </div>
    );
  }

  const eventStatus = getEventStatus();
  const statusColors = {
    upcoming: "bg-green-100 text-green-800",
    ongoing: "bg-yellow-100 text-yellow-800",
    ended: "bg-red-100 text-red-800",
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="relative h-[500px] w-full">
        <img
          src={event.image || "https://picsum.photos/1920/1080"}
          alt={event.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-black/30 flex flex-col items-center justify-end pb-12">
          <div className="text-center text-white max-w-4xl px-4">
            <h1 className="text-5xl font-bold mb-6">{event.title}</h1>
            <div className="flex justify-center items-center gap-8 mb-8">
              <div className="flex items-center">
                <Calendar className="w-5 h-5 mr-2" />
                <span>
                  {new Date(event.date).toLocaleDateString("en-US", {
                    weekday: "long",
                    month: "long",
                    day: "numeric",
                  })}
                </span>
              </div>
              <div className="flex items-center">
                <Clock className="w-5 h-5 mr-2" />
                <span>
                  {new Date(event.date).toLocaleTimeString("en-US", {
                    hour: "numeric",
                    minute: "numeric",
                  })}
                </span>
              </div>
              <div className="flex items-center">
                <MapPin className="w-5 h-5 mr-2" />
                <span>{event.location}</span>
              </div>
            </div>
            <div className="flex justify-center gap-4">
              <button
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center"
                disabled={eventStatus === "ended"}
              >
                {event.price === 0
                  ? "Free Event"
                  : `Buy Tickets (GH₵${event.price}.00)`}
              </button>
              <button
                onClick={handleShare}
                className="px-4 py-3 bg-white/10 backdrop-blur-sm text-white rounded-lg hover:bg-white/20 transition flex items-center"
              >
                <Share2 className="w-5 h-5 mr-2" />
                Share
              </button>
            </div>
            <span
              className={`inline-block px-3 py-1 mt-5 rounded-full text-sm font-medium mb-4 ${statusColors[eventStatus]}`}
            >
              {eventStatus.charAt(0).toUpperCase() + eventStatus.slice(1)}
            </span>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <Link
          to="/"
          className="flex items-center text-gray-600 hover:text-blue-600 transition"
        >
          <ArrowLeft className="w-5 h-5 mr-2" /> Back to Events
        </Link>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8 grid md:grid-cols-3 gap-8">
        {/* Left Column */}
        <div className="md:col-span-2 space-y-8">
          {/* Tabs */}
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8">
              <button
                onClick={() => setActiveTab("details")}
                className={`pb-4 px-1 border-b-2 transition ${
                  activeTab === "details"
                    ? "border-blue-600 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                Event Details
              </button>
              <button
                onClick={() => setActiveTab("register")}
                className={`pb-4 px-1 border-b-2 transition ${
                  activeTab === "register"
                    ? "border-blue-600 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                Register
              </button>
            </nav>
          </div>

          {/* Tab Content */}
          {activeTab === "details" ? (
            <div className="space-y-8">
              <div>
                <h2 className="text-2xl font-bold mb-4">About This Event</h2>
                <p className="text-gray-600 leading-relaxed whitespace-pre-line">
                  {event.description}
                </p>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <h3 className="text-lg font-semibold mb-4">Event Details</h3>
                <div className="grid gap-4">
                  <div className="flex items-center">
                    <Users className="w-5 h-5 text-blue-600 mr-3" />
                    <div>
                      <p className="text-sm text-gray-500">Capacity</p>
                      <p className="text-gray-900">
                        {event.registeredCount || 0} / {event.capacity || 100}{" "}
                        registered
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <Calendar className="w-5 h-5 text-blue-600 mr-3" />
                    <div>
                      <p className="text-sm text-gray-500">Date & Time</p>
                      <p className="text-gray-900">
                        {new Date(event.date).toLocaleDateString("en-US", {
                          weekday: "long",
                          month: "long",
                          day: "numeric",
                          hour: "numeric",
                          minute: "numeric",
                        })}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 p-6 rounded-xl">
                <h3 className="text-lg font-semibold mb-4">Event Organizer</h3>
                <div className="space-y-3">
                  <div className="flex items-center">
                    <User className="w-5 h-5 text-blue-600 mr-3" />
                    <span className="text-gray-700">
                      {event.organizer?.name || "Event Organizer"}
                    </span>
                  </div>
                  {event.organizer?.email && (
                    <div className="flex items-center">
                      <Mail className="w-5 h-5 text-blue-600 mr-3" />
                      <a
                        href={`mailto:${event.organizer.email}`}
                        className="text-blue-600 hover:underline"
                      >
                        {event.organizer.email}
                      </a>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {registrationSuccess ? (
                <div className="bg-green-50 p-6 rounded-xl text-green-700">
                  <h2 className="text-xl font-bold mb-2">
                    Registration Successful!
                  </h2>
                  <p>
                    Thank you for registering. We've sent you a confirmation
                    email with more details.
                  </p>
                </div>
              ) : eventStatus === "ended" ? (
                <div className="bg-red-50 p-6 rounded-xl text-red-700">
                  <h2 className="text-xl font-bold mb-2">Event Ended</h2>
                  <p>This event has already taken place.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6 max-w-md">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name
                    </label>
                    <input
                      type="text"
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number (Optional)
                    </label>
                    <input
                      type="tel"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      value={formData.phone}
                      onChange={(e) =>
                        setFormData({ ...formData, phone: e.target.value })
                      }
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Special Requirements (Optional)
                    </label>
                    <textarea
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      rows={4}
                      value={formData.specialRequirements}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          specialRequirements: e.target.value,
                        })
                      }
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center justify-center"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      "Complete Registration"
                    )}
                  </button>
                </form>
              )}
            </div>
          )}
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Event Stats */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <button
                onClick={() => {
                  setLiked(!liked);
                  setLikeCount(liked ? likeCount - 1 : likeCount + 1);
                }}
                className="flex items-center gap-2 text-gray-600 hover:text-red-500 transition"
              >
                <Heart
                  className={`w-5 h-5 ${
                    liked ? "fill-current text-red-500" : ""
                  }`}
                />
                <span>{likeCount} likes</span>
              </button>
              <div className="flex items-center gap-2 text-gray-600">
                <MessageSquare className="w-5 h-5" />
                <span>{reviews.length} reviews</span>
              </div>
            </div>
            <div className="h-1 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-blue-600 rounded-full"
                style={{
                  width: `${
                    ((event.registeredCount || 0) / (event.capacity || 100)) *
                    100
                  }%`,
                }}
              />
            </div>
            <p className="text-sm text-gray-500 mt-2">
              {event.capacity - (event.registeredCount || 0)} spots remaining
            </p>
          </div>

          {/* Map */}
          {isLoaded && event.coordinates && (
            <div className="h-64 rounded-xl overflow-hidden shadow-sm border border-gray-100">
              <GoogleMap
                center={{
                  lat: event.coordinates.coordinates[1],
                  lng: event.coordinates.coordinates[0],
                }}
                zoom={15}
                mapContainerStyle={{ width: "100%", height: "100%" }}
              >
                <Marker
                  position={{
                    lat: event.coordinates.coordinates[1],
                    lng: event.coordinates.coordinates[0],
                  }}
                />
              </GoogleMap>
            </div>
          )}

          {/* Review Section */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h2 className="text-xl font-bold mb-4">Reviews</h2>
            <form onSubmit={handleReviewSubmit} className="mb-6">
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder="Write a review..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={newReview}
                  onChange={(e) => setNewReview(e.target.value)}
                />
                <button
                  type="submit"
                  className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
            </form>

            <div className="space-y-4">
              {reviews.length > 0 ? (
                reviews.map((review) => (
                  <div key={review.id} className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <User className="w-4 h-4 text-gray-500" />
                      <span className="text-sm font-medium text-gray-700">
                        {review.author}
                      </span>
                    </div>
                    <p className="text-gray-700">{review.text}</p>
                    <p className="text-sm text-gray-500 mt-2">
                      {review.timestamp}
                    </p>
                  </div>
                ))
              ) : (
                <p className="text-center text-gray-500">
                  No reviews yet. Be the first to review!
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetailsPage;
