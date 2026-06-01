import { useContext, useEffect, useState } from "react";
import ExcelUploadDashboard from "../components/ExcelUploadDashboard";
import ExpDownloadReport, {
  type ExpReportRow,
} from "../components/exp_download/ExpDownloadReport";
import { AppContext } from "../context/AppContext";
import axios from "axios";
import axiosInstance from "../customHook/api/axiosInstance";

const ExpDownload = () => {
  const [excelData, setExcelData] = useState<ExpReportRow[]>([]);
  const [fileName, setFileName] = useState<string>("");

  const [dbData, setDbData] = useState<ExpReportRow[]>([]);
  const [activeTab, setActiveTab] = useState("internal");
  const { BACKEND_URL, clientId } = useContext(AppContext);

  function mapApiResponseToExpReport(apiData: any[]): ExpReportRow[] {
    return apiData.map((data) => ({
      ADSCODE: data.adscode || 0,
      EXP_Serial: data.expSerial || 0,
      EXP_Year: data.expYear || 0,
      Invoice_No: data.invoiceNo || 0,
      Status: [
        "Completed",
        "Processing",
        "Fail",
        "Pending",
        "Success",
      ].includes(data.status)
        ? data.status
        : "Pending",
      Err_Description: data.errDescription || null,
      Elapsed_Time: data.elapsedTime || null,
    }));
  }

  useEffect(() => {
    const fetchData = async () => {
      const storedClientId = localStorage.getItem("clientId");
      const apiUrl = `${BACKEND_URL}/expDownload?userId=${storedClientId}`;
      try {
        const response = await axiosInstance.get<any>(apiUrl);
        setDbData(mapApiResponseToExpReport(response.data));
      } catch (error) {
        console.error("Error updating status", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="items-center">
      {/* <Breadcrumb data="EXP Download" /> */}

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
                <ExpDownloadReport data={dbData} fileName={"internalSource"} />
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
                    <ExpDownloadReport data={excelData} fileName={fileName} />
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

export default ExpDownload;
