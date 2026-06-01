import MetricCard from "./MetricCard";

const dashboardMetrics = [
  { title: "Total Process", value: 2 },
  { title: "Total Spent Time", value: "8 sec" },
  // { title: "Total Saved Time", value: "-1 hr -1 min" },
  // { title: "Total Saved Cost", value: "-0.88" },
];

const DashboardMetrics = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {dashboardMetrics.map((metric) => (
        <MetricCard
          key={metric.title}
          title={metric.title}
          value={metric.value}
        />
      ))}
    </div>
  );
};

export default DashboardMetrics;
