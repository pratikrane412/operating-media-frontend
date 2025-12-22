import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login/Login';
import Dashboard from './pages/Dashboard/Dashboard';
import ManageBranch from './pages/ManageBranch/ManageBranch';
import ManageEnquiry from './pages/Enquiry/ManageEnquiry';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/manage-branch" element={<ManageBranch />} />
        <Route path="/branch/:branchId/enquiries" element={<ManageEnquiry />} />
      </Routes>
    </Router>
  );
}

export default App;