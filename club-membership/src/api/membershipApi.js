
// // src/api/membershipApi.js
// import http from './httpClient';

// const USER_SERVICE_URL = process.env.REACT_APP_USER_SERVICE_URL || 'http://localhost:8989';
// const BASE_URL = `${USER_SERVICE_URL}/api/memberships`;

// /**
//  * Utility: ensure we send ISO date strings when start/end are provided.
//  * Accepts Date, string (already ISO), or null/undefined.
//  */
// const toIsoOrNull = (value) => {
//   if (!value) return null;
//   try {
//     // If value is already a string, assume it’s ISO-like
//     if (typeof value === 'string') return value;
//     // If Date object, convert to ISO
//     if (value instanceof Date) return value.toISOString();
//     // Fallback: try Date parse
//     const d = new Date(value);
//     return isNaN(d.getTime()) ? null : d.toISOString();
//   } catch {
//     return null;
//   }
// };

// /**
//  * OWNER: Apply for membership
//  * @param {{ ownerUserId: string, type: 'GOLD'|'SILVER' }} params
//  */
// export const applyMembership = ({ ownerUserId, type }) =>
//   http.post(`${BASE_URL}/apply`, null, {
//     params: { ownerUserId, type },
//   });

// /**
//  * ADMIN: Approve a membership application
//  * @param {{ id: number, adminUserId: string, remarks?: string, start?: Date|string, end?: Date|string }} params
//  */
// export const approveMembership = ({ id, adminUserId, remarks, start, end }) =>
//   http.patch(`${BASE_URL}/${id}/approve`, null, {
//     params: {
//       adminUserId,
//       remarks,
//       // Send ISO strings to match @DateTimeFormat(iso = DATE_TIME) on backend
//       start: toIsoOrNull(start),
//       end: toIsoOrNull(end),
//     },
//   });

// /**
//  * ADMIN: Reject a membership application
//  * @param {{ id: number, adminUserId: string, remarks?: string }} params
//  */
// export const rejectMembership = ({ id, adminUserId, remarks }) =>
//   http.patch(`${BASE_URL}/${id}/reject`, null, {
//     params: { adminUserId, remarks },
//   });

// /**
//  * OWNER/Server: Get active membership for a given ownerUserId
//  * Returns null if none approved (or expired).
//  */
// export const getActiveMembership = (ownerUserId) =>
//   http.get(`${BASE_URL}/active/${ownerUserId}`);

// /**
//  * ADMIN: List all PENDING approval requests
//  * Optional filter by membership type (SILVER/GOLD).
//  * Backend: GET /api/memberships/pending?type=GOLD|SILVER (type optional)
//  */
// export const getPendingMemberships = (type) =>
//   http.get(`${BASE_URL}/pending`, {
//     params: type ? { type } : {},
//   });

// /**
//  * ADMIN: Generic list by status (PENDING_APPROVAL, APPROVED, REJECTED)
//  * Optional filter by type (SILVER/GOLD).
//  * Backend: GET /api/memberships?status=...&type=...
//  */
// export const listMembershipsByStatus = ({ status, type }) =>
//   http.get(`${BASE_URL}`, {
//     params: {
//       status, // required
//       ...(type ? { type } : {}),
//     },
//   });

// /**
//  * (Optional) Fetch a single membership by ID (if you expose such endpoint).
//  * Uncomment only if backend supports: GET /api/memberships/{id}
//  */
// // export const getMembershipById = (id) => http.get(`${BASE_URL}/${id}`);

// /**
//  * (Optional) Helper to resolve ownerUserId from JWT if you prefer not to pass it explicitly.
//  * Use in components: const ownerUserId = getOwnerUserIdFromToken();
//  */
// export const getOwnerUserIdFromToken = () => {
//   const stored = localStorage.getItem('userId');
//   if (stored) return stored;
//   const token = localStorage.getItem('token');
//   if (!token) return null;
//   try {
//     const payload = JSON.parse(atob(token.split('.')[1]));
//     return payload.userId || payload.sub || null;
//   } catch {
//     return null;
//   }
// };

// src/api/membershipApi.js
import http from './httpClient';

const USER_SERVICE_URL = process.env.REACT_APP_USER_SERVICE_URL || 'http://localhost:8989';
const BASE_URL = `${USER_SERVICE_URL}/api/memberships`;

const toIsoOrNull = (value) => {
  if (!value) return null;
  if (typeof value === 'string') return value;
  const d = new Date(value);
  return isNaN(d.getTime()) ? null : d.toISOString();
};

export const applyMembership = ({ ownerUserId, type }) =>
  http.post(`${BASE_URL}/apply`, null, { params: { ownerUserId, type } });

// ✅ no adminUserId
export const approveMembership = ({ id, remarks, start, end }) =>
  http.patch(`${BASE_URL}/${id}/approve`, null, {
    params: { remarks, start: toIsoOrNull(start), end: toIsoOrNull(end) },
  });

// ✅ no adminUserId
export const rejectMembership = ({ id, remarks }) =>
  http.patch(`${BASE_URL}/${id}/reject`, null, {
    params: { remarks },
  });

export const getActiveMembership = (ownerUserId) =>
  http.get(`${BASE_URL}/active/${ownerUserId}`);

export const getPendingMemberships = (type) =>
  http.get(`${BASE_URL}/pending`, { params: type ? { type } : {} });

export const listMembershipsByStatus = ({ status, type }) =>
  http.get(`${BASE_URL}`, { params: { status, ...(type ? { type } : {}) } });

