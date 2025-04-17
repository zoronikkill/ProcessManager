import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import ProjectEditor from './pages/ProjectEditor';
import ProjectsPage from './pages/ProjectsPage';
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/projects" element={<ProjectsPage />} />
        <Route path="/editor/:projectId" element={<ProjectEditor />} />
        {/* <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} /> */}
        <Route path="/" element={<HomePage />} />
        <Route path="/editor" element={<ProjectEditor />} />
      </Routes>
    </Router>
  );
}

export default App;