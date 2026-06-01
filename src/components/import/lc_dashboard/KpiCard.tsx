import type { JSX } from "react";
import {
  BiFilter,
  BiHourglass,
  BiCheckCircle,
  BiError,
  BiKey,
  BiBox,
  BiCheckSquare,
  BiCalendarCheck,
} from "react-icons/bi";
import { IoCheckmarkDoneCircleOutline } from "react-icons/io5";

// The onClick property is now required and handled by the parent
export interface KpiData {
  label: string;
  value: string | number;
  subTitle?: string;
  icon: string;
  color: string;
  type: "total" | "inProgress" | "completed" | "delayed" | "approved" | string;
  onClick: (type: KpiData["type"]) => void; // IMPORTANT: Define the required onClick signature
}

const iconMap: Record<string, JSX.Element> = {
  "file-text": <BiFilter />,
  hourglass: <BiHourglass />,
  "check-circle": <BiCheckCircle />,
  "alert-triangle": <BiError />,
  eye: <BiKey />,
  inbox: <BiBox />,
  "check-square": <BiCheckSquare />,
  "calendar-check": <BiCalendarCheck />,
  "checkmark-done-circle": <IoCheckmarkDoneCircleOutline />,
};

// Destructure onClick from props
const KpiCard = ({
  label,
  value,
  subTitle,
  icon,
  color,
  type,
  onClick,
}: KpiData) => {
  const bgColor = `${color}`;
  const textColor =
    color === "bg-[#9ECFD4]" ||
    color === "bg-[#E5E9C5]" ||
    color === "bg-[#0080004f]"
      ? "text-gray-800"
      : "text-white";

  // Use the passed-in onClick prop directly
  const handleViewDetails = () => {
    onClick(type);
  };

  return (
    <>
      <div
        // Pass onClick to the container to make the whole card clickable for details
        onClick={handleViewDetails}
        className={`relative rounded-xl p-5 ${bgColor} ${textColor} shadow-lg overflow-hidden transition-transform duration-200 hover:scale-[1.02] cursor-pointer`}
      >
        <div className="flex items-center gap-3">
          <div className="text-3xl opacity-90">
            {iconMap[icon] ?? <BiFilter />}
          </div>

          <div>
            <div className="text-3xl font-bold">
              {value}
              {subTitle && (
                <span className="pl-2 text-lg opacity-80 font-medium">
                  ({subTitle})
                </span>
              )}
            </div>
            <div className="text-xs opacity-95">{label}</div>
          </div>
        </div>

        {/* The hover button now just calls the primary handler */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-200 backdrop-blur-sm bg-black/15">
          <button
            className="bg-white/35 text-teal-950 rounded-lg py-2 px-4 font-bold inline-flex items-center gap-2 border-0 shadow-lg cursor-pointer"
            // The button also calls handleViewDetails
            onClick={(e) => {
              e.stopPropagation(); // Prevent duplicate clicks from the parent div
              handleViewDetails();
            }}
          >
            <BiKey /> View Details
          </button>
        </div>
      </div>
    </>
  );
};

export default KpiCard;
