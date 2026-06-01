import { useEffect, useState, useMemo } from "react";
import axios from "axios";
import type { EDocData, EdocStatusUpdatedPayload } from "./types";
import { LiveSocket } from "../../customHook/liveSocket";
import { useRef } from "react";
import Swal from "sweetalert2";
import axiosInstance, {
  isAxiosError,
} from "../../customHook/api/axiosInstance";

export const useEDocProcessor = (
  initial: EDocData[],
  api: { BASE_URL: string; BACKEND_URL: string; clientId: string },
  fileName: string,
) => {
  const { BASE_URL, BACKEND_URL, clientId } = api;

  const [rows, setRows] = useState<EDocData[]>(initial);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showBotActivity, setShowBotActivity] = useState(true);
  const [time, setTime] = useState(0);
  const [percentage, setPercentage] = useState(0);
  const [socket, setSocket] = useState<LiveSocket | null>(null);

  const lastSettingsRef = useRef<any>(null);

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

  //Run Bot Eng.

  const startBot = async (settings: any) => {
    setIsProcessing(true);
    lastSettingsRef.current = settings;

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

    const updated = pending.map((r) => {
      let name = r.File_Name.trim();
      name = name.endsWith(".pdf") ? name : name + ".pdf";

      return {
        ...r,
        File_Name: name,
        File_Path: `${settings.folder}\\${name}`,
      };
    });

    setRows((prev) =>
      prev.map(
        (item) =>
          updated.find(
            (r) =>
              r.Booking_confirmation_number ===
              item.Booking_confirmation_number,
          ) ?? item,
      ),
    );

    const formData = new FormData();
    formData.append("client_id", clientId);
    formData.append("filename", fileName);
    formData.append("username", settings.username);
    formData.append("password", settings.password);
    formData.append("botfile", "EdocUpload");
    formData.append("folder", "D:\\RPA\\logs");
    formData.append("excel_json", JSON.stringify(updated));
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
            payload.data?.Booking_confirmation_number ||
            payload.Booking_confirmation_number ||
            null;

          if (!rowId) return row;

          if (
            String(row.Booking_confirmation_number).trim() ===
            String(rowId).trim()
          ) {
            if (
              payload.data?.Status === "Success" ||
              payload.data?.Status === "Fail"
            ) {
              updatedDBStatus({
                bookingNumber: String(row.Booking_confirmation_number),
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
          (r) => r.Status === "Processing" || r.Status === "Uploading",
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

  const updatedDBStatus = async (request: EdocStatusUpdatedPayload) => {
    console.log("rows : " + JSON.stringify(request));
    try {
      const apiUrl = `${BACKEND_URL}/edoc/updateStatus`;
      const response = await axiosInstance.post(apiUrl, request);
      console.log(response);
    } catch (error) {
      console.error("Error when DB update : ", error);
    }
  };

  // Delete Row
  const handleDelete = async (id: string, status: string) => {
    if (status === "Processing" || status === "Uploading") {
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
    //   text: `Are you sure you want to delete EXP Serial: ${id}?`,
    //   icon: "warning",
    //   showCancelButton: true,
    //   confirmButtonColor: "#d33",
    //   cancelButtonColor: "#6b7280",
    //   confirmButtonText: "Yes, delete it",
    //   cancelButtonText: "Cancel",
    // });

    // if (!result.isConfirmed) return;

    try {
      await axiosInstance.delete(`${BACKEND_URL}/edoc/delete/${id}`);

      // ✅ Update UI
      setRows((prev) =>
        prev.filter((row) => row.Booking_confirmation_number !== id),
      );

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

  const summary = useMemo(() => {
    const total = rows.length;
    return {
      total,
      processing: rows.filter(
        (r) => r.Status === "Processing" || r.Status === "Uploading",
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
    handleDelete,
  };
};
