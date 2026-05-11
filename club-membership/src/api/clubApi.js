// // import axios from 'axios';

// // const BASE_URL = 'http://localhost:8989/user/clubs'; // ✅ Matches your backend

// // const getAuthHeaders = () => {
// //   const token = localStorage.getItem('token');
// //   return {
// //     headers: {
// //       Authorization: `Bearer ${token}` // ✅ Space added
// //     }
// //   };
// // };

// // // ✅ Register Club
// // export const registerClub = (club) =>
// //   axios.post(`${BASE_URL}/club/registration`, club, getAuthHeaders());

// // import axios from 'axios';

// // const BASE_URL = 'http://localhost:8989/user/clubs';

// // const getAuthHeaders = () => {
// //   const token = localStorage.getItem('token');
// //   return { headers: { Authorization: `Bearer ${token}` } };
// // };

// // // ✅ Register Club (your existing endpoint)
// // export const registerClub = (club) =>
// //   axios.post(`${BASE_URL}/club/registration`, club, getAuthHeaders());

// // // ✅ Fetch the clubs for current user (OWNER-scoped in your desired flow)
// // export const getMyClubs = () =>
// //   axios.get(`${BASE_URL}`, getAuthHeaders());

// // src/api/clubApi.js
// import http from './httpClient';

// const USER_SERVICE_URL = process.env.REACT_APP_USER_SERVICE_URL || 'http://localhost:8989';
// const BASE_URL = `${USER_SERVICE_URL}/user/clubs`;

// // Register a club
// export const registerClub = (club) =>
//   http.post(`${BASE_URL}/club/registration`, club);

// // Get current owner’s clubs
// export const getMyClubs = () =>
//   http.get(`${BASE_URL}`);

// // (Optional) Get club by ID
// export const getClubById = (clubId) =>
//   http.get(`${BASE_URL}/${clubId}`);

// src/api/clubApi.js
// import http from './httpClient';

// const USER_SERVICE_URL = process.env.REACT_APP_USER_SERVICE_URL || 'http://localhost:8989';
// const BASE_URL = `${USER_SERVICE_URL}/user/clubs`;

// // Register a club (gated by APPROVED membership on server side)
// export const registerClub = (club) =>
//   http.post(`${BASE_URL}/club/registration`, club);

// // Get current owner’s clubs
// export const getMyClubs = () =>
//   http.get(`${BASE_URL}`);

// // Optional: Get club by ID
// export const getClubById = (clubId) =>
//   http.get(`${BASE_URL}/${clubId}`);

// src/api/clubApi.js
import http from './httpClient';

const USER_SERVICE_URL = process.env.REACT_APP_USER_SERVICE_URL || 'http://localhost:8989';
const BASE_URL = `${USER_SERVICE_URL}/user/clubs`;

/**
 * OWNER: Register a new club.
 * The User service should:
 *  - Extract ownerUserId from JWT,
 *  - Validate APPROVED membership,
 *  - Forward to Club service via Feign.
 */
export const registerClub = (club) =>
  http.post(`${BASE_URL}/club/registration`, club);

/**
 * OWNER: Get clubs owned by the current logged-in user.
 * Server derives ownerUserId from JWT; no need to pass it here.
 */
export const getMyClubs = () =>
  http.get(`${BASE_URL}`);

/**
 * OWNER/ADMIN: Get a specific club by its ID.
 */
export const getClubById = (clubId) =>
  http.get(`${BASE_URL}/${clubId}`);

/**
 * ADMIN: Get all clubs (across all owners).
 * Use in the EventList admin tab for “Clubs”.
 */
export const getAllClubs = () =>
  http.get(`${BASE_URL}/all`);
