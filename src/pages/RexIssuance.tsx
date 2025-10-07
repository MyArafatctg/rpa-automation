import ExcelUploadDashboard from "../components/ExcelUploadDashboard";
import { useState } from "react";

export const RexIssuance = () => {
  const [excelData, setExcelData] = useState<any[]>([]);

  return (
    <div>
      {(excelData.length > 0 && (
        <button
          onClick={() => setExcelData([])}
          className="mb-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Upload New File
        </button>
      )) || <ExcelUploadDashboard onData={setExcelData} />}
      <div className="mt-8 p-4 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-4">Rex Issuance Data</h2>
        <pre className="bg-gray-100 p-4 rounded-lg overflow-x-auto">
          {JSON.stringify(excelData, null, 2)}
        </pre>
      </div>
    </div>
  );
};
