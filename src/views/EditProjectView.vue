<script setup>
import { useRoute } from "vue-router";
import { useDataStore } from "@/stores/dataStore";
import ProjectForm from "@/components/projects/ProjectForm.vue";

const route = useRoute();
const store = useDataStore();

const project = store.projects.find(p => p.id === route.params.id);
</script>

<template>
  <ProjectForm mode="edit" :project="project" />
</template>
