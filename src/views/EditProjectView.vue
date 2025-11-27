<script setup>
import { useRoute, useRouter } from "vue-router";
import { useDataStore } from "@/stores/dataStore";
import ProjectForm from "@/components/projects/ProjectForm.vue";
import { onBeforeMount } from "vue";

const route = useRoute();
const store = useDataStore();
const router = useRouter();

onBeforeMount(() => {
  const isManagerInProject = store.projects.some(p => p.managerIds.includes(store.user.id) && p.id === route.params.id);
  if (!isManagerInProject) {
    router.push({ name: 'home' });
  }
})

const project = store.projects.find(p => p.id === route.params.id);
</script>

<template>
  <ProjectForm mode="edit" :project="project" />
</template>
