<script setup>
import { computed, ref, onMounted, onUnmounted } from "vue";
import { useDataStore } from "@/stores/dataStore";
import {getStatusColor, statusUtils} from "@/utils/statusUtils.js";
import { getAvailableStatusTransitions } from "@/utils/statusTransitions";
import { statusEnum } from "@/data/statusEnum.js";
import Swal from "sweetalert2";
import { isInvalidProjectStatus } from "@/utils/statusUtils.js";

const props = defineProps({
  task: {
    type: Object,
    required: true,
  },
  canManageTasks: {
    type: Boolean,
    required: true
  },
  viewMode: {
    type: String,
    default: "developer",
    validator: (value) => ["developer", "manager"].includes(value),
  },
  projectStatus: {
    type: String,
    required: true
  }
});

const emit = defineEmits(["view-task", "status-changed", "edit-task", "delete-task"]);

const store = useDataStore();
const showStatusDropdown = ref(false);

const assignedUser = computed(() => {
  return store.users?.find((u) => u.id === props.task.assignedTo);
});

const statusName = computed(() => statusUtils(store.status, props.task));

const statusBadgeClass = computed(() => getStatusColor(statusName.value));

const userRole = computed(() => {
  return props.viewMode;
});

const currentStatusName = computed(() => {
  const statusObj = store.status?.find((s) => s.id === props.task.status);
  return statusObj?.name || null;
});

const availableStatusTransitions = computed(() => {
  if (!userRole.value || !currentStatusName.value) return [];
  return getAvailableStatusTransitions(currentStatusName.value, userRole.value);
});

const availableStatusObjects = computed(() => {
  return availableStatusTransitions.value.map((statusName) => store.status.find((s) => s.name === statusName)).filter((s) => s !== undefined);
});

const canChangeStatus = computed(() => {
  return availableStatusTransitions.value.length > 0;
});

const canClickStatus = computed(() => {
  return !isInvalidProjectStatus(props.projectStatus) && canChangeStatus.value;
});

function handleStatusClick() {
  if (isInvalidProjectStatus(props.projectStatus)) {
    return;
  }
  
  if (!canChangeStatus.value) {
    Swal.fire({
      title: "Not Allowed!",
      text: "You cannot change the status of this task from its current status",
      icon: "info",
      timer: 2000,
      showConfirmButton: false,
    });
    return;
  }
  showStatusDropdown.value = !showStatusDropdown.value;
}

async function handleStatusChange(newStatusId) {
  const newStatusObj = store.status.find((s) => s.id === newStatusId);
  if (!newStatusObj) return;

  try {
    const success = store.updateTaskStatus(props.task.id, newStatusId);
    if (success) {
      showStatusDropdown.value = false;
      emit("status-changed", {
        taskId: props.task.id,
        newStatus: newStatusId,
        newStatusName: newStatusObj.name,
      });

      Swal.fire({
        title: "Success!",
        text: `Status changed to ${newStatusObj.name}`,
        icon: "success",
        timer: 1500,
        showConfirmButton: false,
      });
    }
  } catch (error) {
    Swal.fire({
      title: "Error!",
      text: "Failed to change status",
      icon: "error",
    });
  }
}

function handleClick() {
  emit("view-task", props.task);
}
function handleEdit() {
  emit("edit-task", props.task);
}

async function handleDelete() {
  const { isConfirmed } = await Swal.fire({
    title: 'Are you sure you want to delete this task?',
    text: 'You won\'t be able to revert this!',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Yes',
    cancelButtonText: 'Cancel'
  });

  if (isConfirmed) {
    try {
      store.deleteTask(props.task.id);
      emit("delete-task", props.task.id);

      Swal.fire({
        title: "Success!",
        text: "Task deleted successfully",
        icon: "success",
        timer: 1500,
        showConfirmButton: false,
      });
    } catch (error) {
      Swal.fire({
        title: "Error!",
        text: "Failed to delete task",
        icon: "error",
      });
    }
  }
}

function handleClickOutside(event) {
  const dropdown = event.target.closest(".status-dropdown");
  const badge = event.target.closest(".badge");

  if (!dropdown && !badge && showStatusDropdown.value) {
    showStatusDropdown.value = false;
  }
}

onMounted(() => {
  document.addEventListener("click", handleClickOutside);
});

onUnmounted(() => {
  document.removeEventListener("click", handleClickOutside);
});
</script>

