import ExcelUploadDashboard from "../components/ExcelUploadDashboard";
import { useContext, useEffect, useState } from "react";
import type {
  EDocData,
  EdocInsertPayload,
} from "../components/edoc_upload/types";
import EDocReport from "../components/edoc_upload/EDocReport";
import { AppContext } from "../context/AppContext";
import axios from "axios";
import axiosInstance from "../customHook/api/axiosInstance";

const EDocUploadHandM = () => {
  const [excelData, setExcelData] = useState<EDocData[]>([]);
  const [fileName, setFileName] = useState<string>("");

  const [dbData, setDbData] = useState<EDocData[]>([]);
  const [activeTab, setActiveTab] = useState("external");
  const { BACKEND_URL, clientId } = useContext(AppContext);

  //   convertor

  function convertToEDocData(rawData: any[]): EDocData[] {
    return rawData.map((item) => ({
      Shipper: item.shipper ?? "",
      Consignee: item.consignee ?? "",
      Booking_confirmation_number: item.bookingConfirmationNumber ?? "",
      Booking_Number: "",
      File_Path: item.filePath ?? "",
      File_Name: item.fileName ?? "",
      Upload_Type: item.uploadType ?? "",
      Save_As: "",
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
      const apiUrl = `${BACKEND_URL}/edoc?userId=${storedClientId}`;
      try {
        const response = await axiosInstance.get<any>(apiUrl);
        const convertedData = convertToEDocData(response.data);
        setDbData(convertedData);
      } catch (error) {
        console.error("Error updating status", error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const saveData = async () => {
      try {
        const convertedData = convertToPayload(excelData);
        saveEdocUpload(convertedData);
      } catch (error) {
        console.error("Error updating status", error);
      }
    };

    saveData();
  }, [excelData]);

  // insert edoc upload data to db

  function convertToPayload(rawData: EDocData[]): EdocInsertPayload[] {
    return rawData.map((item) => ({
      shipper: item.Shipper ?? "",
      consignee: item.Consignee ?? "",
      bookingConfirmationNumber: item.Booking_confirmation_number ?? "",
      filePath: item.File_Path ?? "",
      fileName: item.File_Name ?? "",
      uploadType: item.Upload_Type ?? "",
      status: item.Status ?? "",
      errDescription: item.Err_Description || "",
      elapsedTime: item.Elapsed_Time || "",
      insertedBy: clientId,
      updatedBy: "",
    }));
  }

  const saveEdocUpload = async (
    payload: EdocInsertPayload[],
  ): Promise<void> => {
    const API_URL = `${BACKEND_URL}/edoc`;
    try {
      const response = await axiosInstance.post(API_URL, payload);
      console.log(response.data);
    } catch (error: any) {
      console.error("API error:", error);
      throw error;
    }
  };

  return (
    <div className="items-center">
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
                <EDocReport data={dbData} fileName={"internalSource"} />
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
                    <EDocReport data={excelData} fileName={fileName} />
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

      {/* <Breadcrumb data="E-Doc Upload" /> */}
    </div>
  );
};

export default EDocUploadHandM;
