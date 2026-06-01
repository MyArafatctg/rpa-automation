import StatusBadge from "../util/StatusBadge";
import type { EDocData } from "./types";

const EDocTable = ({
  rows,
  onDelete,
}: {
  rows: EDocData[];
  onDelete: (id: string, status: string) => void;
}) => (
  <div className="overflow-x-auto max-h-[520px] border rounded-lg">
    <table className="min-w-full divide-y divide-gray-400">
      <thead className="bg-gray-200 sticky top-0">
        <tr className="uppercase">
          {[
            "Booking Confirmation Number",
            "Status",
            "File Path",
            "File Name",
            "Upload Type",
            "Elapsed Time (sec.)",
            "Actions",
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
        {rows.map((row) => (
          <tr key={row.Booking_confirmation_number}>
            <td className="px-6 py-4 font-bold">
              {row.Booking_confirmation_number}
            </td>

            <td title={row.Err_Description || ""}>
              <StatusBadge
                status={row.Status}
                errDescription={row.Err_Description}
              />
            </td>

            <td className="px-6 py-4 truncate max-w-[200px]">
              {row.File_Path}
            </td>

            <td className="px-6 py-4">{row.File_Name}</td>

            <td className="px-6 py-4">{row.Upload_Type}</td>

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
            <td className="px-6 py-4 text-sm text-center whitespace-nowrap">
              <button
                onClick={() =>
                  onDelete(row.Booking_confirmation_number, row.Status)
                }
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

export default EDocTable;
