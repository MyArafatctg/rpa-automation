import StatusBadge from "../util/StatusBadge";
import type { TradeData } from "./type";

const TradeTable = ({ rows }: { rows: TradeData[] }) => {
  return (
    <div className="overflow-x-auto max-h-[520px] rounded-lg border border-gray-400 shadow-md">
      <table className="min-w-full divide-y divide-gray-400">
        <thead className="bg-gray-200 sticky top-0">
          <tr className="uppercase">
            {[
              "HTS ID",
              "Status",
              "TEMPLATE NAME",
              "CUSTOMER REFERENCE",
              "METHOD OF TRANSMISSION",
              "BENEFICIARY NAME",
              "Elapsed Time (sec.)",
            ].map((header) => (
              <th
                key={header}
                className="px-6 py-3 text-left text-[14px] font-bold text-black uppercase tracking-wider"
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-400">
          {rows.map((row, index) => (
            <tr
              key={index}
              className="hover:bg-gray-100/50 transition-all duration-200"
            >
              <td className="px-6 py-4 text-sm font-bold text-black rounded-l-lg">
                {row.HTS_ID}
              </td>
              <td
                title={row.ERR_DESCRIPTION || ""}
                className="text-sm font-semibold"
              >
                <StatusBadge
                  status={row.STATUS}
                  errDescription={row.ERR_DESCRIPTION}
                />
              </td>

              <td className="px-6 py-4 text-sm text-black truncate max-w-[200px]">
                {row.TEMPLATE_NAME}
              </td>

              <td className="px-6 py-4 text-sm text-black">
                {row.CUSTOMER_REFERENCE}
              </td>

              <td className="px-6 py-4 text-sm text-black">
                {row.METHOD_OF_TRANSMISSION}
              </td>

              <td className="px-6 py-4 text-sm text-black">
                {row.BENEFICIARY_NAME}
              </td>

              <td className="px-6 py-4 text-sm text-black font-mono rounded-r-lg flex items-center">
                <svg
                  className="w-4 h-4 mr-2 text-black shrink-0"
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
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TradeTable;
