<script setup>
import {computed, ref, watch} from 'vue';
import Swal from 'sweetalert2';
import { useDataStore } from '@/stores/dataStore';
import { statusEnum } from '@/data/statusEnum.js';

const props = defineProps({
  isOpen: {
    type: Boolean,
    required: true
  },
  projectId: {
    type: String,
    required: true
  },
  hasManagerRole: {
    type: Boolean,
    required: true
  },
  hasDeveloperRole: {
    type: Boolean,
    required: true
  },
  isCreating: {
    type: Boolean,
    default: false
  },
  taskToEdit: {
    type: Object,
    default: null,
  },
});

const emit = defineEmits(['close', 'task-created', "task-updated"]);

const store = useDataStore();

const newTask = ref({
  title: '',
  description: '',
  assignedTo: '',
  status: getDefaultStatus()
});

const isEditMode = computed(() => !!props.taskToEdit);

watch(
    () => props.taskToEdit,
    (newVal) => {
      if (newVal) {
        newTask.value = {
          title: newVal.title,
          description: newVal.description,
          assignedTo: newVal.assignedTo || "",
          status: newVal.status,
        };
      } else {
        resetTask();
      }
    },
    { immediate: true }
);


function getDefaultStatus() {
  const statusName = props.hasManagerRole ? statusEnum.VALID : statusEnum.PENDING;
  return store.status?.find(s => s?.name === statusName)?.id;
}

function resetTask() {
  newTask.value = {
    title: '',
    description: '',
    assignedTo: props.hasManagerRole ? '' : (store.user?.id || ''),
    status: getDefaultStatus()
  };
}

async function saveTask() {
  if (!newTask.value?.title?.trim()) {
    Swal.fire({
      title: 'Error!',
      text: 'Task title is required',
      icon: 'error'
    });
    return;
  }

  try {
    if (isEditMode.value) {
      const updatedTaskData = {
        id: props.taskToEdit.id,
        projectId: props.projectId,
        ...newTask.value,
      };

      store.updateTask(updatedTaskData);

      Swal.fire({
        title: "Success!",
        text: "Task updated successfully",
        icon: "success",
        timer: 1500,
        showConfirmButton: false,
      });
      emit("task-updated");
    } else {
      const { title, description, status } = newTask.value;
      let assignedTo = newTask.value.assignedTo;

      if (props.hasDeveloperRole) {
        assignedTo = store.user?.id;
      }

      store.addTask(props.projectId, title, description, status, assignedTo, "");

      Swal.fire({
        title: "Success!",
        text: "Task created successfully",
        icon: "success",
        timer: 2000,
        showConfirmButton: false,
      });

      emit("task-created");
    }
    closeModal();
  } catch (error) {
    Swal.fire({
      title: "Error!",
      text: "Failed to create task",
      icon: "error",
    });
  }

}

function closeModal() {
  resetTask();
  emit('close');
}
</script>

<template>
  <div v-if="isOpen" class="modal d-block" tabindex="-1" style="background-color: rgba(0,0,0,0.5);" @click.self="closeModal" role="dialog" aria-modal="true" aria-labelledby="taskModalTitle">
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="taskModalTitle"><i class="bi bi-plus-circle me-2"></i>{{ isEditMode ? "Edit Task" : "New Task" }}</h5>
          <button type="button" class="btn-close" @click="closeModal" aria-label="Close modal"></button>
        </div>

        <form @submit.prevent="saveTask">
          <div class="modal-body">
            <div class="mb-3">
              <label class="form-label fw-semibold" for="taskTitle">Title *</label>
              <input
                id="taskTitle"
                v-model="newTask.title"
                type="text"
                class="form-control"
                required
                placeholder="e.g., Create database schema"
                :disabled="isCreating"
              />
            </div>

            <div class="mb-3">
              <label class="form-label fw-semibold" for="taskDescription">Description</label>
              <textarea
                id="taskDescription"
                v-model="newTask.description"
                class="form-control"
                rows="3"
                placeholder="Describe the task details..."
                :disabled="isCreating"
              ></textarea>
            </div>

            <div v-if="hasManagerRole" class="mb-3">
              <label class="form-label fw-semibold" for="taskAssignee">Assign to</label>
              <select 
                id="taskAssignee"
                v-model="newTask.assignedTo" 
                class="form-select"
                :disabled="isCreating"
              >
                <option disabled value="">Select a team member...</option>
                <option v-for="user in store.users" :key="user?.id" :value="user?.id">
                  {{ user?.name }} ({{ user?.roles?.join(", ") }})
                </option>
              </select>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" @click="closeModal" class="btn btn-secondary" :disabled="isCreating">Cancel</button>
            <button type="submit" class="btn btn-success" :disabled="isCreating">
              <span v-if="isCreating" class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
              {{ isEditMode ? "Save Changes" : "Create Task" }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>
