// import React, { useEffect, useState } from "react";
// import { useNavigate, useParams } from "react-router-dom";
// import { getEvents, updateRSVPStatus, deleteEvent } from "../api/eventApi";
// import UpdateEventForm from "./UpdateEventForm";
// import EventForm from "./EventForm";
// import "./EventList.css";
// import UserList from "./UserList";
// import {
//   getActiveMembership,
//   getPendingMemberships,
//   approveMembership,
//   rejectMembership,
// } from "../api/membershipApi";

// const EventList = () => {
//   // Events UI state
//   const [events, setEvents] = useState([]);
//   const [loading, setLoading] = useState(false);

//   // Role & tabs
//   const [role, setRole] = useState(null);
//   const [activeTab, setActiveTab] = useState("view");

//   // Owner membership UI state
//   const [membership, setMembership] = useState(null);
//   const [membershipLoading, setMembershipLoading] = useState(false);
//   const [membershipError, setMembershipError] = useState("");

//   // Admin approvals UI state
//   const [pendingMemberships, setPendingMemberships] = useState([]);
//   const [approvalsLoading, setApprovalsLoading] = useState(false);
//   const [approvalsError, setApprovalsError] = useState("");

//   const navigate = useNavigate();

//   // Optional – read clubId from route or localStorage
//   const { clubId: clubIdParam } = useParams();
//   const storedClubId = localStorage.getItem("clubId");
//   const clubId = clubIdParam || storedClubId || null;

//   // Resolve current user id from localStorage or JWT payload
//   const resolveCurrentUserId = () => {
//     const stored = localStorage.getItem("userId");
//     if (stored) return stored;
//     const token = localStorage.getItem("token");
//     if (!token) return null;
//     try {
//       const payload = JSON.parse(atob(token.split(".")[1]));
//       return payload.userId || payload.sub || null;
//     } catch {
//       return null;
//     }
//   };
//   const currentUserId = resolveCurrentUserId();

//   useEffect(() => {
//     // Read role from JWT
//     const token = localStorage.getItem("token");
//     if (token) {
//       try {
//         const payload = JSON.parse(atob(token.split(".")[1]));
//         // If multiple roles exist, we’re taking the first—adjust as needed
//         setRole(payload.roles?.[0] || null);
//       } catch (err) {
//         console.error("Invalid token", err);
//       }
//     }

//     fetchEvents();
//     fetchMembership();

//     // For admin, you can prefetch pending approvals too
//     if (role === "ADMIN") {
//       fetchPendingApprovals();
//     }
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [role]); // re-run when role becomes available

//   /** Events */
//   const fetchEvents = () => {
//     setLoading(true);
//     getEvents()
//       .then((response) => {
//         setEvents(response.data || []);
//       })
//       .catch((error) => {
//         console.error("Error fetching events:", error);
//       })
//       .finally(() => setLoading(false));
//   };

//   /** Owner membership */
//   const fetchMembership = () => {
//     if (!currentUserId) return;
//     setMembershipLoading(true);
//     setMembershipError("");
//     getActiveMembership(currentUserId)
//       .then((res) => setMembership(res.data || null))
//       .catch((err) => {
//         console.error("Error fetching membership:", err);
//         const msg =
//           err?.response?.data?.message ||
//           (typeof err?.response?.data === "string" ? err.response.data : null) ||
//           "Failed to load membership.";
//         setMembershipError(msg);
//         setMembership(null);
//       })
//       .finally(() => setMembershipLoading(false));
//   };

//   const isApproved = Boolean(membership && membership.status === "APPROVED");

