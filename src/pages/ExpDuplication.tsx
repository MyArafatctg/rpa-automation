import ExcelUploadDashboard from "../components/ExcelUploadDashboard";
import { useContext, useEffect, useState } from "react";
import type { ReportRow } from "../components/exp_duplication/ReportTable";
import ReportTable from "../components/exp_duplication/ReportTable";
import { AppContext } from "../context/AppContext";
import axios from "axios";
import axiosInstance from "../customHook/api/axiosInstance";

const ExpDuplication = () => {
  const [excelData, setExcelData] = useState<ReportRow[]>([]);
  const [dbData, setDbData] = useState<ReportRow[]>([]);
  const [fileName, setFileName] = useState<string>("");
  const [activeTab, setActiveTab] = useState("internal");
  const { BACKEND_URL } = useContext(AppContext);

  function mapApiResponseToRexData(apiData: any[]): ReportRow[] {
    return apiData.map((data) => ({
      ADSCODE: data.adsCode,
      EXP_Serial: data.expSerial,
      EXP_Year: data.expYear,
      Invoice_Amount_Confirmed_by_Customs: data.invoiceAmount,
      Custom_Office: data.customOffice,
      Bill_of_Export_Number: data.billOfExportNumber,
      Bill_of_Export_Date: data.billOfExportDate,
      Shipment_Date: data.shipmentDate,
      Duplicate_Date: data.duplicateDate,
      Transport_Doc_Type: data.transportDocType,
      Transport_Doc_No: data.transportDocNo,
      Transport_Document_Date: data.transportDocDate,
      Invoice_No: data.invoiceNo,
      Invoice_Date: data.invoiceDate || "",
      DUP_FLAG: data.dupFlag || "",
      Status: ["Success", "Processing", "Error"].includes(data.status)
        ? data.status
        : "Pending",
      Err_Description: data.errDescription || null,
      Elapsed_Time: data.elapsedTime || null,
    }));
  }

  useEffect(() => {
    const fetchData = async () => {
      const storedClientId = localStorage.getItem("clientId");
      const apiUrl = `${BACKEND_URL}/expDup?userId=${storedClientId}`;
      try {
        const response = await axiosInstance.get<any>(apiUrl);
        setDbData(mapApiResponseToRexData(response.data));
      } catch (error) {
        console.error("Error updating status", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="items-center">
      {/* <Breadcrumb data="EXP Duplication" /> */}

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
                <ReportTable data={dbData} fileName={fileName} />
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
                    <ReportTable data={excelData} fileName={fileName} />
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

export default ExpDuplication;
