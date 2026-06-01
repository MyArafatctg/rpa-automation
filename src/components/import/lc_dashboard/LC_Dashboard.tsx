import { useState, useMemo, useContext, useEffect } from "react";
import { Line, Doughnut, Bar } from "react-chartjs-2";
import ChartCard from "./ChartCard";
import KpiCard, { type KpiData } from "./KpiCard";
import Modal from "./Modal";
import ModalTable from "./ModalTable";
import SnapshotTable, { type SnapshotItem } from "./SnapshotTable";
import TimelineStage from "./TimelineStage";
import { AppContext } from "../../../context/AppContext";
import axios from "axios";
import type { LcApiRecord } from "../lc_tracking/LcTrackingV2";
import type { DeptData } from "./DeptCompletionChart";
import DeptCompletionChart from "./DeptCompletionChart";
import GroupWiseLcTime, { type RawData } from "./GroupWiseLcTime";
import DateRangePicker, { type DateRange } from "../../util/DateRangePicker";
import TableSkeleton from "../../util/TableSkeleton";
import axiosInstance from "../../../customHook/api/axiosInstance";

interface LcSummaryResponse {
  totalLc: number;
  inProgress: number;
  completed: number;
  delayed: number;
  avgCompletionTime: number;
  approved: number;
  avgApprovedTime: number;
}

interface TimelineSummaryResponse {
  commercialLC: number;
  auditLC: number;
  processControlLC: number;
  bodLC: number;
  gmLC: number;
}

export interface CommercialCount {
  newLc: number;
  onGoingLc: number;
}

