import { defineStore } from "pinia";
import { seedData } from "../data/seed";

export const useDataStore = defineStore("data", {
  state: () => ({
    user: null,
    projects: JSON.parse(localStorage.getItem("projects")) || seedData.projects,
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
    createProject(title, description, managerIds) {
      const project = {
        id: crypto.randomUUID(),
        title,
        description,
        managerIds,
        tasks: [],
      };
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
    },
  },
});
