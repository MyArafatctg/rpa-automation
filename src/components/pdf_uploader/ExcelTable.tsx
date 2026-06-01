import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import React from "react";
// Import necessary icons from react-icons
import {
  FiDownload,
  FiUpload,
  FiTable,
  FiCreditCard,
  FiCalendar,
} from "react-icons/fi";

// Define the data structure interface
export interface PDFData {
  pageNo: string;
  companyName: string;
  documentNo: string;
  documentDate: string;
  accountNo: string;
  bankNo: string;
  ourDocument: string;
  yourInvoiceNo: string;
  reference: string;
  cashDiscount: string;
  cashDiscountNum: string;
  whtamount: string;
  wHTAmountNum: string;
  grossAmount: string;
  grossAmountNum: number;
  file: string;
}

interface Props {
  data: PDFData[];
  onData: (data: PDFData[]) => void;
}

/**
 * A React component that displays PDF data in a table and provides an Excel export function.
 * @param {Props} props The component props containing the data array.
 */
const ExcelTable: React.FC<Props> = ({ data, onData }: Props) => {
  /**
   * Transforms the data array into a format suitable for Excel export and triggers the download.
   * @param {PDFData[]} exportData The data to be exported.
   */
  const exportToExcel = (exportData: PDFData[]) => {
    // Convert JSON data to a worksheet, mapping keys to desired column headers
    const worksheet = XLSX.utils.json_to_sheet(
      exportData.map((row) => ({
        "Page No": row.pageNo,
        "Company Name": row.companyName,
        "Document No": row.documentNo,
        "Document Date": row.documentDate,
        "Account No": row.accountNo,
        "Bank No": row.bankNo,
        "Our Document": row.ourDocument,
        "Your Invoice No": row.yourInvoiceNo,
        Reference: row.reference,
        "Cash Discount": row.cashDiscount,
        "Cash Discount Num": row.cashDiscountNum,
        "WHT Amount": row.whtamount,
        "WHT Amount Num": row.wHTAmountNum,
        "Gross Amount": row.grossAmount,
        "Gross Amount Num": row.grossAmountNum,
        File: row.file,
      }))
    );

    // Create a new workbook and add the worksheet
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Payment Advice");

    // Write the workbook to a binary array buffer
    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });

    // Create a Blob and trigger the download using file-saver
    const blob = new Blob([excelBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });

    saveAs(blob, "payment-advice.xlsx");
  };

  // Define headers for the table display (matches the excel output columns)
  const tableHeaders = [
    { key: "pageNo", label: "Page No" },
    { key: "companyName", label: "Company Name" },
    { key: "documentNo", label: "Doc No" },
    { key: "documentDate", label: "Doc Date" },
    { key: "accountNo", label: "Account No" },
    { key: "bankNo", label: "Bank No" },
    { key: "ourDocument", label: "Our Doc" },
    { key: "yourInvoiceNo", label: "Invoice No." },
    { key: "reference", label: "Ref" },
    { key: "cashDiscountNum", label: "Cash Disc" },
    { key: "wHTAmountNum", label: "WHT Amt" },
    { key: "grossAmountNum", label: "Gross Amt" },
    { key: "file", label: "File" },
  ];

  // Helper function to render table cells dynamically
  const renderCell = (row: PDFData, key: keyof PDFData) => {
    // Use the *Num fields for numerical display where appropriate,
    // or fall back to non-Num fields if needed by the data structure.
    let displayValue = row[key];

    // Simple formatting hint based on keys
    if (key.includes("Date")) {
      return (
        <span className="flex items-center text-sm text-gray-700">
          <FiCalendar className="mr-1 text-gray-800" /> {displayValue}
        </span>
      );
    }
    if (key.includes("AmountNum") || key.includes("cashDiscountNum")) {
      // Simple heuristic for styling numerical/monetary fields
      return (
        <span className="text-sm font-mono font-semibold text-green-700">
          {displayValue}
        </span>
      );
    }
    if (key.includes("accountNo") || key.includes("bankNo")) {
      return (
        <span className="text-sm font-mono text-gray-800">{displayValue}</span>
      );
    }

    return <span className="text-sm text-gray-800">{displayValue}</span>;
  };

  return (
    <div className="p-6 bg-white rounded-xl shadow-2xl">
      <div className="flex justify-between items-center mb-6 border-b pb-4">
        <h2 className="text-2xl font-extrabold text-gray-900 flex items-center">
          <FiTable className="mr-3 h-6 w-6 text-gray-800" />
          Payment Advice Data
        </h2>

        {/* --- Download Button --- */}
        <div className="flex gap-1">
          <button
            onClick={() => onData([])}
            className="cursor-pointer flex items-center px-5 py-2 bg-yellow-300 text-black font-semibold rounded-lg shadow-lg hover:bg-yellow-500 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <FiUpload className="mr-2 h-5 w-5" />
            Upload new
          </button>
          <button
            onClick={() => exportToExcel(data)}
            disabled={data.length === 0}
            className="cursor-pointer flex items-center px-5 py-2 bg-gray-700 text-white font-semibold rounded-lg shadow-lg hover:bg-gray-800 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <FiDownload className="mr-2 h-5 w-5" />
            Download Excel ({data.length})
          </button>
        </div>
      </div>

      {data.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          <FiCreditCard className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-lg font-medium">No Data Available</h3>
          <p className="mt-1 text-sm">
            Please upload a PDF to extract payment advice data.
          </p>
        </div>
      ) : (
        // --- Table Container ---
        <div className="overflow-x-auto rounded-xl border border-gray-200 shadow-xl max-h-[620px]">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-indigo-50 sticky top-0">
              <tr>
                {tableHeaders.map((header) => (
                  <th
                    key={header.key}
                    className="px-4 py-3 text-left text-xs font-bold text-gray-800 uppercase tracking-wider whitespace-nowrap"
                  >
                    {header.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {data.map((row, index) => (
                <tr
                  key={index}
                  className="hover:bg-indigo-50/50 transition-colors duration-150"
                >
                  {/* Map over the keys in the header definition to ensure order */}
                  {tableHeaders.map((header) => (
                    <td
                      key={header.key}
                      className="px-4 py-3 whitespace-nowrap"
                    >
                      {renderCell(row, header.key as keyof PDFData)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ExcelTable;
