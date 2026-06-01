import React, { useState, useRef, useCallback, useContext } from "react";
import axios from "axios";
import { AppContext } from "../../context/AppContext";
import {
  FiUploadCloud,
  FiFileText,
  FiDownload,
  FiXCircle,
  FiLoader,
} from "react-icons/fi";
import type { PDFData } from "./ExcelTable";
import axiosInstance, {
  isAxiosError,
} from "../../customHook/api/axiosInstance";

/**
 * Defines the possible states of the upload process.
 */
type UploadStatus = "idle" | "uploading" | "success" | "error";

interface Props {
  onData: (data: PDFData[]) => void;
}

// convertor
export function convertToPDFData(raw: any[]): PDFData[] {
  return raw.map((item) => ({
    pageNo: String(item["Page No"] ?? ""),
    companyName: item["Company Name"] ?? "",
    documentNo: item["Document No"] ?? "",
    documentDate: item["Document Date"] ?? "",
    accountNo: item["Account No"] ?? "",
    bankNo: item["Bank No"] ?? "",
    ourDocument: item["Our Document"] ?? "",
    yourInvoiceNo: item["Your Invoice No."] ?? "",
    reference: item["Reference"] ?? "",
    cashDiscount: item["Cash Discount"] ?? "",
    cashDiscountNum: String(item["Cash DiscountNum"] ?? ""),
    whtamount: item["WHT amount"] ?? "",
    wHTAmountNum: String(item["WHT Amount Num"] ?? ""),
    grossAmount: item["Gross amount"] ?? "",
    grossAmountNum: Number(item["Gross Amount Num"] ?? 0),
    file: item["File"] ?? "",
  }));
}

const PdfUploader = ({ onData }: Props) => {
  const [status, setStatus] = useState<UploadStatus>("idle");
  const [statusMessage, setStatusMessage] = useState<string>("");
  const [fileName, setFileName] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { BASE_URL } = useContext(AppContext);

  /**
   * Handles the file selection change event.
   */
  const handleFileChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (file) {
        setFileName(file.name);
        setStatus("idle");
        setStatusMessage("");
      } else {
        setFileName("");
      }
    },
    [],
  );

  /**
   * Clears the selected file and resets the component state.
   */
  const handleClearFile = useCallback(() => {
    if (fileInputRef.current) {
      fileInputRef.current.value = ""; // Clear the input element's value
    }
    setFileName("");
    setStatus("idle");
    setStatusMessage("");
  }, []);

  /**
   * The core logic for uploading the PDF and handling the response.
   */
  const uploadPdf = useCallback(async () => {
    const file = fileInputRef.current?.files?.[0];

    if (!file) {
      setStatus("error");
      setStatusMessage("Please select a PDF file first.");
      return;
    }

    setStatus("uploading");
    setStatusMessage("Uploading & Extracting...");

    try {
      const fd = new FormData();
      fd.append("pdf", file);

      const res = await axios.post(`${BASE_URL}/api/pdf-extract`, fd, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      const data = res.data.data;

      console.log(JSON.stringify(data));
      onData(convertToPDFData(data));

      setStatus("success");
      setStatusMessage("PDF Extracted Successfully (Excel Downloaded)");
    } catch (err) {
      setStatus("error");
      if (isAxiosError(err) && err.response) {
        setStatusMessage(
          `Error: Server responded with status ${err.response.status}`,
        );
      } else {
        setStatusMessage(
          `Error: ${
            err instanceof Error ? err.message : "An unknown error occurred"
          }`,
        );
      }
    }
  }, []);

  const getStatusClasses = (): string => {
    switch (status) {
      case "uploading":
        return "text-blue-600 bg-blue-100 border-blue-400";
      case "success":
        return "text-green-600 bg-green-100 border-green-400";
      case "error":
        return "text-red-600 bg-red-100 border-red-400";
      case "idle":
      default:
        return "text-gray-600 bg-gray-100 border-gray-300";
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white shadow-xl rounded-xl">
      <h3 className="flex items-center text-2xl font-semibold text-gray-800 mb-4 border-b pb-2">
        <FiFileText className="mr-2 text-teal-500" /> PDF to Excel Extractor
      </h3>

      {/* --- File Input Area --- */}
      <div className="mb-6">
        <label
          htmlFor="pdfFile"
          className={`flex flex-col items-center justify-center p-6 border-2 border-dashed rounded-lg cursor-pointer transition-colors ${
            fileName
              ? "border-teal-500 bg-indigo-50"
              : "border-gray-300 hover:bg-gray-50"
          }`}
        >
          <input
            type="file"
            id="pdfFile"
            accept=".pdf"
            onChange={handleFileChange}
            ref={fileInputRef}
            className="hidden" // Hide the default file input
          />

          {fileName ? (
            <div className="text-center">
              <div className="flex items-center text-lg font-medium text-teal-600">
                <FiFileText className="mr-2 h-6 w-6" />
                <span>{fileName}</span>
              </div>
              <p className="text-sm text-gray-500 mt-1">
                Ready for upload. Click the button below.
              </p>
              <button
                onClick={handleClearFile}
                type="button"
                className="mt-2 text-sm text-red-500 hover:text-red-700 font-medium"
              >
                <FiXCircle className="inline mr-1" /> Clear File
              </button>
            </div>
          ) : (
            <div className="text-center">
              <FiUploadCloud className="w-10 h-10 text-gray-400" />
              <p className="mt-2 text-sm text-gray-600">
                <span className="font-semibold text-teal-600">
                  Click to upload
                </span>{" "}
                or drag and drop
              </p>
              <p className="text-xs text-gray-500">PDF (Max 10MB)</p>
            </div>
          )}
        </label>
      </div>

      {/* --- Upload Button --- */}
      <div className="mb-4">
        <button
          onClick={uploadPdf}
          disabled={!fileName || status === "uploading"}
          className={`w-full py-3 px-4 rounded-lg text-white font-bold transition-all duration-200 shadow-md ${
            !fileName || status === "uploading"
              ? "bg-gray-300 cursor-not-allowed"
              : "bg-teal-600 hover:bg-teal-700 hover:shadow-lg"
          }`}
        >
          {status === "uploading" ? (
            <span className="flex items-center justify-center">
              <FiLoader className="animate-spin mr-2" /> Processing...
            </span>
          ) : (
            <span className="flex items-center justify-center">
              <FiDownload className="mr-2" /> Upload & Get Excel
            </span>
          )}
        </button>
      </div>

      {/* --- Status Bar --- */}
      {status !== "idle" && (
        <div
          id="pdfStatus"
          className={`p-3 rounded-lg border text-center font-medium transition-all ${getStatusClasses()}`}
        >
          {statusMessage}
        </div>
      )}

      {/* The original code's pdfPreview div wasn't used, so we omit it here for a cleaner component */}
    </div>
  );
};

export default PdfUploader;
