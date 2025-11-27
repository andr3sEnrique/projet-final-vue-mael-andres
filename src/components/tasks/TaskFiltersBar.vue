<script setup>
import { computed, ref } from 'vue';
import { useDataStore } from '@/stores/dataStore';

const props = defineProps({
  tasks: {
    type: Array,
    required: true
  },
  canManageTasks: {
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

  if (selectedStatusId.value) {
    result = result.filter(task => task.status === selectedStatusId.value);
  }

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
      <div class="col-12 col-md-6">
        <label for="searchInput" class="form-label">
          <i class="bi bi-search me-2"></i>Search by title or description
        </label>
        <input 
          id="searchInput"
          v-model="searchQuery" 
          type="text" 
          class="form-control"
          placeholder="Type to search..."
          @input="handleSearchChange"
        />
      </div>

      <div class="col-12 col-md-4">
        <label for="statusSelect" class="form-label">
          <i class="bi bi-funnel me-2"></i>Filter by status
        </label>
        <select 
          id="statusSelect"
          v-model="selectedStatusId" 
          class="form-select"
          @change="handleStatusChange"
        >
          <option value="">All</option>
          <option 
            v-for="status in statusOptions" 
            :key="status.id"
            :value="status.id"
          >
            {{ status.name }}
          </option>
        </select>
      </div>

      <div class="col-12 col-md-2 d-flex justify-content-end">
        <button 
          v-if="canManageTasks"
          class="btn btn-primary w-100"
          @click="handleAddTask"
          aria-label="Create new task"
        >
          <i class="bi bi-plus-lg me-1"></i> New Task
        </button>
      </div>
    </div>

    <div v-if="searchQuery || selectedStatusId" class="mt-2">
      <small class="text-muted">
        <i class="bi bi-info-circle me-1"></i>
        Showing {{ filteredTasks.length }} of {{ tasks.length }} tasks
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
