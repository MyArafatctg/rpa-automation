import ExcelUploadDashboard from "../components/ExcelUploadDashboard";
import { useState } from "react";
import RexReport, { type RexData } from "../components/RexInssuance/RexReport";

export const RexIssuance = () => {
  const [excelData, setExcelData] = useState<RexData[]>([]);
  const [fileName, setFileName] = useState<string>("");

  return (
    <div>
      {/* <Breadcrumb data="Rex Issuance" /> */}
      {(excelData.length > 0 && (
        <>
          <button
            onClick={() => setExcelData([])}
            className="mb-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Upload New File
          </button>

          <div className="flex justify-center">
            <RexReport data={excelData} fileName={fileName} />
          </div>
        </>
      )) || (
        <ExcelUploadDashboard onData={setExcelData} setFileName={setFileName} />
      )}
    </div>
  );
};
