import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login/Login';
import Dashboard from './pages/Dashboard/Dashboard';
import LeadsView from './pages/LeadsView/LeadsView';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/admin" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/leads-view" element={<LeadsView />} /> 
      </Routes>
    </Router>
  );
}

export default App;