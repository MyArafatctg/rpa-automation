import type { ReactNode } from "react";

interface Props {
  title: string;
  children: ReactNode;
}
const ChartCard = ({ title, children }: Props) => (
  <div className="bg-white rounded-xl p-4 shadow-md h-[400px] flex flex-col">
    <h5 className="text-xl font-bold mb-3 text-gray-800">{title}</h5>
    <div className="flex-1 min-h-0">{children}</div>
  </div>
);

export default ChartCard;
