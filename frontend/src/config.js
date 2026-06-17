const DEV_API = "http://127.0.0.1:5000/api";

const API_BASE_URL =
  process.env.REACT_APP_API_URL && process.env.REACT_APP_API_URL !== ""
    ? process.env.REACT_APP_API_URL
    : typeof window !== "undefined" &&
        (window.location.hostname === "localhost" ||
          window.location.hostname === "127.0.0.1")
      ? DEV_API
      : "/api";

export default API_BASE_URL;
