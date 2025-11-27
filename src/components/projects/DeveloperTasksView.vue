<script setup>
import { computed } from 'vue';
import TaskView from '@/views/TaskView.vue';
const props = defineProps({
  tasks: {
    type: Array,
    required: true
  },
  userId: {
    type: String,
    default: null
  },
  canAddTasks: {
    type: Boolean,
    required: true
  }
});

const emit = defineEmits(['view-task', 'add-task']);

const myAssignedTasks = computed(() => {
  if (!props.userId) return [];
  return props.tasks.filter((task) => task?.assignedTo === props.userId);
});

const otherTasks = computed(() => {
  if (!props.userId) return props.tasks;
  return props.tasks.filter((task) => task?.assignedTo !== props.userId);
});
</script>

<template>
  <div class="text-start">
    <div v-if="myAssignedTasks.length > 0" class="mb-5">
      <div class="d-flex justify-content-between align-items-center mb-3">
        <h5 class="mb-0">
          <i class="bi bi-person-check me-2"></i>
          My Assigned Tasks
          <span class="badge bg-primary ms-2">{{ myAssignedTasks.length }}</span>
        </h5>
        <button v-if="canAddTasks" class="btn btn-primary" @click="emit('add-task')" aria-label="Create new task">
          <i class="bi bi-plus-lg me-1"></i> New Task
        </button>
      </div>
      <div class="row row-cols-1 row-cols-md-2 g-3">
        <div class="col" v-for="task in myAssignedTasks" :key="task?.id">
          <TaskView v-if="task" :task="task" @view-task="emit('view-task', $event)" />
        </div>
      </div>
  
    </div>

    <div v-if="otherTasks.length > 0">
      <div class="d-flex justify-content-between align-items-center mb-3">
        <h5 class="mb-0">
          <i class="bi bi-kanban me-2"></i>
          Other Tasks
          <span class="badge bg-secondary ms-2">{{ otherTasks.length }}</span>
        </h5>
      </div>
      <div class="row row-cols-1 row-cols-md-2 g-3">
        <div class="col" v-for="task in otherTasks" :key="task?.id">
          <TaskView v-if="task" :task="task" @view-task="emit('view-task', $event)" />
        </div>
      </div>
    </div>

    <div v-if="tasks.length === 0" class="text-center py-5">
      <i class="bi bi-inbox text-secondary" style="font-size: 4rem;"></i>
      <h5 class="text-secondary mt-3">No tasks yet</h5>
      <p class="text-muted mb-4">Get started by creating your first task for this project</p>
      <button v-if="canAddTasks" class="btn btn-primary" @click="emit('add-task')" aria-label="Create first task">
        <i class="bi bi-plus-lg me-1"></i> Create First Task
      </button>
    </div>
  </div>
</template>
