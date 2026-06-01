import { useState, useMemo } from "react";
import { Search } from "lucide-react"; // Using lucide-react for the search icon
import type { LcApiRecord } from "../lc_tracking/LcTrackingV2";

// --- Interfaces (Kept as provided) ---

export interface DepartmentCompletion {
  audit: number;
  pc: number;
  bod: number;
}

interface ModalTableProps {
  data: LcApiRecord[];
  stage?: string;
}

// --- Component Implementation ---

function ModalTable({ data, stage }: ModalTableProps) {
  const [searchTerm, setSearchTerm] = useState("");

  // Function to render the status badge with beautiful Tailwind styling
  const getStatusBadge = (status: LcApiRecord["status"]) => {
    let classes =
      "inline-block px-3 py-1 text-xs font-medium rounded-full transition duration-150 ease-in-out";
    let text = status;

    switch (status) {
      case "Complete":
        classes += " bg-green-100 text-green-700 ring-1 ring-green-200";
        break;
      case "Pending":
        classes += " bg-yellow-100 text-yellow-700 ring-1 ring-yellow-200";
        break;
      case "Delayed":
        classes += " bg-red-100 text-red-700 ring-1 ring-red-200";
        break;
      default:
        classes += " bg-gray-100 text-gray-700 ring-1 ring-gray-200";
        break;
    }

    return <span className={classes}>{text}</span>;
  };

  // Use useMemo to filter data only when 'data' or 'searchTerm' changes
  const filteredData = useMemo(() => {
    if (!searchTerm) {
      return data;
    }

    const lowerCaseSearch = searchTerm.toLowerCase();

    return data.filter(
      (item) =>
        item.lcSerial.toLowerCase().includes(lowerCaseSearch) ||
        item.company.toLowerCase().includes(lowerCaseSearch) ||
        item.supplier.toLowerCase().includes(lowerCaseSearch) ||
        item.status.toLowerCase().includes(lowerCaseSearch),
    );
  }, [data, searchTerm]);

  return (
    <div className="p-4 bg-white rounded-xl shadow-lg border border-gray-100">
      {/* Search Input Section */}
      <div className="mb-4 flex items-center p-2 border border-gray-200 rounded-lg focus-within:ring-2 focus-within:ring-indigo-500 transition duration-150 ease-in-out">
        <Search className="h-5 w-5 text-gray-400 mr-2" />
        <input
          type="text"
          placeholder="Search by LC No, Company, or Supplier..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full text-sm text-gray-700 placeholder-gray-400 focus:outline-none bg-transparent"
        />
      </div>

      <div className="max-h-[70vh] overflow-y-auto">
        <table className="min-w-full text-sm divide-y divide-gray-200">
          <thead className="bg-indigo-50 sticky top-0 z-10 shadow-sm">
            <tr>
              <th className="px-4 py-3 text-left font-semibold text-teal-900 uppercase tracking-wider">
                LC SERIAL
              </th>
              <th className="px-4 py-3 text-left font-semibold text-teal-900 uppercase tracking-wider">
                COMPANY
              </th>
              <th className="px-4 py-3 text-left font-semibold text-teal-900 uppercase tracking-wider">
                BANK
              </th>
              <th className="px-4 py-3 text-left font-semibold text-teal-900 uppercase tracking-wider">
                Inserted Date
              </th>
              {stage === "PC" && (
                <th className="px-4 py-3 text-left font-semibold text-teal-900 uppercase tracking-wider">
                  PC received Date
                </th>
              )}
              <th className="px-4 py-3 text-left font-semibold text-teal-900 uppercase tracking-wider">
                SUPPLIER
              </th>
              {/* <th className="px-4 py-3 text-left font-semibold text-teal-900 uppercase tracking-wider">
                ITEM NAME
              </th> */}
              <th className="px-4 py-3 text-left font-semibold text-teal-900 uppercase tracking-wider">
                ITEM Group
              </th>
              {/* <th className="px-4 py-3 text-left font-semibold text-teal-900 uppercase tracking-wider">
                LC QTY
              </th>
              <th className="px-4 py-3 text-left font-semibold text-teal-900 uppercase tracking-wider">
                Unit
              </th> */}
              <th className="px-4 py-3 text-left font-semibold text-teal-900 uppercase tracking-wider">
                LC AMOUNT
              </th>
              <th className="px-4 py-3 text-left font-semibold text-teal-900 uppercase tracking-wider">
                STATUS
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-100">
            {filteredData.length > 0 ? (
              filteredData.map((item, index) => (
                <tr
                  key={index}
                  className="hover:bg-gray-50 transition duration-100 ease-in-out"
                >
                  <td className="px-4 py-3 font-medium text-gray-900">
                    {item.lcSerial}
                  </td>
                  <td className="px-4 py-3 text-gray-800">{item.company}</td>
                  <td className="px-4 py-3 text-gray-800">{item.localBank}</td>
                  <td className="px-4 py-3 text-gray-800">
                    {item.insertedDate}
                  </td>
                  {stage === "PC" && (
                    <td className="px-4 py-3 text-gray-800">
                      {item.pcReceiveDate}
                    </td>
                  )}
                  <td className="px-4 py-3 font-mono text-gray-600">
                    {item.supplier}
                  </td>
                  {/* <td className="px-4 py-3 text-gray-800">{item.item}</td> */}
                  <td className="px-4 py-3 text-gray-800">{item.itemGroup}</td>
                  {/* <td className="px-4 py-3 text-gray-800">
                     {item.quantity}
                  </td>
                  <td className="px-4 py-3 text-gray-800">{item.unit}</td> */}
                  <td className="px-4 py-3 text-gray-800">
                    {item.currency} {item.lcAmount}
                  </td>
                  <td className="px-4 py-3">{getStatusBadge(item.status)}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={6}
                  className="px-4 py-8 text-center text-gray-500 italic"
                >
                  No Letter of Credit data found matching "{searchTerm}".
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default ModalTable;
