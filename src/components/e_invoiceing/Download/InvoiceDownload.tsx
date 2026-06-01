import {
  useContext,
  useEffect,
  useMemo,
  useState,
  type ChangeEvent,
} from "react";
import { AppContext } from "../../../context/AppContext";
import axios from "axios";
import CheckBox from "../../util/CheckBox";
import JobSummaryCard from "../../cards/JobSummaryCard";
import type {
  EInvoice,
  InvoiceSettingData,
  InvoiceStatusUpdatePayload,
} from "../InvoiceType";
import InvoiceTable from "../InvoiceTable";
import InvoiceSetting from "../InvoiceSetting";
import { toast } from "react-toastify";
import { LiveSocket } from "../../../customHook/liveSocket";
import ProgressBar from "../../util/ProgressBar";
import Swal from "sweetalert2";
import axiosInstance, {
  isAxiosError,
} from "../../../customHook/api/axiosInstance";

const InvoiceDownload = ({
  data,
  fileName,
}: {
  data: EInvoice[];
  fileName: string;
}) => {
  const { BASE_URL, BACKEND_URL, clientId } = useContext(AppContext);
  const [rows, setRows] = useState<EInvoice[]>(data);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isChecked, setChecked] = useState<boolean>(true);
  const [time, setTime] = useState(0);

  const [socket, setSocket] = useState<LiveSocket | null>(null);

  //Setting Forms
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleCheckBox = (event: ChangeEvent<HTMLInputElement>) => {
    setChecked(event.target.checked);
    console.log(isChecked);
  };

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
      const seconds = Number(row.ELAPSED_TIME); // convert string to number
      return acc + (isNaN(seconds) ? 0 : seconds);
    }, 0);

    setTime(totalSeconds);
  }, [rows]);

  const handleRunBot = async () => {
    setIsModalOpen(true);
  };

  const runBot = async (settingData: InvoiceSettingData) => {
    const filterData = rows.filter((r) => r.STATUS != "Success");

    if (filterData.length < 1) {
      toast.error("No pending row found!");
      return;
    }

    let logFileName;

    const formData = new FormData();
    formData.append("client_id", clientId); //"EXP-102491"
    formData.append("filename", fileName);
    formData.append("username", settingData.username); //"commercial@apexholdings.com"
    formData.append("password", settingData.password); //"Askml12345"
    formData.append("botfile", "EInvoiceHnMDownload");
    formData.append("folder", settingData.folder); //"E:\\RPA\\E-Invoicing\\H&M\\"
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
          r.STATUS != "Success" ? { ...r, STATUS: "Processing" } : r,
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
            payload.data?.EINVOICE_ID ||
            payload.einvoice_id ||
            payload.Invoice_No ||
            payload.InvoiceNo ||
            payload.invoice ||
            null;

          if (!invoiceVal) return row;

          if (String(row.EINVOICE_ID).trim() === String(invoiceVal).trim()) {
            if (
              payload.data?.STATUS === "Success" ||
              payload.data?.STATUS === "Fail"
            ) {
              updatedDBStatus({
                status: payload.data?.STATUS,
                invoiceId: payload.data?.EINVOICE_ID,
                elapsedTime: payload.data?.ELAPSED_TIME,
                errDescription: payload.data?.ERR_DESCRIPTION,
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

    await processSequentially();
  };

  const processSequentially = async () => {
    const intervalId = setInterval(async () => {
      // After each update, check if processingCount is 0
      setRows((prevRows) => {
        const processingCount = prevRows.filter(
          (r) => r.STATUS === "Processing" || r.STATUS === "Running Tasks",
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

  const updatedDBStatus = async (payload: InvoiceStatusUpdatePayload) => {
    console.log("Final Payload Sent to DB:", payload);
    try {
      const apiUrl = `${BACKEND_URL}/invoice/download/updateStatus`;
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
      (r) => r.STATUS === "Processing" || r.STATUS === "Running Tasks",
    ).length;
    const completedCount = rows.filter((r) => r.STATUS === "Success").length;
    const errorsCount = rows.filter((r) => r.STATUS === "Fail").length;
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
      await axiosInstance.delete(
        `${BACKEND_URL}/invoice/download/delete/${id}`,
      );

      // ✅ Update UI
      setRows((prev) => prev.filter((row) => row.EINVOICE_ID !== id));

      await Swal.fire({
        icon: "success",
        title: "Deleted!",
        text: `Invoice Id ${id} deleted successfully.`,
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
      <InvoiceTable rows={rows} onDelete={handleDelete} />
      <InvoiceSetting
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onStart={(settingData) => runBot(settingData)}
      />
    </div>
  );
};

export default InvoiceDownload;
