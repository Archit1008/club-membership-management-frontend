// import axios from 'axios';

// const BASE_URL = 'http://localhost:8989/club'; // Update if needed

// const getAuthHeaders = () => {
//   const token = localStorage.getItem('token');
//   return {
//     headers: {
//       Authorization: `Bearer ${token}`
//     }
//   };
// };

// // GET all events
// export const getEvents = () => axios.get(`${BASE_URL}/getAllEvent`, getAuthHeaders());

// // POST: Create a new event
// export const saveEvent = (event) => axios.post(`${BASE_URL}/saveEvent`, event, getAuthHeaders());

// // DELETE: Delete an event by name
// export const deleteEvent = (eventName) =>
//   axios.delete(`${BASE_URL}/deleteEvent/${encodeURIComponent(eventName)}`, getAuthHeaders());

// // PUT: Update an existing event
// export const updateEvent = (event) =>
//   axios.put(`${BASE_URL}/updateEvent`, event, getAuthHeaders());

// export const updateRSVPStatus = (eventId, rsvp) =>
//   axios.put(`${BASE_URL}/updateRsvp/${eventId}/${rsvp}`, {}, getAuthHeaders());

// src/api/eventApi.js

// api/events.js
import http from './httpClient';

const USER_SERVICE_URL = process.env.REACT_APP_USER_SERVICE_URL || 'http://localhost:8989';
const BASE_URL = `${USER_SERVICE_URL}/user/events`;

// GET all events
export const getEvents = () => http.get(`${BASE_URL}/getAllEvent`);

// POST: Create a new event
export const saveEvent = (event) => http.post(`${BASE_URL}/saveEvent`, event);

// DELETE: Delete an event by name
export const deleteEvent = (eventName) => http.delete(`${BASE_URL}/deleteEvent/${encodeURIComponent(eventName)}`);

// PUT: Update an existing event
export const updateEvent = (event) => http.put(`${BASE_URL}/updateEvent`, event);

// PUT: Update RSVP status
export const updateRSVPStatus = (eventId, rsvp) => http.put(`${BASE_URL}/updateRsvp/${eventId}/${rsvp}`);

// GET: Get event by id (if you use it)
export const getEventById = () => http.get(`${BASE_URL}/getEventByOwnerName`);
