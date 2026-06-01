import axios from "axios";
import { tokenService } from "../../auth/tokenService";

export const isAxiosError = axios.isAxiosError;

const AUTH_URL = "https://api-andron.ahlapps.com/api/v1";

const axiosInstance = axios.create({
  baseURL: AUTH_URL,
  withCredentials: true,
});

// Attach token dynamically
axiosInstance.interceptors.request.use((config) => {
  const token = tokenService.getAccessToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Refresh logic
axiosInstance.interceptors.response.use(
  (res) => res,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const res = await axios.post(`${AUTH_URL}/auth/refresh-token`, {
          refreshToken: tokenService.getRefreshToken(),
        });

        const newAccessToken = res.data.access_token;
        const newRefreshToken = res.data.refresh_token;

        tokenService.setAccessToken(newAccessToken);
        tokenService.setRefreshToken(newRefreshToken);

        localStorage.setItem("token", newAccessToken);
        localStorage.setItem("refreshToken", newRefreshToken);

        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return axiosInstance(originalRequest);
      } catch (e) {
        tokenService.clear();
        localStorage.clear();
        window.location.href = "/login"; // redirect safely
      }
    }

    return Promise.reject(error);
  },
);

export default axiosInstance;
