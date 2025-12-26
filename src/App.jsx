import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login/Login";
import BranchLogin from "./pages/Login/BranchLogin";
import Dashboard from "./pages/Dashboard/Dashboard";
import LeadsView from "./pages/LeadsView/LeadsView";
import LeadsCreate from "./pages/LeadsCreate/LeadsCreate";
import LeadsEdit from "./pages/LeadsEdit/LeadsEdit";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/admin" element={<Login />} />
        <Route path="/login" element={<BranchLogin />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/leads-view" element={<LeadsView />} />
        <Route path="/leads-create" element={<LeadsCreate />} />
        <Route path="/leads-edit/:leadId" element={<LeadsEdit />} />
      </Routes>
    </Router>
  );
}

export default App;
