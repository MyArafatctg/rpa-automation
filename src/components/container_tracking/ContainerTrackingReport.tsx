import { useContext, useState } from "react";
import { AppContext } from "../../context/AppContext";
import CheckBox from "../util/CheckBox";
import JobSummaryCard from "../cards/JobSummaryCard";
import { useContainerProcessor } from "./useContainerProcessor";
import ContainerTable from "./ContainerTable";
import type { ContainerType } from "./containerTypes";
import ContainerSetting from "./ContainerSetting";

interface EDocReportProps {
  data: ContainerType[];
  fileName: string;
}

const ContainerTrackingReport: React.FC<EDocReportProps> = ({
  data,
  fileName,
}) => {
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
    handleDelete,
  } = useContainerProcessor(data, api, fileName);

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

      <JobSummaryCard {...summary} time={time} />

      <ContainerTable rows={rows} onDelete={handleDelete} />

      <ContainerSetting
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onStart={startBot}
      />
    </div>
  );
};

export default ContainerTrackingReport;
