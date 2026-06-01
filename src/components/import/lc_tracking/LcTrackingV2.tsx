import React, {
  useState,
  useEffect,
  useCallback,
  useMemo,
  useContext,
} from "react";
import {
  Download,
  Funnel,
  Check,
  List,
  ChevronUp,
  ChevronDown,
  ArrowUpDown,
} from "lucide-react";
import axios from "axios";
import { AppContext } from "../../../context/AppContext";
import LovSelect, { type LovOption } from "../../util/LovSelect";
import DateRangePicker, { type DateRange } from "../../util/DateRangePicker";
import TableSkeleton from "../../util/TableSkeleton";
import axiosInstance from "../../../customHook/api/axiosInstance";
import StageBadge from "./StageBadge";

// --- Data Models & Constants ---

export interface LcApiRecord {
  currency: string;
  item: string;
  itemGroup: string;
  supplier: string;
  status: "Pending" | "Complete" | "Delayed"; // Restrict to known status
  unit: string;
  buyer: string | null;
  quantity: number;
  lcSerial: string;
  lcAmount: number;
  localBank: string;
  insertedBy: string;
  insertedDate: string;
  company: string;
  delayed: "On Time" | "Delayed";
  currentStage: string;
  progressIndex: number;
  pcReceiveDate?: string; // New field for PC Received Date
}

interface LcResponse {
  content: LcApiRecord[];
  pageable: {
    pageNumber: number;
    pageSize: number;
  };
  totalPages: number;
  totalElements: number;
  size: number;
  number: number;
}

// API response for a single LC timeline
interface SingleLcTimelineEvent {
  event: string; // The event key (e.g., "CREATED", "PROCESS_CONTROL_APPROVE")
  status: string; // Status (e.g., "DONE")
  eventTime: string; // The date/time string (e.g., "03-NOV-2025 12:11 AM")
  eventBy: string; // The user name/by (mapped to eventBy in the sample)
  note: string | null; // Any additional notes
  isDeleted: "Y" | "N";
}

interface LcTimelineResponse {
  lcTimelineEvent: SingleLcTimelineEvent[];
  lcCompletionTime: number;
}

// Timeline Steps (Display Names)
const timelineSteps = [
  "Created",
  // "To Audit",
  "Audit Received",
  "Audit Returned",
  "Audit Approved",
  "PC Received",
  "PC Returned",
  "PC Approved",
  "GM/ED Received",
  "GM/ED Approved",
  "BOD Received",
  "BOD Approved",
];

// Mapping: Display Step Name -> API Event Key
const stepToEventMap: { [key: string]: string } = {
  Created: "CREATED",
  "To Audit": "TRANS_TO_AUDIT",
  "Audit Received": "AUDIT_REV",
  "Audit Returned": "AUDIT_RETURN",
  "Audit Approved": "AUDIT_APPROVE",
  "PC Received": "PROCESS_CONT_REV",
  "PC Returned": "PC_RETURN",
  "PC Approved": "PROCESS_CONTROL_APPROVE",
  "GM/ED Received": "COMMERCIAL_REVIEW",
  "GM/ED Approved": "GM_ED_APPROVE",
  "BOD Received": "TRANS_TO_BOD",
  "BOD Approved": "BOD_APPROVE",
};

// --- Utility Functions ---

/**
 * Parses and formats the API date string 'DD-MMM-YYYY HH:mm A'
 */
