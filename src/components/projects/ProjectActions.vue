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
  <div class="d-flex gap-2">
    <div v-if="hasBothRoles" class="d-flex gap-2 me-3">
      <button 
        @click="setViewMode('developer')" 
        :class="['btn', viewMode === 'developer' ? 'btn-primary' : 'btn-outline-primary']"
        aria-label="Switch to developer view"
      >
        👨‍💻 Developer View
      </button>
      <button 
        @click="setViewMode('manager')" 
        :class="['btn', viewMode === 'manager' ? 'btn-primary' : 'btn-outline-primary']"
        aria-label="Switch to manager view"
      >
        📊 Manager View
      </button>
    </div>

    <div v-if="(hasManagerRole || hasBothRoles) && isManagerInProject" class="d-flex gap-2">
      <button 
        @click="router.push(`/projects/${project.id}/update`)" 
        class="btn btn-outline-primary"
        aria-label="Edit project"
        :disabled="isDeleting"
      >
        ✏️
      </button>
      <button 
        @click="handleDelete" 
        class="btn btn-outline-danger"
        aria-label="Delete project"
        :disabled="isDeleting"
      >
        🗑️
      </button>
      <button 
        @click="router.push('/')" 
        class="btn btn-outline-secondary"
        aria-label="Go to home page"
        :disabled="isDeleting"
      >
        Go Home
      </button>
    </div>
  </div>
</template>
