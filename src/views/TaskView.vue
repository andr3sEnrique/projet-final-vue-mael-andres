<script setup>
import { computed } from "vue";
import { useDataStore } from "@/stores/dataStore";

const props = defineProps({
  task: {
    type: Object,
    required: true,
  },
});

const store = useDataStore();

const assignedUser = computed(() => {
  return store.users?.find((u) => u.id === props.task.assignedTo);
});

const statusBadgeClass = computed(() => {
  switch (props.task.status) {
    case "VALIDE":
      return "bg-success";
    case "EN_COURS":
      return "bg-warning text-dark";
    case "A_FAIRE":
      return "bg-secondary";
    default:
      return "bg-light text-dark border";
  }
});

const formatStatus = (status) => {
  return status
    .replace("_", " ")
    .toLowerCase()
    .replace(/\b\w/g, (l) => l.toUpperCase());
};
</script>

<template>
  <div class="card mb-3 task-card border-0 shadow-sm">
    <div class="card-body">
      <div class="d-flex justify-content-between align-items-start mb-2">
        <h5 class="card-title mb-0 fw-bold text-dark">{{ task.title }}</h5>

        <span class="badge rounded-pill" :class="statusBadgeClass">
          {{ formatStatus(task.status) }}
        </span>
      </div>

      <p class="card-text text-secondary text-truncate-2">
        {{ task.description }}
      </p>

      <hr class="my-2 border-light" />

      <div class="d-flex justify-content-between align-items-center mt-3">
        <div class="d-flex align-items-center">
          <div class="avatar-circle me-2">
            {{ assignedUser ? assignedUser.name[0] : "?" }}
          </div>
          <small class="text-muted">
            {{ assignedUser ? assignedUser.name : "Non assigné" }}
          </small>
        </div>

        <button class="btn btn-sm btn-outline-primary py-0 px-2" style="font-size: 0.8rem">Voir</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.task-card {
  transition: transform 0.2s, box-shadow 0.2s;
  border-left: 4px solid transparent !important;
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
</style>
