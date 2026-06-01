import { useState } from "react";
import PdfUploader from "../components/pdf_uploader/PdfUploader";
import type { PDFData } from "../components/pdf_uploader/ExcelTable";
import ExcelTable from "../components/pdf_uploader/ExcelTable";

const DataProcessingHandM = () => {
  const [pdfData, setpdfData] = useState<PDFData[]>([]);
  return (
    <div>
      {pdfData.length > 0 ? (
        <ExcelTable data={pdfData} onData={setpdfData} />
      ) : (
        <PdfUploader onData={setpdfData} />
      )}
    </div>
  );
};

export default DataProcessingHandM;
