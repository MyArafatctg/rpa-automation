import React, {
  useContext,
  useEffect,
  useMemo,
  useState,
  type ChangeEvent,
} from "react";
import { AppContext } from "../../context/AppContext";
import CheckBox from "../util/CheckBox";
import JobSummaryCard from "../cards/JobSummaryCard";

export interface RexData {
  ADSCODE: number;
  EXP_Serial: number;
  EXP_Year: number;
  Invoice_Amount_Confirmed_by_Customs: number;
  Custom_Office: number;
  Bill_of_Export_Number: number;
  Bill_of_Export_Date: string;
  Shipment_Date: string;
  Duplicate_Date: string;
  Transport_Doc_Type: number;
  Transport_Doc_No: string;
  Transport_Document_Date: string;
  Invoice_No: number;
  Invoice_Date: string;
  DUP_FLAG: string;
  Status: "Success" | "Processing" | "Fail" | "Pending";
  Err_Description: string | null;
  Elapsed_Time: string | null;
}

const statusStyles: Record<RexData["Status"], string> = {
  Success: "text-green-800 ",
  Processing: "text-blue-800",
  Fail: "text-red-800",
  Pending: "text-yellow-800",
};

// --- COMPONENT START ---

const RexReport: React.FC<{ data: RexData[]; fileName: string }> = ({
  data,
  fileName,
}) => {
  const { USER_CREDENTIALS } = useContext(AppContext);
  const [rows, setRows] = useState<RexData[]>(data);
  const [isProcessing] = useState(false);
  const { username, password } = USER_CREDENTIALS;
  const [isChecked, setChecked] = useState<boolean>(false);
  const [time, setTime] = useState(0);

  const handleCheckBox = (event: ChangeEvent<HTMLInputElement>) => {
    setChecked(event.target.checked);
    console.log(isChecked);
  };

  // Update rows when data prop changes (initial load)
  useEffect(() => {
    setRows(data);
  }, [data]);

  useEffect(() => {
    if (!rows || rows.length === 0) {
      setTime(0);
      return;
    }

    // Sum all elapsed seconds
    const totalSeconds = rows.reduce((acc, row) => {
      const seconds = Number(row.Elapsed_Time); // convert string to number
      return acc + (isNaN(seconds) ? 0 : seconds);
    }, 0);

    setTime(totalSeconds);
  }, [rows]);

  const handleRunBot = async () => {
    const formData = new FormData();
    formData.append("client_id", username);
    formData.append("filename", fileName);
    formData.append("username", username);
    formData.append("password", password);
    formData.append("botfile", "ExpDup");
    formData.append("folder", "D:/RPA");

    /*
    try {
      const response = await axiosInstance.post(`${BASE_URL}/api/start-run`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      console.log("RPA process initiated:", response);
    } catch (error) {
      console.error("Error initiating RPA process:", error);
      alert("Error initiating RPA process");
      return;
    }
      */
    console.log("Run BOT clicked");

    // Update all "Pending" rows to "Processing"
    setRows((prevRows) =>
      prevRows.map((r) =>
        r.Status === "Pending" ? { ...r, Status: "Processing" } : r,
      ),
    );

    // await processSequentially();
  };

  // Summary stats
  const [total, processing, completed, errors] = useMemo(() => {
    const total = rows.length;
    const processingCount = rows.filter(
      (r) => r.Status === "Processing",
    ).length;
    const completedCount = rows.filter((r) => r.Status === "Success").length;
    const errorsCount = rows.filter((r) => r.Status === "Fail").length;
    return [total, processingCount, completedCount, errorsCount];
  }, [rows]);

  return (
    // bg-gray-900
    <div className="bg-transparent rounded-xl shadow-2xl p-8  w-full">
      <div className="flex justify-between items-center mb-6 border-b border-gray-700 pb-3">
        <h1 className="text-3xl font-bold">RPA Live Processing</h1>
        <div className="flex">
          <CheckBox
            isChecked={isChecked}
            onChange={handleCheckBox}
            levelText="Show BOT Activities"
          ></CheckBox>
          <button
            onClick={handleRunBot}
            disabled={isProcessing}
            type="button"
            className="cursor-pointer text-sm font-medium px-3 py-1 rounded-full bg-green-800 text-white hover:bg-green-700 hover:text-white-300 transition duration-150"
          >
            {isProcessing ? "Processing..." : "Run BOT"}
          </button>
        </div>
      </div>

      {/* Stats */}
      {/* <div className="grid grid-cols-4 gap-6 mb-8">
        <StatCard title="Total" value={total} color="gray" />
        <StatCard title="Processing" value={processing} color="blue" />
        <StatCard title="Completed" value={completed} color="green" />
        <StatCard title="Error(s)" value={errors} color="red" />
      </div> */}

      <JobSummaryCard
        total={total}
        processing={completed}
        success={processing}
        failed={errors}
        time={time}
      />

      {/* Table */}
      <div className="overflow-x-auto rounded-lg border border-gray-400 shadow-md">
        <table className="min-w-full divide-y divide-gray-400">
          <thead className="bg-gray-200">
            <tr>
              {[
                "EXP Serial",
                "ADSCODE",
                "Invoice No",
                "Invoice Date",
                "Status",
                "EXP Year",
                "Invoice Amount",
                "DUP FLAG",
                "Elapsed Time (Sec.)",
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
            {rows.map((row) => (
              <tr
                key={row.EXP_Serial}
                className="hover:transition-all duration-200"
              >
                <td className="px-6 py-4 text-sm font-mono text-black rounded-l-lg">
                  {row.EXP_Serial}
                </td>
                <td className="px-6 py-4 text-sm font-mono text-black rounded-l-lg">
                  {row.ADSCODE}
                </td>
                <td className="px-6 py-4 text-sm font-semibold text-black">
                  {row.Invoice_No}
                </td>
                <td className="px-6 py-4 text-sm font-semibold text-black">
                  {row.Invoice_Date}
                </td>
                <td className="px-6 py-4 text-sm font-semibold">
                  <span
                    className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                      statusStyles[row.Status]
                    }`}
                  >
                    {row.Status === "Success" && (
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
                    {row.Status === "Processing" && (
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
                    {row.Status === "Fail" && (
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
                    {row.Status === "Pending" && (
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
                    <span>{row.Status}</span>
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-black truncate max-w-[200px]">
                  {row.EXP_Year}
                </td>
                <td className="px-6 py-4 text-sm text-black">
                  {row.Invoice_Amount_Confirmed_by_Customs}
                </td>
                <td className="px-6 py-4 text-sm text-black">{row.DUP_FLAG}</td>

                <td className="px-6 py-4 text-sm text-black font-mono bg-gray-800/30 rounded-r-lg flex items-center">
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
                  {row.Elapsed_Time}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RexReport;
