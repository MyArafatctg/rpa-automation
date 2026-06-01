import React, { useContext, useEffect, useRef, useState } from "react";
import { Calendar, CheckCircle, XOctagon, Hourglass, Bot } from "lucide-react";
import { AppContext } from "../../context/AppContext";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar, Doughnut, Line } from "react-chartjs-2";
import axiosInstance from "../../customHook/api/axiosInstance";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
);

interface SummaryData {
  id: number;
  totalJobs: number;
  successfulRuns: number;
  failedRuns: number;
  totalElapsedTime: string;
}

interface BotActivity {
  botName: string;
  time: number;
  status: String;
}

interface BotStats {
  botName: string;
  runs: number;
  success: number;
  fail: number;
}

const DashboardAnalytics: React.FC = () => {
  const [dateRange, setDateRange] = useState("7");
  const [summary, setSummary] = useState<SummaryData | null>(null);
  const { BACKEND_URL, clientId, token } = useContext(AppContext);
  const [loading, setLoading] = useState(true);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const [days, setDays] = useState<string[]>([]);
  const [dayTotal, setDayTotal] = useState<number[]>([]);

  const [botActivity, setBotActivity] = useState<BotActivity[]>([]);
  const [botStats, setBotStats] = useState<BotStats[]>([]);

  // ✅ Fetch API Data
  useEffect(() => {
    // console.log("Fetching summary data for clientId:", token);
    const fetchSummary = async () => {
      try {
        const apiUrl = `${BACKEND_URL}/getJobSummary`;

        const res = await axiosInstance.get(apiUrl, {
          params: {
            days: parseInt(dateRange),
          },
        });

        // const res = await fetch(`${BACKEND_URL}/getJobSummary`);
        // if (!res.ok) throw new Error("Failed to fetch summary data");
        // const data = await res.json();
        setSummary(res.data);
        // console.log("Summary Data:", res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchSummary();
    fetchDayWiseData();
    fetchBotActivityData();
    fetchBotPerformanceData();
  }, [BACKEND_URL, dateRange]);

  // Day wise data
  const fetchDayWiseData = async () => {
    const apiUrl = `${BACKEND_URL}/getJobSummary/dayWiseData`;

    const response = await axiosInstance.get(apiUrl, {
      params: {
        days: parseInt(dateRange) > 30 ? 30 : parseInt(dateRange),
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
  };

  // Bot activity data
  const fetchBotActivityData = async () => {
    const apiUrl = `${BACKEND_URL}/getJobSummary/recentActivity`;

    try {
      const response = await axiosInstance.get(apiUrl);
      setBotActivity(response.data);
    } catch (error) {
      console.error("Error fetching bot activity data:", error);
    }
  };

  // Bot performance data
  const fetchBotPerformanceData = async () => {
    const apiUrl = `${BACKEND_URL}/getJobSummary/botPerformance`;

    try {
      const response = await axiosInstance.get(apiUrl);
      setBotStats(response.data);
    } catch (error) {
      console.error("Error fetching bot performance data:", error);
    }
  };
  // Chart Data
  const jobsTrendData = {
    labels: days,
    datasets: [
      {
        label: "Jobs",
        data: dayTotal,
        borderColor: "#016B61",
        backgroundColor: "rgba(1,107,97,0.15)",
        borderWidth: 3,
        tension: 0.4,
      },
    ],
  };

  const successPieData = {
    labels: ["Success", "Failed"],
    datasets: [
      {
        data: [summary?.successfulRuns ?? 0, summary?.failedRuns ?? 0],
        backgroundColor: ["#016B61", "#d63031"],
      },
    ],
  };

  const top5Bots = [...botStats].sort((a, b) => b.runs - a.runs).slice(0, 5);

  const topBotsData = {
    labels: top5Bots.map((bot) => bot.botName),
    datasets: [
      {
        label: "Runs",
        data: top5Bots.map((bot) => bot.runs),
        backgroundColor: [
          "#016B61",
          "#70B2B2",
          "#9ECFD4",
          "#E5E9C5",
          "#016B61",
        ],
      },
    ],
  };

  const formatTime = (minutes: number) => {
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    return h > 0 ? `${h} h ${m} min` : `${m} min`;
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold text-gray-800">
          Dashboard Analytics
          <span className="text-lg text-gray-400 ml-2">[ {clientId} ]</span>
        </h2>

        {/* Date Filter Dropdown */}
        <div className="relative">
          <select
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
          <i className="bi bi-calendar3 absolute right-3 top-1/2 -translate-y-1/2 text-teal-600 pointer-events-none"></i>
        </div>
      </div>

      {/* KPI Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="rounded-2xl p-6 text-white shadow-md bg-[#016B61]">
          <Bot className="w-10 h-10 mb-3 opacity-90" />
          <p className="text-4xl font-bold">
            {loading ? "..." : (summary?.totalJobs ?? 0)}
          </p>
          <p className="opacity-90 text-sm">Total Bot Jobs</p>
        </div>

        <div className="rounded-2xl p-6 text-white shadow-md bg-[#70B2B2]">
          <CheckCircle className="w-10 h-10 mb-3 opacity-90" />
          <p className="text-4xl font-bold">
            {loading ? "..." : (summary?.successfulRuns ?? 0)}
          </p>
          <p className="opacity-90 text-sm">Successful Runs</p>
        </div>

        <div className="rounded-2xl p-6 text-white shadow-md bg-[#9ECFD4]">
          <XOctagon className="w-10 h-10 mb-3 opacity-90" />
          <p className="text-4xl font-bold">
            {loading ? "..." : (summary?.failedRuns ?? 0)}
          </p>
          <p className="opacity-90 text-sm">Failed Runs</p>
        </div>

        <div className="rounded-2xl p-6 text-gray-800 shadow-md bg-[#E5E9C5]">
          <Hourglass className="w-10 h-10 mb-3 opacity-80" />
          <p className="text-4xl font-bold">
            {loading ? "..." : (summary?.totalElapsedTime ?? "00:00:00")}{" "}
          </p>
          <p className="text-sm">Total run time</p>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-md">
          <h5 className="text-lg font-semibold mb-3">
            {/* Jobs Trend ({selectedRange}) */}
            Jobs Trend (Last Week)
          </h5>
          <Line data={jobsTrendData} />
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-md">
          <h5 className="text-lg font-semibold mb-3">Success Ratio</h5>
          <Doughnut data={successPieData} />
        </div>
      </div>

      {/* Third Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity */}
        <div className="bg-white rounded-2xl p-6 shadow-md">
          <h5 className="text-lg font-semibold mb-3">Recent Activity</h5>

          {botActivity.map((item, i) => (
            <div
              key={i}
              className="flex justify-between py-2 border-b last:border-0 text-sm"
            >
              <span>
                {item.status === "Success" ? "✔" : "❌"} {item.botName}
              </span>
              <span className="text-gray-500">{formatTime(item.time)} ago</span>
            </div>
          ))}
        </div>

        {/* Bot Performance */}
        <div className="bg-white rounded-2xl p-6 shadow-md">
          <h5 className="text-lg font-semibold mb-3">Bot Performance</h5>

          <table className="w-full text-sm">
            <thead>
              <tr className="text-left border-b">
                <th className="py-2">Bot Name</th>
                <th>Runs</th>
                <th>Success</th>
                <th>Failed</th>
              </tr>
            </thead>

            <tbody>
              {botStats.map((bot, i) => (
                <tr key={i} className="border-b last:border-0">
                  <td className="py-2">{bot.botName}</td>
                  <td>{bot.runs}</td>
                  <td className="text-green-600 font-medium">{bot.success}</td>
                  <td className="text-red-600 font-medium">{bot.fail}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Top 5 Bots */}
        <div className="bg-white rounded-2xl p-6 shadow-md">
          <h5 className="text-lg font-semibold mb-3">Top 5 Most Active Bots</h5>
          <Bar data={topBotsData} />
        </div>
      </div>
    </div>
  );
};

export default DashboardAnalytics;
