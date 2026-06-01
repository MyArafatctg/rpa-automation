import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AppContextProvider } from "./context/AppContext";
import ProtectedRoute from "./components/route/ProtectedRoute";
import CoGsaSafta from "./pages/CoGsaSafta";
import EDocUploadHandM from "./pages/EDocUploadHandM";
import FcrSubmission from "./pages/FcrSubmission";
import EInvoicingHAndM from "./pages/EInvoicingHAndM";
import ExpDownload from "./pages/ExpDownload";
import ExpDuplication from "./pages/ExpDuplication";
import { RexIssuance } from "./pages/RexIssuance";
import UnderDevelopment from "./components/util/UnderDevelopment";
import Sidebar from "./components/route/Sidebar";
import LoggingScreen from "./pages/LoggingScreen";
import LCDashboard from "./pages/LCDashboard";
import { LCTracking } from "./pages/LCTracking";
import DataProcessingHandM from "./pages/DataProcessingHandM";
import ContainerTracking from "./pages/ContainerTracking";
import EInvoiceDownload from "./pages/EInvoiceDownload";
import HsbcTradeSolution from "./pages/HsbcTradeSolution";
import HsbcSmartForm from "./pages/HsbcSmartForm";
import NotFound from "./pages/NotFound";

function App() {
  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} />
      <BrowserRouter>
        <AppContextProvider>
          <Routes>
            {/* <Route path="/login" element={<Login />}></Route> */}
            <Route path="/redirect" element={<LoggingScreen />}></Route>
            <Route element={<ProtectedRoute />}>
              <Route path="/" element={<Dashboard />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/cogsa-safta" element={<CoGsaSafta />} />
              <Route path="/edoc-upload-handm" element={<EDocUploadHandM />} />
              <Route path="/fcr-submission" element={<FcrSubmission />} />
              <Route path="/einvoicing-handm" element={<EInvoicingHAndM />} />
              <Route path="/invoice-download" element={<EInvoiceDownload />} />
              <Route path="/exp-download" element={<ExpDownload />} />
              <Route path="/exp-duplication" element={<ExpDuplication />} />
              <Route
                path="/container-tracking"
                element={<ContainerTracking />}
              />
              <Route path="/rex-issuance" element={<RexIssuance />} />
              <Route path="/lc_dashboard" element={<LCDashboard />} />
              <Route path="/lc_list" element={<LCTracking />} />
              <Route
                path="/payment-advice-handm"
                element={<DataProcessingHandM />}
              />
              <Route path="/hsbc-smart-form" element={<HsbcSmartForm />} />
              <Route path="/hsbc-trade" element={<HsbcTradeSolution />} />
              <Route path="/under-development" element={<UnderDevelopment />} />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
          {/* </Nav> */}
        </AppContextProvider>
      </BrowserRouter>
    </>
  );
}

export default App;
