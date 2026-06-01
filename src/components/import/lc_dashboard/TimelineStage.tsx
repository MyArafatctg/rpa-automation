import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";
import { IoFileTray } from "react-icons/io5";
import { IoMdCheckboxOutline } from "react-icons/io";
import type { CommercialCount } from "./LC_Dashboard";

// 1. Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
);

// Utility function to get Font Awesome/Material Icons class (best effort map)
interface TimelineStageProps {
  stage: string;
  count: number;
  leftArm?: { label: string; icon: string; sub: string };
  rightArm?: { label: string; icon: string; sub: string };
  commercialData?: CommercialCount;
  onStageClick: (stage: string, subStage: string | null) => void;
}

const TimelineStage = ({
  stage,
  count,
  leftArm,
  rightArm,
  commercialData,
  onStageClick,
}: TimelineStageProps) => {
  return (
    <div className="relative flex-1 group/stage text-center z-10">
      {/* MAIN CIRCLE */}
      <div
        className="w-16 h-16 rounded-full bg-teal-800 text-white flex items-center justify-center font-extrabold text-xl mx-auto transition-all duration-250 cursor-pointer group-hover/stage:scale-110 group-hover/stage:shadow-xl"
        onClick={() => onStageClick(stage, null)}
      >
        {count}
      </div>

      {/* LABEL */}
      <div className="mt-2 text-sm font-bold text-teal-950">{stage}</div>

      {/* HOVER ARMS */}
      {leftArm && (
        <button
          className="absolute w-[155px] p-2 bg-amber-400 text-amber-900 font-semibold text-xs rounded-full flex items-center justify-start gap-1 shadow-md transition-all duration-250 opacity-0 scale-50 group-hover/stage:opacity-100 group-hover/stage:scale-100 top-0 -left-14 pr-6 hover:scale-110 -z-20 h-15 cursor-pointer border-2 border-white overflow-hidden"
          onClick={(e) => {
            e.stopPropagation();
            onStageClick(stage, leftArm.sub);
          }}
        >
          <div className="w-[100px] flex items-center justify-start">
            <IoFileTray className="text-3xl " />
            <p className="text-left ml-2 text-[14px] hover:font-bold">
              {leftArm.label}
            </p>
          </div>
          <span className="text-xl font-bold">{commercialData?.newLc}</span>
        </button>
      )}

      {rightArm && (
        <button
          className="absolute w-[155px] p-2 bg-teal-300 text-teal-950 font-semibold text-xs rounded-full flex items-center justify-end gap-1 shadow-md transition-all duration-250 opacity-0 scale-50 group-hover/stage:opacity-100 group-hover/stage:scale-100 top-0 -right-14 pl-6 hover:scale-110 -z-20  h-15  cursor-pointer border-2 border-white overflow-hidden"
          onClick={(e) => {
            e.stopPropagation();
            onStageClick(stage, rightArm.sub);
          }}
        >
          <span className="text-xl font-bold">{commercialData?.onGoingLc}</span>
          <div className="w-[100px] flex items-center justify-end">
            <p className="text-right mr-2 text-[14px] hover:font-bold">
              {rightArm.label}
            </p>{" "}
            <IoMdCheckboxOutline className="text-4xl" />
          </div>
        </button>
      )}
    </div>
  );
};

export default TimelineStage;
