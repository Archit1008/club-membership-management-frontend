import React, { useState } from 'react';
import { updateEvent } from '../api/eventApi';
import './UpdateEventForm.css'; // Import the CSS file

const UpdateEventForm = () => {
  const [eventId, setEventId] = useState('');
  const [eventDate, setEventDate] = useState('');
  const [rsvp, setRsvp] = useState('');
  const [message, setMessage] = useState('');

  const handleUpdate = async (e) => {
    e.preventDefault();

    const formattedDate = eventDate ? `${eventDate}T00:00:00` : null;

    const eventData = {
      id: parseInt(eventId),
      eventDate: formattedDate,
      rsvp: rsvp || null
    };

    try {
      const response = await updateEvent(eventData);
      setMessage(response.data);
    } catch (error) {
      const errorMsg =
        typeof error.response?.data === 'string'
          ? error.response.data
          : error.response?.data?.message || 'Error updating event';
      setMessage(errorMsg);
    }
  };

  return (
    <div className="update-card">
      <h2>Update Event</h2>
      <form onSubmit={handleUpdate} className="update-form">
        <label>Event ID:</label>
        <input
          type="number"
          value={eventId}
          onChange={(e) => setEventId(e.target.value)}
          required
        />

        <label>Event Date:</label>
        <input
          type="date"
          value={eventDate}
          onChange={(e) => setEventDate(e.target.value)}
        />

        <label>RSVP:</label>
        <input
          type="text"
          value={rsvp}
          onChange={(e) => setRsvp(e.target.value)}
        />

        <button type="submit">Update Event</button>
      </form>
      {message && <p className="update-message">{message}</p>}
    </div>
  );
};

export default UpdateEventForm;