import ExcelUploadDashboard from "../components/ExcelUploadDashboard";
import { useContext, useEffect, useState } from "react";
import { AppContext } from "../context/AppContext";
import axios from "axios";
import type { EInvoice } from "../components/e_invoiceing/InvoiceType";
import InvoiceDownload from "../components/e_invoiceing/Download/InvoiceDownload";
import axiosInstance from "../customHook/api/axiosInstance";

const EInvoiceDownload = () => {
  const [excelData, setExcelData] = useState<EInvoice[]>([]);
  const [fileName, setFileName] = useState<string>("");

  const [dbData, setDbData] = useState<EInvoice[]>([]);
  const [activeTab, setActiveTab] = useState("internal");
  const { BACKEND_URL } = useContext(AppContext);

  //   convertor

  useEffect(() => {
    const fetchData = async () => {
      const storedClientId = localStorage.getItem("clientId");
      const apiUrl = `${BACKEND_URL}/invoice/download?userId=${storedClientId}`;
      try {
        const response = await axiosInstance.get<any>(apiUrl);
        setDbData(response.data);
      } catch (error) {
        console.error("Error : ", error);
      }
    };

    fetchData();
  }, []);

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
                <InvoiceDownload data={dbData} fileName={"internalSource"} />
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
                    <InvoiceDownload data={excelData} fileName={fileName} />
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
export default EInvoiceDownload;
