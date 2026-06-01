import StatusBadge from "../util/StatusBadge";
import type { ContainerType } from "./containerTypes";

const ContainerTable = ({
  rows,
  onDelete,
}: {
  rows: ContainerType[];
  onDelete: (slNo: string, status: string) => void;
}) => (
  <div className="overflow-x-auto max-h-[520px] border rounded-lg">
    <table className="min-w-full divide-y divide-gray-400">
      <thead className="bg-gray-200 sticky top-0">
        <tr className="uppercase">
          {[
            "SL NO",
            "Status",
            "FCR",
            "INVOICE NO",
            "EXP NO",
            "Elapsed Time (sec.)",
            "Actions",
          ].map((h) => (
            <th key={h} className="px-6 py-3 text-left text-[14px] font-bold">
              {h}
            </th>
          ))}
        </tr>
      </thead>

      <tbody className="divide-y divide-gray-400">
        {rows.map((row) => (
          <tr key={row.SL_NO}>
            <td className="px-6 py-4 font-bold">{row.SL_NO}</td>

            <td className="cursor-pointer" title={row.ERR_DESCRIPTION || ""}>
              <StatusBadge
                status={row.STATUS}
                errDescription={row.ERR_DESCRIPTION}
              />
            </td>

            <td className="px-6 py-4 truncate max-w-[200px]">{row.FCR}</td>

            <td className="px-6 py-4">{row.INVOICE_NO}</td>

            <td className="px-6 py-4">{row.EXP_NO}</td>

            <td className="px-6 py-4 font-mono flex items-center">
              <svg
                className="w-4 h-4 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              {row.ELAPSED_TIME}
            </td>
            <td className="px-6 py-4 text-sm text-center whitespace-nowrap">
              <button
                onClick={() => onDelete(row.FCR, row.STATUS)}
                className="px-3 py-1 text-red-600 border border-red-500 rounded hover:bg-red-50 transition cursor-pointer"
              >
                Delete
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

export default ContainerTable;