const LC_Dashboard = () => {
  const [dateRange, setDateRange] = useState("7");
  const [activeSnapshotTab, setActiveSnapshotTab] = useState("Commercial");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalLoading, setIsModalLoading] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [modalData, setModalData] = useState<LcApiRecord[]>([]);
  const [days, setDays] = useState<string[]>([]);
  const [deptAvg, setDeptAvg] = useState<number[]>([]);
  const [deptName, setDeptName] = useState<string[]>([]);
  const [dayTotal, setDayTotal] = useState<number[]>([]);
  const [deptData, setDeptData] = useState<DeptData>({});

  const [commercialCounts, setCommercialCounts] = useState<CommercialCount>({
    newLc: 0,
    onGoingLc: 0,
  });

  const [stages, setStages] = useState<string[]>([]);
  const [totalCounts, setTotalCounts] = useState<number[]>([]);

  const [snapshotData, setSnapshotData] = useState<SnapshotItem[]>([]);

  const { BACKEND_URL } = useContext(AppContext);

  const [summary, setSummary] = useState<LcSummaryResponse | null>(null);
  const [loading, setLoading] = useState(true);

  const [isProgressLoading, setIsProgressLoading] = useState(false);

  const [groupData, setGroupData] = useState<RawData>({
    yarn: [],
    accessories: [],
    dyes: [],
  });

  const [timelinesummary, setTimelinesummary] =
    useState<TimelineSummaryResponse | null>(null);

  const getInitialDates = (): DateRange => {
    const today = new Date();
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(today.getDate() - 30); // 30 days ago

    const formatDate = (date: Date) => date.toISOString().split("T")[0];

    return {
      from: formatDate(sevenDaysAgo),
      to: formatDate(today),
    };
  };

  const [dateRanges, setDateRanges] = useState<DateRange>(getInitialDates());

  useEffect(() => {
    setLoading(true);
    // const fetchSummary = async () => {
    //   const apiUrl = `${BACKEND_URL}/lc/summary/${dateRange}`;
    //   try {
    //     const res = await axiosInstance.get<LcSummaryResponse>(apiUrl);
    //     setSummary(res.data);
    //   } catch (err) {
    //     console.error("Error loading LC summary:", err);
    //   } finally {
    //     setLoading(false);
    //   }
    // };

    const fetchSummary = async () => {
      try {
        setLoading(true);
        const res = await axiosInstance.get(`${BACKEND_URL}/lc/summary`, {
          params: {
            from: dateRanges.from,
            to: dateRanges.to,
          },
        });
        setSummary(res.data);
      } catch (err) {
        console.error("Error loading LC summary:", err);
      } finally {
        setLoading(false);
      }
    };

    // const fetchTimelineSummary = async () => {
    //   const apiUrl = `${BACKEND_URL}/lc/lcSummary/${dateRange}`;
    //   try {
    //     const res = await axios.get<TimelineSummaryResponse>(apiUrl);
    //     setTimelinesummary(res.data);
    //   } catch (err) {
    //     console.error("Error loading LC summary:", err);
    //   } finally {
    //     setLoading(false);
    //   }
    // };

    const fetchTimelineSummary = async () => {
      try {
        setLoading(true);
        const res = await axiosInstance.get(`${BACKEND_URL}/lc/lcSummary`, {
          params: {
            from: dateRanges.from,
            to: dateRanges.to,
          },
        });
        setTimelinesummary(res.data);
      } catch (err) {
        console.error("Error loading LC summary:", err);
      } finally {
        setLoading(false);
      }
    };

    const fetchDeptData = async () => {
      const apiUrl = `${BACKEND_URL}/lc/deptCompletionTime/date-range`; // Updated endpoint

      try {
        setLoading(true);
        const res = await axiosInstance.get<DeptData>(apiUrl, {
          params: {
            from: dateRanges.from,
            to: dateRanges.to,
          },
        });
        setDeptData(res.data);
      } catch (err) {
        console.error("Error loading LC summary:", err);
      } finally {
        setLoading(false);
      }
    };

    const fetchCommercialCount = async () => {
      const apiUrl = `${BACKEND_URL}/lc/commercialCount`;

      try {
        setLoading(true);
        const res = await axiosInstance.get<CommercialCount>(apiUrl, {
          params: {
            from: dateRanges.from,
            to: dateRanges.to,
          },
        });
        setCommercialCounts(res.data);
      } catch (err) {
      } finally {
        setLoading(false);
      }
    };

    if (dateRanges.from && dateRanges.to) {
      fetchDeptData();
      fetchDayWiseData();
      fetchSummary();
      fetchTimelineSummary();
      fetchStageWiseData();
      fetchDeptWiseData();
      fetchGroupData();
      fetchCommercialCount();
    }
  }, [dateRange, dateRanges, BACKEND_URL]);

  useEffect(() => {
    console.log("Updated summary:", summary);
  }, [summary]);

  const formatWorkTimeShort = (totalHours: number): string => {
    const hoursPerDay = 9;

    const totalMinutes = Math.round(totalHours * 60);

    const totalDays = Math.floor(totalMinutes / (hoursPerDay * 60));
    const remainingMinutesAfterDays = totalMinutes % (hoursPerDay * 60);

    const hours = Math.floor(remainingMinutesAfterDays / 60);
    const minutes = remainingMinutesAfterDays % 60;

    return `${totalDays}D-${hours}.${minutes}H`;
  };

  // 7. Data Processing (useMemo for efficiency)
  const { kpis, timelineCounts, slaPerformance } = useMemo(() => {
    let created = timelinesummary?.commercialLC ?? 0,
      audit = timelinesummary?.auditLC ?? 0,
      pc = timelinesummary?.processControlLC ?? 0,
      bod = timelinesummary?.bodLC ?? 0,
      gm = timelinesummary?.gmLC ?? 0;
    let auditSum = 0,
      auditCount = 0,
      pcSum = 0,
      pcCount = 0,
      bodSum = 0,
      bodCount = 0,
      gmSum = 0,
      gmCount = 0;

    return {
      kpis: [
        {
          label: "Total L/C Created",
          value: summary?.totalLc ?? 0,
          icon: "file-text",
          color: "bg-teal-700",
          type: "total",
        },
        {
          label: "Approval In-Progress",
          value: summary?.inProgress ?? 0,
          icon: "hourglass",
          color: "bg-[#70B2B2]",
          type: "inProgress",
        },
        {
          label: "Completed (upto BOD received)",
          value: summary?.approved ?? 0,
          subTitle: summary
            ? formatWorkTimeShort(summary.avgCompletionTime)
            : "0d 0h",
          icon: "check-circle",
          color: "bg-[#9ECFD4]",
          type: "completed",
        },
        {
          label: "Approved by BOD",
          value: summary?.completed ?? 0,
          subTitle: summary
            ? formatWorkTimeShort(summary.avgApprovedTime)
            : "0d 0h",
          icon: "checkmark-done-circle",
          color: "bg-[#0080004f]",
          type: "approved",
        },
        {
          label: "Delayed (> 5 Days)",
          value: summary?.delayed ?? 0,
          icon: "alert-triangle",
          color: "bg-[#E5E9C5]",
          type: "delayed",
        },
      ],
      timelineCounts: { created, audit, pc, bod, gm },
      deptAverages: {
        comerAvg: auditCount ? Math.round(auditSum / auditCount) : 0,
        auditAvg: auditCount ? Math.round(auditSum / auditCount) : 0,
        pcAvg: pcCount ? Math.round(pcSum / pcCount) : 0,
        bodAvg: bodCount ? Math.round(bodSum / bodCount) : 0,
        gmAvg: gmCount ? Math.round(gmSum / gmCount) : 0,
      },
      slaPerformance: summary
        ? {
            onTime: summary.totalLc - summary.delayed,
            delayed: summary.delayed,
          }
        : { onTime: 0, delayed: 0 },
    };
  }, [summary, timelinesummary]);

  // 8. Chart Data Configurations

  const fetchDayWiseData = async () => {
    const apiUrl = `${BACKEND_URL}/lc/dayWiseData`;

    try {
      setLoading(true);
      const response = await axiosInstance.get(apiUrl, {
        params: {
          from: dateRanges.from,
          to: dateRanges.to,
        },
      });

      let days: string[] = [];
      let daysData: number[] = [];
      response.data.forEach((element: { DAYS: string; TOTAL: number }) => {
        days.push(element.DAYS);
        daysData.push(element.TOTAL);
      });

      setDays(days);
      setDayTotal(daysData);
    } catch (err) {
      console.error("Error loading LC summary:", err);
    } finally {
      setLoading(false);
    }
  };

  const trendChartData = {
    labels: days,
    datasets: [
      {
        label: "L/C Created",
        data: dayTotal,
        borderColor: "#016B61",
        backgroundColor: "rgba(1,107,97,0.12)",
        fill: false,
        tension: 0.35,
      },
    ],
  };

  const slaChartData = {
    labels: ["On Time", "Delayed"],
    datasets: [
      {
        data: [slaPerformance.onTime, slaPerformance.delayed],
        backgroundColor: ["#016B61", "#d63031"],
        hoverOffset: 4,
      },
    ],
  };

  // Calculate Overall Average for Dept Completion Chart

  const deptOrder = ["Commercial", "Audit", "Process Controll", "BOD"];
  const deptMap: Record<string, string> = {
    commercial: "Commercial",
    audit: "Audit",
    processcontroll: "Process Controll",
    bod: "BOD",
  };

  const fetchDeptWiseData = async () => {
    try {
      setLoading(true);
      const apiUrl = `${BACKEND_URL}/lc/deptWiseCount`;

      const response = await axiosInstance.get(apiUrl);

      const entries = Object.entries(response.data);

      let records: StageRecord[] = entries.map(([stage, count]) => ({
        stage: deptMap[stage] || stage,
        count: Number(count),
      }));

      // Sort
      records.sort(
        (a, b) => deptOrder.indexOf(a.stage) - deptOrder.indexOf(b.stage),
      );

      setDeptAvg(records.map((r) => r.count));
      setDeptName(records.map((r) => r.stage));
    } catch (err) {
      console.error("Error loading LC summary:", err);
    } finally {
      setLoading(false);
    }
  };

  const deptWiseCharData = {
    labels: deptName,
    datasets: [
      {
        label: "AVG",
        data: deptAvg,
        backgroundColor: "#1f77b4",
      },
    ],
  };

  // stageCharData
  interface StageRecord {
    stage: string;
    count: number;
  }

  const stageOrder = [
    "Create",
    "To Audit",
    "Audit Revised",
    "Audit Approved",
    "Audit Returned",
    "PC Received",
    "PC Approved",
    "PC Returned",
    "GM/ED Received",
    "GM/ED Approved",
    "BOD Received",
    "BOD Approved",
  ];

  const stageMap: Record<string, string> = {
    TRANS_TO_BOD: "BOD Received",
    CREATED: "Create",
    BOD_APPROVE: "BOD Approved",
    AUDIT_RETURN: "Audit Returned",
    PC_RETURN: "PC Returned",
    AUDIT_APPROVE: "Audit Approved",
    PROCESS_CONTROL_APPROVE: "PC Approved",
    PROCESS_CONT_REV: "PC Received",
    COMMERCIAL_REVIEW: "GM/ED Received",
    GM_ED_APPROVE: "GM/ED Approved",
    TRANS_TO_AUDIT: "To Audit",
    AUDIT_REV: "Audit Revised",
  };

  const fetchStageWiseData = async () => {
    const apiUrl = `${BACKEND_URL}/lc/stageWiseData`;

    try {
      setLoading(true);
      const response = await axiosInstance.get(apiUrl, {
        params: {
          from: dateRanges.from,
          to: dateRanges.to,
        },
      });

      // Map
      let records: StageRecord[] = response.data.map(
        (element: { stage: string; count: number }) => ({
          stage: stageMap[element.stage] || element.stage,
          count: element.count,
        }),
      );

      // Sort
      records.sort(
        (a, b) => stageOrder.indexOf(a.stage) - stageOrder.indexOf(b.stage),
      );

      // Extract
      setStages(records.map((r) => r.stage));
      setTotalCounts(records.map((r) => r.count));
    } catch (err) {
      console.error("Error loading LC summary:", err);
    } finally {
      setLoading(false);
    }
  };

  const stageChartData = {
    labels: stages,
    datasets: [
      {
        label: "Count",
        data: totalCounts,
        backgroundColor: "#016B61",
      },
    ],
  };

  // 9. Modal Logic for KPI/Timeline
  const openDetailsModal = (data: LcApiRecord[], title: string) => {
    setModalData(data);
    setModalTitle(title);
    setIsModalOpen(true);
  };

  const fetchLcDetails = async (type: KpiData["type"]) => {
    let statusParam = "total";

    if (type === "inProgress") statusParam = "processing";
    if (type === "completed") statusParam = "complete";
    if (type === "delayed") statusParam = "delayed";
    if (type === "approved") statusParam = "approved";

    const apiUrl = `${BACKEND_URL}/lc/detailView`;

    try {
      setIsModalLoading(true); // Start loading
      const response = await axiosInstance.get(apiUrl, {
        params: {
          from: dateRanges.from,
          to: dateRanges.to,
          status: statusParam,
        },
      });

      return response.data;
    } catch (error) {
      console.error("Error fetching LC details:", error);
      return [];
    } finally {
      setIsModalLoading(false); // Stop loading
    }
  };

  const fetchDeptLcDetails = async (department: string) => {
    const apiUrl = `${BACKEND_URL}/lc/getLcDetails`;

    const response = await axiosInstance.get(apiUrl, {
      params: {
        from: dateRanges.from,
        to: dateRanges.to,
        department: department,
      },
    });

    return response.data;
  };

  const handleKpiClick = async (type: KpiData["type"]) => {
    let title = "";

    if (type === "total") title = "Total L/Cs Details";
    else if (type === "inProgress") title = "In Progress L/Cs Details";
    else if (type === "completed") title = "Completed L/Cs Details";
    else if (type === "delayed") title = "Delayed L/Cs Details";

    setModalTitle(title);
    setIsModalOpen(true);
    setIsModalLoading(true);
    setModalData([]); // Clear previous data

    try {
      const subset = await fetchLcDetails(type);
      openDetailsModal(subset, title);
    } catch (error) {
      console.error("Error fetching LC details:", error);
    } finally {
      setIsModalLoading(false); // Stop loading
    }
  };

  const handleStageTimelineClick = async (
    stage: string,
    subStage: string | null,
  ) => {
    let department = "";
    let title = "";
    if (!subStage || subStage === null) {
      department = stage;
      title = stage;
    }

    if (subStage) {
      if (subStage === "Pending Receive") {
        department = stage + "_" + "rec";
        title = stage + " " + subStage;
      } else if (subStage === "Pending Approval") {
        department = stage + "_" + "app";
        title = stage + " " + subStage;
      }
    }
    department = department.toLowerCase();

    if (department === "gm/ed") {
      department = "gm";
    }

    console.log("Department: ", department);

    // 1. Open modal and start loading immediately
    setModalTitle(title);
    setIsModalOpen(true);
    setIsModalLoading(true);
    setModalData([]);

    try {
      const subset = await fetchDeptLcDetails(department);
      openDetailsModal(subset, title);
    } catch (error) {
      console.error("Error fetching LC details:", error);
    } finally {
      setIsModalLoading(false);
    }

    console.log("department : ", department);
  };

  // 10. Snapshot Table Data
  const fetchPendingList = async (department: string) => {
    if (department === "Process Control") {
      department = "pc";
    }
    if (department === "GM / ED") {
      department = "gm";
    }

    department = department.toLowerCase();
    console.log("department : ", department);
    const apiUrl = `${BACKEND_URL}/lc/deptWiseList`;

    try {
      setIsProgressLoading(true);
      const response = await axiosInstance.get(apiUrl, {
        params: {
          from: dateRanges.from,
          to: dateRanges.to,
          department: department,
        },
      });
      setSnapshotData(response.data);
    } catch (err) {
      console.error("Error loading LC summary:", err);
    } finally {
      setIsProgressLoading(false);
    }
  };
  const fetchGroupData = async () => {
    const apiUrl = `${BACKEND_URL}/lc/groupWiseData`;

    const response = await axiosInstance.get(apiUrl, {
      params: {
        from: dateRanges.from,
        to: dateRanges.to,
      },
    });

    setGroupData(response.data);
  };

  useEffect(() => {
    fetchPendingList(activeSnapshotTab);
  }, [activeSnapshotTab, dateRanges]);

  const handleFilter = (range: DateRange) => {
    console.log("Selected Date Range:", range);
    setDateRanges(range);
  };

  // Render the main component structure
  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Assuming a basic main-content structure */}
      <div className=" p-4 transition-all duration-300">
        {/* Header and Date Filter */}
        <div className="flex justify-between items-center mb-5">
          <h1 className="text-2xl font-bold text-gray-800">
            L/C Approval Dashboard Analytics
          </h1>
          <div className="relative">
            <DateRangePicker
              // label="Date Filter"
              onFilterChange={handleFilter}
              defaultValue={dateRanges}
            />
            {/* <select
              className="appearance-none bg-white border border-gray-300 shadow-sm rounded-lg py-2 px-5 text-gray-700 focus:outline-none focus:ring-2 focus:ring-teal-500 transition duration-150"
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
            >
              <option value="7">Last 7 Days</option>
              <option value="30">Last 30 Days</option>
              <option value="90">Last 3 Months</option>
              <option value="120">Last 6 Months</option>
              <option value="365">Last 1 Year</option>
            </select>
            <i className="bi bi-calendar3 absolute right-3 top-1/2 -translate-y-1/2 text-teal-600 pointer-events-none"></i> */}
          </div>
        </div>

        {loading ? (
          <TableSkeleton />
        ) : (
          <div>
            {/* KPI Row */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
              {kpis.map((kpi) => (
                <KpiCard
                  key={kpi.type}
                  {...kpi}
                  onClick={() => handleKpiClick(kpi.type)}
                />
              ))}
            </div>
            {/* Horizontal Stage Timeline */}
            <div className="bg-white rounded-xl p-6 shadow-md mb-6 transition-all duration-300">
              <h1 className="text-xl font-bold text-gray-600">
                Approval In-Progress
              </h1>
              <div className="relative mt-4">
                {/* BACKGROUND LINE (Centered) */}
                <div className="absolute top-9 left-1/2 w-3/4 h-1 bg-teal-300 -translate-x-1/2 -translate-y-1/2"></div>

                {/* TIMELINE STAGES */}
                <div className="relative flex justify-between items-center w-full">
                  <TimelineStage
                    stage="COMMERCIAL"
                    count={timelineCounts.created}
                    commercialData={commercialCounts}
                    leftArm={{
                      label: "New Creation",
                      icon: "inbox",
                      sub: "Pending Receive",
                    }}
                    rightArm={{
                      label: "On Going",
                      icon: "check-circle",
                      sub: "Pending Approval",
                    }}
                    onStageClick={handleStageTimelineClick}
                  />

                  <TimelineStage
                    stage="AUDIT"
                    count={timelineCounts.audit}
                    // leftArm={{
                    //   label: "Pending Receive",
                    //   icon: "inbox",
                    //   sub: "Pending Receive",
                    // }}
                    // rightArm={{
                    //   label: "Pending Approval",
                    //   icon: "check-square",
                    //   sub: "Pending Approval",
                    // }}
                    onStageClick={handleStageTimelineClick}
                  />

                  <TimelineStage
                    stage="PC"
                    count={timelineCounts.pc}
                    // leftArm={{
                    //   label: "Pending Receive",
                    //   icon: "inbox",
                    //   sub: "Pending Receive",
                    // }}
                    // rightArm={{
                    //   label: "Pending Approval",
                    //   icon: "calendar-check",
                    //   sub: "Pending Approval",
                    // }}
                    onStageClick={handleStageTimelineClick}
                  />

                  <TimelineStage
                    stage="GM/ED"
                    count={timelineCounts.gm}
                    onStageClick={handleStageTimelineClick}
                  />

                  <TimelineStage
                    stage="BOD"
                    count={timelineCounts.bod}
                    onStageClick={handleStageTimelineClick}
                  />
                </div>
              </div>
            </div>

            {/* Trend & SLA Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              <ChartCard title="L/C Opening Trend">
                <Line
                  data={trendChartData}
                  options={{
                    maintainAspectRatio: false,
                    plugins: { legend: { display: false } },
                    scales: {
                      y: {
                        beginAtZero: true,
                        title: { display: true, text: "Hours" },
                      },
                      x: {
                        title: { display: true, text: "Date" },
                      },
                    },
                  }}
                />
              </ChartCard>
              <ChartCard title="Approval Performance">
                <Doughnut
                  data={slaChartData}
                  options={{
                    maintainAspectRatio: false,
                    cutout: "60%",
                    plugins: { legend: { position: "bottom" } },
                  }}
                />
              </ChartCard>
            </div>

            {/* Average LC time */}
            <div className="bg-white rounded-xl p-6 shadow-md min-h-[400px] mb-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
                <h5 className="text-xl font-bold text-gray-800 mb-2 sm:mb-0">
                  Category wise L/C completion trends (Average)
                </h5>
              </div>
              <GroupWiseLcTime data={groupData} isLoading={loading} />
            </div>

            {/* Dept completion & Stage overview Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              <ChartCard title="Department Completion Time (hrs)">
                <DeptCompletionChart lcData={deptData} isLoading={loading} />
              </ChartCard>
              <ChartCard title="Stage-Wise Status Overview">
                <Bar
                  data={stageChartData}
                  options={{
                    maintainAspectRatio: false,
                    plugins: { legend: { display: false } },
                    scales: { y: { beginAtZero: true } },
                  }}
                />
              </ChartCard>
            </div>

            {/* Pending Snapshot */}
            <div className="bg-white rounded-xl p-6 shadow-md min-h-[400px]">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
                <h5 className="text-xl font-bold text-gray-800 mb-2 sm:mb-0">
                  In-Progress L/C Status
                </h5>
                <div className="flex gap-2">
                  {[
                    {
                      key: "Commercial",
                      label: `Commercial (${timelineCounts.created})`,
                    },
                    { key: "Audit", label: `Audit (${timelineCounts.audit})` },
                    {
                      key: "Process Control",
                      label: `Process Control (${timelineCounts.pc})`,
                    },
                    { key: "GM / ED", label: `GM / ED (${timelineCounts.gm})` },
                    { key: "BOD", label: `BOD (${timelineCounts.bod})` },
                  ].map(({ key, label }) => (
                    <button
                      key={key}
                      className={`cursor-pointer py-2 px-4 rounded-lg font-bold transition-colors duration-150 ${
                        activeSnapshotTab === key
                          ? "bg-[#016B61] text-white shadow-md"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                      onClick={() => setActiveSnapshotTab(key)}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Table Content - Simplified as a simple React table for brevity, skipping DataTables implementation */}
              {["Commercial", "Audit", "Process Control", "GM / ED", "BOD"].map(
                (tab) =>
                  activeSnapshotTab === tab && (
                    <div key={tab} className="overflow-x-auto">
                      <SnapshotTable data={snapshotData} />
                    </div>
                  ),
              )}
            </div>
          </div>
        )}
      </div>

      {/* Reusable Details Modal */}

      {isModalOpen && (
        <Modal title={modalTitle} onClose={() => setIsModalOpen(false)}>
          {isModalLoading ? (
            <div className="p-4">
              <TableSkeleton />
            </div>
          ) : (
            <ModalTable data={modalData} stage={modalTitle} />
          )}
        </Modal>
      )}
    </div>
  );
};

export default LC_Dashboard;
