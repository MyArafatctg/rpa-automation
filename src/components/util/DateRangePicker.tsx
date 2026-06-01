import React, { useState, type ChangeEvent } from "react";
import { Calendar, ArrowRight } from "lucide-react";

export interface DateRange {
  from: string;
  to: string;
}

interface DateRangePickerProps {
  onFilterChange: (range: DateRange) => void;
  defaultValue: DateRange;
  label?: string;
}

const DateRangePicker = ({
  onFilterChange,
  defaultValue,
  label,
}: DateRangePickerProps) => {
  const [range, setRange] = useState<DateRange>(defaultValue);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const updatedRange = { ...range, [name]: value };
    setRange(updatedRange);

    // Lift state up to the parent component
    onFilterChange(updatedRange);
  };

  const handleClear = () => {
    const cleared = { from: "", to: "" };
    setRange(cleared);
    onFilterChange(cleared);
  };

  return (
    <div className="flex flex-col gap-2 p-4 bg-white border border-slate-200 rounded-xl shadow-sm w-fit">
      {label && (
        <span className="text-sm font-semibold text-slate-700">{label}</span>
      )}

      <div className="flex items-center gap-3">
        {/* From Date */}
        <div className="relative">
          <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="date"
            name="from"
            value={range.from}
            onChange={handleChange}
            className="pl-10 pr-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
          />
        </div>

        <ArrowRight className="w-4 h-4 text-slate-400" />

        {/* To Date */}
        <div className="relative">
          <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="date"
            name="to"
            value={range.to}
            onChange={handleChange}
            className="pl-10 pr-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
          />
        </div>

        <button
          onClick={handleClear}
          className="text-xs font-medium text-slate-500 hover:text-red-600 transition-colors ml-2"
        >
          Clear
        </button>
      </div>
    </div>
  );
};

export default DateRangePicker;
