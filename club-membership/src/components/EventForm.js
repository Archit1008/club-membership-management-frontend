
// src/components/EventForm.jsx
// import React, { useState } from "react";
// import { saveEvent } from "../api/eventApi";
// import { useNavigate } from "react-router-dom";
// import "./EventForm.css"; // Import the CSS file

// const EventForm = ({ onEventCreated }) => {
//   const [eventName, setEventName] = useState("");
//   const [eventDate, setEventDate] = useState("");
//   const navigate = useNavigate();

//   const handleSubmit = (e) => {
//     e.preventDefault();

//     // ✅ Read clubId directly from localStorage
//     const clubId = localStorage.getItem("clubId");
//     if (!clubId) {
//       alert("Club ID not found. Please register a club first or re-login.");
//       return;
//     }

//     const newEvent = {
//       eventName,
//       eventDate,
//       rsvp: false,
//       clubId, // ✅ include clubId in payload
//     };

//     saveEvent(newEvent)
//       .then(() => {
//         alert("Event created!");
//         setEventName("");
//         setEventDate("");
//         onEventCreated?.(newEvent);
//         navigate("/eventsList");
//       })
//       .catch((error) => {
//         console.error("Error creating event:", error);
//         const msg =
//           error?.response?.data?.message ||
//           (typeof error?.response?.data === "string" ? error.response.data : null) ||
//           "Failed to create event";
//         alert(msg);
//       });
//   };

//   return (
//     <div className="event-card">
//       <form onSubmit={handleSubmit} className="event-form">
//         <h3>Create New Event</h3>
//         <input
//           type="text"
//           placeholder="Event Name"
//           value={eventName}
//           onChange={(e) => setEventName(e.target.value)}
//           required
//         />
//         <input
//           type="datetime-local"
//           value={eventDate}
//           onChange={(e) => setEventDate(e.target.value)}
//           required
//         />
//         <button type="submit">Create Event</button>
//       </form>
//     </div>
//   );
// };

// export default EventForm;



import React, { useEffect, useState } from "react";
import { saveEvent } from "../api/eventApi";
import { getActiveMembership } from "../api/membershipApi";
import { useNavigate } from "react-router-dom";
import "./EventForm.css";

const EventForm = ({ onEventCreated }) => {
  const [eventName, setEventName] = useState("");
  const [eventDate, setEventDate] = useState(""); // HTML datetime-local string
  const [submitting, setSubmitting] = useState(false);
  const [membership, setMembership] = useState(null);
  const [membershipLoading, setMembershipLoading] = useState(false);
  const [membershipMsg, setMembershipMsg] = useState("");

  const navigate = useNavigate();

  // Resolve ownerUserId from localStorage or JWT payload
  const resolveOwnerUserId = () => {
    const stored = localStorage.getItem("userId");
    if (stored) return stored;
    const token = localStorage.getItem("token");
    if (!token) return null;
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      return payload.userId || payload.sub || null;
    } catch {
      return null;
    }
  };

  const ownerUserId = resolveOwnerUserId();

  // Fetch membership status once
  useEffect(() => {
    if (!ownerUserId) return;
    setMembershipLoading(true);
    getActiveMembership(ownerUserId)
      .then((res) => setMembership(res.data || null))
      .catch((err) => {
        console.error("Error loading membership:", err);
        setMembershipMsg("Could not load membership status.");
        setMembership(null);
      })
      .finally(() => setMembershipLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const isApproved = Boolean(membership && membership.status === "APPROVED");

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Club ID is required for event creation and ownership validation
    const clubId = localStorage.getItem("clubId");
    if (!clubId) {
      alert("Club ID not found. Please open events from a club card or re-login.");
      return;
    }

    // Frontend gating (server will still enforce)
    if (!isApproved) {
      alert("Membership not approved. Please apply and wait for admin approval.");
      return;
    }

    // Convert datetime-local to ISO string if needed
    // Most browsers return "YYYY-MM-DDTHH:mm" (without seconds).
    // Backend FlexibleLocalDateTimeDeserializer usually accepts ISO.
    const isoEventDate = new Date(eventDate).toISOString();

    const newEvent = {
      eventName,
      eventDate: isoEventDate,   // ✅ ISO format to be safe
      rsvp: false,
      clubId: Number(clubId),    // ✅ as number if backend expects Long
      ownerUserId                // ✅ backend needs this to validate
    };

    try {
      setSubmitting(true);
      await saveEvent(newEvent);
      alert("Event created!");
      setEventName("");
      setEventDate("");
      onEventCreated?.(newEvent);
      // If your route expects a specific clubId:
      navigate(`/eventsList/${clubId}`);
    } catch (error) {
      console.error("Error creating event:", error);
      const msg =
        error?.response?.data?.message ||
        (typeof error?.response?.data === "string" ? error.response.data : null) ||
        "Failed to create event";
      alert(msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="event-card">
      {/* Membership banner */}
      <div className="membership-info">
        <small>
          {membershipLoading
            ? "Loading membership…"
            : `Membership: ${membership?.type || "None"} — Status: ${membership?.status || "None"}`}
        </small>
        {!isApproved && (
          <small style={{ color: "#c77d00", marginLeft: 8 }}>
            Apply & wait for admin approval to create events.
          </small>
        )}
        {membershipMsg && (
          <small style={{ color: "#b00020", marginLeft: 8 }}>{membershipMsg}</small>
        )}
      </div>

      <form onSubmit={handleSubmit} className="event-form">
        <h3>Create New Event</h3>

        <input
          type="text"
          placeholder="Event Name"
          value={eventName}
          onChange={(e) => setEventName(e.target.value)}
          required
        />

        <input
          type="datetime-local"
          value={eventDate}
          onChange={(e) => setEventDate(e.target.value)}
          required
        />

        <button type="submit" disabled={submitting || !isApproved}>
          {submitting ? "Creating…" : "Create Event"}
        </button>
      </form>
    </div>
  );
};

export default EventForm;
