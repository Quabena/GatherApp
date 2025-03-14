import React from "react";
import EventCard from "../EventCard/EventCard";

const EventList = ({ events }) => {
  return (
    <div className="space-y-6">
      {events.map((event) => (
        <EventCard key={event.id} event={event} />
      ))}
    </div>
  );
};

export default EventList;