//   /** Admin approvals */
//   const fetchPendingApprovals = () => {
//     setApprovalsLoading(true);
//     setApprovalsError("");
//     getPendingMemberships() // optional: pass 'GOLD' or 'SILVER' to filter
//       .then((res) => setPendingMemberships(Array.isArray(res.data) ? res.data : []))
//       .catch((err) => {
//         console.error("Error fetching pending approvals:", err);
//         const msg =
//           err?.response?.data?.message ||
//           (typeof err?.response?.data === "string" ? err.response.data : null) ||
//           "Failed to load pending approvals.";
//         setApprovalsError(msg);
//         setPendingMemberships([]);
//       })
//       .finally(() => setApprovalsLoading(false));
//   };

  
// const onApprove = async (m) => {
//   try {
//     await approveMembership({ id: m.id, remarks: "Approved", start: new Date(), end: null });
//     alert(`Approved ${m.ownerUserId} (${m.type})`);
//     fetchPendingApprovals();
//   } catch (err) { /* handle */ }
// };

// const onReject = async (m) => {
//   try {
//     await rejectMembership({ id: m.id, remarks: "Insufficient details" });
//     alert(`Rejected ${m.ownerUserId} (${m.type})`);
//     fetchPendingApprovals();
//   } catch (err) { /* handle */ }
// };

 

//   /** Tabs guard for owners */
//   const guardTab = (tab) => {
//     if ((tab === "createEvent" || tab === "updateEvent") && role === "OWNER" && !isApproved) {
//       alert("Membership not approved. Please apply in Owner Dashboard and wait for admin approval.");
//       setActiveTab("view");
//       return;
//     }
//     setActiveTab(tab);

//     // Lazy-load admin approvals on demand
//     if (role === "ADMIN" && tab === "approvals") {
//       fetchPendingApprovals();
//     }
//   };

//   /** RSVP toggle */
//   const handleRSVP = (eventId, currentStatus) => {
//     const newStatus = !currentStatus;
//     updateRSVPStatus(eventId, newStatus)
//       .then(() => {
//         setEvents((prev) =>
//           prev.map((e) => (e.id === eventId ? { ...e, rsvp: newStatus } : e))
//         );
//         alert(newStatus ? "Successfully RSVP'd!" : "RSVP undone.");
//       })
//       .catch((error) => {
//         console.error("Error updating RSVP:", error);
//         alert("Failed to update RSVP.");
//       });
//   };

//   /** Delete by name */
//   const handleDelete = (eventName) => {
//     if (window.confirm(`Delete event "${eventName}"?`)) {
//       deleteEvent(eventName)
//         .then(() => {
//           alert("Event deleted successfully!");
//           setEvents((prev) => prev.filter((e) => e.eventName !== eventName));
//         })
//         .catch((error) => {
//           console.error("Error deleting event:", error);
//           alert("Failed to delete event.");
//         });
//     }
//   };

//   /** Logout */
//   const handleLogout = () => {
//     localStorage.removeItem("token");
//     navigate("/");
//   };

//   return (
//     <div className="event-container">
//       {/* Header */}
//       <header className="header">
//         <h1>Club Events</h1>
//         <nav>
//           {role === "ADMIN" && (
//             <div className="admin-tabs">
//               <button onClick={() => guardTab("users")}>Users</button>
//               <button onClick={() => guardTab("approvals")}>Approvals</button>
//               {/* Add other admin tabs here if needed (e.g., Clubs) */}
//             </div>
//           )}

//           {role === "OWNER" && (
//             <div className="owner-tabs">
//               <button onClick={() => guardTab("createEvent")}>Create Event</button>
//               <button onClick={() => guardTab("updateEvent")}>Update Event</button>
//               <button onClick={() => guardTab("view")}>View Events</button>
//             </div>
//           )}

//           <button className="logout-btn" onClick={handleLogout}>Logout</button>
//         </nav>
//       </header>

