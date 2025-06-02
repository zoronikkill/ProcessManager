export const userStorage = {
  getCurrentUser: () => {
    return JSON.parse(localStorage.getItem('currentUser'));
  },

  getToken: () => {
    return localStorage.getItem('token');
  },

  isAuthenticated: () => {
    return !!localStorage.getItem('token');
  },

  logout: () => {
    localStorage.removeItem('currentUser');
    localStorage.removeItem('token');
  }
};

export const projectStorage = {
  getProjects: () => {
    return JSON.parse(localStorage.getItem('projects') || '[]');
  },

  getProject: (id) => {
    const projects = JSON.parse(localStorage.getItem('projects') || '[]');
    return projects.find(project => project.id === id);
  },

  createProject: (project) => {
    const projects = JSON.parse(localStorage.getItem('projects') || '[]');
    const newProject = {
      ...project,
      id: projects.length + 1,
      created_at: new Date().toISOString(),
      user_id: userStorage.getCurrentUser()?.id
    };
    projects.push(newProject);
    localStorage.setItem('projects', JSON.stringify(projects));
    return newProject;
  },

  updateProject: (id, updatedData) => {
    const projects = JSON.parse(localStorage.getItem('projects') || '[]');
    const index = projects.findIndex(project => project.id === id);
    if (index !== -1) {
      projects[index] = { ...projects[index], ...updatedData };
      localStorage.setItem('projects', JSON.stringify(projects));
      return projects[index];
    }
    return null;
  },

  deleteProject: (id) => {
    const projects = JSON.parse(localStorage.getItem('projects') || '[]');
    const filteredProjects = projects.filter(project => project.id !== id);
    localStorage.setItem('projects', JSON.stringify(filteredProjects));
  }
};

export const taskStorage = {
  getTasks: (projectId) => {
    const tasks = JSON.parse(localStorage.getItem('tasks') || '[]');
    return tasks.filter(task => task.project_id === projectId);
  },

  createTask: (task) => {
    const tasks = JSON.parse(localStorage.getItem('tasks') || '[]');
    const newTask = {
      ...task,
      id: tasks.length + 1,
      created_at: new Date().toISOString(),
      status: 'new'
    };
    tasks.push(newTask);
    localStorage.setItem('tasks', JSON.stringify(tasks));
    return newTask;
  },

  updateTask: (id, updatedData) => {
    const tasks = JSON.parse(localStorage.getItem('tasks') || '[]');
    const index = tasks.findIndex(task => task.id === id);
    if (index !== -1) {
      tasks[index] = { ...tasks[index], ...updatedData };
      localStorage.setItem('tasks', JSON.stringify(tasks));
      return tasks[index];
    }
    return null;
  },

  deleteTask: (id) => {
    const tasks = JSON.parse(localStorage.getItem('tasks') || '[]');
    const filteredTasks = tasks.filter(task => task.id !== id);
    localStorage.setItem('tasks', JSON.stringify(filteredTasks));
  }
}; 