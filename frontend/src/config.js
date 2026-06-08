// Development default (local backend)
const DEV_API = "http://127.0.0.1:5000/api";

// Use build-time `REACT_APP_API_URL` if provided. Otherwise use localhost for
// local development, and a relative `/api` path for production/container runs.
// const API_BASE_URL = process.env.REACT_APP_API_URL || (typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') ? DEV_API : "/api");
const API_BASE_URL = DEV_API;
export default API_BASE_URL;
