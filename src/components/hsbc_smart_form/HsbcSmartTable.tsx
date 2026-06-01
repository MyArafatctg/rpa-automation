import StatusBadge from "../util/StatusBadge";
import type { SmartFormData } from "./type";

const HsbcSmartTable = ({ rows }: { rows: SmartFormData[] }) => (
  <div className="overflow-x-auto max-h-[520px] border rounded-lg">
    <table className="min-w-full divide-y divide-gray-400">
      <thead className="bg-gray-200 sticky top-0">
        <tr className="uppercase">
          {[
            "Account Name",
            "Debit Account Number",
            "Status",
            "Debit Account Currency",
            "Pourpose of Payment",
            "Elapsed Time (sec.)",
          ].map((h) => (
            <th
              key={h}
              className="px-6 py-3 text-left text-[14px] font-bold text-black uppercase tracking-wider"
            >
              {h}
            </th>
          ))}
        </tr>
      </thead>

      <tbody className="divide-y divide-gray-400">
        {rows.map((row, index) => (
          <tr key={index}>
            <td className="px-6 py-4 font-bold">{row.Account_Name}</td>

            <td className="px-6 py-4 truncate max-w-[200px]">
              {row.Debit_Account_Number}
            </td>

            <td title={row.Err_Description || ""}>
              <StatusBadge
                status={row.Status}
                errDescription={row.Err_Description}
              />
            </td>

            <td className="px-6 py-4">{row.Debit_Account_Currency_1}</td>

            <td className="px-6 py-4">{row.Purpose_of_Payment}</td>

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
              {row.Elapsed_Time}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

export default HsbcSmartTable;
