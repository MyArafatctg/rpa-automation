interface Props {
  total: number;
  success: number;
  processing: number;
  failed: number;
  time: number; // ⬅️ parent-controlled time in seconds
}

const JobSummaryCard = ({
  total,
  success,
  processing,
  failed,
  time,
}: Props) => {
  // Format time as HH:MM:SS
  const formatTime = (totalSeconds: number): string => {
    const hrs = Math.floor(totalSeconds / 3600);
    const mins = Math.floor((totalSeconds % 3600) / 60);
    const secs = Math.floor(totalSeconds % 60);
    return `${String(hrs).padStart(2, "0")}:${String(mins).padStart(
      2,
      "0"
    )}:${String(secs).padStart(2, "0")}`;
  };

  return (
    <div
      className="shadow-sm rounded-2xl p-2 mb-3 border-0"
      style={{
        background:
          "linear-gradient(90deg, #ffffff 0%, #f9fafc 50%, #eef3f7 100%)",
      }}
    >
      <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-4 items-center">
        {/* Left: Timer */}
        <div className="col-span-1 flex flex-col items-center justify-center bg-white rounded-2xl shadow-sm p-5">
          <h6 className="text-gray-500 mb-2 text-sm font-medium">Timer</h6>
          <span className="text-3xl md:text-4xl font-bold text-gray-800">
            {formatTime(time)}
          </span>
        </div>

        {/* Right: Summary Cards */}
        <div className="col-span-2 md:col-span-2 lg:col-span-3">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div
              className="text-center rounded-2xl shadow-sm p-4"
              style={{ backgroundColor: "#f3f6ff" }}
            >
              <h6 className="text-black mb-1 text-[18px] font-medium">Total</h6>
              <span className="text-4xl font-bold text-gray-800">{total}</span>
            </div>

            <div
              className="text-center rounded-2xl shadow-sm p-4"
              style={{ backgroundColor: "#e8f8f5" }}
            >
              <h6 className="text-black mb-1 text-[18px] font-medium">
                Success
              </h6>
              <span className="text-4xl font-bold text-green-600">
                {success}
              </span>
            </div>

            <div className="text-center rounded-2xl shadow-sm p-4 bg-blue-100">
              <h6 className="text-black mb-1 text-[18px] font-medium">
                Processing
              </h6>
              <span className="text-4xl font-bold text-blue-600">
                {processing}
              </span>
            </div>

            <div
              className="text-center rounded-2xl shadow-sm p-4"
              style={{ backgroundColor: "#fdecea" }}
            >
              <h6 className="text-black mb-1 text-[18px] font-medium">
                Failed
              </h6>
              <span className="text-4xl font-bold text-red-600">{failed}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobSummaryCard;
