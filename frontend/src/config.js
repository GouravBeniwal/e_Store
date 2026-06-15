// Development default (local backend)
const DEV_API = "http://127.0.0.1:5000/api";

// Build-time override: REACT_APP_API_URL (set in Dockerfile build stage)
// Runtime fallback: localhost during dev, otherwise relative `/api` for containers
const API_BASE_URL = (process.env.REACT_APP_API_URL && process.env.REACT_APP_API_URL !== '')
	? process.env.REACT_APP_API_URL
	: (typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')
		? DEV_API
		: "/api");

export default API_BASE_URL;
