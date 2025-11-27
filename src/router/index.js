import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";
import LoginView from "../views/LoginView.vue";
import RegisterView from "@/views/RegisterView.vue";
import ProjectView from '../views/ProjectView.vue';
import CreateProjectView from "@/views/CreateProjectView.vue";
import EditProjectView from "@/views/EditProjectView.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: "/", name: "home", component: HomeView },
    { path: "/login", name: "login", component: LoginView },
    { path: "/register", name: "register", component: RegisterView },
    { path: "/projects/create", name: "add-project", component: CreateProjectView },
    { path: '/projects/:id/update', name: 'update-project', component: EditProjectView },
    { path: '/projects/:id', name: 'project-detail', component: ProjectView }

  ],
});

router.beforeEach((to, from, next) => {
  const rawUser = localStorage.getItem("user");
  const user = rawUser ? JSON.parse(rawUser) : null;
  const isAuth = !!user;

  if (!isAuth && to.name !== 'login' && to.name !== 'register') {
    return next({ name: 'login' });
  }

  if (isAuth && (to.name === 'login' || to.name === 'register')) {
    return next({ name: 'home' });
  }

  if (isAuth && !user.roles.includes('manager') && to.name === 'add-project') {
    return next({ name: 'home' });
  }
  next();
});

export default router;
