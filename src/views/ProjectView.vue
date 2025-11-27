<script setup>
import { computed, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useDataStore } from "@/stores/dataStore";
import TaskView from "./TaskView.vue";
import { statusEnum } from "@/data/statusEnum.js";
import { getStatusName } from "@/utils/getStatusName";
import Swal from 'sweetalert2';

const route = useRoute();
const router = useRouter();
const store = useDataStore();

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
    store.deleteProject(projectId);
    router.push('/');
  }
};

const projectId = route.params.id;
const hasManagerRole = computed(() => store.user?.roles.includes("manager"));

const project = computed(() => store.projects.find((p) => p.id === projectId));
const tasks = computed(() => store.tasks.filter((task) => task.projectId === projectId));

const canAddTasks = computed(() => {
  if (!project.value || !store.user) return false;

  if (hasManagerRole.value) {
    return project.value.managerIds.includes(store.user.id);
  }

  return true;
});


const progessPercentage = computed(() => {
  if (!tasks.value || tasks.value.length === 0) return 0;
  let completedTasks = 0;
  for (const task of tasks.value) {
    const st = getStatusName(store.status, task);
    if (st !== null && st === statusEnum.DONE) {
      completedTasks++;
    }
  }
  return (completedTasks / tasks.value.length) * 100;
});

const projectStatus = computed(() => {
  if (!project.value) return { label: 'Unknown', class: 'bg-secondary', icon: 'bi-question-circle' };

  const st = store.status.find(s => s.id === project.value.status);
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
      description: 'Project completed'
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
      description: `${Math.abs(diffDays)} days overdue`
    };
  }
  if (diffDays <= 3) {
    return {
      label: 'At Risk',
      class: 'bg-warning text-dark',
      icon: 'bi-exclamation-circle-fill',
      description: `${diffDays} days remaining`
    };
  }

  return {
    label: 'On Track',
    class: 'bg-success',
    icon: 'bi-check-circle',
    description: `${diffDays} days remaining`
  };
});

function formatDate(dateString) {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString();
}

const showModal = ref(false);

function getDefaultStatus() {
  const statusName = hasManagerRole.value ? statusEnum.VALID : statusEnum.PENDING;
  return store.status.find(s => s.name === statusName)?.id;
}
const newTask = ref({ title: "", description: "", assignedTo: "", status: getDefaultStatus() });
const selectedTask = ref(null);
const newCommentText = ref("");

function saveTask() {
  if (!newTask.value.title) return;

  const { title, description, assignedTo, status } = newTask.value;
  store.addTask(projectId, title, description, status, assignedTo, "");
  showModal.value = false;
  resetTask();
}

function resetTask() {
  newTask.value = { title: "", description: "", assignedTo: hasManagerRole.value ? "" : store.user?.id || "", status: getDefaultStatus() };
}

function openTaskDetails(task) {
  selectedTask.value = task;
}

function postComment() {
  if (!newCommentText.value.trim()) return;

  store.addComment(selectedTask.value.id, newCommentText.value, store.currentUser.id);
  newCommentText.value = "";
}

function getAuthorName(userId) {
  const user = store.users.find((u) => u.id === userId);
  return user ? user.name : "Inconnu";
}