<template>
  <div class="card mb-3 task-card border-0 shadow-sm" :class="{ 'dropdown-active': showStatusDropdown }">
    <div class="card-body">
      <div class="d-flex justify-content-between align-items-start mb-2">
        <h5 class="card-title mb-0 fw-bold fs-6 fs-sm-5">{{ task.title }}</h5>

        <div class="position-relative">
          <span class="badge rounded-pill" :class="[statusBadgeClass, canClickStatus ? 'cursor-pointer' : '']" @click="handleStatusClick" :style="{ cursor: canClickStatus ? 'pointer' : 'default' }" :title="canClickStatus ? 'Click to change the status' : (props.projectStatus === statusEnum.CANCELLED ? 'Cannot change status - project is cancelled' : 'You cannot change the status from here')"> {{ statusName }} {{ canClickStatus ? "▼" : "" }} </span>

          <div v-if="showStatusDropdown && availableStatusObjects.length > 0" class="status-dropdown" @click.stop>
            <div class="dropdown-header">
              <small>Change Status :</small>
            </div>
            <div class="dropdown-body">
              <button v-for="statusObj in availableStatusObjects" :key="statusObj.id" class="dropdown-item" @click="handleStatusChange(statusObj.id)">
                <span class="status-dot" :class="getStatusColor(statusObj.name)"></span>
                {{ statusObj.name }}
              </button>
            </div>
          </div>
        </div>
      </div>

      <p class="card-text text-secondary text-truncate-2 fs-7 fs-sm-6">
        {{ task.description }}
      </p>

      <hr class="my-2 border-light" />

      <div class="d-flex justify-content-between align-items-center mt-3">
        <div class="d-flex align-items-center">
          <div class="avatar-circle me-2">
            {{ assignedUser ? assignedUser.name[0] : "?" }}
          </div>
          <small class=" fs-7 fs-sm-6">
            {{ assignedUser ? assignedUser.name : "Non assigné" }}
          </small>
        </div>
        <div class="d-flex gap-1 gap-sm-2" v-if="!isInvalidProjectStatus(projectStatus)">
          <button class="btn btn-sm btn-outline-primary py-0 px-2" style="font-size: 0.8rem" @click="handleClick">
            <span class="d-inline d-sm-none">👁️</span>
            <span class="d-none d-sm-inline">👁️ More</span>
          </button>
          <button v-if="canManageTasks" class="btn btn-sm btn-outline-secondary py-0 px-2" style="font-size: 0.8rem" @click="handleEdit">
            <span class="d-inline d-sm-none">✏️</span>
            <span class="d-none d-sm-inline">✏️ Update</span>
          </button>
          <button v-if="canManageTasks" class="btn btn-sm btn-outline-danger py-0 px-2" style="font-size: 0.8rem" @click="handleDelete">
            <span class="d-inline d-sm-none">🗑️</span>
            <span class="d-none d-sm-inline">🗑️ Delete</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  methods: {
    getStatusColor(statusName) {
      switch (statusName) {
        case "VALID":
          return "status-success";
        case "IN PROGRESS":
          return "status-warning";
        case "TO DO":
          return "status-secondary";
        case "CANCELLED":
          return "status-danger";
        case "DONE":
          return "status-primary";
        case "PENDING":
          return "status-info";
        default:
          return "status-light";
      }
    },
  },
};
</script>

<style scoped>
.fs-7 {
  font-size: 0.75rem !important;
}

@media (min-width: 576px) {
  .fs-sm-6 {
    font-size: 1rem !important;
  }
  .fs-sm-5 {
    font-size: 1.25rem !important;
  }
}

.task-card {
  transition: transform 0.2s, box-shadow 0.2s;
  border-left: 4px solid transparent !important;
  overflow: visible !important;
}

.task-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15) !important;
}

.text-truncate-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.avatar-circle {
  width: 24px;
  height: 24px;
  background-color: #e9ecef;
  color: #495057;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.75rem;
  font-weight: bold;
}

.position-relative {
  position: relative;
  overflow: visible !important;
}

.status-dropdown {
  position: absolute;
  top: 100%;
  right: 0;
  background: white;
  border: 1px solid #dee2e6;
  border-radius: 0.375rem;
  box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15);
  z-index: 9999;
  min-width: 200px;
  margin-top: 0.5rem;
}

.dropdown-active {
  position: relative;
  z-index: 1000;
}

.dropdown-header {
  padding: 0.5rem 1rem;
  border-bottom: 1px solid #dee2e6;
  background-color: #f8f9fa;
  border-radius: 0.375rem 0.375rem 0 0;
}

.dropdown-body {
  padding: 0.5rem 0;
}

.dropdown-item {
  display: flex;
  align-items: center;
  width: 100%;
  padding: 0.5rem 1rem;
  border: none;
  background: none;
  text-align: left;
  cursor: pointer;
  transition: background-color 0.2s;
  color: #212529;
  font-size: 0.9rem;
}

.dropdown-item:hover {
  background-color: #f8f9fa;
}

.dropdown-item:last-child {
  border-radius: 0 0 0.375rem 0.375rem;
}

.status-dot {
  display: inline-block;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  margin-right: 0.5rem;
}
</style>
