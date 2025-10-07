import { useContext, type JSX } from "react";
import { Navigate } from "react-router-dom";
import { AppContext } from "../context/AppContext"; // adjust path as needed
import cookie from "js-cookie";
interface ProtectedRouteProps {
  children: JSX.Element;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { token } = useContext(AppContext);
<<<<<<< HEAD
  // const storedToken = localStorage.getItem("token");
  const storedToken = cookie.get("token");

  // If no token, redirect to login page
  console.log("ProtectedRoute token:", token);
=======
  const storedToken = localStorage.getItem("token");

  // If no token, redirect to login page
>>>>>>> 56cdd21eb84155c91715912545e40d3452d60d1f
  if (!storedToken) {
    return <Navigate to="/login" replace />;
  }

  // Otherwise, allow access
  return children;
};

export default ProtectedRoute;
