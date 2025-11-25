import { defineStore } from 'pinia';
import { seedData } from '../data/seed';

export const useDataStore = defineStore('data', {
  state: () => ({
    users: JSON.parse(localStorage.getItem('users')) || seedData.users,
    projects: JSON.parse(localStorage.getItem('projects')) || seedData.projects,
    tasks: JSON.parse(localStorage.getItem('tasks')) || seedData.tasks,
    currentUser: JSON.parse(localStorage.getItem('currentUser')) || null,
  }),
  actions: {
    login(email, password) {
      const user = this.users.find(u => u.email === email && u.password === password);
      if (user) {
        this.currentUser = user;
        this.saveToLocalStorage();
        return true;
      }
      return false;
    },
    logout() {
      this.currentUser = null;
      this.saveToLocalStorage();
    },
    saveToLocalStorage() {
      localStorage.setItem('users', JSON.stringify(this.users));
      localStorage.setItem('projects', JSON.stringify(this.projects));
      localStorage.setItem('tasks', JSON.stringify(this.tasks));
      localStorage.setItem('currentUser', JSON.stringify(this.currentUser));
    },

    addProject(project) { this.projects.push(project); this.saveToLocalStorage(); },
    addTask(task) { this.tasks.push(task); this.saveToLocalStorage(); }
  }
});