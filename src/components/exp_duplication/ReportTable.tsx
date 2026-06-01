import React, {
  useContext,
  useEffect,
  useMemo,
  useState,
  type ChangeEvent,
} from "react";
import { AppContext } from "../../context/AppContext";
import axios from "axios";
import CheckBox from "../util/CheckBox";
import JobSummaryCard from "../cards/JobSummaryCard";
import DuplicationSettingForm, {
  type DuplicationSettingType,
} from "./DuplicationSettingForm";
import { toast } from "react-toastify";
import StatusBadge from "../util/StatusBadge";
import { LiveSocket } from "../../customHook/liveSocket";
import ProgressBar from "../util/ProgressBar";
import Swal from "sweetalert2";
import axiosInstance, {
  isAxiosError,
} from "../../customHook/api/axiosInstance";

export interface ReportRow {
  ADSCODE: string;
  EXP_Serial: string;
  EXP_Year: string;
  Invoice_Amount_Confirmed_by_Customs: string;
  Custom_Office: string;
  Bill_of_Export_Number: string;
  Bill_of_Export_Date: string;
  Shipment_Date: string;
  Duplicate_Date: string;
  Transport_Doc_Type: string;
  Transport_Doc_No: string;
  Transport_Document_Date: string;
  Invoice_No: string;
  Invoice_Date: string;
  DUP_FLAG: string;
  Status: "Success" | "Processing" | "Fail" | "Pending" | "Running Tasks";
  Err_Description: string | null;
  Elapsed_Time: string | null;
}

interface DuplicationStatusUpdatedPayload {
  expSerial: string;
  status?: "Success" | "Processing" | "Fail" | "Pending" | "Running Tasks";
  errDescription?: string;
  elapsedTime?: string | number | null;
}

export const convertToReportRows = (data: any[]): ReportRow[] => {
  return data.map((item) => ({
    ADSCODE: item.ADSCODE,
    EXP_Serial: item.EXP_Serial,
    EXP_Year: item.EXP_Year,
    Invoice_Amount_Confirmed_by_Customs:
      item.Invoice_Amount_Confirmed_by_Customs,
    Custom_Office: item.Custom_Office,
    Bill_of_Export_Number: item.Bill_of_Export_Number,
    Bill_of_Export_Date: item.Bill_of_Export_Date,
    Shipment_Date: item.Shipment_Date,
    Duplicate_Date: item.Duplicate_Date,
    Transport_Doc_Type: item.Transport_Doc_Type,
    Transport_Doc_No: item.Transport_Doc_No,
    Transport_Document_Date: item.Transport_Document_Date,
    Invoice_No: item.Invoice_No,
    Invoice_Date: item.Invoice_Date,
    DUP_FLAG: item.DUP_FLAG,
    Status: item.Status?.toLowerCase().includes("fail")
      ? "Fail"
      : item.Status?.toLowerCase().includes("success")
        ? "Success"
        : item.Status?.toLowerCase().includes("pending")
          ? "Pending"
          : "Processing",
    Err_Description: item.Err_Description || null,
    Elapsed_Time: item.Elapsed_Time ? String(item.Elapsed_Time) : null,
  }));
};

const statusStyles: Record<ReportRow["Status"], string> = {
  Success: "text-green-800",
  Processing: "text-blue-800",
  Fail: "text-red-800",
  Pending: "text-yellow-800",
  "Running Tasks": "text-orange-500",
};

// --- COMPONENT START ---

