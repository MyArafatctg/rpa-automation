import React, { useContext, useEffect, useMemo, useState } from "react";
import { AppContext } from "../../context/AppContext";
import axios from "axios";
import JobSummaryCard from "../cards/JobSummaryCard";
import SettingsForm, {
  type SettingData,
} from "../util/setting_form/SettingsForm";
import { toast } from "react-toastify";
import { LiveSocket } from "../../customHook/liveSocket";
import StatusBadge from "../util/StatusBadge";
import ProgressBar from "../util/ProgressBar";
import Swal from "sweetalert2";
import axiosInstance, {
  isAxiosError,
} from "../../customHook/api/axiosInstance";

export interface ExpReportRow {
  ADSCODE: string;
  EXP_Serial: string;
  EXP_Year: string;
  Invoice_No: string;
  Status: "Processing" | "Fail" | "Pending" | "Success" | "Downloading";
  Err_Description: string | null;
  Elapsed_Time: string | null;
}

const statusStyles: Record<ExpReportRow["Status"], string> = {
  Processing: "text-blue-800",
  Fail: "text-red-800",
  Pending: "text-yellow-800",
  Success: "text-green-800",
  Downloading: "text-blue-700",
};

// --- COMPONENT START ---

const ExpDownloadReport: React.FC<{
  data: ExpReportRow[];
  fileName: string;
}> = ({ data, fileName }) => {
  const { BASE_URL, BACKEND_URL, clientId } = useContext(AppContext);
  const [rows, setRows] = useState<ExpReportRow[]>(data);
  const [isProcessing, setIsProcessing] = useState(false);
  const [socket, setSocket] = useState<LiveSocket | null>(null);

  // const { username, password } = USER_CREDENTIALS;
  const [time, setTime] = useState(0);

  //Setting Forms
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Update rows when data prop changes (initial load)
  useEffect(() => {
    setRows(data);
  }, [data]);

  // Update rows when data prop changes (initial load)
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

  const runBot = async (settingData: SettingData) => {
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
    formData.append("botfile", "ExpDownload");
    formData.append("folder", settingData.folder);
    formData.append("excel_json", JSON.stringify(filterData));
    formData.append("headless", "false");

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

      setRows((prevRows) =>
        prevRows.map((row) => {
          const invoiceVal =
            payload.data?.invoice_no ||
            payload.invoice_no ||
            payload.Invoice_No ||
            payload.InvoiceNo ||
            payload.invoice ||
            null;

          if (!invoiceVal) return row;

          if (String(row.Invoice_No).trim() === String(invoiceVal).trim()) {
            if (
              payload.data?.Status === "Success" ||
              payload.data?.Status === "Fail"
            ) {
              updatedDBStatus({
                ...row,
                Status: payload.data?.Status,
                Err_Description:
                  payload.data?.Err_Description ?? row.Err_Description,
                Elapsed_Time:
                  payload.data?.Elapsed_Time != null
                    ? String(payload.data?.Elapsed_Time)
                    : row.Elapsed_Time,
              });
            }

            return {
              ...row,
              Status:
                payload.data?.Status ||
                payload.bot_status ||
                payload.Status ||
                payload.status ||
                "Downloading",
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
          (r) => r.Status === "Processing" || r.Status === "Downloading",
        ).length;

        if (processingCount === 0) {
          clearInterval(intervalId);
          setIsProcessing(false);
          console.log("✅ All processing completed. Interval stopped.");
          if (socket) {
            setSocket(null);
            console.log("🔌 WebSocket closed after completion");
          }
        }

        return prevRows;
      });
    }, 5000);
  };

  const updatedDBStatus = async (finalRows: ExpReportRow) => {
    console.log("rows : " + JSON.stringify(finalRows));
    try {
      const apiUrl = `${BACKEND_URL}/expDownload/updateStatus`;
      const response = await axiosInstance.post(apiUrl, finalRows);
      console.log(response);
    } catch (error) {
      console.error("Error when DB update : ", error);
    }
  };

  // Summary stats
  const [total, processing, completed, errors, percentage] = useMemo(() => {
    const total = rows.length;
    const processingCount = rows.filter(
      (r) => r.Status === "Processing" || r.Status === "Downloading",
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
  const handleDelete = async (expSerial: string, status: string) => {
    if (status === "Processing" || status === "Downloading") {
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

    // const result = await Swal.fire({
    //   title: "Confirm Deletion",
    //   text: `Are you sure you want to delete EXP Serial: ${expSerial}?`,
    //   icon: "warning",
    //   showCancelButton: true,
    //   confirmButtonColor: "#d33",
    //   cancelButtonColor: "#6b7280",
    //   confirmButtonText: "Yes, delete it",
    //   cancelButtonText: "Cancel",
    // });

    // if (!result.isConfirmed) return;

    try {
      await axiosInstance.delete(
        `${BACKEND_URL}/expDownload/delete/${expSerial}`,
      );

      // ✅ Update UI
      setRows((prev) => prev.filter((row) => row.EXP_Serial !== expSerial));

      await Swal.fire({
        icon: "success",
        title: "Deleted!",
        text: `EXP Serial ${expSerial} deleted successfully.`,
        timer: 2000,
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
                "Status",
                "EXP Year",
                "Invoice No",
                "Elapsed Time (sec.)",
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
                <td className="px-6 py-4 text-sm font-semibold text-black rounded-l-lg">
                  {row.EXP_Serial}
                </td>

                <td className="px-6 py-4 text-sm  text-black">{row.ADSCODE}</td>

                <td
                  className="px-6 py-4 text-sm font-semibold cursor-pointer"
                  title={row.Err_Description || ""}
                >
                  <StatusBadge
                    status={row.Status}
                    errDescription={row.Err_Description}
                  />
                </td>

                <td className="px-6 py-4 text-sm text-black truncate max-w-[200px]">
                  {row.EXP_Year}
                </td>
                <td className="px-6 py-4 text-sm text-black">
                  {row.Invoice_No}
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
      <SettingsForm
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onStart={(settingData) => runBot(settingData)}
      />
    </div>
  );
};

export default ExpDownloadReport;
