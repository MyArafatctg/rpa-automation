import ExcelUploadDashboard from "../components/ExcelUploadDashboard";
import { useContext, useEffect, useState } from "react";
import type { FcrData } from "../components/fcr_submission/FcrSubReport";
import FcrSubReport from "../components/fcr_submission/FcrSubReport";
import { AppContext } from "../context/AppContext";
import axios from "axios";
import axiosInstance from "../customHook/api/axiosInstance";

const FcrSubmission = () => {
  const [excelData, setExcelData] = useState<FcrData[]>([]);
  const [fileName, setFileName] = useState<string>("");

  const [dbData, setDbData] = useState<FcrData[]>([]);
  const [activeTab, setActiveTab] = useState("internal");
  const { BACKEND_URL } = useContext(AppContext);

  function convertToFcrData(rawData: any[]): FcrData[] {
    return rawData.map((item) => ({
      Shipper: item.shipper ?? "",
      Consignee: item.consignee ?? "",
      Booking_confirmation_number: item.bookingConfirmationNumber ?? "",
      Booking_Number: item.bookingNumber ?? "",
      Country: item.country ?? "",
      FCR_Template: item.fcrTemplate ?? "",
      Save_As: item.saveAs ?? "",
      Summary_field_description: item.summaryFileDescription ?? "",
      Status: (["Success", "Processing", "Fail", "Pending"].includes(
        item.status,
      )
        ? item.status
        : "Pending") as "Success" | "Processing" | "Fail" | "Pending",
      Err_Description: item.errDescription || null,
      Elapsed_Time: item.elapsedTime ? item.elapsedTime.toString() : null,
    }));
  }

  useEffect(() => {
    const fetchData = async () => {
      const storedClientId = localStorage.getItem("clientId");
      const apiUrl = `${BACKEND_URL}/fcr?userId=${storedClientId}`;
      try {
        const response = await axiosInstance.get<any>(apiUrl);
        setDbData(convertToFcrData(response.data));
      } catch (error) {
        console.error("Error updating status", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="items-center">
      {/* <Breadcrumb data="FCR Duplication" /> */}

      <div className="min-h-screen bg-gray-100 justify-center ">
        <div className="bg-white rounded-2xl shadow-lg p-6 w-full">
          {/* Tabs */}
          <div className="flex border-b border-gray-300 mb-6">
            <button
              className={`flex-1 py-2 text-lg font-medium ${
                activeTab === "internal"
                  ? "text-blue-600 border-b-2 border-blue-600"
                  : "text-gray-600 hover:text-blue-500"
              }`}
              onClick={() => setActiveTab("internal")}
            >
              Internal Source
            </button>
            <button
              className={`flex-1 py-2 text-lg font-medium ${
                activeTab === "external"
                  ? "text-blue-600 border-b-2 border-blue-600"
                  : "text-gray-600 hover:text-blue-500"
              }`}
              onClick={() => setActiveTab("external")}
            >
              External Source
            </button>
          </div>

          {/* Tab Content */}
          {activeTab === "internal" && (
            <div className="overflow-x-auto">
              <div className="flex justify-center">
                <FcrSubReport data={dbData} fileName={"internalSource"} />
              </div>
            </div>
          )}

          {activeTab === "external" && (
            <div className="overflow-x-auto">
              {(excelData.length > 0 && (
                <>
                  <button
                    onClick={() => setExcelData([])}
                    className="mb-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                  >
                    Upload New File
                  </button>

                  <div className="flex justify-center">
                    <FcrSubReport data={excelData} fileName={fileName} />
                  </div>
                </>
              )) || (
                <ExcelUploadDashboard
                  onData={setExcelData}
                  setFileName={setFileName}
                />
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FcrSubmission;
