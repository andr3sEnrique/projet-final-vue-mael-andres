<script setup>
import { useDataStore } from "@/stores/dataStore";
import { useRouter } from "vue-router";

const props = defineProps({
  isDark: Boolean,
});
const store = useDataStore();
const router = useRouter();

function handleLogout() {
  store.logout();
  router.push("/login");
}

const emit = defineEmits(["toggle-theme"]);
</script>

<template>
  <nav
    class="navbar navbar-expand-lg"
    :class="props.isDark ? 'navbar-dark bg-dark' : 'navbar-light bg-light'"
  >
    <div class="container">
      <router-link class="navbar-brand d-flex align-items-center" :to="{ name: 'home' }">
        <i class="bi bi-kanban me-2"></i> Projects Management
      </router-link>

      <button
        class="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbarContent"
        aria-controls="navbarContent"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span class="navbar-toggler-icon"></span>
      </button>

      <div class="collapse navbar-collapse" id="navbarContent">
        <ul class="navbar-nav ms-auto mb-2 mb-lg-0 align-items-center">
          <li v-if="store.user" class="nav-item me-2">
            <span class="nav-link">
              Hi, <strong>{{ store.user.name }}</strong>
            </span>
          </li>

          <li class="nav-item me-2">
            <button class="btn btn-outline-secondary btn-sm mb-1" @click="emit('toggle-theme')">
              <i v-if="props.isDark" class="bi bi-sun me-1"></i>
              <i v-else class="bi bi-moon me-1"></i>
              {{ props.isDark ? 'Light Mode' : 'Dark Mode' }}
            </button>
          </li>

          <li v-if="store.user" class="nav-item">
            <button @click="handleLogout" class="btn btn-outline-danger btn-sm">
              <i class="bi bi-box-arrow-right me-1"></i> Logout
            </button>
          </li>
          <li v-else class="nav-item">
            <router-link to="/login" class="btn btn-primary btn-sm">
              <i class="bi bi-box-arrow-in-right me-1"></i> Login
            </router-link>
          </li>
        </ul>
      </div>
    </div>
  </nav>
</template>
