<script setup>
import { computed, onBeforeMount, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useDataStore } from '@/stores/dataStore';
import { statusEnum } from '@/data/statusEnum.js';
import { statusUtils } from '@/utils/statusUtils.js';
import Swal from 'sweetalert2';
import ProjectActions from '@/components/projects/ProjectActions.vue';
import TaskFormModal from '@/components/tasks/TaskFormModal.vue';
import TaskDetailsModal from '@/components/tasks/TaskDetailsModal.vue';
import DeveloperTasksView from '@/components/tasks/DeveloperTasksView.vue';
import ManagerTasksView from '@/components/tasks/ManagerTasksView.vue';

const route = useRoute();
const router = useRouter();
const store = useDataStore();

const isDeleting = ref(false);
const isCreatingTask = ref(false);
const isPostingComment = ref(false);
const taskToEdit = ref(null);

const hasBothRoles = computed(() => store.user?.roles?.includes('manager') && store.user?.roles?.includes('developer'));
const hasManagerRole = computed(() => store.user?.roles?.includes('manager') && !store.user?.roles?.includes('developer'));
const hasDeveloperRole = computed(() => store.user?.roles?.includes('developer') && !store.user?.roles?.includes('manager'));

const viewMode = ref(null);
const projectId = route.params.id;

onBeforeMount(() => {
  if (store.user?.roles?.includes('manager')) {
    return;
  }

  if (store.user?.roles?.includes('developer')) {
    const developperHasTasks = store.tasks.some((task) => task.projectId === projectId && task.assignedTo === store.user.id);
    if (!developperHasTasks) {
      router.push({ name: 'home' });
    }
  }
});

watch(
  [hasBothRoles, hasManagerRole, hasDeveloperRole],
  () => {
    if (viewMode.value === null) {
      if (hasBothRoles.value) {
        const savedMode = localStorage.getItem(`projectViewMode_${route.params.id}`);
        viewMode.value = savedMode || 'manager';
      } else if (hasManagerRole.value) {
        viewMode.value = 'manager';
      } else if (hasDeveloperRole.value) {
        viewMode.value = 'developer';
      }
    }
  },
  { immediate: true }
);

const setViewMode = (mode) => {
  viewMode.value = mode;
  localStorage.setItem(`projectViewMode_${route.params.id}`, mode);
};

const handleDelete = async () => {
  isDeleting.value = true;
  try {
    store.deleteProject(projectId);
    await Swal.fire({
      title: 'Success!',
      text: 'Project deleted successfully',
      icon: 'success',
      timer: 2000,
      showConfirmButton: false,
    });
    router.push('/');
  } catch (error) {
    Swal.fire({
      title: 'Error!',
      text: 'Failed to delete project',
      icon: 'error',
    });
  } finally {
    isDeleting.value = false;
  }
};

