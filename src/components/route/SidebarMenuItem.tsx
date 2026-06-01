// components/SidebarMenuItem.tsx
import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { FaChevronDown, FaChevronRight } from "react-icons/fa";
import { iconMap } from "../util/iconMapper";

interface MenuItemProps {
  item: any;
  isCollapse: boolean;
  setIsCollapse: React.Dispatch<React.SetStateAction<boolean>>;
}

const SidebarMenuItem: React.FC<MenuItemProps> = ({
  item,
  isCollapse,
  setIsCollapse,
}) => {
  const [open, setOpen] = useState(false);
  const hasChildren = item.subMenus && item.subMenus.length > 0;
  useEffect(() => {
    if (isCollapse) {
      setOpen(false);
    }
  }, [isCollapse]);
  return (
    <div>
      {hasChildren ? (
        <button
          onClick={() => {
            setOpen(!open);
            setIsCollapse(false); // ✅ collapse sidebar
          }}
          className="mb-1 w-full flex items-center justify-between text-white px-3 py-2 rounded hover:bg-white hover:text-black transition"
        >
          <span className="flex items-center gap-2">
            {iconMap[item.parentIcon]}
            {!isCollapse && <span>{item.title}</span>}
          </span>

          {!isCollapse && (open ? <FaChevronDown /> : <FaChevronRight />)}
        </button>
      ) : (
        <NavLink
          to={item.link}
          className={({ isActive }) =>
            `mb-1 flex items-center gap-2 px-3 py-2 rounded font-semibold transition ${
              isActive
                ? "bg-white text-black"
                : "text-white hover:bg-white hover:text-black"
            }`
          }
        >
          {iconMap[item.parentIcon || item.childIcon]}
          {!isCollapse && <span>{item.title}</span>}
        </NavLink>
      )}

      {open && hasChildren && (
        <div className="ml-4 border-l border-gray-700">
          {item.subMenus.map((child: any, i: number) => (
            <SidebarMenuItem
              key={i}
              item={child}
              isCollapse={isCollapse}
              setIsCollapse={setIsCollapse}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default SidebarMenuItem;
