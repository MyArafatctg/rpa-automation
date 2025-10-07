import { useState } from "react";

import * as FaIcons from "react-icons/fa";
import * as AiIcons from "react-icons/ai";

import { IconContext } from "react-icons";

import { Link } from "react-router-dom";

export default function Navbar() {
  const [sidebar, setSidebar] = useState(false);

  const showSidebar = () => setSidebar(!sidebar);

  const NAV_BG = "bg-[#060b26]";

  const navMenuClasses = `
    ${NAV_BG} 
    w-[250px] 
    h-screen 
    flex 
    justify-center 
    fixed 
    top-0 
    transition-[left] 
    duration-[850ms] 
    ${sidebar ? "left-0 duration-[350ms]" : "left-[-100%]"}
  `;

  return (
    <>
      <IconContext.Provider value={{ color: "#FFF" }}>
        <div className={`${NAV_BG} h-20 flex justify-start items-center`}>
          <Link to="#" className="ml-8 text-3xl bg-transparent">
            <FaIcons.FaBars onClick={showSidebar} />
          </Link>
          <h1 className="text-white text-2xl mx-auto">RPA Automation</h1>
          <Link to="#" className="mr-8 text-3xl bg-transparent">
            <FaIcons.FaUser />
          </Link>
        </div>

        <nav className={navMenuClasses}>
          <ul className="w-full p-0" onClick={showSidebar}>
            <li
              className={`${NAV_BG} w-full h-20 flex justify-start items-center`}
            >
              <Link to="#" className="ml-8 text-3xl bg-transparent">
                <AiIcons.AiOutlineClose />
              </Link>
            </li>

            <li>
              <Link
                to="dashboard"
                className="
                  flex justify-start items-center 
                  no-underline text-[#f5f5f5] text-lg 
                  w-[95%] h-[60px] 
                  px-4 rounded hover:bg-[#1a83ff]
                "
              >
                <span className="ml-4">Dashboard</span>
              </Link>
            </li>
          </ul>
        </nav>
      </IconContext.Provider>
    </>
  );
}