const handleExport = async () => {
  try {
    let exportedProject = store.getExportProject(projectId);

    const blob = new Blob([JSON.stringify(exportedProject, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;

    link.download = exportedProject.title + '_export.json';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    await Swal.fire({
      title: 'Success!',
      text: 'Porject Exported successfully',
      icon: 'success',
      timer: 2000,
      showConfirmButton: false,
    });
  } catch (error) {
    console.log(error);
    Swal.fire({
      title: 'Error!',
      text: 'Failed to export',
      icon: 'error',
    });
  }
};

const project = computed(() => {
  if (!store.projects || !Array.isArray(store.projects)) return null;
  return store.projects.find((p) => p?.id === projectId);
});

const tasks = computed(() => {
  if (!store.tasks || !Array.isArray(store.tasks)) return [];
  return store.tasks.filter((task) => task?.projectId === projectId);
});

const canManageTasks = computed(() => {
  if (!project.value || !store.user?.id) return false;

  if (hasManagerRole.value || hasBothRoles.value) {
    return project.value?.managerIds?.includes(store.user.id) || false;
  }

  return true;
});

const progessPercentage = computed(() => {
  if (!tasks.value || !Array.isArray(tasks.value) || tasks.value.length === 0) return 0;
  if (!store.status || !Array.isArray(store.status)) return 0;

  let completedTasks = 0;
  for (const task of tasks.value) {
    if (!task) continue;
    const st = statusUtils(store.status, task);
    if (st !== null && st === statusEnum.DONE) {
      completedTasks++;
    }
  }
  return (completedTasks / tasks.value.length) * 100;
});

const projectStatus = computed(() => {
  if (!project.value) return { label: 'Unknown', class: 'bg-secondary', icon: 'bi-question-circle' };
  if (!store.status || !Array.isArray(store.status)) return { label: 'Unknown', class: 'bg-secondary', icon: 'bi-question-circle' };

  const st = store.status.find((s) => s?.id === project.value.status);
  if (!st) return { label: 'Unknown', class: 'bg-secondary', icon: 'bi-question-circle' };

  let cls;
  let icon;

  switch (st.name) {
    case statusEnum.DONE:
      cls = 'bg-success';
      icon = 'bi-check-circle-fill';
      break;
    case statusEnum.CANCELLED:
      cls = 'bg-danger';
      icon = 'bi-x-circle-fill';
      break;
    case statusEnum.IN_PROGRESS:
      cls = 'bg-warning text-dark';
      icon = 'bi-arrow-repeat';
      break;
    case statusEnum.TO_DO:
      cls = 'bg-info text-dark';
      icon = 'bi-clock';
      break;
    default:
      cls = 'bg-primary';
      icon = 'bi-circle';
      break;
  }

  return { label: st.name, class: cls, icon };
});

const projectHealth = computed(() => {
  if (!project.value) return { label: 'Unknown', class: 'bg-secondary', icon: 'bi-question-circle', description: '' };

  if (progessPercentage.value === 100) {
    return {
      label: 'Completed',
      class: 'bg-success',
      icon: 'bi-check-circle-fill',
      description: 'Project completed',
    };
  }

  const today = new Date();
  const endDate = new Date(project.value.endDate);
  const diffTime = endDate - today;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays < 0) {
    return {
      label: 'Delayed',
      class: 'bg-danger',
      icon: 'bi-exclamation-triangle-fill',
      description: `${Math.abs(diffDays)} days overdue`,
    };
  }
  if (diffDays <= 3) {
    return {
      label: 'At Risk',
      class: 'bg-warning text-dark',
      icon: 'bi-exclamation-circle-fill',
      description: `${diffDays} days remaining`,
    };
  }

  return {
    label: 'On Track',
    class: 'bg-success',
    icon: 'bi-check-circle',
    description: `${diffDays} days remaining`,
  };
});

const showModal = ref(false);

function getDefaultStatus() {
  const statusName = hasManagerRole.value ? statusEnum.VALID : statusEnum.PENDING;
  return store.status.find((s) => s.name === statusName)?.id;
}
const newTask = ref({ title: '', description: '', assignedTo: '', status: getDefaultStatus() });
const selectedTask = ref(null);
const newCommentText = ref('');

function openTaskDetails(task) {
  selectedTask.value = task;
}

function handleTaskCreated() {
  showModal.value = false;
}

function handleTaskUpdated() {
  showModal.value = false;
  taskToEdit.value = null;
}

function handleCommentAdded() {}

function handleViewModeChange(mode) {
  setViewMode(mode);
}

function formatDate(isoString) {
  return new Date(isoString).toLocaleString('fr-FR', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' });
}

function openCreateModal() {
  taskToEdit.value = null;
  showModal.value = true;
}

function openEditModal(task) {
  taskToEdit.value = task;
  showModal.value = true;
}
</script>

<template>
  <div class="container mt-4">
    <div v-if="!project" class="alert alert-danger">
      <h4 class="alert-heading">Project not found</h4>
      <p>Project with ID {{ projectId }} does not exist</p>
      <button @click="router.push('/')" class="btn btn-outline-danger">Go back</button>
    </div>

    <div v-else>
      <div class="d-flex justify-content-between align-items-start mb-4">
        <div class="flex-grow-1">
          <div class="d-flex align-items-center mb-3">
            <h1 class="display-6 mb-0 me-3">{{ project.title }}</h1>

            <ProjectActions v-if="project" :project="project" :hasBothRoles="hasBothRoles" :hasManagerRole="hasManagerRole" :isManagerInProject="canManageTasks" :viewMode="viewMode" :isDeleting="isDeleting" @delete="handleDelete" @export="handleExport" @update-view-mode="handleViewModeChange" class="ms-auto" />
          </div>

          <p class="text-muted mb-3">{{ project.description }}</p>

          <div class="d-flex align-items-center text-secondary small">
            <i class="bi bi-calendar-event me-2"></i>
            <span><strong>Timeline:</strong> {{ formatDate(project.startDate) }} → {{ formatDate(project.endDate) }}</span>
          </div>
        </div>
      </div>

      <div v-if="viewMode === 'manager'" class="manager-view">
        <hr />

        <div class="row g-2 mb-3">
          <div class="col-md-6">
            <div class="card border-0 shadow-sm h-100 text-white" :class="projectStatus.class">
              <div class="card-body py-2 px-3">
                <div class="small text-uppercase fw-bold opacity-75 mb-1" style="font-size: 0.7rem; letter-spacing: 0.5px">
                  <i class="bi bi-flag-fill me-1"></i>
                  Project Status
                </div>
                <div class="d-flex align-items-center">
                  <i :class="projectStatus.icon" class="me-2"></i>
                  <span class="fw-bold">{{ projectStatus.label }}</span>
                </div>
              </div>
            </div>
          </div>

          <div class="col-md-6">
            <div class="card border-0 shadow-sm h-100 text-white" :class="projectHealth.class">
              <div class="card-body py-2 px-3">
                <div class="small text-uppercase fw-bold opacity-75 mb-1" style="font-size: 0.7rem; letter-spacing: 0.5px">
                  <i class="bi bi-heart-pulse-fill me-1"></i>
                  Project Health
                </div>
                <div class="d-flex align-items-center">
                  <i :class="projectHealth.icon" class="me-2"></i>
                  <span class="fw-bold">{{ projectHealth.label }}</span>
                </div>
                <small v-if="projectHealth.description" class="d-block mt-1 opacity-85" style="font-size: 0.8rem">
                  {{ projectHealth.description }}
                </small>
              </div>
            </div>
          </div>
        </div>

        <div class="mb-4">
          <div class="d-flex justify-content-between align-items-center mb-2">
            <div>
              <i class="bi bi-list-check me-1"></i>
              <span class="fw-semibold">Overall Progress</span>
            </div>
            <span class="badge bg-primary">{{ Math.round(progessPercentage) }}%</span>
          </div>
          <div class="progress" style="height: 24px">
            <div class="progress-bar progress-bar-striped progress-bar-animated" role="progressbar" :class="projectHealth.class" :style="{ width: progessPercentage + '%' }" :aria-valuenow="progessPercentage" aria-valuemin="0" aria-valuemax="100">
              <span v-if="progessPercentage > 10">{{ Math.round(progessPercentage) }}%</span>
            </div>
          </div>
        </div>

        <hr />
      </div>

      <div class="row">
        <div class="col-12">
          <div class="card bg-light border-0">
            <div class="card-body text-start py-4 px-4">
              <DeveloperTasksView v-if="viewMode === 'developer'" :tasks="tasks" :projectStatus="projectStatus.label" :userId="store.user?.id" @view-task="openTaskDetails" @add-task="openCreateModal" />

              <ManagerTasksView v-else-if="viewMode === 'manager'" :tasks="tasks" :projectStatus="projectStatus.label" :canManageTasks="canManageTasks" @view-task="openTaskDetails" @add-task="openCreateModal" @edit-task="openEditModal" />
            </div>
          </div>
        </div>
      </div>

      <TaskFormModal :isOpen="showModal" :projectId="projectId" :hasBothRoles="hasBothRoles" :hasManagerRole="hasManagerRole" :hasDeveloperRole="hasDeveloperRole" :isCreating="isCreatingTask" :taskToEdit="taskToEdit" @close="showModal = false" @task-created="handleTaskCreated" @task-updated="handleTaskUpdated" />

      <TaskDetailsModal :task="selectedTask" :isOpen="!!selectedTask" :isPostingComment="isPostingComment" @close="selectedTask = null" @comment-added="handleCommentAdded" />
    </div>
  </div>
</template>

<style scoped>
.card {
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.card:hover {
  transform: translateY(-2px);
  box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15) !important;
}
</style>
