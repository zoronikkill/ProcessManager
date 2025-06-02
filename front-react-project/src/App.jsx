import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import HomePage from './pages/HomePage';
import ProjectEditor from './pages/ProjectEditor';
import ProjectsPage from './pages/ProjectsPage';
import EmployeesPage from './pages/EmployeesPage';
import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import { AuthProvider, useAuth } from './contexts/AuthContext.jsx';
import './App.css';

// Компонент для защищенных маршрутов
const PrivateRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? children : <Navigate to="/login" />;
};

function AppRoutes() {
  return (
    <Router>
      {/* Обертка для flex layout */}
      <div className="app-container"> 
        {/* Основной контент */}
        <main className="main-content"> 
          <Routes>
            {/* Публичные маршруты */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/" element={<HomePage />} />

            {/* Защищенные маршруты */}
            <Route 
              path="/projects" 
              element={
                <PrivateRoute>
                  <ProjectsPage />
                </PrivateRoute>
              } 
            />
            <Route 
              path="/editor/:projectId" 
              element={<PrivateRoute><ProjectEditor /></PrivateRoute>} 
            />
            <Route 
              path="/editor" 
              element={<PrivateRoute><ProjectEditor /></PrivateRoute>} 
            />
            <Route 
              path="/employees" 
              element={<PrivateRoute><EmployeesPage /></PrivateRoute>} 
            />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  );
}

export default App;