import { useEffect, useState, useMemo } from "react";
import axios from "axios";
import { LiveSocket } from "../../customHook/liveSocket";
import type { SmartFormData, SmartFormPayload, SmartFormStatus } from "./type";
import axiosInstance from "../../customHook/api/axiosInstance";

export const useSmartFormProcessor = (
  initial: SmartFormData[],
  api: { BASE_URL: string; BACKEND_URL: string; clientId: string },
  fileName: string,
) => {
  const { BASE_URL, BACKEND_URL, clientId } = api;

  const [rows, setRows] = useState<SmartFormData[]>(initial);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showBotActivity, setShowBotActivity] = useState(true);
  const [time, setTime] = useState(0);
  const [percentage, setPercentage] = useState(0);
  const [socket, setSocket] = useState<LiveSocket | null>(null);

  useEffect(() => {
    setRows(initial);
  }, [initial]);

  useEffect(() => {
    const totalSeconds = rows.reduce(
      (sum, r) => sum + (Number(r.Elapsed_Time) || 0),
      0,
    );
    setTime(totalSeconds);

    const progress =
      summary.total === 0
        ? 0
        : Math.round(
            ((summary.success + summary.failed) / summary.total) * 100,
          );
    setPercentage(progress);
  }, [rows]);

  const startBot = async (settings: any) => {
    setIsProcessing(true);

    setTimeout(() => {
      // Update all "Pending" rows to "Processing"
      setRows((prevRows) =>
        prevRows.map((r) =>
          r.Status != "Success" ? { ...r, Status: "Processing" } : r,
        ),
      );
    }, 1000);

    console.log("Bot Started..");

    const pending = rows.filter((r) => r.Status !== "Success");
    if (pending.length === 0) {
      throw new Error("No pending rows to process");
    }

    const formData = new FormData();
    formData.append("client_id", clientId);
    formData.append("filename", fileName);
    formData.append("username", "username");
    formData.append("password", "password");
    formData.append("botfile", "ImpHSF");
    formData.append("folder", settings.folder);
    formData.append("excel_json", JSON.stringify(pending));
    formData.append("headless", showBotActivity ? "true" : "false");

    const res = await axios.post(`${BASE_URL}/api/start-run-json`, formData);
    const logPath = res.data.json_log_path;

    // CONNECT WEBSOCKET HERE
    const ws = new LiveSocket(BASE_URL, clientId);
    ws.connect();
    setSocket(ws);

    // LISTEN FOR MESSAGES
    ws.onMessage((payload) => {
      console.log("WS PAYLOAD:", payload);

      setRows((prevRows) =>
        prevRows.map((row) => {
          const rowId =
            payload.data?.Debit_Account_Number ||
            payload.Debit_Account_Number ||
            null;

          if (!rowId) return row;

          if (
            String(row.Debit_Account_Number).trim() === String(rowId).trim()
          ) {
            if (
              payload.data?.Status === "Success" ||
              payload.data?.Status === "Fail"
            ) {
              updatedDBStatus({
                id: String(row.Debit_Account_Number),
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
              Status:
                payload.data?.Status ||
                payload.bot_status ||
                payload.Status ||
                payload.status ||
                "Processing",
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

    await pollLog();
  };

  const pollLog = async () => {
    const intervalId = setInterval(async () => {
      // After each update, check if processingCount is 0
      setRows((prevRows) => {
        const processingCount = prevRows.filter(
          (r) => r.Status === "Processing" || r.Status === "Running Tasks",
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

  const updatedDBStatus = async (request: SmartFormPayload) => {
    console.log("rows : " + JSON.stringify(request));
    try {
      const apiUrl = `${BACKEND_URL}/edoc/updateStatus`;
      const response = await axiosInstance.post(apiUrl, request);
      console.log(response);
    } catch (error) {
      console.error("Error when DB update : ", error);
    }
  };

  const summary = useMemo(() => {
    const total = rows.length;
    return {
      total,
      processing: rows.filter(
        (r) => r.Status === "Processing" || r.Status === "Running Tasks",
      ).length,
      success: rows.filter((r) => r.Status === "Success").length,
      failed: rows.filter((r) => r.Status === "Fail").length,
    };
  }, [rows]);

  return {
    rows,
    setShowBotActivity,
    showBotActivity,
    startBot,
    isProcessing,
    summary,
    time,
    percentage,
  };
};
function setSocket(ws: LiveSocket) {
  throw new Error("Function not implemented.");
}
