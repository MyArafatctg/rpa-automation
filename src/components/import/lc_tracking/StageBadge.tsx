import {
  Briefcase,
  FileCheck,
  Settings,
  UserCheck,
  ShieldCheck,
  CheckCircle,
} from "lucide-react";

const getStageInfo = (stage: string) => {
  switch (stage) {
    case "Commercial":
      return {
        color: "bg-blue-100 text-blue-700",
        icon: <Briefcase size={14} className="mr-1" />,
        stageName: "Commercial",
      };

    case "Audit":
      return {
        color: "bg-purple-100 text-purple-700",
        icon: <FileCheck size={14} className="mr-1" />,
        stageName: "Audit",
      };

    case "PC":
      return {
        color: "bg-orange-100 text-orange-700",
        icon: <Settings size={14} className="mr-1" />,
        stageName: "Process Control",
      };

    case "GM":
      return {
        color: "bg-indigo-100 text-indigo-700",
        icon: <UserCheck size={14} className="mr-1" />,
        stageName: "GM/ED",
      };

    case "BOD":
      return {
        color: "bg-red-100 text-red-700",
        icon: <ShieldCheck size={14} className="mr-1" />,
        stageName: "BOD",
      };

    case "Completed":
      return {
        color: "bg-green-100 text-green-700",
        icon: <CheckCircle size={14} className="mr-1" />,
        stageName: "Completed",
      };

    default:
      return {
        color: "bg-gray-100 text-gray-600",
        icon: null,
      };
  }
};

const StageBadge = ({ stage }: { stage: string }) => {
  const { color, icon, stageName } = getStageInfo(stage);

  return (
    <span
      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${color}`}
    >
      {icon}
      {stageName}
    </span>
  );
};

export default StageBadge;
