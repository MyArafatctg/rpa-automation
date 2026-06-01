import {
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
import type { SettingData } from "../util/setting_form/SettingsForm";
import { toast } from "react-toastify";
import SettingsForm from "../util/setting_form/SettingsForm";
import StatusBadge from "../util/StatusBadge";
import axiosInstance from "../../customHook/api/axiosInstance";

export interface EDocData {
  Shipper: string;
  Consignee: string;
  Booking_confirmation_number: string;
  Booking_Number: string;
  File_Path: string;
  File_Name: string;
  Upload_Type: string;
  Save_As: string;
  Status: "Success" | "Processing" | "Fail" | "Pending";
  Err_Description: string | null;
  Elapsed_Time: string | null;
}

const statusStyles: Record<EDocData["Status"], string> = {
  Success: "text-green-800",
  Processing: "text-blue-800",
  Fail: "text-red-800",
  Pending: "text-yellow-800",
};

const OldVersion = ({
  data,
  fileName,
}: {
  data: EDocData[];
  fileName: string;
}) => {
  const { BASE_URL, BACKEND_URL, clientId } = useContext(AppContext);
  const [rows, setRows] = useState<EDocData[]>(data);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isChecked, setChecked] = useState<boolean>(true);
  const [isDbUpdated, setIsDbUpdated] = useState(false);
  const [time, setTime] = useState(0);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleCheckBox = (event: ChangeEvent<HTMLInputElement>) => {
    setChecked(event.target.checked);
    console.log(isChecked);
  };

  //   convertor

  function convertToEDocData(rawData: any[]): EDocData[] {
    return rawData.map((item) => ({
      Shipper: item.Shipper ?? "",
      Consignee: item.Consignee ?? "",
      Booking_confirmation_number: item.Booking_confirmation_number ?? "",
      Booking_Number: "",
      File_Path: item.File_Path ?? "",
      File_Name: item.File_Name ?? "",
      Upload_Type: item.Upload_Type ?? "",
      Save_As: "",
      Status: (["Success", "Processing", "Fail", "Pending"].includes(
        item.Status,
      )
        ? item.Status
        : "Pending") as "Success" | "Processing" | "Fail" | "Pending",
      Err_Description: item.Err_Description || null,
      Elapsed_Time: item.Elapsed_Time ? item.Elapsed_Time.toString() : null,
    }));
  }

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
    const updatedRows = rows.map((r) => ({
      ...r,
      File_Path: `${settingData.folder}\\${r.File_Name}`,
    }));
    setRows(updatedRows);
    console.log("updatedRows : ", updatedRows);

    const filterData = rows.filter((r) => r.Status != "Success");
    console.log("filterData : ", JSON.stringify(filterData));
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
    formData.append("botfile", "EdocUpload");
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

    await processSequentially("D:\\RPA\\logs", logFileName);
  };

  const handleUpdateStatus = async (pathName: string): Promise<any> => {
    const apiUrl = `${BASE_URL}/api/fetch-log?path=${encodeURIComponent(
      pathName,
    )}`;
    console.log(apiUrl);
    try {
      const response = await axiosInstance.get<any>(apiUrl);
      const jsonData = await response.data;

      if (!Array.isArray(jsonData) || jsonData.length === 0) {
        console.log(
          "Log file not yet created or empty, retrying:",
          response.data,
        );
        return;
      }

      setRows((prevRows) => {
        const updatedData = convertToEDocData(jsonData);
        console.log();
        return prevRows.map((prev) => {
          const updated = updatedData.find(
            (u) =>
              String(u.Booking_confirmation_number) ===
              String(prev.Booking_confirmation_number),
          );

          console.log("updated : " + updated);
          return updated ? { ...prev, ...updated } : prev;
        });
      });
    } catch (error) {
      console.error(`Error updating status :`, error);
      throw error;
    }
  };

  const processSequentially = async (dir: string, fileName: string) => {
    const pathUrl = dir + "\\" + fileName;

    const intervalId = setInterval(async () => {
      await handleUpdateStatus(pathUrl);

      // After each update, check if processingCount is 0
      setRows((prevRows) => {
        const processingCount = prevRows.filter(
          (r) => r.Status === "Processing",
        ).length;

        if (processingCount === 0) {
          clearInterval(intervalId);
          setIsDbUpdated(true);
          setIsProcessing(false);
          console.log("✅ All processing completed. Interval stopped.");
        }

        return prevRows;
      });
    }, 5000);
  };

  // Updated DB
  useEffect(() => {
    if (!isProcessing) {
      const hasProcessing = rows.some((r) => r.Status === "Processing");

      if (!hasProcessing && isDbUpdated) {
        console.log("🔥 All rows completed. Updating DB with final rows...");
        updatedDBStatus(rows);
      }
    }
  }, [isDbUpdated, isProcessing]);

  const updatedDBStatus = async (finalRows: EDocData[]) => {
    const payload = finalRows.map((r) => ({
      status: r.Status,
      bookingNumber: r.Booking_confirmation_number,
      elapsedTime: r.Elapsed_Time,
      errDescription: r.Err_Description,
    }));

    console.log("Final Payload Sent to DB:", payload);
    try {
      const apiUrl = `${BACKEND_URL}/edoc/updateStatus`;
      const response = await axiosInstance.post(apiUrl, payload);
      console.log("DB Update Success:", response.data);
    } catch (error) {
      console.error("Error when DB update : ", error);
    }
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

      <JobSummaryCard
        total={total}
        processing={completed}
        success={processing}
        failed={errors}
        time={time}
      />

      {/* Table */}
      <div className="overflow-x-auto max-h-[520px] rounded-lg border border-gray-400 shadow-md">
        <table className="min-w-full divide-y divide-gray-400">
          <thead className="bg-gray-200 sticky top-0">
            <tr>
              {[
                "Booking Confirmation Number",
                "Status",
                "File Path",
                "File Name",
                "Upload Type",
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
                  {row.Booking_confirmation_number}
                </td>

                <td className="text-sm font-semibold">
                  <StatusBadge status={row.Status} />
                </td>

                <td className="px-6 py-4 text-sm text-black truncate max-w-[200px]">
                  {row.File_Path}
                </td>

                <td className="px-6 py-4 text-sm text-black">
                  {row.File_Name}
                </td>

                <td className="px-6 py-4 text-sm text-black">
                  {row.Upload_Type}
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

export default OldVersion;
