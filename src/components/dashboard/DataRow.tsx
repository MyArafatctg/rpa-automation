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

interface DataRowProps {
  data: WorkHistoryItem;
  isTotal?: boolean;
}
const DataRow = ({ data, isTotal }: DataRowProps) => {
  // Utility function to safely format numbers for display
  const formatValue = (value: number | string): string => {
    if (typeof value === "number") {
      return value.toFixed(2);
    }
    return String(value);
  };
  return (
    <tr
      className={`border-b ${
        isTotal ? "font-bold bg-gray-50" : "hover:bg-gray-100"
      }`}
    >
      <td className="py-2 px-3 text-center text-gray-900">{data.sl}</td>
      <td className="py-2 px-3 whitespace-nowrap text-sm font-medium text-gray-900">
        {data.pName}
      </td>
      <td className="py-2 px-3 text-center text-sm text-gray-700">
        {formatValue(data.rate)}
      </td>
      <td className="py-2 px-3 text-center text-sm text-gray-700">{data.tp}</td>
      <td className="py-2 px-3 text-center text-sm text-gray-700">
        {data.succeed}
      </td>
      <td className="py-2 px-3 text-center text-sm text-gray-700">
        {data.failed}
      </td>
      <td className="py-2 px-3 text-center text-sm text-gray-700">
        {formatValue(data.cost)}
      </td>
      <td className="py-2 px-3 text-center text-sm text-gray-700">
        {formatValue(data.tCons)}
      </td>
      <td className="py-2 px-3 text-center text-sm text-gray-700">
        {formatValue(data.tSave)}
      </td>
    </tr>
  );
};

export default DataRow;
