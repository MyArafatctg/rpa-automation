import DataRow from "./DataRow";
import TableHeader from "./TableHeader";

interface WorkHistoryItem {
  sl: number | string; // Serial number (string for 'Total' row)
  pName: string;
  rate: number | string; // Rate (string for 'Total' row, number for data rows)
  tp: number;
  succeed: number;
  failed: number;
  cost: number;
  tCons: number;
  tSave: number;
}

const totalWorkData: WorkHistoryItem = {
  sl: "",
  pName: "Total",
  rate: "",
  tp: 2,
  succeed: 2,
  failed: 0,
  cost: 0.0,
  tCons: 8.83,
  tSave: 8.83,
};

const todayWorkData: WorkHistoryItem[] = [
  {
    sl: 1,
    pName: "EXP Download",
    rate: 0.0,
    tp: 2,
    succeed: 2,
    failed: 0,
    cost: 0.0,
    tCons: 8.83,
    tSave: 8.83,
  },
];

const TodayWorkHistory = () => {
  return (
    <div className="relative overflow-x-auto w-full">
      <table className="w-full text-sm text-left rtl:text-right text-gray-500 min-w-[700px]">
        <TableHeader />
        <tbody>
          {todayWorkData.map((data) => (
            // Type assertion is safe here as this is a non-total row
            <DataRow key={data.sl as number} data={data} />
          ))}
          {/* Total Row */}
          <DataRow data={totalWorkData} isTotal={true} />
        </tbody>
      </table>
    </div>
  );
};

export default TodayWorkHistory;
