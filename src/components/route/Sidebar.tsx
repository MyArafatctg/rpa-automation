// components/route/Sidebar.tsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { RiArrowLeftSLine } from "react-icons/ri";
import { PiSignOut } from "react-icons/pi";
import cookie from "js-cookie";

import Logo from "./logo.png";
import staticMmenu from "../../assets/menuModel.json";
import SidebarMenuItem from "./SidebarMenuItem";
import type { AppMenuItem } from "./menu";

interface SidebarProps {
  children: React.ReactNode;
}

const Sidebar: React.FC<SidebarProps> = ({ children }) => {
  const [isCollapse, setIsCollapse] = useState(false);
  const navigate = useNavigate();

  const dynamicMenu = localStorage.getItem("menuDetails");

  const menuList: AppMenuItem[] = (() => {
    try {
      return dynamicMenu ? (JSON.parse(dynamicMenu) as AppMenuItem[]) : [];
    } catch {
      return [];
    }
  })();

  const signOut = () => {
    localStorage.removeItem("token");
    cookie.remove("token");
    // navigate("/login");
    window.location.href = "https://andron.ahlapps.com/";
    return null;
  };

  return (
    <div className="flex max-h-screen bg-gray-100">
      {/* Sidebar Section */}
      <div
        className={`flex flex-col h-screen ${
          isCollapse ? "w-[70px]" : "w-64"
        } bg-[#151a2d] shadow-xl border p-3 transition-all duration-300 ease-in-out`}
      >
        {/* Logo and Collapse Button */}
        <div
          className={`flex ${
            isCollapse ? "flex-col gap-5" : "justify-between"
          } items-center transition-all duration-300 ease-in-out`}
        >
          <img src={Logo} alt="logo" className="h-12 rounded-full" />

          {!isCollapse && (
            <span className="text-white text-xl font-bold">Apex RPA</span>
          )}

          <button
            onClick={() => setIsCollapse(!isCollapse)}
            className="bg-gray-50 rounded w-7 h-7 flex items-center justify-center shadow-md"
          >
            <RiArrowLeftSLine
              className={`text-black text-2xl ${
                isCollapse ? "rotate-180" : ""
              }`}
            />
          </button>
        </div>

        {/* 🔥 DYNAMIC MENU (REPLACED PART) */}
        <nav className="flex flex-col grow mt-4 overflow-y-auto scrollbar-hide">
          {menuList.map((item, index) => (
            <SidebarMenuItem
              key={index}
              item={item}
              isCollapse={isCollapse}
              setIsCollapse={setIsCollapse}
            />
          ))}
        </nav>

        {/* Sign Out */}
        <div className="border-t border-gray-800 mt-auto py-4">
          <button
            type="button"
            onClick={signOut}
            className="w-full flex items-center gap-3 font-semibold text-lg text-white hover:bg-white hover:text-black p-3 transition-all duration-300 rounded-md"
          >
            <PiSignOut className="text-xl" />
            {!isCollapse && <span>Sign Out</span>}
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6 overflow-y-auto">{children}</div>
    </div>
  );
};

export default Sidebar;
