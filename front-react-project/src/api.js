import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8000/api/',
  timeout: 10000,
});

api.interceptors.request.use(config => {
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default {
  getProjects() {
    return api.get('projects/');
  },
  getProject(id) {
    return api.get(`projects/${id}/`);
  },
  saveProject(data) {
    return api.post('projects/', data);
  },
  updateProject(id, data) {
    return api.put(`projects/${id}/`, data);
  },
  deleteProject(id) {
    return api.delete(`projects/${id}/`);
  },
  
  getEmployees() {
    return api.get('employees/');
  },
  getEmployee(id) {
    return api.get(`employees/${id}/`);
  },
  createEmployee(data) {
    return api.post('employees/', data);
  },
  updateEmployee(id, data) {
    return api.put(`employees/${id}/`, data);
  },
  deleteEmployee(id) {
    return api.delete(`employees/${id}/`);
  },
  
  login(credentials) {
    return api.post('auth/login/', credentials);
  },
  register(userData) {
    return api.post('auth/register/', userData);
  },
  refreshToken() {
    const refresh = localStorage.getItem('refresh_token');
    return api.post('auth/token/refresh/', { refresh });
  }
};