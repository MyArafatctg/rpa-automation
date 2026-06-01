import { useContext, useEffect, useState } from "react";
import { AppContext } from "../context/AppContext";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import cookie from "js-cookie";
import axios from "axios";
import staticMmenu from "../assets/menuModel.json";
import axiosInstance from "../customHook/api/axiosInstance";
import { tokenService } from "../auth/tokenService";

interface LoginPayload {
  userId: number;
  password: string;
  appId: number;
}

const LoggingScreen = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const {
    setToken,
    setRefreshToken,
    token,
    refreshToken,
    setClientId,
    AUTH_URL,
    APP_ID,
  } = useContext(AppContext); // ✅ Move here

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Parse URL query parameters
    const params = new URLSearchParams(location.search);
    const encodedUserId = params.get("userId");
    const encodedPass = params.get("pass");

    if (!encodedUserId || !encodedPass) {
      // navigate("/login");
      window.location.href = "https://andron.ahlapps.com/";
      return;
    }

    try {
      // Decode Base64 parameters
      const decodedUserId = atob(encodedUserId);
      const decodedPass = atob(encodedPass);

      if (!decodedUserId || !decodedPass) {
        throw new Error("Empty credentials");
      }

      /*
      setToken("accessToken");
      setClientId(decodedUserId);

      localStorage.setItem("token", "accessToken");
      localStorage.setItem("clientId", decodedUserId);
      localStorage.setItem("menuDetails", JSON.stringify(staticMmenu));

      cookie.set("token", "accessToken", {
        secure: true,
        sameSite: "strict",
        expires: 1,
      });

      toast.success("Login successful", { toastId: "login-success" });
      navigate("/dashboard");
      */

      // Proceed to login

      login({
        userId: Number(decodedUserId),
        password: decodedPass,
        appId: APP_ID,
      });
    } catch (error) {
      console.error("Invalid base64 data", error);
      toast.error("Something went wrong");
      // navigate("/login");
      window.location.href = "https://andron.ahlapps.com/";
    }
  }, [location.search]);

  const login = async (payload: LoginPayload) => {
    if (loading) return;
    setLoading(true);
    try {
      const response = await axiosInstance.post(
        `${AUTH_URL}/auth/login`,
        payload,
      );

      const { refreshToken, accessToken, user } = response.data;

      setToken(accessToken);
      setRefreshToken(refreshToken);
      setClientId(user.USER_ID);

      localStorage.setItem("token", accessToken);
      localStorage.setItem("clientId", user.USER_ID);
      localStorage.setItem("menuDetails", JSON.stringify(user.menuDetails));
      localStorage.setItem("refreshToken", refreshToken);

      cookie.set("token", accessToken, {
        secure: true,
        sameSite: "strict",
        expires: 1,
      });

      tokenService.setAccessToken(accessToken);
      tokenService.setRefreshToken(refreshToken);

      toast.success("Login successful", { toastId: "login-success" });
      navigate("/dashboard");
    } catch (err: any) {
      if (!err.response) {
        toast.error("Server not reachable");
      } else if (err.response.status === 401) {
        toast.error("Invalid credentials");
      } else {
        toast.error("Login failed");
      }
      // navigate("/login");
      window.location.href = "https://andron.ahlapps.com/";
      return null;
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <p className="text-xl font-semibold text-gray-700 animate-pulse">
        {loading ? "Logging in..." : "Preparing to log in..."}
      </p>
    </div>
  );
};

export default LoggingScreen;
