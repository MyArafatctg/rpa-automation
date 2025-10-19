import React, { useState, useCallback, useRef } from "react";
import * as XLSX from "xlsx";
import type { RowsData } from "./ExcelReport";

// Define the component's state type
interface UploadState {
  isDragging: boolean;
  fileName: string | null;
  uploadStatus: "idle" | "success" | "error";
}
const ExcelUploadDashboard = ({
  onData,
}: {
  onData: (data: RowsData[]) => void;
}) => {
  const [state, setState] = useState<UploadState>({
    isDragging: false,
    fileName: null,
    uploadStatus: "idle",
  });

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Helper function to handle file processing (for demonstration)
  const handleFileChange = (file: File | null) => {
    if (file) {
      // Check file type
      const allowedTypes = [
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "application/vnd.ms-excel",
        "text/csv",
      ];

      if (!allowedTypes.includes(file.type) && !file.name.endsWith(".csv")) {
        setState({
          ...state,
          fileName: file.name,
          uploadStatus: "error",
        });
        console.error("Invalid file type uploaded:", file.type);
        return;
      }
      // *** In a real application, you would send the 'file' object to your backend here ***
      console.log("File ready for upload:", file.name);
      const reader = new FileReader();
      reader.onload = (evt) => {
        const arrayBuffer = evt.target?.result;
        const wb = XLSX.read(arrayBuffer, { type: "array" });
        const wsname = wb.SheetNames[0];
        const ws = wb.Sheets[wsname];
        const jsonData: RowsData[] = XLSX.utils.sheet_to_json(ws);
        onData(jsonData);
      };
      reader.readAsArrayBuffer(file);

      // Simulate a successful upload after a short delay
      setTimeout(() => {
        setState((prev) => ({ ...prev, uploadStatus: "success" }));
      }, 1000);
    } else {
      setState({ ...state, fileName: null, uploadStatus: "idle" });
    }
  };

  // --- Drag and Drop Handlers ---

  const handleDragEnter = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setState((prev) => ({ ...prev, isDragging: true }));
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setState((prev) => ({ ...prev, isDragging: false }));
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();
      setState((prev) => ({ ...prev, isDragging: false }));

      if (e.dataTransfer.files && e.dataTransfer.files[0]) {
        handleFileChange(e.dataTransfer.files[0]);
      }
    },
    [handleFileChange]
  );

  // --- Button Handler ---

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };
  const handleButtonUpload = () => {
    fileInputRef.current?.focus();
  };

  // --- Rendering Helpers ---

  // Determines the styling for the file box based on state
  const getDropzoneClasses = () => {
    let classes =
      "p-12 md:p-16 border-2 rounded-xl transition-all duration-300 flex flex-col items-center justify-center space-y-4 cursor-pointer ";
    if (state.isDragging) {
      classes += "border-blue-500 bg-blue-50/50 scale-[1.02]";
    } else if (state.uploadStatus === "success") {
      classes += "border-green-500 bg-green-50";
    } else if (state.uploadStatus === "error") {
      classes += "border-red-500 bg-red-50";
    } else {
      classes +=
        "border-dashed border-gray-300 hover:border-blue-400 hover:bg-gray-50";
    }
    return classes;
  };

  const UploadIcon = () => (
    <svg
      className="w-16 h-16 text-blue-500"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
        d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
      ></path>
    </svg>
  );

  const SuccessIcon = () => (
    <svg
      className="w-16 h-16 text-green-600"
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
  );

  const ErrorIcon = () => (
    <svg
      className="w-16 h-16 text-red-600"
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
  );

  // Determine the display icon
  const DisplayIcon = () => {
    if (state.uploadStatus === "success") return <SuccessIcon />;
    if (state.uploadStatus === "error") return <ErrorIcon />;
    return <UploadIcon />;
  };

  return (
    <>
      <div className="bg-gray-50 flex items-center justify-center p-4 font-inter">
        <div
          className="bg-white rounded-xl shadow-2xl max-w-2xl w-full p-6 md:p-10"
          // Handle drag and drop events on the main container
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
        >
          <div
            className={getDropzoneClasses()}
            onClick={handleButtonClick} // Clicking anywhere in the dropzone triggers the file input
          >
            {/* Hidden file input */}
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              accept=".xlsx, .xls, .csv"
              onChange={(e) =>
                handleFileChange(e.target.files ? e.target.files[0] : null)
              }
            />

            <div className="p-3 bg-blue-100 rounded-full">
              <DisplayIcon />
            </div>

            <div className="text-center">
              <h1 className="text-2xl font-semibold text-gray-800">
                {state.isDragging ? "Drop file here!" : "Upload Excel/CSV File"}
              </h1>

              {state.fileName && state.uploadStatus === "idle" && (
                <p className="text-sm text-gray-500 mt-1">
                  Selected:{" "}
                  <span className="font-medium text-gray-700">
                    {state.fileName}
                  </span>
                </p>
              )}

              {state.uploadStatus === "success" && (
                <p className="text-sm text-green-600 font-semibold mt-1">
                  {state.fileName} successfully prepared for automation!
                </p>
              )}

              {state.uploadStatus === "error" && (
                <p className="text-sm text-red-600 font-semibold mt-1">
                  Invalid file type. Please use .xlsx, .xls, or .csv.
                </p>
              )}

              {!state.fileName && state.uploadStatus === "idle" && (
                <p className="text-sm text-gray-500 mt-1">
                  Drag and drop or click below.
                </p>
              )}

              <p className="text-sm text-gray-400 mt-4">
                Select an Excel file (.xlsx, .xls) or CSV to begin automation
              </p>
            </div>

            <button
              type="button"
              className="mt-4 px-6 py-3 bg-gray-800 text-white font-medium rounded-lg shadow-lg hover:bg-gray-900 transition duration-150 transform hover:scale-[1.05] focus:outline-none focus:ring-4 focus:ring-blue-500 focus:ring-opacity-50 flex items-center space-x-2"
              // onClick={handleButtonClick}
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                ></path>
              </svg>
              <span>Choose File</span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default ExcelUploadDashboard;
