import React from "react";
import "./EventList.css";
import EventItem from "./EventItem/EventItem";

const eventList = props => {
  const events = props.events.map(event => {
    return (
      <EventItem
        eventId={event._id}
        title={event.title}
        price={event.price}
        date={event.date}
        creatorId={event.creator._id}
        userId={props.userId}
        onDetail={props.onDetail}
      />
    );
  });
  return events;
};

export default eventList;
