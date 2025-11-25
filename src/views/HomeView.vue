<script setup>
  import { useDataStore } from '@/stores/dataStore';
  const store = useDataStore();

  const projects = store.projects;
</script>

<template>
  <div class="container">
    <div class="d-flex flex-column align-items-center">
      <h1 class="display-5 fw-bold text-primary">My Projects</h1>
      <p class="text-muted">Select a project to see its tasks.</p>
    </div>

    <div v-if="projects.length === 0" class="alert alert-info" role="alert">
      There are no projects available at this time.
    </div>

    <div v-else class="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
      <div v-for="project in projects" :key="project.id" class="col">
        <div class="card h-100 shadow-sm hover-shadow">
          <div class="card-body">
            <h5 class="card-title">{{ project.title }}</h5>
            <p class="card-text text-secondary">{{ project.description }}</p>
          </div>
          <div class="card-footer bg-transparent border-top-0">
            <button class="btn btn-outline-primary w-100">
              Show Details
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.hover-shadow {
  transition: box-shadow 0.3s ease-in-out;
}
.hover-shadow:hover {
  box-shadow: 0 .5rem 1rem rgba(0,0,0,.15)!important;
}
</style>