//       {/* Membership banner (for owners) */}
//       {role === "OWNER" && (
//         <div className="membership-banner">
//           <small>
//             Membership:&nbsp;
//             {membershipLoading
//               ? "Loading..."
//               : membership
//                 ? `${membership.type} — Status: ${membership.status}`
//                 : "None"}
//           </small>
//           {!isApproved && (
//             <small style={{ color: "#c77d00", marginLeft: 8 }}>
//               Apply from Owner Dashboard to enable event creation.
//             </small>
//           )}
//           {membershipError && (
//             <small style={{ color: "#b00020", marginLeft: 8 }}>
//               {membershipError}
//             </small>
//           )}
//           <button
//             onClick={fetchMembership}
//             className="refresh-membership-btn"
//             style={{ marginLeft: 12 }}
//           >
//             Refresh
//           </button>
//         </div>
//       )}

//       {/* Content */}
//       {role === "ADMIN" && activeTab === "users" && <UserList />}

//       {role === "ADMIN" && activeTab === "approvals" && (
//         <AdminApprovalsView
//           loading={approvalsLoading}
//           error={approvalsError}
//           pending={pendingMemberships}
//           onApprove={onApprove}
//           onReject={onReject}
//           onRefresh={fetchPendingApprovals}
//         />
//       )}

//       {role === "OWNER" && activeTab === "createEvent" && isApproved && <EventForm />}
//       {role === "OWNER" && activeTab === "updateEvent" && isApproved && <UpdateEventForm />}

//       {((role === "MEMBER" || role === "OWNER") || activeTab === "view") && (
//         <>
//           <h2>Events</h2>
//           {loading && <p>Loading...</p>}
//           <ul className="event-list">
//             {events.map((event) => (
//               <li key={event.id} className="event-item">
//                 <strong>{event.eventName}</strong> — {event.eventDate}
//                 {(role === "MEMBER" || role === "OWNER") && (
//                   <button
//                     className={`rsvp-btn ${event.rsvp ? "rsvp-active" : ""}`}
//                     onClick={() => handleRSVP(event.id, event.rsvp)}
//                   >
//                     {event.rsvp ? "Undo RSVP" : "RSVP"}
//                   </button>
//                 )}
//                 {(role === "OWNER" || role === "ADMIN") && (
//                   <button
//                     className="delete-btn"
//                     onClick={() => handleDelete(event.eventName)}
//                   >
//                     Delete
//                   </button>
//                 )}
//               </li>
//             ))}
//           </ul>
//         </>
//       )}

//       <footer className="footer">
//         <p>Manage your events easily!</p>
//       </footer>
//     </div>
//   );
// };

// export default EventList;

// /** ===== Inline Admin helper view for Approvals ===== */
// function AdminApprovalsView({ loading, error, pending, onApprove, onReject, onRefresh }) {
//   if (loading) return <p>Loading approvals…</p>;
//   if (error) return <p style={{ color: "#b00020" }}>{error}</p>;
//   if (!pending?.length) return (
//     <div className="admin-approvals">
//       <h2>Pending Membership Approvals</h2>
//       <p>No pending membership requests.</p>
//       <button onClick={onRefresh}>Refresh</button>
//     </div>
//   );

//   return (
//     <div className="admin-approvals">
//       <h2>Pending Membership Approvals</h2>
//       <button onClick={onRefresh} style={{ marginBottom: 12 }}>Refresh</button>
//       <ul className="approval-list">
//         {pending.map((m) => (
//           <li key={m.id} className="approval-item">
//             <div>
//               <strong>User:</strong> {m.ownerUserId} &nbsp;|&nbsp;
//               <strong>Plan:</strong> {m.type} &nbsp;|&nbsp;
//               <strong>Status:</strong> {m.status} &nbsp;|&nbsp;
//               <strong>Applied:</strong> {m.appliedAt || "-"}
//             </div>
//             <div className="approval-actions" style={{ marginTop: 8 }}>
//               <button onClick={() => onApprove(m)}>Approve</button>
//               <button onClick={() => onReject(m)} style={{ marginLeft: 8 }}>Reject</button>
//             </div>
//           </li>
//         ))}
//       </ul>
//     </div>
//   );
// }

