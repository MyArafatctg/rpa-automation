import { Menu, CalendarCheck } from "lucide-react";

interface DashboardCardProps {
  title: string;
  children: React.ReactNode;
  hasData?: boolean;
}

const DashboardCard = ({
  title,
  children,
  hasData = true,
}: DashboardCardProps) => {
  return (
    // Responsive sizing: full width on mobile, half width on large screens
    <div className="bg-white rounded-xl shadow-xl overflow-hidden h-full flex flex-col transition-all duration-300 hover:shadow-2xl">
      {/* Card Header (Dark Grey) */}
      <div className="flex items-center justify-between p-3 bg-gray-700 text-white rounded-t-xl">
        <div className="flex items-center space-x-2">
          <Menu className="w-5 h-5 text-gray-300" />
          <h2 className="text-lg font-semibold">{title}</h2>
        </div>
        {/* Right Icon (History/Calendar icon) */}
        <button
          className="p-1 rounded-full text-gray-300 hover:text-white transition-colors"
          aria-label={`View history for ${title}`}
        >
          <CalendarCheck className="w-5 h-5" />
        </button>
      </div>

      {/* Card Content */}
      <div
        className={`p-4 grow overflow-auto ${
          !hasData ? "flex items-center justify-center" : ""
        }`}
      >
        {children}
      </div>
    </div>
  );
};

export default DashboardCard;
