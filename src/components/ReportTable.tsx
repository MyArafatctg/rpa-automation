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
  const [isProcessing, setIsProcessing] = useState(false);

  // Update rows when data prop changes (initial load)
  useEffect(() => {
    setRows(data);
  }, [data]);

  /**
   * Handles the asynchronous PUT request to update the row status.
   * Returns the updated ReportRow object received from the backend.
   */
  const handleUpdateStatus = async (
    id: number,
    status: ReportRow["status"]
  ): Promise<ReportRow> => {
    const apiUrl = `${BASE_URL}/api/v1/rpa/${id}/status/${status}`;
    try {
      const response = await axios.put<ReportRow>(apiUrl);
      return response.data;
    } catch (error) {
      console.error(`Error updating status for ID ${id}:`, error);
      throw error;
    }
  };

  // Process pending rows ONLY ONCE when component mounts
  useEffect(() => {
    const rowsToProcess = rows.filter((r) => r.status === "Pending");

    if (rowsToProcess.length === 0 || isProcessing) return;

    const processSequentially = async () => {
      setIsProcessing(true);

      for (const row of rowsToProcess) {
        setRows((prevRows) =>
          prevRows.map((r) =>
            r.id === row.id ? { ...r, status: "Processing" as const } : r
          )
        );
        try {
          console.log(`Processing row ID ${row.id}...`);
          // Simulate 3-second API delay + random status
          const finalStatus = Math.random() < 0.7 ? "Completed" : "Error";
          const updatedRow = await handleUpdateStatus(row.id, finalStatus);

          console.log(`Row ID ${row.id} processed with status: ${finalStatus}`);

          // Optimistic update - immediately reflect in UI
          setRows((prevRows) =>
            prevRows.map((r) => (r.id === updatedRow.id ? updatedRow : r))
          );

          // Add small delay between requests to see sequential processing
          // await new Promise((resolve) => setTimeout(resolve, 500));
        } catch (error) {
          console.error(`Failed to process row ${row.id}:`, error);
          setRows((prevRows) =>
            prevRows.map((r) =>
              r.id === row.id ? { ...r, status: "Error" as const } : r
            )
          );
        }
      }

      setIsProcessing(false);
    };

    processSequentially();
  }, []); // Empty dependency array = runs ONLY ONCE when component mounts

  // Summary stats
  const [total, processing, completed, errors] = useMemo(() => {
    const total = rows.length;
    const processingCount = rows.filter(
      (r) => r.status === "Processing"
    ).length;
    const completedCount = rows.filter((r) => r.status === "Completed").length;
    const errorsCount = rows.filter((r) => r.status === "Error").length;
    return [total, processingCount, completedCount, errorsCount];
  }, [rows]);

  return (
    <div className="bg-gray-900 rounded-xl shadow-2xl p-8 max-w-4xl w-full text-white">
      <div className="flex justify-between items-center mb-6 border-b border-gray-700 pb-3">
        <h1 className="text-3xl font-bold">Sequential Processing Report</h1>
        <div className="text-sm font-medium px-3 py-1 rounded-full bg-gray-800 text-blue-400">
          {isProcessing ? "Processing..." : "Ready"}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-6 mb-8">
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
              <tr
                key={row.id}
                className="hover:bg-gray-700/50 transition-all duration-200"
              >
                <td className="px-6 py-4 text-sm font-mono text-gray-400 bg-gray-800/50 rounded-l-lg">
                  {row.id}
                </td>
                <td className="px-6 py-4 text-sm font-semibold">
                  <span
                    className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                      statusStyles[row.status]
                    }`}
                  >
                    {row.status === "Completed" && (
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
                          d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    )}
                    {row.status === "Processing" && (
                      <svg
                        className="w-4 h-4 mr-2 animate-spin"
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
                        className="w-4 h-4 mr-2"
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
                    {row.status === "Pending" && (
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
                    )}
                    <span>{row.status}</span>
                  </span>
                </td>
                <td className="px-6 py-4 text-sm font-semibold text-gray-200">
                  {row.name}
                </td>
                <td className="px-6 py-4 text-sm text-gray-400 truncate max-w-[200px]">
                  {row.email}
                </td>
                <td className="px-6 py-4 text-sm text-gray-400">
                  {row.company}
                </td>
                <td className="px-6 py-4 text-sm text-gray-400 font-mono bg-gray-800/30 rounded-r-lg flex items-center">
                  <svg
                    className="w-4 h-4 mr-2 text-gray-500 flex-shrink-0"
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

      {/* Processing status footer */}
      {/* {isProcessing && (
        <div className="mt-6 p-4 bg-blue-900/20 border border-blue-500/30 rounded-lg">
          <div className="flex items-center justify-center">
            <svg
              className="w-5 h-5 mr-3 animate-spin text-blue-400"
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
          </div>
        </div>
      )} */}
    </div>
  );
};

export default ReportTable;
