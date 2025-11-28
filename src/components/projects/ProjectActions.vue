<script setup>
import Swal from 'sweetalert2';
import { useRouter } from 'vue-router';

const props = defineProps({
  project: {
    type: Object,
    required: true
  },
  hasBothRoles: {
    type: Boolean,
    required: true
  },
  hasManagerRole: {
    type: Boolean,
    required: true
  },
  isManagerInProject: {
    type: Boolean,
    required: true
  },
  viewMode: {
    type: String,
    required: true
  },
  isDeleting: {
    type: Boolean,
    default: false
  }
});

console.log('props', props);

const emit = defineEmits(['delete', 'update-view-mode']);

const router = useRouter();

const handleDelete = async () => {
  const { isConfirmed } = await Swal.fire({
    title: 'Are you sure you want to delete this project?',
    text: 'You won\'t be able to revert this!',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Yes',
    cancelButtonText: 'Cancel'
  });

  if (isConfirmed) {
    emit('delete');
  }
};

const setViewMode = (mode) => {
  emit('update-view-mode', mode);
};
</script>

<template>
  <div class="d-flex flex-wrap gap-2 gap-md-3">
    <div v-if="hasBothRoles" class="d-flex gap-1 gap-sm-2">
      <button 
        @click="setViewMode('developer')" 
        :class="['btn btn-sm', viewMode === 'developer' ? 'btn-primary' : 'btn-outline-primary']"
        aria-label="Switch to developer view"
      >
        <span class="d-inline d-sm-none">👨‍💻</span>
        <span class="d-none d-sm-inline">👨‍💻 Developer</span>
        <span class="d-none d-lg-inline"> View</span>
      </button>
      <button 
        @click="setViewMode('manager')" 
        :class="['btn btn-sm', viewMode === 'manager' ? 'btn-primary' : 'btn-outline-primary']"
        aria-label="Switch to manager view"
      >
        <span class="d-inline d-sm-none">📊</span>
        <span class="d-none d-sm-inline">📊 Manager</span>
        <span class="d-none d-lg-inline"> View</span>
      </button>
    </div>

    <div class="d-flex flex-wrap gap-1 gap-sm-2 align-items-start">
      <div v-if="(hasManagerRole || hasBothRoles) && isManagerInProject" class="d-flex gap-1 gap-sm-2">
        <button 
          @click="router.push(`/projects/${project.id}/update`)" 
          class="btn btn-sm btn-outline-primary"
          aria-label="Edit project"
          :disabled="isDeleting"
        >
          <span class="d-inline d-sm-none">✏️</span>
          <span class="d-none d-sm-inline">✏️ Edit</span>
        </button>
        <button 
          @click="handleDelete" 
          class="btn btn-sm btn-outline-danger"
          aria-label="Delete project"
          :disabled="isDeleting"
        >
          <span class="d-inline d-sm-none">🗑️</span>
          <span class="d-none d-sm-inline">🗑️ Delete</span>
        </button>
      </div>
      
      <button 
        @click="router.push('/')" 
        class="btn btn-sm btn-outline-secondary"
        aria-label="Go to home page"
        :disabled="isDeleting"
      >
        <span class="d-inline d-sm-none">🏠</span>
        <span class="d-none d-sm-inline">🏠 Home</span>
      </button>
    </div>
  </div>
</template>
