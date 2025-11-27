import { defineStore } from "pinia";
import { seedData } from "../data/seed";

export const useDataStore = defineStore("data", {
  state: () => ({
    user: JSON.parse(localStorage.getItem("user")) || null,
    managers: JSON.parse(localStorage.getItem("managers")) || seedData.users.filter((u) => u.roles.includes("manager")),
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
    syncToLocalStorage() {
      localStorage.setItem("user", JSON.stringify(this.user));
      localStorage.setItem("managers", JSON.stringify(this.managers));
      localStorage.setItem("projects", JSON.stringify(this.projects));
      localStorage.setItem("tasks", JSON.stringify(this.tasks));
      localStorage.setItem("users", JSON.stringify(this.users));
    },
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
      this.tasks = this.tasks.filter((t) => t.projectId !== projectId);
      this.syncToLocalStorage();
    },
    updateProject(updated) {
      const index = this.projects.findIndex((p) => p.id === updated.id);
      if (index !== -1) {
        this.projects[index] = updated;
        this.syncToLocalStorage();
      }
    },
    createProject(project) {
      this.projects.push(project);
      this.syncToLocalStorage();
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
      this.users.push(newUser);
      this.user = newUser;
      if (newUser.roles.includes("manager")) {
        this.managers.push(newUser);
      }
      this.syncToLocalStorage();

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
        comments: comments || [],
      };

      this.tasks.push(newTask);
      this.syncToLocalStorage();
    },

    addComment(taskId, content, userId) {
      const task = this.tasks?.find((t) => t.id === taskId);

      if (!task) return;

      const newComment = {
        id: String(Date.now()),
        content,
        authorId: userId,
        date: new Date().toISOString(),
      };

      if (!task.comments) task.comments = [];
      task.comments.push(newComment);
      this.syncToLocalStorage();
    },

    updateTask(updatedTask) {
      const taskIndex = this.tasks.findIndex((t) => t.id === updatedTask.id);
      if (!taskIndex) return;
      this.tasks[taskIndex] = { ...this.tasks[taskIndex], ...updatedTask };
      this.syncToLocalStorage();
    },

    updateTaskStatus(taskId, newStatus) {
      const task = this.tasks?.find((t) => t.id === taskId);

      if (!task) return false;

      task.status = newStatus;
      this.syncToLocalStorage();
      return true;
    },
  },
});
