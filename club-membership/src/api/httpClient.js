
// src/api/httpClient.js
import axios from 'axios';

// If you later adopt an API gateway, set REACT_APP_API_GATEWAY_URL and use it here.
const http = axios.create({
  // baseURL can be left empty; we use full URLs per module.
});

http.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

http.interceptors.response.use(
  (res) => res,
  (err) => {
    // Centralize 401 handling, optional toast, etc.
    return Promise.reject(err);
  }
);

export default http;
