<script setup>
import { useDataStore } from '@/stores/dataStore';
import Swal from 'sweetalert2';
import { computed, ref } from 'vue';
const store = useDataStore();

const fileInput = ref(null);

const hasManagerRole = computed(() => store.user?.roles.includes('manager'));
const projects = store.projects;

const finalProjects = computed(() => {
  if (hasManagerRole.value) {
    return projects;
  }

  return projects.filter((project) => {
    return store.tasks.some((task) => task.projectId === project.id && task.assignedTo === store.user?.id);
  });
});

const triggerImport = () => {
  fileInput.value.click();
};

const handleFileChange = (event) => {
  const file = event.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = (e) => {
    try {
      const jsonContent = JSON.parse(e.target.result);

      if (!jsonContent.title || !jsonContent.tasks) {
        throw new Error('Invalid format');
      }
      store.importProject(jsonContent);

      Swal.fire({
        icon: 'success',
        title: 'Successfully imported',
        text: 'The project we successfully imported',
        timer: 200,
        showConfirmButton: false,
      });
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Impossible to read json file. Check the format',
      });
    } finally {
      event.target.value = '';
    }
  };
  reader.readAsText(file);
};
</script>

<template>
  <div class="container">
    <div class="d-flex flex-column align-items-center">
      <h1 class="display-5 fw-bold text-primary">My Projects</h1>
      <p>Select a project to see its tasks.</p>
    </div>
    <div class="d-flex gap-3 mb-3">
      <router-link v-if="hasManagerRole" :to="{ name: 'add-project' }" class="btn btn-primary mb-3"> Create a new project </router-link>
      <div>
        <input type="file" ref="fileInput" @change="handleFileChange" accept=".json" style="display: none" />
        <button @click="triggerImport" class="btn btn-outline-warning mb-3">
          <span class="d-inline d-sm-none">📥</span>
          <span class="d-none d-sm-inline">📥 Import</span>
        </button>
      </div>
    </div>

    <div v-if="finalProjects.length === 0" class="alert alert-info" role="alert">There are no projects available at this time.</div>

    <div v-else class="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
      <div v-for="project in finalProjects" :key="project.id" class="col">
        <div class="card h-100 shadow-sm hover-shadow">
          <div class="card-body">
            <h5 class="card-title">{{ project.title }}</h5>
            <p class="card-text text-secondary">{{ project.description }}</p>
          </div>
          <div class="card-footer bg-transparent border-top-0">
            <router-link :to="{ name: 'project-detail', params: { id: project.id } }" class="btn btn-outline-primary w-100"> Show Details </router-link>
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
  box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15) !important;
}
</style>