import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import {
  getEvents,
  updateRSVPStatus,
  deleteEvent,
  // NOTE: This calls /getEventByOwnerName (backend resolves owner from SecurityContext)
  getEventById,
} from "../api/eventApi";

import UpdateEventForm from "./UpdateEventForm";
import EventForm from "./EventForm";
import "./EventList.css";
import UserList from "./UserList";

import {
  getActiveMembership,
  getPendingMemberships,
  approveMembership,
  rejectMembership,
} from "../api/membershipApi";

/** Safely decode JWT payload */
const decodeTokenPayload = (token) => {
  if (!token) return null;
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload;
  } catch {
    return null;
  }
};

const EventList = () => {
  // Events UI state
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);

  // Role & tabs
  const [role, setRole] = useState(null);
  const [activeTab, setActiveTab] = useState("view"); // 'view' | 'users' | 'approvals' | 'createEvent' | 'updateEvent'

  // Owner membership UI state
  const [membership, setMembership] = useState(null);
  const [membershipLoading, setMembershipLoading] = useState(false);
  const [membershipError, setMembershipError] = useState("");

  // Admin approvals UI state
  const [pendingMemberships, setPendingMemberships] = useState([]);
  const [approvalsLoading, setApprovalsLoading] = useState(false);
  const [approvalsError, setApprovalsError] = useState("");

  const navigate = useNavigate();

  // Optional: clubId if you need later
  const { clubId: clubIdParam } = useParams();
  const storedClubId = localStorage.getItem("clubId");
  const clubId = clubIdParam || storedClubId || null;

  /** Resolve current user id from localStorage or JWT payload */
  const resolveCurrentUserId = () => {
    const stored = localStorage.getItem("userId");
    if (stored) return stored;

    const token = localStorage.getItem("token");
    const payload = decodeTokenPayload(token);
    return payload?.userId || payload?.sub || null;
  };
  const currentUserId = useMemo(resolveCurrentUserId, []);

  /** Decode role from JWT once */
  useEffect(() => {
    const token = localStorage.getItem("token");
    const payload = decodeTokenPayload(token);
    if (!payload) return;

    // Handle different JWT role structures
    const rolesArr =
      payload.roles ||
      payload.authorities ||
      payload?.realm_access?.roles ||
      [];

    const firstRole = Array.isArray(rolesArr) ? rolesArr[0] : rolesArr;
    setRole(firstRole || null);
  }, []);

  /** Initial loads after role becomes available */
  useEffect(() => {
    // Load events
    fetchEvents();

    // Load membership (for owner/member if userId exists)
    fetchMembership();

    // Admin: pending approvals
    if (role === "ADMIN") {
      fetchPendingApprovals();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [role]);

  /** Events: OWNER uses /getEventByOwnerName, others use /events */
  const fetchEvents = () => {
    setLoading(true);

    const call =
      role === "OWNER"
        ? getEventById() // ✅ your owner-only endpoint
        : getEvents();

    call
      .then((response) => {
        const data = response?.data;
        setEvents(Array.isArray(data) ? data : []);
      })
      .catch((error) => {
        console.error("Error fetching events:", error);
      })
      .finally(() => setLoading(false));
  };

  /** Owner membership */
  const fetchMembership = () => {
    if (!currentUserId) return;
    setMembershipLoading(true);
    setMembershipError("");
    getActiveMembership(currentUserId)
      .then((res) => setMembership(res?.data || null))
      .catch((err) => {
        console.error("Error fetching membership:", err);
        const msg =
          err?.response?.data?.message ||
          (typeof err?.response?.data === "string" ? err.response.data : null) ||
          "Failed to load membership.";
        setMembershipError(msg);
        setMembership(null);
      })
      .finally(() => setMembershipLoading(false));
  };

  const isApproved = Boolean(membership && membership.status === "APPROVED");

  /** Admin: approvals */
  const fetchPendingApprovals = () => {
    setApprovalsLoading(true);
    setApprovalsError("");
    getPendingMemberships()
      .then((res) => setPendingMemberships(Array.isArray(res?.data) ? res.data : []))
      .catch((err) => {
        console.error("Error fetching pending approvals:", err);
        const msg =
          err?.response?.data?.message ||
          (typeof err?.response?.data === "string" ? err.response.data : null) ||
          "Failed to load pending approvals.";
        setApprovalsError(msg);
        setPendingMemberships([]);
      })
      .finally(() => setApprovalsLoading(false));
  };

  const onApprove = async (m) => {
    try {
      await approveMembership({
        id: m.id,
        remarks: "Approved",
        start: new Date().toISOString(),
        end: null,
      });
      alert(`Approved ${m.ownerUserId} (${m.type})`);
      fetchPendingApprovals();
    } catch (err) {
      console.error("Approve failed:", err);
      alert(
        err?.response?.data?.message ||
          "Failed to approve membership. Please retry."
      );
    }
  };

  const onReject = async (m) => {
    const remarks = prompt("Enter rejection remarks:", "Insufficient details");
    if (remarks === null) return;
    try {
      await rejectMembership({ id: m.id, remarks });
      alert(`Rejected ${m.ownerUserId} (${m.type})`);
      fetchPendingApprovals();
    } catch (err) {
      console.error("Reject failed:", err);
      alert(
        err?.response?.data?.message ||
          "Failed to reject membership. Please retry."
      );
    }
  };

  /** Tabs guard for owners */
  const guardTab = (tab) => {
    if ((tab === "createEvent" || tab === "updateEvent") && role === "OWNER" && !isApproved) {
      alert("Membership not approved. Please apply in Owner Dashboard and wait for admin approval.");
      setActiveTab("view");
      return;
    }
    setActiveTab(tab);

    if (role === "ADMIN" && tab === "approvals") {
      fetchPendingApprovals();
    }
  };

  /** RSVP toggle */
  const handleRSVP = (eventId, currentStatus) => {
    const newStatus = !currentStatus;
    updateRSVPStatus(eventId, newStatus)
      .then(() => {
        setEvents((prev) =>
          prev.map((e) => (e.id === eventId ? { ...e, rsvp: newStatus } : e))
        );
        alert(newStatus ? "Successfully RSVP'd!" : "RSVP undone.");
      })
      .catch((error) => {
        console.error("Error updating RSVP:", error);
        alert("Failed to update RSVP.");
      });
  };

  /** Delete by name */
  const handleDelete = (eventName) => {
    if (window.confirm(`Delete event "${eventName}"?`)) {
      deleteEvent(eventName)
        .then(() => {
          alert("Event deleted successfully!");
          setEvents((prev) => prev.filter((e) => e.eventName !== eventName));
        })
        .catch((error) => {
          console.error("Error deleting event:", error);
          alert("Failed to delete event.");
        });
    }
  };

  /** Logout */
  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <div className="event-container">
      {/* Header */}
      <header className="header">
        <h1>Club Events</h1>
        <nav>
          {role === "ADMIN" && (
            <div className="admin-tabs">
              <button onClick={() => guardTab("users")}>Users</button>
              <button onClick={() => guardTab("approvals")}>Approvals</button>
            </div>
          )}

          {role === "OWNER" && (
            <div className="owner-tabs">
              <button onClick={() => guardTab("createEvent")}>Create Event</button>
              <button onClick={() => guardTab("updateEvent")}>Update Event</button>
              <button onClick={() => guardTab("view")}>View Events</button>
            </div>
          )}

          <button className="logout-btn" onClick={handleLogout}>Logout</button>
        </nav>
      </header>

      {/* Membership banner (for owners) */}
      {role === "OWNER" && (
        <div className="membership-banner">
          <small>
            Membership:&nbsp;
            {membershipLoading
              ? "Loading..."
              : membership
              ? `${membership.type || membership.plan || "—"} — Status: ${membership.status}`
              : "None"}
          </small>
          {!isApproved && (
            <small style={{ color: "#c77d00", marginLeft: 8 }}>
              Apply from Owner Dashboard to enable event creation.
            </small>
          )}
          {membershipError && (
            <small style={{ color: "#b00020", marginLeft: 8 }}>
              {membershipError}
            </small>
          )}
          <button
            onClick={fetchMembership}
            className="refresh-membership-btn"
            style={{ marginLeft: 12 }}
          >
            Refresh
          </button>
        </div>
      )}

      {/* Content */}
      {role === "ADMIN" && activeTab === "users" && <UserList />}

      {role === "ADMIN" && activeTab === "approvals" && (
        <AdminApprovalsView
          loading={approvalsLoading}
          error={approvalsError}
          pending={pendingMemberships}
          onApprove={onApprove}
          onReject={onReject}
          onRefresh={fetchPendingApprovals}
        />
      )}

      {role === "OWNER" && activeTab === "createEvent" && isApproved && <EventForm />}
      {role === "OWNER" && activeTab === "updateEvent" && isApproved && <UpdateEventForm />}

      {((role === "MEMBER" || role === "OWNER") || activeTab === "view") && (
        <>
          {role === "OWNER" && (
            <small className="notice" style={{ display: "block", marginBottom: 8 }}>
              Showing events created by you
            </small>
          )}
          <h2>Events</h2>
          {loading && <p>Loading...</p>}
          <ul className="event-list">
            {events.map((event) => (
              <li key={event.id} className="event-item">
                <strong>{event.eventName || "Untitled"}</strong> — {event.eventDate || "—"}
                {(role === "MEMBER" || role === "OWNER") && (
                  <button
                    className={`rsvp-btn ${event.rsvp ? "rsvp-active" : ""}`}
                    onClick={() => handleRSVP(event.id, event.rsvp)}
                  >
                    {event.rsvp ? "Undo RSVP" : "RSVP"}
                  </button>
                )}
                {(role === "OWNER" || role === "ADMIN") && (
                  <button
                    className="delete-btn"
                    onClick={() => handleDelete(event.eventName)}
                  >
                    Delete
                  </button>
                )}
              </li>
            ))}
          </ul>
        </>
      )}

      <footer className="footer">
        <p>Manage your events easily!</p>
      </footer>
    </div>
  );
};

