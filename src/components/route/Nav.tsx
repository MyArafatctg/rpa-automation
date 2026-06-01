// components/route/Sidebar.tsx
import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { RiArrowLeftSLine } from "react-icons/ri";
import { LuLayoutDashboard } from "react-icons/lu";
import { FaChevronDown, FaChevronRight } from "react-icons/fa";
import { FaRegArrowAltCircleRight } from "react-icons/fa";
import { PiSignOut } from "react-icons/pi";
import { FaArrowAltCircleDown } from "react-icons/fa";
import { FaArrowAltCircleUp } from "react-icons/fa";
import cookie from "js-cookie";

import Logo from "./logo.png";

interface SidebarProps {
  children: React.ReactNode;
}

const Sidebar: React.FC<SidebarProps> = ({ children }) => {
  const [isCollapse, setIsCollapse] = useState(false);
  const [openImportMenu, setOpenImportMenu] = useState(false);
  const [openExportMenu, setOpenExportMenu] = useState(false);
  const [openEInvoiceMenu, setOpenEInvoiceMenu] = useState(false);
  const [openLCMenu, setopenLCMenu] = useState(false);

  const navigate = useNavigate();

  // Submenu items under Export
  const exportSubmenu = [
    {
      icon: <FaRegArrowAltCircleRight />,
      label: "E-Invoicing",
      hasChildren: true,
      children: [
        {
          icon: <FaRegArrowAltCircleRight />,
          label: "H&M",
          path: "/einvoicing-handm",
        },
      ],
    },
    {
      icon: <FaRegArrowAltCircleRight />,
      label: "FCR Submission",
      path: "/fcr-submission",
    },
    {
      icon: <FaRegArrowAltCircleRight />,
      label: "E-DOC Upload",
      path: "/edoc-upload-handm",
    },
    {
      icon: <FaRegArrowAltCircleRight />,
      label: "EXP Duplication",
      path: "/exp-duplication",
    },
    {
      icon: <FaRegArrowAltCircleRight />,
      label: "EXP Download",
      path: "/exp-download",
    },
    {
      icon: <FaRegArrowAltCircleRight />,
      label: "Container Tracking",
      path: "/container-tracking",
    },
    {
      icon: <FaRegArrowAltCircleRight />,
      label: "REX Issuance",
      path: "/rex-issuance",
    },
    {
      icon: <FaRegArrowAltCircleRight />,
      label: "CO/GSA/SAFTA",
      path: "/cogsa-safta",
    },
    {
      icon: <FaRegArrowAltCircleRight />,
      label: "Data Processing",
      hasChildren: true,
      children: [
        {
          icon: <FaRegArrowAltCircleRight />,
          label: "Payment Advice (H&M)",
          path: "/payment-advice-handm",
        },
      ],
    },
  ];

  // Submenu items under Export
  const importSubmenu = [
    {
      icon: <FaRegArrowAltCircleRight />,
      label: "LC",
      hasChildren: true,
      path: "#",
      children: [
        {
          icon: <FaRegArrowAltCircleRight />,
          label: "Dashboard",
          path: "/lc_dashboard",
        },
        {
          icon: <FaRegArrowAltCircleRight />,
          label: "Details",
          path: "/lc_list",
        },
      ],
    },
  ];

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
            isCollapse ? "flex-col gap-5" : "justify-between "
          } items-center  transition-all duration-300 ease-in-out`}
        >
          <img src={Logo} alt="logo" className={`h-12 rounded-full `} />
          {isCollapse ? (
            ""
          ) : (
            <span className="text-white text-xl font-bold transition-all duration-300 ease-in-out">
              Apex RPA
            </span>
          )}
          <button
            onClick={() => {
              setIsCollapse(!isCollapse);
              setOpenImportMenu(false);
              setOpenExportMenu(false);
              setOpenEInvoiceMenu(false);
            }}
            className="bg-gray-50 text-white rounded w-7 h-7 flex items-center justify-center text-sm shadow-md"
          >
            <RiArrowLeftSLine
              className={`text-black text-2xl ${
                isCollapse ? "rotate-180" : ""
              }`}
            />
          </button>
        </div>

        {/* Navigation Section */}
        <nav className="flex flex-col grow mt-4 overflow-y-auto scrollbar-hide">
          {/* Dashboard */}
          <NavLink
            to="/dashboard"
            className={({ isActive }) =>
              `flex items-center p-2 cursor-pointer rounded font-semibold ${
                isActive ? "bg-white text-black" : "text-white hover:bg-white "
              } hover:text-black transition-all duration-300 ease-in-out ${
                isActive ? "bg-white text-black" : ""
              }`
            }
          >
            <LuLayoutDashboard className="text-xl" />
            {!isCollapse && <span className="ml-3">Dashboard</span>}
          </NavLink>

          {/* Export Submenu */}
          <div className="mt-4">
            <button
              onClick={() => {
                setOpenExportMenu(!openExportMenu);
                if (isCollapse) setIsCollapse(false);
              }}
              className="w-full flex items-center justify-between text-white font-semibold text-lg px-3 py-2 hover:bg-white hover:text-black rounded transition-all duration-300"
            >
              <span className="flex items-center gap-2">
                <FaArrowAltCircleUp className="text-xl" />
                {!isCollapse && <span>Export</span>}
              </span>
              {!isCollapse &&
                (openExportMenu ? (
                  <FaChevronDown className="text-sm" />
                ) : (
                  <FaChevronRight className="text-sm" />
                ))}
            </button>

            {openExportMenu && (
              <div className="ml-2 border-l border-gray-700 mt-2 space-y-1">
                {exportSubmenu.map((item, index) => {
                  if (item.hasChildren) {
                    // Nested submenu: E-Invoicing
                    return (
                      <div key={index}>
                        <button
                          onClick={() => setOpenEInvoiceMenu(!openEInvoiceMenu)}
                          className="flex w-full items-center justify-between p-2 pl-5 rounded font-semibold text-white hover:bg-white hover:text-black transition-all duration-300"
                        >
                          <span className="flex items-center gap-2">
                            {item.icon}
                            {!isCollapse && <span>{item.label}</span>}
                          </span>
                          {!isCollapse &&
                            (openEInvoiceMenu ? (
                              <FaChevronDown className="text-sm" />
                            ) : (
                              <FaChevronRight className="text-sm" />
                            ))}
                        </button>

                        {openEInvoiceMenu && (
                          <div className="ml-5 border-l border-gray-700 mt-2 space-y-1">
                            {item.children?.map((subItem, subIndex) => (
                              <NavLink
                                key={subIndex}
                                to={subItem.path}
                                className={({ isActive }) =>
                                  `flex items-center p-2 pl-5 cursor-pointer rounded font-semibold transition-all duration-300 ease-in-out ${
                                    isActive
                                      ? "bg-white text-black"
                                      : "text-white hover:bg-white hover:text-black"
                                  }`
                                }
                              >
                                <span className="text-lg">{subItem.icon}</span>
                                {!isCollapse && (
                                  <span className="ml-3">{subItem.label}</span>
                                )}
                              </NavLink>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  }

                  // Normal export submenu
                  return (
                    <NavLink
                      key={index}
                      to={item.path || "#"}
                      onClick={(e) =>
                        (item.label === "REX Issuance" && e.preventDefault()) ||
                        (item.label === "CO/GSA/SAFTA" && e.preventDefault())
                      }
                      className={({ isActive }) =>
                        `flex items-center p-2 pl-5 cursor-pointer rounded font-semibold transition-all duration-300 ease-in-out ${
                          isActive
                            ? "bg-white text-black"
                            : "text-white hover:bg-white hover:text-black"
                        }`
                      }
                    >
                      <span className="text-lg">{item.icon}</span>
                      {!isCollapse && (
                        <span
                          className={`ml-3 ${
                            item.label === "REX Issuance" ||
                            item.label === "CO/GSA/SAFTA"
                              ? "text-gray-500 cursor-not-allowed"
                              : ""
                          }`}
                        >
                          {item.label}
                        </span>
                      )}
                    </NavLink>
                  );
                })}
              </div>
            )}
          </div>

          {/* Import Submenu */}
          <div className="mt-4">
            <button
              onClick={() => {
                setOpenImportMenu(!openImportMenu);
                if (isCollapse) setIsCollapse(false);
              }}
              className="w-full flex items-center justify-between text-white font-semibold text-lg px-3 py-2 hover:bg-white hover:text-black rounded transition-all duration-300"
            >
              <span className="flex items-center gap-2">
                <FaArrowAltCircleDown className="text-xl" />
                {!isCollapse && <span>Import</span>}
              </span>
              {!isCollapse &&
                (openExportMenu ? (
                  <FaChevronDown className="text-sm" />
                ) : (
                  <FaChevronRight className="text-sm" />
                ))}
            </button>

            {openImportMenu && (
              <div className="ml-2 border-l border-gray-700 mt-2 space-y-1">
                {importSubmenu.map((item, index) => {
                  if (item.hasChildren) {
                    // Nested submenu: E-Invoicing
                    return (
                      <div key={index}>
                        <button
                          onClick={() => setopenLCMenu(!openLCMenu)}
                          className="flex w-full items-center justify-between p-2 pl-5 rounded font-semibold text-white hover:bg-white hover:text-black transition-all duration-300"
                        >
                          <span className="flex items-center gap-2">
                            {item.icon}
                            {!isCollapse && <span>{item.label}</span>}
                          </span>
                          {!isCollapse &&
                            (openLCMenu ? (
                              <FaChevronDown className="text-sm" />
                            ) : (
                              <FaChevronRight className="text-sm" />
                            ))}
                        </button>

                        {openLCMenu && (
                          <div className="ml-5 border-l border-gray-700 mt-2 space-y-1">
                            {item.children?.map((subItem, subIndex) => (
                              <NavLink
                                key={subIndex}
                                to={subItem.path}
                                className={({ isActive }) =>
                                  `flex items-center p-2 pl-5 cursor-pointer rounded font-semibold transition-all duration-300 ease-in-out ${
                                    isActive
                                      ? "bg-white text-black"
                                      : "text-white hover:bg-white hover:text-black"
                                  }`
                                }
                              >
                                <span className="text-lg">{subItem.icon}</span>
                                {!isCollapse && (
                                  <span className="ml-3">{subItem.label}</span>
                                )}
                              </NavLink>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  }

                  // Normal export submenu
                  return (
                    <NavLink
                      key={index}
                      to={item.path || "#"}
                      className={({ isActive }) =>
                        `flex items-center p-2 pl-5 cursor-pointer rounded font-semibold transition-all duration-300 ease-in-out ${
                          isActive
                            ? "bg-white text-black"
                            : "text-white hover:bg-white hover:text-black"
                        }`
                      }
                    >
                      <span className="text-lg">{item.icon}</span>
                      {!isCollapse && (
                        <span className="ml-3">{item.label}</span>
                      )}
                    </NavLink>
                  );
                })}
              </div>
            )}
          </div>
        </nav>

        {/* Sign Out */}
        <div className="border-t border-gray-800 mt-auto py-4">
          <button
            type="button"
            onClick={signOut}
            className="w-full flex items-center gap-3 font-semibold text-lg text-white hover:bg-white hover:text-black p-3 transition-all duration-300 rounded-md hover:cursor-pointer"
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

// export default Sidebar;
