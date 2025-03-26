import mongoose from "mongoose";
import Event from "./models/Event.js"; // Import your Event model
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

// Sample event data
const sampleEvents = [
  {
    title: "ALX Tech Conference 2025",
    date: "2025-10-15T19:00:00",
    location: "Accra, Ghana.",
    description: "A conference about the latest in technology.",
    organizer: "67dc822b5aa888ba1d3475e5",
    image: "https://picsum.photos/1920/1080?random=1",
    price: 0,
    requiresRegistration: true,
    coordinates: {
      type: "Point",
      coordinates: [5.614818, -0.205874],
    },
    category: "Tech",
  },
  {
    title: "Live Music Festival",
    date: "2024-12-20T18:00:00",
    location: "SG Mall, Kumasi, Ghana.",
    description: "A festival featuring top artists from around the world.",
    organizer: "67dc822b5aa888ba1d3475e5",
    image: "https://picsum.photos/1920/1080?random=2",
    price: 50,
    requiresRegistration: true,
    coordinates: {
      type: "Point",
      coordinates: [6.700071, -1.630783],
    },
    category: "Music",
  },
  {
    title: "Food Festival",
    date: "2024-11-10T12:00:00",
    location: "Nsawam, Ghana.",
    description: "A celebration of global cuisines.",
    organizer: "67dc822b5aa888ba1d3475e5",
    image: "https://picsum.photos/1920/1080?random=3",
    price: 20,
    requiresRegistration: true,
    coordinates: {
      type: "Point",
      coordinates: [5.8088672, -0.3505737],
    },
    category: "Food",
  },
  {
    title: "Accra Fashion Week",
    date: "2025-03-05T17:00:00",
    location: "National Theatre, Accra, Ghana.",
    description: "Showcasing Ghanaian and international designers.",
    organizer: "67dc822b5aa888ba1d3475e5",
    image: "https://picsum.photos/1920/1080?random=4",
    price: 30,
    requiresRegistration: true,
    coordinates: {
      type: "Point",
      coordinates: [5.5571, -0.2075],
    },
    category: "Fashion",
  },
  {
    title: "Ghana Startup Summit",
    date: "2025-08-25T09:00:00",
    location: "Impact Hub, Accra, Ghana.",
    description: "Connecting investors with young entrepreneurs.",
    organizer: "67dc822b5aa888ba1d3475e5",
    image: "https://picsum.photos/1920/1080?random=5",
    price: 15,
    requiresRegistration: true,
    coordinates: {
      type: "Point",
      coordinates: [5.6145, -0.187],
    },
    category: "Business",
  },
  {
    title: "Kente Weaving Workshop",
    date: "2025-07-10T10:00:00",
    location: "Bonwire, Ghana.",
    description: "A hands-on workshop on traditional Kente weaving.",
    organizer: "67dc822b5aa888ba1d3475e5",
    image: "https://picsum.photos/1920/1080?random=6",
    price: 10,
    requiresRegistration: false,
    coordinates: {
      type: "Point",
      coordinates: [6.9931, -1.4688],
    },
    category: "Culture",
  },
  {
    title: "Takoradi Street Carnival",
    date: "2025-12-26T14:00:00",
    location: "Market Circle, Takoradi, Ghana.",
    description: "A vibrant street carnival with music, dance, and food.",
    organizer: "67dc822b5aa888ba1d3475e5",
    image: "https://picsum.photos/1920/1080?random=7",
    price: 0,
    requiresRegistration: false,
    coordinates: {
      type: "Point",
      coordinates: [4.8952, -1.7534],
    },
    category: "Festival",
  },
  {
    title: "Kwahu Easter Paragliding Festival",
    date: "2025-04-18T08:00:00",
    location: "Kwahu, Ghana.",
    description: "An exciting paragliding adventure over the Kwahu mountains.",
    organizer: "67dc822b5aa888ba1d3475e5",
    image: "https://picsum.photos/1920/1080?random=8",
    price: 200,
    requiresRegistration: true,
    coordinates: {
      type: "Point",
      coordinates: [6.647, -0.7367],
    },
    category: "Adventure",
  },
  {
    title: "Ghana Film Festival",
    date: "2025-09-15T18:30:00",
    location: "Silverbird Cinemas, Accra, Ghana.",
    description: "A week-long festival celebrating Ghanaian and African films.",
    organizer: "67dc822b5aa888ba1d3475e5",
    image: "https://picsum.photos/1920/1080?random=9",
    price: 25,
    requiresRegistration: true,
    coordinates: {
      type: "Point",
      coordinates: [5.6051, -0.1873],
    },
    category: "Movie",
  },
  {
    title: "Accra Marathon",
    date: "2025-11-02T06:00:00",
    location: "Independence Square, Accra, Ghana.",
    description: "Annual marathon promoting health and fitness.",
    organizer: "67dc822b5aa888ba1d3475e5",
    image: "https://picsum.photos/1920/1080?random=10",
    price: 10,
    requiresRegistration: true,
    coordinates: {
      type: "Point",
      coordinates: [5.5471, -0.1922],
    },
    category: "Sports",
  },
  {
    title: "Chale Wote Art Festival",
    date: "2025-08-20T10:00:00",
    location: "Jamestown, Accra, Ghana.",
    description: "A vibrant street art festival celebrating creativity.",
    organizer: "67dc822b5aa888ba1d3475e5",
    image: "https://picsum.photos/1920/1080?random=11",
    price: 0,
    requiresRegistration: false,
    coordinates: {
      type: "Point",
      coordinates: [5.5356, -0.2231],
    },
    category: "Art",
  },
  {
    title: "Cape Coast History Tour",
    date: "2025-06-10T09:00:00",
    location: "Cape Coast Castle, Ghana.",
    description: "A guided tour exploring Ghana’s rich history.",
    organizer: "67dc822b5aa888ba1d3475e5",
    image: "https://picsum.photos/1920/1080?random=12",
    price: 5,
    requiresRegistration: true,
    coordinates: {
      type: "Point",
      coordinates: [5.1036, -1.2474],
    },
    category: "History",
  },
];

// Connect to MongoDB
const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB");

    // Clear existing events (optional)
    await Event.deleteMany({});
    console.log("Cleared existing events");

    // Insert sample events
    await Event.insertMany(sampleEvents);
    console.log("Inserted sample events");

    // Disconnect from MongoDB
    await mongoose.disconnect();
    console.log("Disconnected from MongoDB");
  } catch (err) {
    console.error("Error seeding database:", err);
    process.exit(1);
  }
};

// Run the seed script
seedDatabase();
