// src/components/DeleteEventByName.js
import React from "react";
import { deleteEvent } from "../api/eventApi";

const DeleteEventByName = ({ fetchEvents, event }) => {
  const handleDelete = (name) => {
    deleteEvent(name)
      .then(() => {
        alert(`Event "${name}" deleted by name!`);
        fetchEvents();
      })
      .catch((error) => {
        console.error("Delete by name failed:", error);
        alert("Delete by name failed");
      });
  };

  return (
    <button onClick={() => handleDelete(event.eventName)}>
      Delete by Name
    </button>
  );
};

export default DeleteEventByName;