const ReportTable: React.FC<{ data: ReportRow[]; fileName: string }> = ({
  data,
  fileName,
}) => {
  const { BASE_URL, BACKEND_URL, clientId } = useContext(AppContext);
  const [rows, setRows] = useState<ReportRow[]>(data);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isDbUpdated, setIsDbUpdated] = useState(false);
  const [isChecked, setChecked] = useState<boolean>(true);
  const [time, setTime] = useState(0);
  const [socket, setSocket] = useState<LiveSocket | null>(null);

  //Setting Forms
  const [isModalOpen, setIsModalOpen] = useState(false);

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
    setIsModalOpen(true);
  };

  const runBot = async (settingData: DuplicationSettingType) => {
    const filterData = rows.filter((r) => r.Status != "Success");

    if (filterData.length < 1) {
      toast.error("No pending row found!");
      return;
    }

    let logFileName;

    const formData = new FormData();
    formData.append("client_id", clientId);
    formData.append("filename", fileName);
    formData.append("username", settingData.username);
    formData.append("password", settingData.password);
    formData.append("botfile", "ExpDup");
    formData.append("folder", "D:\\RPA\\logs");
    formData.append("excel_json", JSON.stringify(filterData));
    formData.append("headless", isChecked ? "true" : "false");

    try {
      const response = await axios.post(
        `${BASE_URL}/api/start-run-json`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
      );
      console.log("RPA process initiated:", response);
      logFileName = response.data.json_log_path;
    } catch (error) {
      console.error("Error initiating RPA process:", error);
    }
    console.log("Run BOT clicked");
    setIsProcessing(true);
    // Simulate processing delay
    setTimeout(() => {
      // Update all "Pending" rows to "Processing"
      setRows((prevRows) =>
        prevRows.map((r) =>
          r.Status != "Success" ? { ...r, Status: "Processing" } : r,
        ),
      );
    }, 1000);

    // CONNECT WEBSOCKET HERE
    const ws = new LiveSocket(BASE_URL, clientId);
    ws.connect();
    setSocket(ws);

    // LISTEN FOR MESSAGES
    ws.onMessage((payload) => {
      console.log("WS PAYLOAD:", payload);
      console.log("Payload Data:", payload.data);

      setRows((prevRows) =>
        prevRows.map((row) => {
          const invoiceVal =
            payload.data?.EXP_Serial || payload.exp_serial || null;

          if (!invoiceVal) return row;

          if (String(row.EXP_Serial).trim() === String(invoiceVal).trim()) {
            if (
              payload.data?.Status === "Success" ||
              payload.data?.Status === "Fail"
            ) {
              updatedDBStatus({
                expSerial: String(row.EXP_Serial),
                status: payload.data?.Status,
                errDescription:
                  payload.data?.Err_Description ?? row.Err_Description,
                elapsedTime:
                  payload.data?.Elapsed_Time != null
                    ? payload.data?.Elapsed_Time
                    : row.Elapsed_Time,
              });
            }
            return {
              ...row,
              Status: payload.data?.Status || "Processing",
              Err_Description:
                payload.data?.Err_Description ?? row.Err_Description,
              Elapsed_Time:
                payload.data?.Elapsed_Time != null
                  ? String(payload.data?.Elapsed_Time)
                  : row.Elapsed_Time,
            };
          }

          return row;
        }),
      );
    });

    await processSequentially();
  };

  const processSequentially = async () => {
    const intervalId = setInterval(async () => {
      // After each update, check if processingCount is 0
      setRows((prevRows) => {
        const processingCount = prevRows.filter(
          (r) => r.Status === "Processing" || r.Status === "Running Tasks",
        ).length;

        if (processingCount === 0) {
          clearInterval(intervalId);
          setIsProcessing(false);
          setIsDbUpdated(true);
          console.log("✅ All processing completed. Interval stopped.");
        }

        return prevRows;
      });
    }, 3000);
  };

  const updatedDBStatus = async (payload: DuplicationStatusUpdatedPayload) => {
    console.log("Final Payload Sent to DB:", payload);
    try {
      const apiUrl = `${BACKEND_URL}/expDup/updateStatus`;
      const response = await axiosInstance.post(apiUrl, payload);
      console.log("DB Update Success:", response.data);
    } catch (error) {
      console.error("Error when DB update : ", error);
    }
  };

  // Summary stats

  const [total, processing, completed, errors, percentage] = useMemo(() => {
    const total = rows.length;
    const processingCount = rows.filter(
      (r) => r.Status === "Processing" || r.Status === "Running Tasks",
    ).length;
    const completedCount = rows.filter((r) => r.Status === "Success").length;
    const errorsCount = rows.filter((r) => r.Status === "Fail").length;
    const percentage =
      total === 0
        ? 0
        : Math.round(((completedCount + errorsCount) / total) * 100);
    return [total, processingCount, completedCount, errorsCount, percentage];
  }, [rows]);

  // Delete Row
  const handleDelete = async (id: string, status: string) => {
    if (status === "Processing" || status === "Running Tasks") {
      await Swal.fire({
        icon: "warning",
        title: "Action Not Allowed",
        text: "Cannot delete a row that is currently processing.",
      });
      return;
    }

    if (status === "Success") {
      await Swal.fire({
        icon: "info",
        title: "Completed Record",
        text: "Cannot delete a row that has been completed successfully.",
      });
      return;
    }

    try {
      await axiosInstance.delete(`${BACKEND_URL}/expDup/delete/${id}`);

      // ✅ Update UI
      setRows((prev) => prev.filter((row) => row.EXP_Serial !== id));

      await Swal.fire({
        icon: "success",
        title: "Deleted!",
        text: `EXP Serial ${id} deleted successfully.`,
        timer: 1000,
        showConfirmButton: false,
      });
    } catch (error: any) {
      if (isAxiosError(error)) {
        if (error.response?.status === 404) {
          await Swal.fire({
            icon: "error",
            title: "Not Found",
            text:
              error.response.data?.message ||
              "No pending record found or already processed.",
          });
        } else {
          await Swal.fire({
            icon: "error",
            title: "Delete Failed",
            text: "Failed to delete the record.",
          });
        }
      } else {
        await Swal.fire({
          icon: "error",
          title: "Unexpected Error",
          text: "Something went wrong.",
        });
      }
    }
  };

  return (
    <div className="bg-transparent rounded-xl shadow-2xl p-8 w-full">
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

      <div className="mb-6">
        <ProgressBar value={percentage} />
      </div>

      <JobSummaryCard
        total={total}
        processing={processing}
        success={completed}
        failed={errors}
        time={time}
      />

      {/* Table */}
      <div className="overflow-x-auto max-h-[520px] rounded-lg border border-gray-400 shadow-md">
        <table className="min-w-full divide-y divide-gray-400">
          <thead className="bg-gray-200 sticky top-0">
            <tr className="uppercase">
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
                "Actions",
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
                <td
                  className=" text-sm font-semibold"
                  title={row.Err_Description || ""}
                >
                  <StatusBadge
                    status={row.Status}
                    errDescription={row.Err_Description}
                  />
                </td>
                <td className="px-6 py-4 text-sm text-black truncate max-w-[300px]">
                  {row.EXP_Year}
                </td>
                <td className="px-6 py-4 text-sm text-black">
                  {row.Invoice_Amount_Confirmed_by_Customs}
                </td>
                <td className="px-6 py-4 text-sm text-black">{row.DUP_FLAG}</td>

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
                  {row.Elapsed_Time}
                </td>
                <td className="px-6 py-4 text-sm text-center whitespace-nowrap">
                  <button
                    onClick={() => handleDelete(row.EXP_Serial, row.Status)}
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
      <DuplicationSettingForm
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onStart={(settingData) => runBot(settingData)}
      />
    </div>
  );
};

export default ReportTable;
