import React, { useMemo } from "react";
import {
  Chart as ChartJS,
  LinearScale,
  CategoryScale,
  BarElement,
  PointElement,
  LineElement,
  Legend,
  Tooltip,
  LineController,
  BarController,
  type ChartData,
  type ChartOptions,
} from "chart.js";
import { Chart } from "react-chartjs-2";

// Register Chart.js components
ChartJS.register(
  LinearScale,
  CategoryScale,
  BarElement,
  PointElement,
  LineElement,
  Legend,
  Tooltip,
  LineController,
  BarController,
);

export interface DeptData {
  auditAvg?: number;
  pcAvg?: number;
  gmAvg?: number;
  commercialAvg?: number;
  stdAudit?: number;
  stdPc?: number;
  stdGM?: number;
  stdCommercial?: number;
}

interface DeptChartProps {
  lcData: DeptData;
  isLoading?: boolean;
}

const DeptCompletionChart: React.FC<DeptChartProps> = ({
  lcData,
  isLoading,
}) => {
  const chartData: ChartData<"bar" | "line"> = useMemo(() => {
    const {
      auditAvg = 0,
      pcAvg = 0,
      gmAvg = 0,
      commercialAvg = 0,
      stdAudit = 0,
      stdPc = 0,
      stdGM = 0,
      stdCommercial = 0,
    } = lcData;

    const overallAvg =
      Math.round(((auditAvg + pcAvg + gmAvg + commercialAvg) / 4) * 100) / 100;

    return {
      labels: ["Commercial", "Audit", "Process Control", "GM / ED"],
      datasets: [
        {
          type: "bar",
          label: "Dept Avg (hrs)",
          data: [commercialAvg, auditAvg, pcAvg, gmAvg],
          backgroundColor: "#1f77b4",
          order: 1,
        },
        {
          type: "bar",
          label: "Standard (hrs)",
          data: [stdCommercial, stdAudit, stdPc, stdGM],
          backgroundColor: "#2ca02c",
          order: 2,
        },
        {
          type: "line",
          label: "Overall Avg (hrs)",
          data: [overallAvg, overallAvg, overallAvg, overallAvg],
          borderColor: "#9467bd",
          backgroundColor: "rgba(148,103,189,0.06)",
          tension: 0.25,
          fill: false,
          order: 0,
          pointStyle: "circle",
        },
      ],
    };
  }, [lcData]);

  const options: ChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: "top" as const },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: { display: true, text: "Hours" },
      },
    },
  };

  if (isLoading) {
    return (
      <div className="flex h-80 items-center justify-center border rounded-xl bg-gray-50">
        <p className="text-gray-500 animate-pulse">Loading Chart Data...</p>
      </div>
    );
  }

  return <Chart type="bar" data={chartData} options={options} />;
};

export default DeptCompletionChart;
