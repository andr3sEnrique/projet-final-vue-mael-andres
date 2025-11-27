<script setup>
import { computed, ref } from 'vue';
import { useDataStore } from '@/stores/dataStore';

const props = defineProps({
  tasks: {
    type: Array,
    required: true
  },
  canAddTasks: {
    type: Boolean,
    required: true
  }
});

const emit = defineEmits(['add-task', 'filtered-tasks']);

const store = useDataStore();
const searchQuery = ref('');
const selectedStatusId = ref('');

const statusOptions = computed(() => {
  if (!store.status || !Array.isArray(store.status)) return [];
  return store.status.filter(s => 
    ['DONE', 'IN PROGRESS', 'VALID', 'PENDING'].includes(s.name)
  );
});

const filteredTasks = computed(() => {
  let result = [...props.tasks];

  // Filtrar por status
  if (selectedStatusId.value) {
    result = result.filter(task => task.status === selectedStatusId.value);
  }

  // Filtrar por búsqueda (título o descripción)
  if (searchQuery.value.trim()) {
    const query = searchQuery.value.toLowerCase();
    result = result.filter(task => 
      (task.title && task.title.toLowerCase().includes(query)) ||
      (task.description && task.description.toLowerCase().includes(query))
    );
  }

  return result;
});

const applyFilters = () => {
  emit('filtered-tasks', filteredTasks.value);
};

// Emitir tareas filtradas cuando cambien
const handleSearchChange = () => {
  applyFilters();
};

const handleStatusChange = () => {
  applyFilters();
};

const handleAddTask = () => {
  emit('add-task');
};
</script>

<template>
  <div class="task-filters-bar mb-4">
    <div class="row g-3 align-items-end">
      <!-- Input de búsqueda -->
      <div class="col-12 col-md-6">
        <label for="searchInput" class="form-label">
          <i class="bi bi-search me-2"></i>Buscar por título o descripción
        </label>
        <input 
          id="searchInput"
          v-model="searchQuery" 
          type="text" 
          class="form-control"
          placeholder="Escribe para buscar..."
          @input="handleSearchChange"
        />
      </div>

      <!-- Select de status -->
      <div class="col-12 col-md-4">
        <label for="statusSelect" class="form-label">
          <i class="bi bi-funnel me-2"></i>Filtrar por status
        </label>
        <select 
          id="statusSelect"
          v-model="selectedStatusId" 
          class="form-select"
          @change="handleStatusChange"
        >
          <option value="">Todos los status</option>
          <option 
            v-for="status in statusOptions" 
            :key="status.id"
            :value="status.id"
          >
            {{ status.name }}
          </option>
        </select>
      </div>

      <!-- Botón New Task -->
      <div class="col-12 col-md-2 d-flex justify-content-end">
        <button 
          v-if="canAddTasks" 
          class="btn btn-primary w-100"
          @click="handleAddTask"
          aria-label="Create new task"
        >
          <i class="bi bi-plus-lg me-1"></i> New Task
        </button>
      </div>
    </div>

    <!-- Mostrar cantidad de tareas filtradas -->
    <div v-if="searchQuery || selectedStatusId" class="mt-2">
      <small class="text-muted">
        <i class="bi bi-info-circle me-1"></i>
        Se muestran {{ filteredTasks.length }} de {{ tasks.length }} tareas
      </small>
    </div>
  </div>
</template>

<style scoped>
.task-filters-bar {
  background-color: #f8f9fa;
  padding: 1.5rem;
  border-radius: 0.5rem;
  border: 1px solid #dee2e6;
}

.form-label {
  font-weight: 500;
  color: #495057;
  margin-bottom: 0.5rem;
}

.form-control,
.form-select {
  border-color: #dee2e6;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
}

.form-control:focus,
.form-select:focus {
  border-color: #0d6efd;
  box-shadow: 0 0 0 0.25rem rgba(13, 110, 253, 0.25);
}
</style>
