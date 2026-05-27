import axios from "axios";
import API_BASE_URL from "../config";

export const getToken = () => localStorage.getItem("token");
export const getRefreshToken = () => localStorage.getItem("refresh_token");
export const getUser = () => {
  try {
    return JSON.parse(localStorage.getItem("user") || "null");
  } catch {
    return null;
  }
};

export const setAuth = (token, user, refreshToken) => {
  localStorage.setItem("token", token);
  localStorage.setItem("user", JSON.stringify(user));
  if (refreshToken) {
    localStorage.setItem("refresh_token", refreshToken);
  }
};

export const clearAuth = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("refresh_token");
  localStorage.removeItem("user");
};

export const isLoggedIn = () => !!getToken();
export const isAdmin = () => {
  const u = getUser();
  return u && u.is_admin;
};

export const refreshAccessToken = async () => {
  const refreshToken = getRefreshToken();
  if (!refreshToken) return null;

  const response = await axios.post(`${API_BASE_URL}/refresh`, null, {
    headers: {
      Authorization: `Bearer ${refreshToken}`,
    },
  });

  const newToken = response.data.access_token;
  if (newToken) {
    const user = getUser();
    setAuth(newToken, user, refreshToken);
    return newToken;
  }

  return null;
};

export const setupAxiosInterceptors = () => {
  axios.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config;

      if (
        error.response?.status === 401 &&
        !originalRequest?._retry &&
        !originalRequest?.url?.includes("/refresh") &&
        getRefreshToken()
      ) {
        originalRequest._retry = true;

        try {
          const newToken = await refreshAccessToken();
          if (newToken) {
            originalRequest.headers.Authorization = `Bearer ${newToken}`;
            return axios(originalRequest);
          }
        } catch (refreshError) {
          clearAuth();
          window.dispatchEvent(new Event("auth-change"));
        }
      }

      return Promise.reject(error);
    },
  );
};
