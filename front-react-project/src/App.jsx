import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import ProjectEditor from './pages/ProjectEditor';
import ProjectsPage from './pages/ProjectsPage';
import EmployeesPage from './pages/EmployeesPage';
import Header from './components/Header/Header'; // Импорт Header
import Footer from './components/Footer/Footer'; // Импорт Footer
import './App.css';

function App() {
  return (
    <Router>
      {/* Обертка для flex layout */}
      <div className="app-container"> 
        <Header />
        {/* Основной контент */}
        <main className="main-content"> 
          <Routes>
            <Route path="/projects" element={<ProjectsPage />} />
            <Route path="/editor/:projectId" element={<ProjectEditor />} />
            <Route path="/employees" element={<EmployeesPage />} />
            {/* <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} /> */}
            <Route path="/" element={<HomePage />} />
            <Route path="/editor" element={<ProjectEditor />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;