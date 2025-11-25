<script setup>
import { RouterView, useRoute } from "vue-router";
import TheNavbar from './components/TheNavbar.vue';
const route = useRoute()
</script>

<template>
  <header>
    <TheNavbar v-if="route.name !== 'login' && route.name !== 'register'" />
  </header>

  <RouterView />
</template>

<style scoped></style>
