import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import ProjectEditor from './pages/ProjectEditor';
import './App.module.scss';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/editor" element={<ProjectEditor />} />
        <Route path="/projects" element={<div>Страница проектов (в разработке)</div>} />
      </Routes>
    </Router>
  );
}

export default App;