function formatDate(isoString) {
  return new Date(isoString).toLocaleString("fr-FR", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" });
}
</script>

<template>
  <div class="container mt-4">
    <div v-if="!project" class="alert alert-danger">
      <h4 class="alert-heading">Project not found</h4>
      <p>Project with ID {{ projectId }} does not exist</p>
      <button @click="goBack" class="btn btn-outline-danger">Go back</button>
    </div>

    <div v-else>
      <div class="d-flex justify-content-between align-items-start mb-4">
        <div class="flex-grow-1">
          <div class="d-flex align-items-center mb-3">
            <h1 class="display-6 mb-0 me-3">{{ project.title }}</h1>

            <div v-if="hasManagerRole" class="ms-auto d-flex gap-2">
              <button @click="router.push(`/projects/${project.id}/update`)" class="btn btn-outline-primary">
                ✏️
              </button>
              <button @click="handleDelete" class="btn btn-outline-danger">
                🗑️
              </button>
              <button @click="router.push('/')" class="btn btn-outline-secondary">
                Go Home
              </button>
            </div>
          </div>

          <p class="text-muted mb-3">{{ project.description }}</p>

          <div class="row g-2 mb-3">
            <div class="col-md-6">
              <div class="card border-0 shadow-sm h-100 text-white" :class="projectStatus.class">
                <div class="card-body py-2 px-3">
                  <div class="small text-uppercase fw-bold opacity-75 mb-1" style="font-size: 0.7rem; letter-spacing: 0.5px;">
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
                  <div class="small text-uppercase fw-bold opacity-75 mb-1" style="font-size: 0.7rem; letter-spacing: 0.5px;">
                    <i class="bi bi-heart-pulse-fill me-1"></i>
                    Project Health
                  </div>
                  <div class="d-flex align-items-center">
                    <i :class="projectHealth.icon" class="me-2"></i>
                    <span class="fw-bold">{{ projectHealth.label }}</span>
                  </div>
                  <small v-if="projectHealth.description" class="d-block mt-1 opacity-85" style="font-size: 0.8rem;">
                    {{ projectHealth.description }}
                  </small>
                </div>
              </div>
            </div>
          </div>

          <div class="d-flex align-items-center text-secondary small">
            <i class="bi bi-calendar-event me-2"></i>
            <span><strong>Timeline:</strong> {{ formatDate(project.startDate) }} → {{ formatDate(project.endDate) }}</span>
          </div>
        </div>
      </div>

      <hr />

      <div class="mb-4">
        <div class="d-flex justify-content-between align-items-center mb-2">
          <div>
            <i class="bi bi-list-check me-1"></i>
            <span class="fw-semibold">Overall Progress</span>
          </div>
          <span class="badge bg-primary">{{ Math.round(progessPercentage) }}%</span>
        </div>
        <div class="progress" style="height: 24px;">
          <div
            class="progress-bar progress-bar-striped progress-bar-animated"
            role="progressbar"
            :class="projectHealth.class"
            :style="{ width: progessPercentage + '%' }"
            :aria-valuenow="progessPercentage"
            aria-valuemin="0"
            aria-valuemax="100">
            <span v-if="progessPercentage > 10">{{ Math.round(progessPercentage) }}%</span>
          </div>
        </div>
      </div>

      <hr />

      <div class="row">
        <div class="col-12">
          <div class="card bg-light border-0">
            <div class="card-body text-center py-5">
              <div v-if="tasks?.length > 0" class="text-start">
                <div class="d-flex justify-content-between align-items-center mb-3">
                  <h5 class="mb-0">
                    <i class="bi bi-kanban me-2"></i>
                    Project Tasks
                    <span class="badge bg-secondary ms-2">{{ tasks.length }}</span>
                  </h5>
                  <button v-if="canAddTasks" class="btn btn-primary" @click="showModal = true">
                    <i class="bi bi-plus-lg me-1"></i> New Task
                  </button>
                </div>

                <div class="row row-cols-1 row-cols-md-2 g-3">
                  <div class="col" v-for="task in tasks" :key="task.id">
                    <TaskView :task="task" @view-task="openTaskDetails" />
                  </div>
                </div>
              </div>

              <div v-else>
                <i class="bi bi-inbox text-secondary" style="font-size: 4rem;"></i>
                <h5 class="text-secondary mt-3">No tasks yet</h5>
                <p class="text-muted mb-4">Get started by creating your first task for this project</p>
                <button v-if="canAddTasks" class="btn btn-primary" @click="showModal = true">
                  <i class="bi bi-plus-lg me-1"></i> Create First Task
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div v-if="showModal" class="modal d-block" tabindex="-1" style="background-color: rgba(0,0,0,0.5);" @click.self="showModal = false">
        <div class="modal-dialog modal-dialog-centered">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title">
                <i class="bi bi-plus-circle me-2"></i>New Task
              </h5>
              <button type="button" class="btn-close" @click="showModal = false"></button>
            </div>

            <form @submit.prevent="saveTask">
              <div class="modal-body">
                <div class="mb-3">
                  <label class="form-label fw-semibold">Title *</label>
                  <input
                    v-model="newTask.title"
                    type="text"
                    class="form-control"
                    required
                    placeholder="e.g., Create database schema"
                  />
                </div>

                <div class="mb-3">
                  <label class="form-label fw-semibold">Description</label>
                  <textarea
                    v-model="newTask.description"
                    class="form-control"
                    rows="3"
                    placeholder="Describe the task details..."
                  ></textarea>
                </div>

                    <div v-if="hasManagerRole" class="mb-3">
                      <label class="form-label fw-semibold">Assign to</label>
                      <select v-model="newTask.assignedTo" class="form-select">
                        <option disabled value="">Select a team member...</option>
                        <option v-for="user in store.users" :key="user.id" :value="user.id">{{ user.name }} ({{ user.roles.join(", ") }})</option>
                      </select>
                    </div>

                    <div class="modal-footer">
                      <button type="button" @click="showModal = false" class="btn btn-secondary">Cancel</button>
                      <button type="submit" class="btn btn-success">Create Task</button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
          <div v-if="selectedTask" class="modal-overlay" @click.self="selectedTask = null">
            <div class="modal-card modal-lg">
              <div class="d-flex justify-content-between align-items-start mb-3">
                <h3 class="mb-0">{{ selectedTask.title }}</h3>
                <button @click="selectedTask = null" class="btn-close"></button>
              </div>

              <div class="row">
                <div class="col-md-7 border-end">
                  <h6 class="text-muted">Description</h6>
                  <p>{{ selectedTask.description }}</p>

                  <div class="mt-4">
                    <span class="badge bg-secondary me-2">{{ selectedTask.status }}</span>
                    <small class="text-muted">ID: {{ selectedTask.id }}</small>
                  </div>
                </div>

                <div class="col-md-5">
                  <h6 class="text-muted mb-3">Commentaires</h6>

                  <div class="comments-list mb-3">
                    <div v-if="selectedTask.comments?.length === 0" class="text-center text-muted fst-italic mt-4">Pas encore de commentaires.</div>

                    <div v-else v-for="comment in selectedTask.comments" :key="comment.id" class="comment-item mb-3">
                      <div class="d-flex justify-content-between">
                        <strong class="text-primary small">{{ getAuthorName(comment.authorId) }}</strong>
                        <span class="text-muted x-small" style="font-size: 0.75rem">{{ formatDate(comment.date) }}</span>
                      </div>
                      <div class="bg-light p-2 rounded mt-1 text-dark">
                        {{ comment.content }}
                      </div>
                    </div>
                  </div>

                  <form @submit.prevent="postComment">
                    <div class="input-group">
                      <input v-model="newCommentText" type="text" class="form-control" placeholder="Écrire un commentaire..." required />
                      <button class="btn btn-primary" type="submit"><i class="bi bi-send"></i> Envoyer</button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.card {
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.card:hover {
  transform: translateY(-2px);
  box-shadow: 0 0.5rem 1rem rgba(0,0,0,0.15) !important;
}

.comments-list {
  max-height: 300px;
  overflow-y: auto;
  padding-right: 5px;
}
</style>