export default EventList;

/** ===== Inline Admin helper view for Approvals ===== */
function AdminApprovalsView({ loading, error, pending, onApprove, onReject, onRefresh }) {
  if (loading) return <p>Loading approvals…</p>;
  if (error) return <p style={{ color: "#b00020" }}>{error}</p>;
  if (!pending?.length) {
    return (
      <div className="admin-approvals">
        <h2>Pending Membership Approvals</h2>
        <p>No pending membership requests.</p>
        <button onClick={onRefresh}>Refresh</button>
      </div>
    );
  }

  return (
    <div className="admin-approvals">
      <h2>Pending Membership Approvals</h2>
      <button onClick={onRefresh} style={{ marginBottom: 12 }}>Refresh</button>
      <ul className="approval-list">
        {pending.map((m) => (
          <li key={m.id} className="approval-item">
            <div>
              <strong>User:</strong> {m.ownerUserId || m.ownerName || "—"} &nbsp;|&nbsp;
              <strong>Plan:</strong> {m.type || m.plan || "—"} &nbsp;|&nbsp;
              <strong>Status:</strong> {m.status || "PENDING"} &nbsp;|&nbsp;
              <strong>Applied:</strong> {m.appliedAt ? new Date(m.appliedAt).toLocaleString() : "-"}
            </div>
            <div className="approval-actions" style={{ marginTop: 8 }}>
              <button onClick={() => onApprove(m)}>Approve</button>
              <button onClick={() => onReject(m)} style={{ marginLeft: 8 }}>Reject</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
