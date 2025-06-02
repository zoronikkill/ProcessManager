import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import HomePage from './pages/HomePage';
import ProjectEditor from './pages/ProjectEditor';
import ProjectsPage from './pages/ProjectsPage';
import EmployeesPage from './pages/EmployeesPage';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import EmployeeRegister from './components/Auth/EmployeeRegister';
import ProjectConstructor from './components/ProjectConstructor/ProjectConstructor';
import { userStorage } from './storage';
import './App.css';

const ProtectedRoute = ({ children }) => {
  const isAuthenticated = userStorage.isAuthenticated();
  return isAuthenticated ? children : <Navigate to="/login" />;
};

const AdminRoute = ({ children }) => {
  const currentUser = userStorage.getCurrentUser();
  const isAdmin = currentUser?.role === 'admin';
  return isAdmin ? children : <Navigate to="/projects" />;
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route 
          path="/register-employee" 
          element={
            <AdminRoute>
              <EmployeeRegister />
            </AdminRoute>
          } 
        />
        <Route 
          path="/projects" 
          element={
            <ProtectedRoute>
              <ProjectsPage />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/employees" 
          element={
            <AdminRoute>
              <EmployeesPage />
            </AdminRoute>
          } 
        />
        <Route 
          path="/editor/:projectId?" 
          element={
            <ProtectedRoute>
              <ProjectConstructor />
            </ProtectedRoute>
          } 
        />
        <Route path="/" element={<HomePage />} />
      </Routes>
    </Router>
  );
}

export default App;