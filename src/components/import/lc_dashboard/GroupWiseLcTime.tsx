import React, { useMemo } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  type ChartData,
  type ChartOptions,
} from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
);

interface CategoryValues {
  day: string;
  data: number;
}

export interface RawData {
  yarn: CategoryValues[];
  accessories: CategoryValues[];
  dyes: CategoryValues[];
}

interface LineChartProps {
  data: RawData;
  isLoading?: boolean;
}

const GroupWiseLcTime: React.FC<LineChartProps> = ({ data, isLoading }) => {
  const chartData: ChartData<"line"> = useMemo(() => {
    const labels = ["1", "2", "3", "4", "5", "6", "7"];
    let dayList: string[] = [];
    let yarnData: number[] = [];
    let accessoriesData: number[] = [];
    let dyesData: number[] = [];
    let groupAvgData: number[] = [];

    data.yarn.forEach((item) => {
      dayList.push(item.day);
      yarnData.push(item.data);
    });
    data.accessories.forEach((item) => {
      accessoriesData.push(item.data);
    });
    data.dyes.forEach((item) => {
      dyesData.push(item.data);
    });

    // Calculate Group Average for each step
    dayList.forEach((day, index) => {
      const total = yarnData[index] + accessoriesData[index] + dyesData[index];
      const avg = total / 3;
      groupAvgData.push(parseFloat(avg.toFixed(2)));
    });
    console.log("dayList:", dayList);

    return {
      labels: dayList,
      datasets: [
        {
          label: "YARN",
          data: yarnData,
          borderColor: "#3b82f6", // Blue
          backgroundColor: "#3b82f6",
          tension: 0.3,
        },
        {
          label: "ACCESSORIES",
          data: accessoriesData,
          borderColor: "#ef4444", // Red
          backgroundColor: "#ef4444",
          tension: 0.3,
        },
        {
          label: "DYES, CHEMICALS & MACHINERIES",
          data: dyesData,
          borderColor: "#10b981", // Green
          backgroundColor: "#10b981",
          tension: 0.3,
        },
        {
          label: "Group Avg",
          data: groupAvgData,
          borderColor: "#f59e0b", // Orange/Yellow
          backgroundColor: "#f59e0b",
          borderDash: [5, 5], // Dashed line for average
          tension: 0.3,
          pointStyle: "rectRot",
          pointRadius: 6,
        },
      ],
    };
  }, [data]);

  const options: ChartOptions<"line"> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top" as const,
        labels: { usePointStyle: true, boxWidth: 6 },
      },
      title: {
        display: true,
        text: "Category Completion Trends",
        font: { size: 16, weight: "bold" },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: { color: "#f3f4f6" },
        title: { display: true, text: "Hours" },
      },
      x: {
        grid: { display: false },
        title: { display: true, text: "Date" },
      },
    },
  };

  if (isLoading) {
    return (
      <div className="h-96 w-full animate-pulse bg-gray-100 rounded-lg flex items-center justify-center">
        Loading...
      </div>
    );
  }

  return (
    <div className="w-full p-4 bg-white rounded-xl shadow-md border border-gray-200">
      <div className="h-[400px]">
        <Line data={chartData} options={options} />
      </div>
    </div>
  );
};

export default GroupWiseLcTime;
