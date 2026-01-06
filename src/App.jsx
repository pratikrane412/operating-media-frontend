import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute"; // Import the Guard

import Login from "./pages/Login/Login";
import BranchLogin from "./pages/Login/BranchLogin";
import Dashboard from "./pages/Dashboard/Dashboard";
import LeadsView from "./pages/LeadsView/LeadsView";
import LeadsCreate from "./pages/LeadsCreate/LeadsCreate";
import LeadsEdit from "./pages/LeadsEdit/LeadsEdit";
import ManageBatch from "./pages/ManageBatch/ManageBatch";
import ManageCourse from "./pages/ManageCourse/ManageCourse";
import ManageStaff from "./pages/ManageStaff/ManageStaff";
import ManageSalary from "./pages/ManageSalary/ManageSalary";
import ManageStudent from "./pages/ManageStudent/ManageStudent";
import ManageAdmission from "./pages/ManageAdmission/ManageAdmission";

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<BranchLogin />} />

        {/* Auth Required - Standard Dashboard */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        {/* Restricted Routes - Based on your DB perm strings */}
        <Route
          path="/leads-view"
          element={
            <ProtectedRoute permission="view enquiry">
              <LeadsView />
            </ProtectedRoute>
          }
        />
        <Route
          path="/leads-create"
          element={
            <ProtectedRoute permission="add enquiry">
              <LeadsCreate />
            </ProtectedRoute>
          }
        />
        <Route
          path="/leads-edit/:leadId"
          element={
            <ProtectedRoute permission="edit enquiry">
              <LeadsEdit />
            </ProtectedRoute>
          }
        />
        <Route
          path="/manage-batch"
          element={
            <ProtectedRoute permission="view batch">
              <ManageBatch />
            </ProtectedRoute>
          }
        />
        <Route
          path="/manage-course"
          element={
            <ProtectedRoute permission="view course">
              <ManageCourse />
            </ProtectedRoute>
          }
        />
        <Route
          path="/manage-staff"
          element={
            <ProtectedRoute permission="manage staff">
              <ManageStaff />
            </ProtectedRoute>
          }
        />
        <Route
          path="/manage-salary"
          element={
            <ProtectedRoute permission="manage staff sallery">
              <ManageSalary />
            </ProtectedRoute>
          }
        />
        <Route
          path="/manage-student"
          element={
            <ProtectedRoute permission="manage student">
              <ManageStudent />
            </ProtectedRoute>
          }
        />
        <Route
          path="/manage-admission"
          element={
            <ProtectedRoute permission="make admission">
              <ManageAdmission />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
