import React, { useState, type ReactNode } from "react";
import { FaAngleDown, FaAngleUp, FaBars, FaSignOutAlt } from "react-icons/fa";
import { NavLink, useNavigate } from "react-router-dom";

// helper for consistent link classes
const navLinkClass = ({ isActive }: { isActive: boolean }) =>
  `block p-2 cursor-pointer rounded transition-colors duration-150 ${
    isActive
      ? "bg-teal-600 text-white"
      : "text-white hover:bg-teal-600 hover:text-white"
  }`;

type NavProps = {
  children: ReactNode;
};

function Nav({ children }: NavProps) {
  const [openMenu, setOpenMenu] = useState(false);
  const [showSidebar, setShowSidebar] = useState(true);
  const isToken = localStorage.getItem("token");
  const navigate = useNavigate();
  function signOut(e: any) {
    e.preventDefault();
    localStorage.removeItem("token");
    navigate("/login");
  }
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="h-12 bg-teal-600 flex items-center justify-between px-4 text-white font-semibold sticky top-0 z-10">
        {/* Hamburger Menu */}
        <div className="inline-flex items-center space-x-4">
          <button
            onClick={() => setShowSidebar(!showSidebar)}
            className="text-xl focus:outline-none hover:cursor-pointer"
          >
            <FaBars />
          </button>
          <div className="relative">
            <h1 className="text-lg">RPA Automation</h1>
          </div>
        </div>

        {/* Sign Out */}
        {isToken && (
          <button
            type="button"
            title="Sign Out"
            onClick={signOut}
            className="hover:cursor-pointer"
          >
            <FaSignOutAlt />
          </button>
        )}
      </header>

      {/* Body */}
      <div className="flex flex-1">
        {/* Sidebar */}
        {showSidebar && (
          <aside
            className={`bg-gray-900 text-white h-[calc(100vh-3rem)] overflow-y-auto sticky top-12 self-start transition-all ease-in-out ${
              showSidebar ? "w-60" : "w-0"
            }`}
          >
            <nav className="p-4">
              <ul className="space-y-2">
                <li>
                  <NavLink to="/dashboard" className={navLinkClass}>
                    Dashboard
                  </NavLink>
                </li>

                <li>
                  <NavLink to="/rex-issuance" className={navLinkClass}>
                    Rex Issuance
                  </NavLink>
                </li>
                <li>
                  <NavLink to="/exp-download" className={navLinkClass}>
                    Exp Download
                  </NavLink>
                </li>
                <li>
                  <NavLink to="/cogsa-safta" className={navLinkClass}>
                    CO/GSA/SAFTA
                  </NavLink>
                </li>

                <li>
                  <NavLink to="/exp-duplication" className={navLinkClass}>
                    Exp Duplication
                  </NavLink>
                </li>

                <li>
                  <NavLink to="/edoc-upload-handm" className={navLinkClass}>
                    E-Doc Upload (H&M)
                  </NavLink>
                </li>

                <li>
                  <NavLink to="/einvoicing-handm" className={navLinkClass}>
                    E-Invoicing (H&M)
                  </NavLink>
                </li>

                <li>
                  <NavLink to="/fcr-submission" className={navLinkClass}>
                    FCR Submission
                  </NavLink>
                </li>
              </ul>
            </nav>
          </aside>
        )}

        {/* Main Content */}
        <main className="flex-1 p-4 overflow-y-auto bg-gray-50">
          {children}
        </main>
      </div>
    </div>
  );
}

export default Nav;

{
  /* Dropdown 
                <li className="group">
                  <button
                    onClick={() => setOpenMenu(!openMenu)}
                    className="w-full text-left flex justify-between items-center"
                  >
                    <span className="group-hover:text-blue-400">Service</span>
                    <span className="text-sm">
                      {openMenu ? <FaAngleUp /> : <FaAngleDown />}
                    </span>
                  </button>

                  Show submenu when openMenu true 
                  {openMenu && (
                    <ul className="pl-4 mt-1 space-y-1">
                      <li>
                        <Link
                          to="/exp-duplication"
                          className="block hover:text-blue-400 cursor-pointer"
                        >
                          Ecommerce
                        </Link>
                      </li>
                      <li>
                        <Link
                          to="/einvoicing-handm"
                          className="block hover:text-blue-400 cursor-pointer"
                        >
                          POS
                        </Link>
                      </li>
                    </ul>
                  )}
                </li>
                */
}
