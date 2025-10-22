import ExcelUploadDashboard from "../components/ExcelUploadDashboard";
import { useState } from "react";
import RpaActivities from "../components/RpaActivities";
import type { ReportRow } from "../components/ReportTable";
import ReportTable from "../components/ReportTable";

// const mockReportData: ReportRow[] = [
//   {
//     id: 1,
//     status: "Completed",
//     name: "Record 1",
//     email: "user1@example.com",
//     company: "Company A",
//     time: "3.33s",
//   },
//   {
//     id: 2,
//     status: "Processing",
//     name: "Record 2",
//     email: "user2@example.com",
//     company: "Company B",
//     time: "2.45s",
//   },
//   {
//     id: 3,
//     status: "Completed",
//     name: "Record 3",
//     email: "user3@example.com",
//     company: "Company C",
//     time: "3.71s",
//   },
//   {
//     id: 4,
//     status: "Completed",
//     name: "Record 4",
//     email: "user4@example.com",
//     company: "Company D",
//     time: "2.55s",
//   },
//   {
//     id: 5,
//     status: "Error",
//     name: "Record 5",
//     email: "user5@example.com",
//     company: "Company E",
//     time: "1.98s",
//   },
// ];

export const RexIssuance = () => {
  const [excelData, setExcelData] = useState<ReportRow[]>([]);

  return (
    <div>
      {(excelData.length > 0 && (
        <>
          <button
            onClick={() => setExcelData([])}
            className="mb-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Upload New File
          </button>

          <div className="inline-flex flex-items-center gap-6 w-full">
            <div className="w-1/2">
              <ReportTable data={excelData} />
            </div>
            <div className="w-1/2">{/* <RpaActivities /> */}</div>
          </div>
        </>
      )) || <ExcelUploadDashboard onData={setExcelData} />}
    </div>
  );
};
