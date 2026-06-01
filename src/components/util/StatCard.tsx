interface StatCardProps {
  title: string;
  value: number;
  color: "blue" | "green" | "red" | "gray" | "dark";
}
const StatCard = ({ title, value, color }: StatCardProps) => {
  const bgColor =
    color === "blue"
      ? "bg-blue-900/50"
      : color === "green"
      ? "bg-green-900/50"
      : color === "red"
      ? "bg-red-900/50"
      : "bg-gray-800";

  const textColor =
    color === "blue"
      ? "text-blue-400"
      : color === "green"
      ? "text-green-400"
      : color === "red"
      ? "text-red-400"
      : "text-white";

  return (
    <div
      className={`p-4 rounded-xl shadow-lg border border-gray-700 ${bgColor}`}
    >
      <h3 className="text-sm font-medium text-gray-400">{title}</h3>
      <p className={`text-2xl font-bold mt-1 ${textColor}`}>{value}</p>
    </div>
  );
};

export default StatCard;
