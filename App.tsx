import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";

import Header from "./components/Header";
import StandardFooter from "./components/StandardFooter";

// Import pages
import Dashboard from "./pages/Dashboard";
import TopCandidates from "./pages/TopCandidates";
import Chatbot from "./pages/Chatbot";
import Upload from "./pages/Upload";
import JobManagement from "./pages/JobManagement";
import CandidateArchive from "./pages/CandidateArchive";
import AdminLogin from "./pages/AdminLogin";

const App: React.FC = () => {
  return (
    <Router>
      <div className="App">
        <Header />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/candidates" element={<TopCandidates />} />
            <Route path="/chatbot" element={<Chatbot />} />
            <Route path="/upload" element={<Upload />} />
            <Route path="/jobs" element={<JobManagement />} />
            <Route path="/archive" element={<CandidateArchive />} />
            <Route path="/login" element={<AdminLogin />} />
          </Routes>
        </main>
        <StandardFooter />
      </div>
    </Router>
  );
};

export default App;
