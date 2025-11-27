<script setup>
import TaskView from '@/views/TaskView.vue';

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

const emit = defineEmits(['view-task', 'add-task']);
</script>

<template>
  <div class="text-start">
    <div v-if="tasks.length > 0">
      <div class="d-flex justify-content-between align-items-center mb-3">
        <h5 class="mb-0">
          <i class="bi bi-kanban me-2"></i>
          Project Tasks
          <span class="badge bg-secondary ms-2">{{ tasks.length }}</span>
        </h5>
        <button v-if="canAddTasks" class="btn btn-primary" @click="emit('add-task')" aria-label="Create new task">
          <i class="bi bi-plus-lg me-1"></i> New Task
        </button>
      </div>

      <div class="row row-cols-1 row-cols-md-2 g-3">
        <div class="col" v-for="task in tasks" :key="task?.id">
          <TaskView v-if="task" :task="task" @view-task="emit('view-task', $event)" />
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
