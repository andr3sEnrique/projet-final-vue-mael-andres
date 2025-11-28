import { defineStore } from 'pinia';
import { seedData } from '../data/seed';
import { hashPassword, verifyPassword } from '@/utils/auth';

export const useDataStore = defineStore('data', {
  state: () => ({
    user: JSON.parse(localStorage.getItem('user')) || null,
    managers: JSON.parse(localStorage.getItem('managers')) || seedData.users.filter((u) => u.roles.includes('manager')),
    projects: JSON.parse(localStorage.getItem('projects')) || seedData.projects,
    status: seedData.status,
    tasks: JSON.parse(localStorage.getItem('tasks')) || seedData.tasks,
    currentUser: JSON.parse(localStorage.getItem('currentUser')) || null,
    users: JSON.parse(localStorage.getItem('users')) || seedData.users,
  }),
  getters: {
    isAuthenticated: (state) => !!state.user,
    currentUser: (state) => state.user,
  },
  actions: {
    syncToLocalStorage() {
      localStorage.setItem('user', JSON.stringify(this.user));
      localStorage.setItem('managers', JSON.stringify(this.managers));
      localStorage.setItem('projects', JSON.stringify(this.projects));
      localStorage.setItem('tasks', JSON.stringify(this.tasks));
      localStorage.setItem('users', JSON.stringify(this.users));
    },
    login(email, password) {
      const user = this.users.find((u) => u.email === email);
      if (user) {
        if (!verifyPassword(password, user.password)) return false;
        this.user = user;
        this.syncToLocalStorage();
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
      localStorage.removeItem('user');
    },
    register(name, email, password, roles) {
      const existingUser = this.users.find((user) => user.email === email);
      if (existingUser) {
        return false;
      }

      const newUser = {
        id: crypto.randomUUID(),
        name,
        email,
        password: hashPassword(password),
        roles,
      };

      this.users.push(newUser);
      if (newUser.roles.includes('manager')) {
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

    deleteTask(taskId) {
      this.tasks = this.tasks.filter((task) => task.id !== taskId);
      this.syncToLocalStorage();
    },

    getExportProject(projectId) {
      const project = this.projects.find((p) => p.id === projectId);
      if (!project) {
        return JSON({ erreur: 'Unknow project' });
      }

      const managerNames = this.users.filter((user) => project.managerIds.includes(user.id)).map((user) => user.name);

      const tasks = this.tasks
        .filter((task) => task.projectId === project.id)
        .map(({ title, description, status, comments, assignedTo }) => {
          const user = this.users.find((u) => u.id === assignedTo);
          const statusObj = this.status ? this.status.find((s) => s.id === status) : null;

          const commentsFormatted = comments.map(({ date, content, authorId }) => {
            const author = this.users.find((u) => u.id === authorId);
            return {
              date,
              content,
              author: author ? author.name : 'Auteur inconnu',
            };
          });

          return {
            title,
            description,
            status: statusObj ? statusObj.name : status,
            comments: commentsFormatted || [],
            userAssigned: user ? user.name : 'Non assigné',
          };
        });

      return {
        id: project.id,
        title: project.title,
        description: project.description,
        managers: managerNames || 'Unknow',
        tasks: tasks || 'Unknow',
      };
    },
  },
});