const formatApiDate = (dateString: string): string => {
  try {
    // Attempt to parse standard date format
    const cleanDateStr = dateString.replace(
      /(\w{3})-(\w{3})-(\w{4}) (\d{2}:\d{2} \w{2})/,
      "$2 $1, $3 $4",
    );
    const date = new Date(cleanDateStr);

    if (isNaN(date.getTime())) {
      return dateString; // Return original string if parsing fails
    }

    // Format to local string
    return date.toLocaleString("en-US", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  } catch (error) {
    return dateString;
  }
};

// --- Helper Components ---

const StatusBadge: React.FC<{ status: LcApiRecord["status"] }> = ({
  status,
}) => {
  let colorClasses = "";
  switch (status) {
    case "Complete":
      colorClasses = "bg-green-100 text-green-700";
      break;
    case "Pending":
      colorClasses = "bg-yellow-100 text-yellow-700";
      break;
    case "Delayed":
      colorClasses = "bg-red-100 text-red-700";
      break;
    default:
      colorClasses = "bg-gray-100 text-gray-700";
  }
  return (
    <span
      className={`px-2.5 py-0.5 text-xs font-semibold rounded-full ${colorClasses}`}
    >
      {status}
    </span>
  );
};

const HorizontalTimeline: React.FC<{
  progressIndex: number;
  timelineDetails: LcTimelineResponse | null;
  loading: boolean;
  isDeleted?: boolean;
}> = ({ progressIndex, timelineDetails, loading, isDeleted }) => {
  const eventDateMap = useMemo(() => {
    if (!timelineDetails) return {};
    return timelineDetails.lcTimelineEvent.reduce(
      (acc, event) => {
        acc[event.event] = event.eventTime;
        return acc;
      },
      {} as { [key: string]: string },
    );
  }, [timelineDetails]);

  const eventMetaMap = useMemo(() => {
    if (!timelineDetails) return {};
    return timelineDetails.lcTimelineEvent.reduce(
      (acc, event) => {
        acc[event.event] = {
          time: event.eventTime,
          by: event.eventBy,
          status: event.status,
          note: event.note,
          isDeleted: event.isDeleted,
        };
        return acc;
      },
      {} as {
        [key: string]: {
          time: string | null;
          by: string | null;
          status: string;
          note: string | null;
          isDeleted: "Y" | "N";
        };
      },
    );
  }, [timelineDetails]);

  const hiddenStepsWhenPending = ["Audit Returned", "PC Returned"];

  const visibleSteps = timelineSteps.filter((step, idx) => {
    const eventKey = stepToEventMap[step];
    const apiDate = eventDateMap[eventKey];

    const dateString = apiDate ? "DONE" : "Pending";
    return !(hiddenStepsWhenPending.includes(step) && dateString === "Pending");
  });

  if (loading) {
    return (
      <div className="p-4 text-center text-sm text-teal-600">
        <span className="animate-pulse">Loading timeline details...</span>
      </div>
    );
  }

  if (
    !timelineDetails?.lcTimelineEvent ||
    timelineDetails.lcTimelineEvent.length === 0
  ) {
    return (
      <div className="p-4 text-center text-sm text-gray-500">
        No timeline data found for this LC.
      </div>
    );
  }

  const formatWorkTimeShort = (totalHours: number): string => {
    const hoursPerDay = 9;

    const totalMinutes = Math.round(totalHours * 60);

    const totalDays = Math.floor(totalMinutes / (hoursPerDay * 60));
    const remainingMinutesAfterDays = totalMinutes % (hoursPerDay * 60);

    const hours = Math.floor(remainingMinutesAfterDays / 60);
    const minutes = remainingMinutesAfterDays % 60;

    return `${totalDays}D-${hours}H-${minutes}M`;
  };

  const lcCompletionTime = formatWorkTimeShort(
    timelineDetails.lcCompletionTime,
  );

  return (
    <div className="p-4 bg-gray-50 border-t border-gray-200 rounded-b-lg overflow-x-auto">
      <div className="flex justify-center mb-6">
        <div
          className={`px-4 py-1 ${isDeleted ? "text-red-800 border border-red-200 bg-red-100" : "text-teal-800 border border-teal-200 bg-teal-100"}  rounded-full text-sm font-bold tracking-wide shadow-sm`}
        >
          {lcCompletionTime}
        </div>
      </div>
      <div className="flex items-start justify-between min-w-max">
        {visibleSteps.map((step, visibleIndex) => {
          const isFirst = visibleIndex === 0;
          const done = visibleIndex <= progressIndex;

          const eventKey = stepToEventMap[step];
          const meta = eventMetaMap[eventKey];

          const dateString = meta?.time
            ? formatApiDate(meta.time)
            : visibleIndex === progressIndex + 1
              ? "Current Step"
              : "Pending";

          return (
            <React.Fragment key={step}>
              {/* Connector Line */}
              {!isFirst && (
                <div className="flex-1 h-0.5 bg-gray-300 relative top-4 -mx-11">
                  {meta?.status === "DONE" && (
                    <div className="absolute top-0 left-0 w-full h-full bg-teal-600" />
                  )}
                </div>
              )}

              {/* Timeline Item */}
              <div className="flex flex-col items-center text-center w-[120px] shrink-0">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center relative z-10 transition-colors duration-300 cursor-pointer
                    ${
                      meta?.status === "DONE"
                        ? meta.isDeleted === "Y"
                          ? "bg-red-600 text-white shadow-md shadow-teal-500/50"
                          : "bg-teal-600 text-white shadow-md shadow-teal-500/50"
                        : visibleIndex === progressIndex + 1
                          ? "bg-blue-200 text-blue-800 border border-blue-400"
                          : "bg-gray-200 text-gray-600"
                    }
                  `}
                  title={
                    step === "Created"
                      ? "Commercial Delay"
                      : step === "Audit Received"
                        ? "Audit Delay"
                        : step === "PC Received"
                          ? "Process Control Delay"
                          : step === "GM/ED Received"
                            ? "GM/ED Delay"
                            : meta?.note || ""
                  }
                >
                  {done ? <Check className="w-4 h-4" /> : visibleIndex + 1}
                </div>

                <div className="mt-2 text-xs font-medium text-gray-700">
                  {step}{" "}
                  {meta?.note && (
                    <span title={meta.note} className="cursor-pointer">
                      ℹ️
                    </span>
                  )}
                </div>

                <div
                  className={`text-[10px] ${
                    dateString === "Current Step"
                      ? "text-blue-500 font-bold"
                      : "text-gray-500"
                  }`}
                >
                  {dateString}
                </div>

                {meta?.by && (
                  <div className="text-[10px] text-gray-400 mt-0.5">
                    By{" "}
                    <span className="font-semibold text-gray-600">
                      {meta.by}
                    </span>
                  </div>
                )}
              </div>
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};

// --- Main App Component ---
const LcTrackingV2: React.FC = () => {
  // State
  const [data, setData] = useState<LcApiRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showFilter, setShowFilter] = useState(false);
  const [inlineOpenLc, setInlineOpenLc] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  // Timeline State (New)
  const [timelineDetail, setTimelineDetail] =
    useState<LcTimelineResponse | null>(null);
  const [timelineLoading, setTimelineLoading] = useState(false);

  // Pagination & API Response State
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalElements, setTotalElements] = useState(0);
  const itemsPerPage = 10;

  //Supplier LOV Context
  const [options, setOptions] = useState<LovOption[]>([]);
  const [value, setValue] = useState<LovOption | null>(null);
  const [supplierLovLoading, setSupplierLovLoading] = useState(false);
  const [supplierSearch, setSupplierSearch] = useState("");

  //Bank LOV Context
  const [bankValue, setBankValue] = useState<LovOption | null>(null);
  const [companyValue, setCompanyValue] = useState<LovOption | null>(null);
  const [amountValue, setAmountValue] = useState<LovOption | null>(null);

  //Item LOV Context
  const [itemValue, setItemValue] = useState<LovOption | null>(null);
  const [itemOptions, setItemOptions] = useState<LovOption[]>([]);
  const [itemLovLoading, setItemLovLoading] = useState(false);
  const [itemSearch, setItemSearch] = useState("");

  const { BACKEND_URL } = useContext(AppContext);

  // Date Filter

  const getInitialDates = (): DateRange => {
    const today = new Date();
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(today.getDate() - 30);

    const formatDate = (date: Date) => date.toISOString().split("T")[0];

    return {
      from: formatDate(sevenDaysAgo),
      to: formatDate(today),
    };
  };

  const [dateRanges, setDateRanges] = useState<DateRange>(getInitialDates());

  const handleFilter = (range: DateRange) => {
    setDateRanges(range);
    setCurrentPage(1); // Reset to first page on date filter change
  };

  // Sorting
  const [sortConfig, setSortConfig] = useState<{
    key: string;
    direction: "asc" | "desc" | null;
  }>({ key: "LC_SERIAL", direction: "desc" }); // Default sorting

  // Function to call the API for the list view
  const getLcDetails = async (params: any) => {
    try {
      const response = await axiosInstance.get<LcResponse>(
        `${BACKEND_URL}/lc/detail`,
        {
          params,
        },
      );
      console.log("params : ", params);
      return response.data;
    } catch (error) {
      console.error("API Fetch Error:", error);
      throw new Error("Failed to fetch LC list data.");
    }
  };

  // Supplier LOV Fetch
  useEffect(() => {
    if (!supplierSearch || supplierSearch.length < 2) return;

    setSupplierLovLoading(true);

    const fetchData = async () => {
      const apiUrl = `${BACKEND_URL}/lc/supplierLov?search=${supplierSearch}`;
      try {
        const response = await axiosInstance.get<any>(apiUrl);
        setOptions(response.data);
      } catch (error) {
        console.error("Error updating status", error);
      } finally {
        setSupplierLovLoading(false);
      }
    };

    fetchData();
  }, [supplierSearch]);

  // Item LOV Fetch
  useEffect(() => {
    if (!itemSearch || itemSearch.length < 2) return;

    setItemLovLoading(true);

    const fetchData = async () => {
      const apiUrl = `${BACKEND_URL}/lc/itemLov?search=${itemSearch}`;
      try {
        const response = await axiosInstance.get<any>(apiUrl);
        setItemOptions(response.data);
      } catch (error) {
        console.error("Error updating status", error);
      } finally {
        setItemLovLoading(false);
      }
    };

    fetchData();
  }, [itemSearch]);

  // Function to call the API for a single LC timeline (New)
  const getLcTimeline = async (
    lcSerial: string,
  ): Promise<LcTimelineResponse | null> => {
    try {
      const response = await axiosInstance.get<LcTimelineResponse>(
        `${BACKEND_URL}/lc/timeline/${lcSerial}`,
      );
      return response.data;
    } catch (error) {
      console.error(`API Fetch Error for LC ${lcSerial} timeline:`, error);
      return null;
    }
  };

  // Filter State (Maps to API params)
  const [filters, setFilters] = useState({
    company: "All",
    supplier: "All",
    localbank: "All",
    item: "All",
    amount: "All",
  });

  // Function to determine min/max amount for API
  const getAmountRange = (
    amountFilter: string,
  ): { minAmount?: number; maxAmount?: number } => {
    switch (amountFilter) {
      case "0–50K":
        return { minAmount: 0, maxAmount: 50000 };
      case "50K–150K":
        return { minAmount: 50001, maxAmount: 150000 };
      case "150K–300K":
        return { minAmount: 150001, maxAmount: 300000 };
      case "300K+":
        return { minAmount: 300001 };
      default:
        return {};
    }
  };

  // --- Data Fetching Logic (List View) ---
  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    setInlineOpenLc(null);

    const amountRange = getAmountRange(filters.amount);

    const params = {
      ...amountRange,
      search: searchTerm ?? null,
      company: filters.company !== "All" ? filters.company : undefined,
      supplier: filters.supplier !== "All" ? filters.supplier : undefined,
      localBank: filters.localbank !== "All" ? filters.localbank : undefined,
      item: filters.item !== "All" ? filters.item : undefined,
      page: currentPage - 1,
      size: itemsPerPage,
      from: dateRanges.from,
      to: dateRanges.to,
      sortBy: sortConfig.key,
      sortDir: sortConfig.direction,
    };

    try {
      const response = await getLcDetails(params);
      console.log("API Response:", response);
      setData(response.content);
      setTotalPages(response.totalPages);
      setTotalElements(response.totalElements);
    } catch (err) {
      setError("Failed to fetch LC details.");
      setData([]);
      setTotalPages(1);
      setTotalElements(0);
    } finally {
      setLoading(false);
    }
  }, [filters, currentPage, searchTerm, BACKEND_URL, dateRanges, sortConfig]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // --- Handlers ---

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // Handler for Inline Timeline (Row Expansion)
  const toggleInlineTimeline = async (lcNo: string) => {
    const isOpening = inlineOpenLc !== lcNo;
    setInlineOpenLc(isOpening ? lcNo : null);

    if (isOpening) {
      setTimelineLoading(true);
      setTimelineDetail(null); // Clear previous data
      const data = await getLcTimeline(lcNo);
      setTimelineDetail(data);
      setTimelineLoading(false);
    }
  };

  // export csv
  const fetchCSVData = async () => {
    const amountRange = getAmountRange(filters.amount);

    const params = {
      ...amountRange,
      search: searchTerm ?? null,
      company: filters.company !== "All" ? filters.company : undefined,
      supplier: filters.supplier !== "All" ? filters.supplier : undefined,
      localbank: filters.localbank !== "All" ? filters.localbank : undefined,
      item: filters.item !== "All" ? filters.item : undefined,
      page: 0,
      size: 100000,
      from: dateRanges.from,
      to: dateRanges.to,
    };

    try {
      const response = await getLcDetails(params);
      return response.content; // return array
    } catch (err) {
      setError("Failed to fetch LC details.");
      return []; // always return array to avoid breaking map()
    }
  };

  // ✅ Make this async
  const exportToCSV = useCallback(async () => {
    const csvData = await fetchCSVData(); // ⬅️ wait for full export data

    if (!csvData || csvData.length === 0) {
      alert("No data available to export.");
      return;
    }

    const headers = [
      "LC SERIAL",
      "COMPANY",
      "BANK",
      "INSERTED DATE",
      "SUPPLIER",
      "ITEM NAME",
      "LC QTY",
      "Unit",
      "LC AMOUNT",
      "Currency",
      "STATUS",
    ];

    const csvRows = csvData.map((record) =>
      [
        record.lcSerial,
        record.company,
        record.localBank,
        record.insertedDate,
        record.supplier,
        record.item,
        record.quantity,
        record.unit,
        record.lcAmount,
        record.currency,
        record.status,
      ]
        .map((field) => `"${String(field).replace(/"/g, '""')}"`)
        .join(","),
    );

    const csvContent = [headers.join(","), ...csvRows].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "lc_list.csv";
    link.click();
  }, [filters, searchTerm]);

  // Unique values for filter dropdowns (Mocked)
  const uniqueOptions = useMemo(
    () => ({
      companies: ["All", "ASKML", "AFWL", "ALL", "ATPML"],
      suppliers: ["All"],
      items: ["All"],
      banks: ["All", "EBL", "BRAC", "HSBC", "DBL", "CITY"],
    }),
    [],
  );

  const bankLovOptions: LovOption[] = useMemo(
    () =>
      uniqueOptions.banks
        .filter((b) => b !== "All")
        .map((b) => ({
          value: b,
          label: b,
        })),
    [uniqueOptions.banks],
  );

  const companyOptions: LovOption[] = useMemo(
    () =>
      uniqueOptions.companies
        .filter((c) => c !== "All")
        .map((c) => ({ value: c, label: c })),
    [uniqueOptions.companies],
  );

  const amountOptions: LovOption[] = [
    { value: "0–50K", label: "0–50K" },
    { value: "50K–150K", label: "50K–150K" },
    { value: "150K–300K", label: "150K–300K" },
    { value: "300K+", label: "300K+" },
  ];

  // --- Render Functions ---
  const renderSortIcon = (key: string) => {
    if (sortConfig.key !== key)
      return <ArrowUpDown className="w-3 h-3 ml-1 opacity-50" />;
    if (sortConfig.direction === "asc")
      return <ChevronUp className="w-4 h-4 ml-1 text-teal-600" />;
    if (sortConfig.direction === "desc")
      return <ChevronDown className="w-4 h-4 ml-1 text-teal-600" />;
    return <ArrowUpDown className="w-3 h-3 ml-1 opacity-50" />;
  };

  const handleSort = (key: string) => {
    let direction: "asc" | "desc" | null = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    } else if (sortConfig.key === key && sortConfig.direction === "desc") {
      direction = null; // Optional: Reset to no sort
    }
    setSortConfig({ key, direction });
    setLoading(true);
    setCurrentPage(1); // Always reset to page 1 when sorting changes
  };

  const renderTableHead = () => (
    <thead className="sticky top-0 z-10">
      <tr className="bg-gray-100">
        <th className="p-3 text-sm font-semibold text-gray-600 border-b-2 border-gray-300 text-left">
          LC SERIAL
        </th>
        <th className="p-3 text-sm font-semibold text-gray-600 border-b-2 border-gray-300 text-left">
          COMPANY
        </th>
        <th className="p-3 text-sm font-semibold text-gray-600 border-b-2 border-gray-300 text-left">
          BANK
        </th>
        <th
          className="p-3 text-sm font-semibold text-gray-600 border-b-2 border-gray-300 text-left cursor-pointer hover:bg-gray-200 transition-colors"
          onClick={() => handleSort("insertedDate")}
        >
          <div className="flex items-center">
            INSERTED DATE {renderSortIcon("insertedDate")}
          </div>
        </th>
        <th className="p-3 text-sm font-semibold text-gray-600 border-b-2 border-gray-300 text-left">
          SUPPLIER
        </th>
        {/* <th className="p-3 text-sm font-semibold text-gray-600 border-b-2 border-gray-300 text-left">
          ITEM NAME
        </th>
        <th className="p-3 text-sm font-semibold text-gray-600 border-b-2 border-gray-300 text-right">
          LC QTY
        </th>
        <th className="p-3 text-sm font-semibold text-gray-600 border-b-2 border-gray-300 text-right">
          Unit
        </th> */}
        <th
          className="p-3 text-sm font-semibold text-gray-600 border-b-2 border-gray-300 text-left cursor-pointer hover:bg-gray-200 transition-colors"
          onClick={() => handleSort("lcAmount")}
        >
          <div className="flex items-center">
            LC AMOUNT {renderSortIcon("lcAmount")}
          </div>
        </th>
        <th className="p-3 text-sm font-semibold text-gray-600 border-b-2 border-gray-300 text-left">
          Current Stage
        </th>
        {/* <th className="p-3 text-sm font-semibold text-gray-600 border-b-2 border-gray-300 text-left">
          STATUS
        </th> */}
      </tr>
    </thead>
  );

  const renderTableBody = () => {
    if (error) {
      return (
        <tbody>
          <tr>
            <td
              colSpan={10}
              className="p-4 text-center text-red-600 font-medium"
            >
              Error: {error}
            </td>
          </tr>
        </tbody>
      );
    }

    if (data.length === 0) {
      return (
        <tbody>
          <tr>
            <td
              colSpan={10}
              className="p-4 text-center text-gray-500 font-medium"
            >
              No matching L/C records found.
            </td>
          </tr>
        </tbody>
      );
    }

    if (loading) {
      return <TableSkeleton />;
    }

    return (
      <tbody>
        {data.map((record, index) => (
          <React.Fragment key={index}>
            <tr className="border-b border-gray-100 hover:bg-teal-50 shadow-sm transition-all duration-200">
              <td
                className={`p-3 text-sm font-medium ${record.delayed === "Delayed" ? "text-red-700" : "text-teal-700"} cursor-pointer hover:underline flex items-center space-x-2`}
                onClick={() => toggleInlineTimeline(record.lcSerial)}
                title="Click to view/hide Inline Timeline"
              >
                <List className="w-4 h-4 text-blue-600" />{" "}
                <span>{record.lcSerial}</span>
              </td>
              <td className="p-3 text-sm text-gray-800">{record.company}</td>
              <td className="p-3 text-sm text-gray-600">{record.localBank}</td>
              <td className="p-3 text-sm text-gray-600">
                {record.insertedDate}
              </td>
              <td className="p-3 text-sm text-gray-600 ">
                {" "}
                {/*hidden sm:table-cell*/}
                {record.supplier}
              </td>
              {/* <td className="p-3 text-sm text-gray-800">{record.item}</td>
              <td className="p-3 text-sm text-gray-600  truncate max-w-xs">
                {record.quantity}
              </td>
              <td className="p-3 text-sm text-gray-600 text-right ">
                {record.unit}
              </td> */}
              <td className="p-3 text-sm text-gray-800 font-mono text-right ">
                {record.currency} {record.lcAmount}
              </td>
              <td className="p-3 text-sm ">
                <StageBadge stage={record.currentStage} />
              </td>
              {/* <td className="p-3 text-sm">
                <StatusBadge status={record.status} />
              </td> */}
            </tr>
            {inlineOpenLc === record.lcSerial && (
              <tr className="bg-gray-50/50">
                <td colSpan={10} className="p-0 border-t-2 border-teal-500">
                  <HorizontalTimeline
                    progressIndex={record.progressIndex}
                    timelineDetails={timelineDetail}
                    loading={timelineLoading}
                    isDeleted={record.delayed === "Delayed" ? true : false}
                  />
                </td>
              </tr>
            )}
          </React.Fragment>
        ))}
      </tbody>
    );
  };

  const renderPagination = () => {
    // Determine the number of pages to show in the pagination controls
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
      <div className="flex items-center justify-between mt-6 flex-wrap gap-4">
        <div className="text-sm font-medium text-gray-600">
          Showing{" "}
          {totalElements === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1} to{" "}
          {Math.min(currentPage * itemsPerPage, totalElements)} of{" "}
          {totalElements} entries
        </div>
        <div className="flex space-x-1">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1 || loading}
            className="px-3 py-1.5 text-sm font-medium rounded-lg text-gray-600 bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer"
          >
            Previous
          </button>

          {pageNumbers.map((page) => (
            <button
              key={page}
              onClick={() => handlePageChange(page)}
              disabled={loading}
              className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors cursor-pointer 
                ${
                  page === currentPage
                    ? "bg-teal-600 text-white shadow-md shadow-teal-500/30"
                    : "bg-gray-100 text-gray-700 hover:bg-teal-100"
                }`}
            >
              {page}
            </button>
          ))}

          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages || totalPages === 0 || loading}
            className="px-3 py-1.5 text-sm font-medium rounded-lg text-gray-600 bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer"
          >
            Next
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans antialiased text-gray-800 p-4">
      <div className="transition-all duration-300">
        {/* Title Bar and Actions */}
        <div className="mb-3 flex flex-col sm:flex-row justify-between items-start sm:items-center bg-white p-4 rounded-xl shadow-lg ">
          <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 mb-3 sm:mb-0">
            LC List & Timeline
          </h1>
          <div className="flex gap-2.5">
            <DateRangePicker
              onFilterChange={handleFilter}
              defaultValue={dateRanges}
            />
            <button
              onClick={exportToCSV}
              className="flex items-center space-x-2 px-3 py-2 text-sm font-semibold  cursor-pointer"
              disabled={loading}
            >
              <Download className="w-4 h-4" />
              <span className="hidden sm:inline">Export</span>
            </button>

            <button
              onClick={() => setShowFilter(!showFilter)}
              className="flex items-center space-x-2 px-3 py-2 text-sm font-semibold  cursor-pointer"
            >
              <Funnel className="w-4 h-4" />
              <span className="hidden sm:inline">Filter</span>
            </button>
          </div>
        </div>

        {/* Filter Box */}
        <div
          className={`bg-white p-4 rounded-xl shadow-lg mb-6 transition-all duration-300 ease-in-out overflow-hidden ${
            showFilter
              ? "max-h-96 opacity-100 pt-6"
              : "max-h-0 opacity-0 p-0 hidden"
          }`}
        >
          <h3 className="text-lg font-bold mb-4 text-gray-700 border-b pb-2">
            Apply Filters
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {/* Company Filter */}
            <LovSelect
              label="Company"
              options={companyOptions}
              value={companyValue}
              placeholder="Select Company..."
              onInputChange={() => {}}
              onChange={(option) => {
                setCompanyValue(option);
                setFilters((prev) => ({
                  ...prev,
                  company: option ? String(option.value) : "All",
                }));
              }}
            />

            {/* Supplier Filter */}
            <LovSelect
              label="Supplier"
              options={options}
              value={value}
              isLoading={supplierLovLoading}
              placeholder="Select Supplier..."
              onInputChange={(input) => setSupplierSearch(input)}
              onChange={(option) => {
                setValue(option);
                setFilters((prev) => ({
                  ...prev,
                  supplier: option ? String(option.value) : "All",
                }));
              }}
            />

            {/* Bank Filter */}
            <LovSelect
              label="Bank"
              options={bankLovOptions}
              value={bankValue}
              placeholder="Select Bank..."
              onInputChange={() => {}}
              onChange={(option) => {
                setBankValue(option);
                setFilters((prev) => ({
                  ...prev,
                  localbank: option ? String(option.value) : "All",
                }));
              }}
            />

            {/* Item Filter */}
            <LovSelect
              label="Item"
              options={itemOptions}
              value={itemValue}
              isLoading={itemLovLoading}
              placeholder="Select Item..."
              onInputChange={(input) => setItemSearch(input)}
              onChange={(option) => {
                setItemValue(option);
                setFilters((prev) => ({
                  ...prev,
                  item: option ? String(option.value) : "All",
                }));
              }}
            />

            {/* Amount Filter */}
            <LovSelect
              label="Amount Range"
              options={amountOptions}
              value={amountValue}
              placeholder="Select Amount..."
              onInputChange={() => {}}
              onChange={(option) => {
                setAmountValue(option);
                setFilters((prev) => ({
                  ...prev,
                  amount: option ? String(option.value) : "All",
                }));
              }}
            />
          </div>
        </div>

        {/* Table & Search */}
        <div className="bg-white p-4 rounded-xl shadow-lg">
          <div className="flex justify-between flex-wrap gap-4 mb-4">
            {/* Simple DataTables-like search/filter */}
            <div className="w-full sm:w-auto">
              <label
                htmlFor="table-search"
                className="text-sm font-semibold text-gray-700 mr-2 hidden sm:inline"
              >
                Search:
              </label>
              <input
                id="table-search"
                type="text"
                placeholder="Search currently loaded data..."
                value={searchTerm}
                onChange={handleSearchChange}
                className="w-full sm:w-64 p-2 border border-gray-300 rounded-lg focus:ring-teal-500 focus:border-teal-500 text-sm"
              />
            </div>
          </div>

          <div className="overflow-x-auto rounded-lg shadow-inner border border-gray-200 h-[calc(100vh-15rem)] overflow-y-auto">
            <table className="min-w-full divide-y divide-gray-200">
              {renderTableHead()}
              {renderTableBody()}
            </table>
          </div>

          {renderPagination()}
        </div>
      </div>
    </div>
  );
};

export default LcTrackingV2;
