<script setup>
import { computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useDataStore } from '@/stores/dataStore';

const route = useRoute();
const router = useRouter();
const store = useDataStore();

const projectId = route.params.id;
const project = computed(() => store.projects.find(p => p.id === projectId));

const goBack = () => router.push('/');
</script>

<template>
    <div class="container mt-4">
      
      <div v-if="!project" class="alert alert-danger">
        <h4 class="alert-heading">Project not found</h4>
        <p>Project with ID {{ projectId }} does not exist</p>
        <button @click="goBack" class="btn btn-outline-danger">Go back</button>
      </div>
  
      <div v-else>
        <div class="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h1 class="display-6">{{ project.title }}</h1>
            <p class="text-muted">{{ project.description }}</p>
          </div>
          <button @click="goBack" class="btn btn-outline-secondary">
            <i class="bi bi-arrow-left"></i> Go back
          </button>
        </div>
  
        <hr>
  
        <div class="row">
          <div class="col-12">
             <div class="card bg-light border-0">
               <div class="card-body text-center py-5">
                 <h5 class="text-secondary">Aquí irán las tareas del proyecto</h5>
                 <p>ID del proyecto actual: <strong>{{ project.id }}</strong></p>
                 
                 <button class="btn btn-primary mt-3">
                   + Nueva Tarea
                 </button>
               </div>
             </div>
          </div>
        </div>
  
      </div>
    </div>
  </template>