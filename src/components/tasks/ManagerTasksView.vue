<script setup>
import { ref } from 'vue';
import TaskView from '@/views/TaskView.vue';
import TaskFiltersBar from '../tasks/TaskFiltersBar.vue';

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

const emit = defineEmits(['view-task', 'add-task', 'status-changed']);

const filteredTasks = ref([]);

const handleFilteredTasks = (tasks) => {
  filteredTasks.value = tasks;
};

const displayTasks = () => {
  return filteredTasks.value.length > 0 ? filteredTasks.value : props.tasks;
};
</script>

<template>
  <div class="text-start">
    <TaskFiltersBar 
      :tasks="props.tasks"
      :canAddTasks="canAddTasks"
      @add-task="emit('add-task')"
      @filtered-tasks="handleFilteredTasks"
    />

    <div v-if="displayTasks().length > 0">
      <div class="d-flex justify-content-between align-items-center mb-3">
        <h5 class="mb-0">
          <i class="bi bi-kanban me-2"></i>
          Project Tasks
          <span class="badge bg-secondary ms-2">{{ displayTasks().length }}</span>
        </h5>
      </div>

      <div class="row row-cols-1 row-cols-md-2 g-3">
        <div class="col" v-for="task in displayTasks()" :key="task?.id">
          <TaskView v-if="task" :task="task" view-mode="manager" @view-task="emit('view-task', $event)" :canEdit="true" @edit-task="$emit('edit-task', $event)" @status-changed="emit('status-changed', $event)" />
        </div>
      </div>
    </div>

    <div v-else class="text-center py-5">
      <i class="bi bi-inbox text-secondary" style="font-size: 4rem;"></i>
      <h5 class="text-secondary mt-3">No tasks yet</h5>
      <p class="text-muted mb-4">Get started by creating your first task for this project</p>
      <button v-if="canAddTasks" class="btn btn-primary" @click="emit('add-task')" aria-label="Create first task">
        <i class="bi bi-plus-lg me-1"></i> Create First Task
      </button>
    </div>
  </div>
</template>
