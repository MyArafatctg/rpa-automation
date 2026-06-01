import { useEffect, useState, useMemo } from "react";
import axios from "axios";
import { mapToContainerType } from "./mapToContainerType";
import type {
  ContainerStatusUpdatedPayload,
  ContainerType,
} from "./containerTypes";
import { LiveSocket } from "../../customHook/liveSocket";
import Swal from "sweetalert2";
import axiosInstance, {
  isAxiosError,
} from "../../customHook/api/axiosInstance";

export const useContainerProcessor = (
  initial: ContainerType[],
  api: { BASE_URL: string; BACKEND_URL: string; clientId: string },
  fileName: string,
) => {
  const { BASE_URL, BACKEND_URL, clientId } = api;

  const [rows, setRows] = useState<ContainerType[]>(initial);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showBotActivity, setShowBotActivity] = useState(true);
  const [time, setTime] = useState(0);
  const [socket, setSocket] = useState<LiveSocket | null>(null);

  useEffect(() => {
    setRows(initial);
  }, [initial]);

  useEffect(() => {
    const totalSeconds = rows.reduce(
      (sum, r) => sum + (Number(r.ELAPSED_TIME) || 0),
      0,
    );
    setTime(totalSeconds);
  }, [rows]);

  const startBot = async (settings: any) => {
    console.log("Bot Started..");
    console.info("Settings:", settings);
    setIsProcessing(true);

    setTimeout(() => {
      // Update all "Pending" rows to "Processing"
      console.log("Updating pending rows to Processing...");
      setRows((prevRows) =>
        prevRows.map((r) =>
          r.STATUS != "Success" ? { ...r, STATUS: "Processing" } : r,
        ),
      );
    }, 1000);

    const pending = rows.filter((r) => r.STATUS !== "Success");
    if (pending.length === 0) {
      // throw new Error("No pending rows to process");
      console.log("No pending rows to process");
    }
    console.log("settings : ", settings);

    const formData = new FormData();
    formData.append("client_id", clientId);
    formData.append("filename", fileName);
    formData.append("username", "username");
    formData.append("password", "password");
    formData.append("botfile", "ContainerDownloadHnM");
    formData.append("folder", settings.downloadFolder);
    formData.append("excel_json", JSON.stringify(rows));
    formData.append("headless", showBotActivity ? "true" : "false");

    const res = await axios.post(`${BASE_URL}/api/start-run-json`, formData);

    // console.log("clientId: ", clientId);
    // console.log("response: ", res);
    // console.log("showBotActivity: ", showBotActivity);

    // CONNECT WEBSOCKET HERE
    const ws = new LiveSocket(BASE_URL, clientId);
    ws.connect();
    setSocket(ws);

    // LISTEN FOR MESSAGES
    ws.onMessage((payload) => {
      // console.log("WS PAYLOAD:", payload);

      setRows((prevRows) =>
        prevRows.map((row) => {
          const rowId = payload.data?.FCR || payload.fcr || null;

          if (!rowId) return row;

          if (String(row.FCR).trim() === String(rowId).trim()) {
            if (
              payload.data?.STATUS === "Success" ||
              payload.data?.STATUS === "Fail"
            ) {
              updatedDBStatus({
                fcr: String(row.FCR),
                status: payload.data?.STATUS,
                errDescription:
                  payload.data?.ERR_DESCRIPTION ?? row.ERR_DESCRIPTION,
                elapsedTime:
                  payload.data?.ELAPSED_TIME != null
                    ? payload.data?.ELAPSED_TIME
                    : row.ELAPSED_TIME,
              });
            }

            return {
              ...row,
              STATUS:
                payload.data?.STATUS ||
                payload.bot_status ||
                payload.Status ||
                payload.status ||
                "Processing",
              ERR_DESCRIPTION:
                payload.data?.ERR_DESCRIPTION ?? row.ERR_DESCRIPTION,
              ELAPSED_TIME:
                payload.data?.ELAPSED_TIME != null
                  ? String(payload.data?.ELAPSED_TIME)
                  : row.ELAPSED_TIME,
            };
          }

          return row;
        }),
      );
    });

    await pollLog();
  };

  const updatedDBStatus = async (request: ContainerStatusUpdatedPayload) => {
    // console.log("rows : " + JSON.stringify(request));
    try {
      const apiUrl = `${BACKEND_URL}/container/updateStatus`;
      const response = await axiosInstance.post(apiUrl, request);
      // console.log(response);
    } catch (error) {
      console.error("Error when DB update : ", error);
    }
  };

  const pollLog = async () => {
    const interval = setInterval(async () => {
      setRows((prevRows) => {
        const processingCount = prevRows.filter(
          (r) => r.STATUS === "Processing" || r.STATUS === "Running Tasks",
        ).length;

        if (processingCount === 0) {
          clearInterval(interval);
          setIsProcessing(false);
          if (socket) {
            setSocket(null);
            console.log("🔌 WebSocket closed after completion");
          }
        }

        return prevRows;
      });
    }, 5000);
  };

  // Delete Row
  const handleDelete = async (id: string, status: string) => {
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
      await axiosInstance.delete(`${BACKEND_URL}/container/delete/${id}`);

      // ✅ Update UI
      setRows((prev) => prev.filter((row) => row.FCR !== id));

      await Swal.fire({
        icon: "success",
        title: "Deleted!",
        text: `EXP Serial ${id} deleted successfully.`,
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

  const summary = useMemo(() => {
    const total = rows.length;
    return {
      total,
      processing: rows.filter(
        (r) => r.STATUS === "Processing" || r.STATUS === "Running Tasks",
      ).length,
      success: rows.filter((r) => r.STATUS === "Success").length,
      failed: rows.filter((r) => r.STATUS === "Fail").length,
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
    handleDelete,
  };
};
