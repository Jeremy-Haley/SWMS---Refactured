import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import App from './App';
import { WorkerSignOffPage } from './Pages/WorkerSignOffPage';
import './index.css';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Router>
      <Routes>
        {/* ✅ FIXED: Specific routes MUST come before wildcard routes */}
        <Route path="/sign-off/:swmsId" element={<WorkerSignOffPage />} />
        <Route path="/*" element={<App />} />
      </Routes>
    </Router>
  </React.StrictMode>
);