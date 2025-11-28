<script setup>
import { RouterView, useRoute } from "vue-router";
import TheNavbar from './components/TheNavbar.vue';
import { ref, onMounted } from "vue";

const route = useRoute();
const isDarkMode = ref(false);

onMounted(() => {
  const saved = localStorage.getItem("theme");
  if (saved === "dark") {
    isDarkMode.value = true;
    document.body.classList.add("dark-mode");
  }
});

const toggleTheme = () => {
  isDarkMode.value = !isDarkMode.value;

  if (isDarkMode.value) {
    document.body.classList.add("dark-mode");
    localStorage.setItem("theme", "dark");
  } else {
    document.body.classList.remove("dark-mode");
    localStorage.setItem("theme", "light");
  }
};
</script>

<template>
  <header>
    <TheNavbar
      v-if="route.name !== 'login' && route.name !== 'register'"
      :is-dark="isDarkMode"
      @toggle-theme="toggleTheme"
    />
  </header>

  <RouterView />
</template>
