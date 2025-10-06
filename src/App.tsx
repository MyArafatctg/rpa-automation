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
import Nav from "./components/Nav";
function App() {
  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} />

      <BrowserRouter>
        <AppContextProvider>
          {/* <Nav> */}
          <Routes>
            <Route
              path="/"
              element={
                <Nav>
                  <Navigate to="/dashboard"></Navigate>
                </Nav>
              }
            ></Route>
            <Route path="/login" element={<Login />}></Route>
            {/* ✅ Protected routes */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Nav>
                    <Dashboard />
                  </Nav>
                </ProtectedRoute>
              }
            />

            <Route
              path="/cogsa-safta"
              element={
                <ProtectedRoute>
                  <Nav>
                    <CoGsaSafta />
                  </Nav>
                </ProtectedRoute>
              }
            />

            <Route
              path="/edoc-upload-handm"
              element={
                <ProtectedRoute>
                  <Nav>
                    <EDocUploadHandM />
                  </Nav>
                </ProtectedRoute>
              }
            />

            <Route
              path="/fcr-submission"
              element={
                <ProtectedRoute>
                  <Nav>
                    <FcrSubmission />
                  </Nav>
                </ProtectedRoute>
              }
            />

            <Route
              path="/einvoicing-handm"
              element={
                <ProtectedRoute>
                  <Nav>
                    <EInvoicingHAndM />
                  </Nav>
                </ProtectedRoute>
              }
            />

            <Route
              path="/exp-download"
              element={
                <ProtectedRoute>
                  <Nav>
                    <ExpDownload />
                  </Nav>
                </ProtectedRoute>
              }
            />

            <Route
              path="/exp-duplication"
              element={
                <ProtectedRoute>
                  <Nav>
                    <ExpDuplication />
                  </Nav>
                </ProtectedRoute>
              }
            />

            <Route
              path="/rex-issuance"
              element={
                <ProtectedRoute>
                  <Nav>
                    <RexIssuance />
                  </Nav>
                </ProtectedRoute>
              }
            />
          </Routes>
          {/* </Nav> */}
        </AppContextProvider>
      </BrowserRouter>
    </>
  );
}

export default App;
