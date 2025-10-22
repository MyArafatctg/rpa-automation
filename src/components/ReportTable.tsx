import React, { useContext, useEffect, useMemo, useState } from "react";
import StatCard from "./StatCard";
import { AppContext } from "../context/AppContext";
import axios from "axios";

// --- INTERFACES AND STYLES ---

export interface ReportRow {
  id: number;
  status: "Completed" | "Processing" | "Error" | "Pending";
  name: string;
  email: string;
  company: string;
  time: string;
}

const statusStyles: Record<ReportRow["status"], string> = {
  Completed: "text-green-500",
  Processing: "text-blue-500",
  Error: "text-red-500",
  Pending: "text-yellow-500",
};

// --- COMPONENT START ---

const ReportTable: React.FC<{ data: ReportRow[] }> = ({ data }) => {
  const { BASE_URL } = useContext(AppContext);
  const [rows, setRows] = useState<ReportRow[]>(data);

  /**
   * Handles the asynchronous PUT request to update the row status.
   * Returns the updated ReportRow object received from the backend.
   */
  const handleUpdateStatus = async (
    id: number,
    status: ReportRow["status"]
  ): Promise<ReportRow> => {
    // Note: The base URL and API path must exactly match your Spring Boot config
    const apiUrl = `${BASE_URL}/api/v1/rpa/${id}/status/${status}`;
    try {
      // <ReportRow> specifies the type of data expected in response.data
      const response = await axios.put<ReportRow>(apiUrl);
      // console.log(`Status successfully updated for ID ${id}:`, response.data);
      return response.data; // Return the full updated row
    } catch (error) {
      console.error(`Error updating status for ID ${id}:`, error);
      // Throw the error so the caller (useEffect) can handle the failure case
      throw error;
    }
  };

  // Summary stats (remains correct)
  const [total, processing, completed, errors] = useMemo(() => {
    const total = rows.length;
    const processing = rows.filter((r) => r.status === "Processing").length;
    const completed = rows.filter((r) => r.status === "Completed").length;
    const errors = rows.filter((r) => r.status === "Error").length;
    return [total, processing, completed, errors];
  }, [rows]);

  useEffect(() => {
    const rowsToProcess = rows.filter((r) => r.status === "Pending");

    if (rowsToProcess.length === 0) return;

    const processSequentially = async () => {
      for (const row of rowsToProcess) {
        const finalStatus = Math.random() < 0.7 ? "Completed" : "Error";

        try {
          console.log(`Processing row ID ${row.id}...`);
          const updatedRow = await handleUpdateStatus(row.id, finalStatus);
          console.log(`Row ID ${row.id} processed with status: ${finalStatus}`);

          setRows((prevRows) =>
            prevRows.map((r) => (r.id === updatedRow.id ? updatedRow : r))
          );
          console.log(`Row ID ${row.id} updated in state.`);
        } catch (error) {
          setRows((prevRows) =>
            prevRows.map((r) =>
              r.id === row.id ? { ...r, status: "Error" as const } : r
            )
          );
        }
      }
    };
    processSequentially();
  }, [rows]);

  return (
    <div className="bg-gray-900 rounded-xl shadow-2xl p-8 max-w-4xl w-full text-white">
      <h1 className="text-3xl font-bold mb-6 border-b border-gray-700 pb-3">
        Sequential Processing Report
      </h1>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        <StatCard title="Total" value={total} color="gray" />
        <StatCard title="Processing" value={processing} color="blue" />
        <StatCard title="Completed" value={completed} color="green" />
        <StatCard title="Errors" value={errors} color="red" />
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-lg border border-gray-700 shadow-md">
        <table className="min-w-full divide-y divide-gray-700">
          <thead className="bg-gray-800">
            <tr>
              {["#", "Status", "Name", "Email", "Company", "Time"].map(
                (header) => (
                  <th
                    key={header}
                    className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider"
                  >
                    {header}
                  </th>
                )
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800">
            {rows.map((row) => (
              <tr key={row.id} className="hover:bg-gray-700 transition">
                <td className="px-6 py-4 text-sm text-gray-400">{row.id}</td>
                <td className="px-6 py-4 text-sm font-semibold">
                  <span
                    className={`inline-flex items-center ${
                      statusStyles[row.status]
                    }`}
                  >
                    {row.status === "Completed" && (
                      <svg
                        className="w-5 h-5 mr-1"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    )}
                    {row.status === "Processing" && (
                      <svg
                        className="w-5 h-5 mr-1 animate-spin text-blue-400"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                        />
                      </svg>
                    )}
                    {row.status === "Error" && (
                      <svg
                        className="w-5 h-5 mr-1"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    )}
                    <span>{row.status}</span>
                  </span>
                </td>
                <td className="px-6 py-4 text-sm font-bold text-gray-200">
                  {row.name}
                </td>
                <td className="px-6 py-4 text-sm text-gray-400">{row.email}</td>
                <td className="px-6 py-4 text-sm text-gray-400">
                  {row.company}
                </td>
                <td className="px-6 py-4 text-sm text-gray-400 font-mono flex items-center">
                  <svg
                    className="w-4 h-4 mr-1 text-gray-500"
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
                  {row.time}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ReportTable;
