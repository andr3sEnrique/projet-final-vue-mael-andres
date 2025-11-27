import { defineStore } from "pinia";
import { seedData } from "../data/seed";

export const useDataStore = defineStore("data", {
  state: () => ({
    user: JSON.parse(localStorage.getItem('user')) || null,
    managers: JSON.parse(localStorage.getItem('managers')) || seedData.users.filter(u => u.roles.includes('manager')),
    projects: JSON.parse(localStorage.getItem("projects")) || seedData.projects,
    status: seedData.status,
    tasks: JSON.parse(localStorage.getItem("tasks")) || seedData.tasks,
    currentUser: JSON.parse(localStorage.getItem("currentUser")) || null,
    users: JSON.parse(localStorage.getItem("users")) || seedData.users,
  }),
  getters: {
    isAuthenticated: (state) => !!state.user,
    currentUser: (state) => state.user,
  },
  actions: {
    login(email, password) {
      const user = seedData.users.find((u) => u.email === email && u.password === password);
      if (user) {
        this.user = user;
        localStorage.setItem("user", JSON.stringify(user));
        return true;
      }
      return false;
    },
    deleteProject(projectId) {
      this.projects = this.projects.filter((project) => project.id !== projectId);
      this.tasks = this.tasks.filter(t => t.projectId !== projectId);
      localStorage.setItem("projects", JSON.stringify(this.projects));
      localStorage.setItem("tasks", JSON.stringify(this.tasks));
    },
    updateProject(updated) {
      const index = this.projects.findIndex((p) => p.id === updated.id);
      if (index !== -1) {
        this.projects[index] = updated;
        localStorage.setItem("projects", JSON.stringify(this.projects));
      }
    },
    createProject(project) {
      this.projects.push(project);
      localStorage.setItem("projects", JSON.stringify(this.projects));
      return project;
    },
    logout() {
      this.user = null;
      localStorage.removeItem("user");
    },
    register(name, email, password, roles) {
      const existingUser = seedData.users.find((user) => user.email === email);
      if (existingUser) {
        return false;
      }

      const newUser = {
        id: crypto.randomUUID(),
        name,
        email,
        password,
        roles,
      };

      seedData.users.push(newUser);
      this.user = newUser;
      if (newUser.roles.includes('manager')) {
        this.managers.push(newUser);
        localStorage.setItem('managers', JSON.stringify(this.managers));
      }
      localStorage.setItem("user", JSON.stringify(newUser));

      return true;
    },
    addTask(projectId, title, description, status, assignedTo, comments) {
      const newTask = {
        id: crypto.randomUUID(),
        projectId,
        title,
        description,
        status,
        assignedTo,
        comments,
      };

      this.tasks.push(newTask);
    },
  },
});
