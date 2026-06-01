import React from "react";

interface ProgressBarProps {
  label?: string;
  value: number; // 0 - 100
  showPercentage?: boolean;
}

const ProgressBar: React.FC<ProgressBarProps> = ({
  label = "Progress",
  value,
  showPercentage = true,
}) => {
  // Clamp value between 0 and 100
  const safeValue = Math.min(100, Math.max(0, value));

  return (
    <div className="w-full">
      {/* Header */}
      <div className="mb-2 flex items-center justify-between font-semibold">
        <span className="text-gray-900">{label}</span>
        {showPercentage && <span className="text-green-500">{safeValue}%</span>}
      </div>

      {/* Progress Bar */}
      <div className="h-4 w-full rounded-full bg-gray-900 shadow-inner overflow-hidden">
        <div
          className="h-full rounded-full bg-cyan-500 transition-all duration-500 ease-in-out"
          style={{ width: `${safeValue}%` }}
        />
      </div>
    </div>
  );
};

export default ProgressBar;
