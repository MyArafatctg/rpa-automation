import { useState, useMemo, useEffect } from "react";

export interface SnapshotItem {
  lcSerial: string;
  company: string;
  supplier: string;
  item: string;
  itemGroup: string;
  lcAmount: string;
  currency: string;
  quantity: string;
  unit: string;
  localBank: string;
  buyer: string;
  insertedBy: string;
  insertedDate: string;
  status: string;
  delayed: string;
  age: number;
}

interface SnapshotTableProps {
  data: SnapshotItem[];
}

const SnapshotTable = ({ data }: SnapshotTableProps) => {
  const itemsPerPage = 15;
  const [currentPage, setCurrentPage] = useState(1);

  const totalElements = data.length;
  const totalPages = Math.ceil(totalElements / itemsPerPage);

  // Slice data for current page
  const currentData = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return data.slice(startIndex, startIndex + itemsPerPage);
  }, [data, currentPage]);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  useEffect(() => {
    setCurrentPage(1);
  }, [data]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "On Time":
        return (
          <span className="px-2 py-0.5 text-xs bg-green-100 text-green-800 font-semibold rounded-full">
            On Time
          </span>
        );
      case "Pending":
        return (
          <span className="px-2 py-0.5 text-xs bg-yellow-100 text-yellow-800 font-semibold rounded-full">
            Pending
          </span>
        );
      case "Delayed":
        return (
          <span className="px-2 py-0.5 text-xs bg-red-100 text-red-800 font-semibold rounded-full">
            Delayed
          </span>
        );
      default:
        return (
          <span className="px-2 py-0.5 text-xs bg-gray-100 text-gray-800 font-semibold rounded-full">
            {status}
          </span>
        );
    }
  };

  // =============== PAGINATION UI ===============
  const renderPagination = () => {
    const maxPagesToShow = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
    let endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);

    if (endPage - startPage + 1 < maxPagesToShow) {
      startPage = Math.max(1, endPage - maxPagesToShow + 1);
    }

    const pageNumbers = Array.from(
      { length: endPage - startPage + 1 },
      (_, i) => startPage + i,
    );

    return (
      <div className="flex items-center justify-between mt-4 flex-wrap gap-4">
        <div className="text-sm font-medium text-gray-600">
          Showing{" "}
          {totalElements === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1} to{" "}
          {Math.min(currentPage * itemsPerPage, totalElements)} of{" "}
          {totalElements} entries
        </div>

        <div className="flex space-x-1">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-3 py-1.5 text-sm font-medium rounded-lg text-gray-600 bg-gray-100 
            hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Previous
          </button>

          {pageNumbers.map((page) => (
            <button
              key={page}
              onClick={() => handlePageChange(page)}
              className={`cursor-pointer px-3 py-1.5 text-sm font-medium rounded-lg transition-colors 
              ${
                page === currentPage
                  ? "bg-[#016B61] text-white shadow-md shadow-teal-500/30"
                  : "bg-gray-100 text-gray-700 hover:bg-teal-100"
              }`}
            >
              {page}
            </button>
          ))}

          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages || totalPages === 0}
            className="cursor-pointer px-3 py-1.5 text-sm font-medium rounded-lg text-gray-600 bg-gray-100 
            hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Next
          </button>
        </div>
      </div>
    );
  };

  // =============== MAIN RENDER ===============

  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden">
      {/* Scrollable Table with Sticky Header */}
      <div className="max-h-96 overflow-y-auto">
        <table className="min-w-full text-sm divide-y divide-gray-200">
          <thead className="bg-gray-50 sticky top-0 z-10 shadow">
            <tr>
              <th className="px-3 py-2 text-left font-medium text-gray-600 uppercase tracking-wider">
                LC No
              </th>
              <th className="px-3 py-2 text-left font-medium text-gray-600 uppercase tracking-wider">
                Supplier
              </th>
              <th className="px-3 py-2 text-left font-medium text-gray-600 uppercase tracking-wider">
                Category
              </th>
              <th className="px-3 py-2 text-left font-medium text-gray-600 uppercase tracking-wider">
                Age
              </th>
              <th className="px-3 py-2 text-left font-medium text-gray-600 uppercase tracking-wider">
                Inserted By
              </th>
              <th className="px-3 py-2 text-left font-medium text-gray-600 uppercase tracking-wider">
                Status
              </th>
            </tr>
          </thead>

          <tbody className="bg-white divide-y divide-gray-200">
            {currentData.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-3 py-4 text-center text-gray-500">
                  No pending LCs for this stage.
                </td>
              </tr>
            ) : (
              currentData.map((item, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-3 py-2">{item.lcSerial}</td>
                  <td className="px-3 py-2">{item.supplier}</td>
                  <td className="px-3 py-2">{item.itemGroup}</td>
                  <td className="px-3 py-2">{item.age} Days</td>
                  <td className="px-3 py-2">{item.insertedBy}</td>
                  <td className="px-3 py-2">{getStatusBadge(item.delayed)}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="p-3 bg-gray-50 border-t border-gray-200">
        {renderPagination()}
      </div>
    </div>
  );
};

export default SnapshotTable;
