import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AppContextProvider } from "./context/AppContext";
import ProtectedRoute from "./components/ProtectedRoute";
import CoGsaSafta from "./pages/CoGsaSafta";
import EDocUploadHandM from "./pages/EDocUploadHandM";
import FcrSubmission from "./pages/FcrSubmission";
import EInvoicingHAndM from "./pages/EInvoicingHAndM";
import ExpDownload from "./pages/ExpDownload";
import ExpDuplication from "./pages/ExpDuplication";
import { RexIssuance } from "./pages/RexIssuance";
import Navbar from "./components/Navbar";
function App() {
  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} />

      <BrowserRouter>
        <AppContextProvider>
          <Navbar />
          <Routes>
            <Route
              path="/"
              element={<Navigate to="/dashboard"></Navigate>}
            ></Route>
            <Route path="/login" element={<Login />}></Route>
            {/* ✅ Protected routes */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />

            <Route
              path="/cogsa-safta"
              element={
                <ProtectedRoute>
                  <CoGsaSafta />
                </ProtectedRoute>
              }
            />

            <Route
              path="/edoc-upload-handm"
              element={
                <ProtectedRoute>
                  <EDocUploadHandM />
                </ProtectedRoute>
              }
            />

            <Route
              path="/fcr-submission"
              element={
                <ProtectedRoute>
                  <FcrSubmission />
                </ProtectedRoute>
              }
            />

            <Route
              path="/einvoicing-handm"
              element={
                <ProtectedRoute>
                  <EInvoicingHAndM />
                </ProtectedRoute>
              }
            />

            <Route
              path="/exp-download"
              element={
                <ProtectedRoute>
                  <ExpDownload />
                </ProtectedRoute>
              }
            />

            <Route
              path="/exp-duplication"
              element={
                <ProtectedRoute>
                  <ExpDuplication />
                </ProtectedRoute>
              }
            />

            <Route
              path="/rex-issuance"
              element={
                <ProtectedRoute>
                  <RexIssuance />
                </ProtectedRoute>
              }
            />
          </Routes>
        </AppContextProvider>
      </BrowserRouter>
    </>
  );
}

export default App;
