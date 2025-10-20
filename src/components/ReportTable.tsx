import React from "react";

export interface ReportRow {
  id: number;
  status: "Completed" | "Processing" | "Error";
  name: string;
  email: string;
  company: string;
  time: string;
}

// Helper for status classes
const statusStyles = {
  Completed: "text-green-500",
  Processing: "text-blue-500",
  Error: "text-red-500",
};

const ReportTable = ({ data }: { data: ReportRow[] }) => {
  // Calculate summary stats
  const total = data.length;
  const processing = data.filter((r) => r.status === "Processing").length;
  const completed = data.filter((r) => r.status === "Completed").length;
  const errors = data.filter((r) => r.status === "Error").length;

  const StatCard: React.FC<{ title: string; value: number; color: string }> = ({
    title,
    value,
    color,
  }) => (
    <div
      className={`p-4 rounded-xl shadow-lg border border-gray-700 ${
        color === "blue"
          ? "bg-blue-900/50"
          : color === "green"
          ? "bg-green-900/50"
          : color === "red"
          ? "bg-red-900/50"
          : "bg-gray-800"
      }`}
    >
      <h3 className="text-sm font-medium text-gray-400">{title}</h3>
      <p
        className={`text-2xl font-bold mt-1 ${
          color === "blue"
            ? "text-blue-400"
            : color === "green"
            ? "text-green-400"
            : color === "red"
            ? "text-red-400"
            : "text-white"
        }`}
      >
        {value}
      </p>
    </div>
  );

  return (
    <div className="bg-gray-900 rounded-xl shadow-2xl p-8 max-w-4xl w-full text-white">
      <h1 className="text-3xl font-bold mb-6 border-b border-gray-700 pb-3">
        Processing Report
      </h1>

      {/* Stats Grid */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        <StatCard title="Total" value={total} color="dark" />
        <StatCard title="Processing" value={processing} color="blue" />
        <StatCard title="Completed" value={completed} color="green" />
        <StatCard title="Errors" value={errors} color="red" />
      </div>

      {/* Data Table */}
      <div className="overflow-x-auto rounded-lg border border-gray-700 shadow-md">
        <table className="min-w-full divide-y divide-gray-700">
          <thead className="bg-gray-800">
            <tr>
              {["#", "Status", "Name", "Email", "Company", "Time"].map(
                (header) => (
                  <th
                    key={header}
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider"
                  >
                    {header}
                  </th>
                )
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800">
            {data.map((row) => (
              <tr
                key={row.id}
                className="bg-gray-850 hover:bg-gray-700 transition-colors duration-150"
              >
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-500">
                  {row.id}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <span
                    className={`inline-flex items-center font-semibold ${
                      statusStyles[row.status]
                    }`}
                  >
                    {row.status === "Completed" && (
                      <svg
                        className="w-5 h-5 mr-1"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                        ></path>
                      </svg>
                    )}
                    {row.status === "Processing" && (
                      <svg
                        className="w-5 h-5 mr-1 animate-spin text-blue-500"
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
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                    )}
                    {row.status === "Error" && (
                      <svg
                        className="w-5 h-5 mr-1"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                        ></path>
                      </svg>
                    )}
                    <span className="text-gray-200 ml-1">{row.status}</span>
                  </span>
                </td>

                <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-200">
                  {row.name}
                </td>

                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                  {row.email}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                  {row.company}
                </td>

                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400 font-mono flex items-center">
                  <svg
                    className="w-4 h-4 mr-1 text-gray-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    ></path>
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
