interface MetricCardProps {
  title: string;
  value: string | number;
}

const MetricCard = ({ title, value }: MetricCardProps) => {
  return (
    <div className="bg-white p-4 rounded-xl shadow-md transition-shadow duration-300 hover:shadow-lg">
      <h3 className="text-gray-600 text-sm font-medium mb-1">{title}</h3>
      {/* The value should be large and prominent */}
      <p className="text-2xl font-bold text-gray-800 wrap-break-word">
        {value}
      </p>
    </div>
  );
};

export default MetricCard;
