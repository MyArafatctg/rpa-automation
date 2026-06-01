import { useContext, useState } from "react";
import { AppContext } from "../../context/AppContext";
import SettingsForm from "../util/setting_form/SettingsForm";
import CheckBox from "../util/CheckBox";
import JobSummaryCard from "../cards/JobSummaryCard";
import { useEDocProcessor } from "./useEDocProcessor";
import EDocTable from "./EDocTable";
import type { EDocData } from "./types";
import ProgressBar from "../util/ProgressBar";

interface EDocReportProps {
  data: EDocData[];
  fileName: string;
}

const EDocReport: React.FC<EDocReportProps> = ({ data, fileName }) => {
  const api = useContext(AppContext);
  const [modalOpen, setModalOpen] = useState(false);

  const {
    rows,
    showBotActivity,
    setShowBotActivity,
    startBot,
    isProcessing,
    summary,
    time,
    percentage,
    handleDelete,
  } = useEDocProcessor(data, api, fileName);

  return (
    <div className="bg-transparent rounded-xl shadow-2xl p-8 w-full">
      <div className="flex justify-between items-center mb-6 border-b pb-3">
        <h1 className="text-3xl font-bold">RPA Live Processing</h1>
        <div className="flex">
          <CheckBox
            isChecked={showBotActivity}
            onChange={(e) => setShowBotActivity(e.target.checked)}
            levelText="Show BOT Activities"
          />

          <button
            onClick={() => setModalOpen(true)}
            disabled={isProcessing}
            className="px-3 py-1 bg-green-800 text-white rounded-full text-sm"
          >
            {isProcessing ? "Processing..." : "Run BOT"}
          </button>
        </div>
      </div>
      <div className="mb-6">
        <ProgressBar value={percentage} />
      </div>

      <JobSummaryCard {...summary} time={time} />

      <EDocTable rows={rows} onDelete={handleDelete} />

      <SettingsForm
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onStart={startBot}
      />
    </div>
  );
};

export default EDocReport;
