import { useContext, type JSX } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { AppContext } from "../../context/AppContext";
import cookie from "js-cookie";
import { useLocation } from "react-router-dom";
import { extractPermittedPaths, type AppMenuItem } from "./menu";
// import menuModel from "../../assets/menuModel.json";
import UnauthorizedPage from "../../pages/UnauthorizedPage";
import Sidebar from "./Sidebar";

const ProtectedRoute = () => {
  const { token, authLoading } = useContext(AppContext);
  const storedToken = localStorage.getItem("token");
  const location = useLocation();

  const permittedMenuString = localStorage.getItem("menuDetails");

  const permittedMenu: AppMenuItem[] = permittedMenuString
    ? JSON.parse(permittedMenuString)
    : [];

  const basePath = location.pathname.split("/")[1] || "";
  // const permittedPaths = extractPermittedPaths(menuModel);

  if (authLoading) return <div>Loading...</div>;

  const permittedPaths = extractPermittedPaths(permittedMenu);

  if (!permittedPaths.includes(basePath)) {
    return <UnauthorizedPage />;
  }

  if (!storedToken) {
    // return <Navigate to="/login" replace />;
    window.location.href = "https://andron.ahlapps.com/";
    return null;
  }

  console.log("Token found in ProtectedRoute:", storedToken);
  // Otherwise, allow access
  return (
    <Sidebar>
      <Outlet />
    </Sidebar>
  );
};

export default ProtectedRoute;
