import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import HomePage from './pages/HomePage';
import ProjectEditor from './pages/ProjectEditor';
import ProjectsPage from './pages/ProjectsPage';
import EmployeesPage from './pages/EmployeesPage';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import EmployeeRegister from './components/Auth/EmployeeRegister';
import UserManagement from './components/Users/UserManagement';
import { AuthProvider, useAuth } from './contexts/AuthContext.jsx';
import './App.css';

const PrivateRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? children : <Navigate to="/login" />;
};

function AppRoutes() {
  return (
    <Router>
      <AuthProvider>
        <div className="app-container"> 
          <main className="main-content"> 
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/" element={<HomePage />} />

              <Route 
                path="/projects" 
                element={
                  <PrivateRoute>
                    <ProjectsPage />
                  </PrivateRoute>
                } 
              />
              <Route 
                path="/projects/:projectId" 
                element={
                  <PrivateRoute>
                    <ProjectEditor />
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
              <Route 
                path="/register-employee" 
                element={<PrivateRoute><EmployeeRegister /></PrivateRoute>} 
              />
              <Route 
                path="/users" 
                element={<PrivateRoute><UserManagement /></PrivateRoute>} 
              />
            </Routes>
          </main>
        </div>
      </AuthProvider>
    </Router>
  );
}

function App() {
  return <AppRoutes />;
}

export default App;