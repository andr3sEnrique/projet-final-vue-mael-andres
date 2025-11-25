import { defineStore } from 'pinia';
import { seedData } from '../data/seed';

export const useDataStore = defineStore('data', {
  state: () => ({
    user: null,
    projects: JSON.parse(localStorage.getItem('projects')) || seedData.projects,
    tasks: JSON.parse(localStorage.getItem('tasks')) || seedData.tasks,
    currentUser: JSON.parse(localStorage.getItem('currentUser')) || null,
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
      localStorage.setItem("user", JSON.stringify(newUser));

      return true;
    },
    saveToLocalStorage() {
      localStorage.setItem('projects', JSON.stringify(this.projects));
      localStorage.setItem('tasks', JSON.stringify(this.tasks));
      localStorage.setItem('currentUser', JSON.stringify(this.currentUser));
    },

    addProject(project) { this.projects.push(project); this.saveToLocalStorage(); },
    addTask(task) { this.tasks.push(task); this.saveToLocalStorage(); }
  }
});