<script setup>
import { ref, computed,watch } from 'vue';
import { useDataStore } from '@/stores/dataStore';
import { useRouter } from 'vue-router';
import { statusEnum } from '@/data/statusEnum.js';

const props = defineProps({
    mode: { type: String, default: 'create' },
    project: { type: Object, default: null },
});

const store = useDataStore();
const router = useRouter();

const availableStatus = computed(() => {
  const allStatus = store.status;

  if (props.mode === 'create') {
    return allStatus.filter(s =>
      s.name === statusEnum.IN_PROGRESS ||
      s.name === statusEnum.TO_DO
    );
  } else {
    return allStatus.filter(s => 
      s.name === statusEnum.IN_PROGRESS ||
      s.name === statusEnum.DONE ||
      s.name === statusEnum.TO_DO ||
      s.name === statusEnum.CANCELLED
    );
  }
});

const selectedManagers = ref([]);

const managers = computed(() => store.managers);

const form = ref({
  title: '',
  description: '',
  managerIds: [],
  status: availableStatus.value.find(s => s.name === statusEnum.IN_PROGRESS)?.id || '',
  startDate: null,
  endDate: null
});

const parseDate = d => d ? new Date(d).toISOString().slice(0, 10) : null;

const errors = ref({
  title: '',
  description: '',
  startDate: '',
  endDate: ''
});

watch(
    () => props.project,
    (p) => {
        if (p) {
            form.value = {
                title: p.title,
                description: p.description,
                managerIds: p.managerIds,
                status: p.status,
                startDate: parseDate(p.startDate),
                endDate: parseDate(p.endDate)
            };

            selectedManagers.value = p.managerIds;
        }
    },
    { immediate: true }
);

function handleSubmit() {
    if (!validateForm()) {
      return;
    }

    if (props.mode === 'create') {
        const project = {
            id: crypto.randomUUID(),
            title: form.value.title,
            description: form.value.description,
            managerIds: selectedManagers.value,
            tasks: [],
            status: form.value.status,
            startDate: form.value.startDate,
            endDate: form.value.endDate
        };

        store.createProject(project);
        router.push('/');
    } else {
      const updated = {
        ...props.project,
        ...form.value,
        managerIds: selectedManagers.value,
        status: form.value.status
      };
        store.updateProject(updated);
        router.push('/projects/' + updated.id);
    }
}

function validateForm() {
    errors.value = { title: '', description: '', startDate: '', endDate: '' };
    let isValid = true;
    if (!form.value.title) {
      errors.value.title = "The project name is required";
      isValid = false;
    }

    if (form.value.title.trim() === '' || form.value.title.length < 3) {
      errors.value.title = "The project name must be at least 3 characters long";
      isValid = false;
    }

    if (!form.value.description) {
      errors.value.description = "The description is required";
      isValid = false;
    }

    if (form.value.description.trim() === '' || form.value.description.length < 3) {
      errors.value.description = "The description must be at least 3 characters long";
      isValid = false;
    }

    if (!form.value.startDate) {
      errors.value.startDate = "The start date is required";
      isValid = false;
    }

    if (!form.value.endDate) {
      errors.value.endDate = "The end date is required";
      isValid = false;
    }

    if (form.value.startDate > form.value.endDate) {
      errors.value.endDate = "The end date must be after the start date";
      isValid = false;
    }

    return isValid;
}
</script>

<template>
    <div class="container mt-5">
      <div class="row justify-content-center">
        <div class="col-md-8 col-lg-6">
          
          <div class="card shadow">
            <div class="card-header bg-primary text-white">
              <h4 class="mb-0"><i class="bi bi-folder-plus"></i> {{ mode === 'create' ? 'Create a new project' : 'Update Project' }}</h4>
            </div>
            
            <div class="card-body">
              <form @submit.prevent="handleSubmit">
                
                <div class="mb-3">
                  <label for="title" class="form-label">Project name <span class="text-danger">*</span></label>
                  <input 
                    id="title"
                    v-model="form.title" 
                    type="text" 
                    class="form-control" 
                    :class="{ 'is-invalid': errors.title }"
                    placeholder="Ex: Web 2025" 
                    required
                  >
                  <div class="invalid-feedback">
                    {{ errors.title }}
                  </div>
                </div>
  
                <div class="mb-4">
                  <label for="desc" class="form-label">Description <span class="text-danger">*</span></label>
                  <textarea 
                    id="desc"
                    v-model="form.description" 
                    class="form-control" 
                    required
                    :class="{ 'is-invalid': errors.description }"
                    rows="3" 
                    placeholder="Brief description of the objective..."
                  ></textarea>
                  <div class="invalid-feedback">
                    {{ errors.description }}
                  </div>
                </div>
  
                <div class="mb-4">
                  <label for="startDate" class="form-label">Start date <span class="text-danger">*</span></label>
                  <input 
                    id="startDate"
                    v-model="form.startDate" 
                    type="date" 
                    class="form-control" 
                    :class="{ 'is-invalid': errors.startDate }"
                    required
                  >
                  <div class="invalid-feedback">
                    {{ errors.startDate }}
                  </div>
                </div>
  
                <div class="mb-4">
                  <label for="endDate" class="form-label">End date <span class="text-danger">*</span></label>
                  <input 
                    id="endDate"
                    v-model="form.endDate" 
                    type="date" 
                    class="form-control" 
                    :class="{ 'is-invalid': errors.endDate }"
                    required
                  >
                  <div class="invalid-feedback">
                    {{ errors.endDate }}
                  </div>
                </div>
  
                <div class="mb-4">
                  <label for="status" class="form-label">Status</label>
                  <select 
                    id="status"
                    v-model="form.status" 
                    class="form-select"
                  >
                  <option v-for="s in availableStatus" :key="s.id" :value="s.id">
                    {{ s.name }}
                  </option>
                  </select>
                </div>
  
                <div class="mb-4">
                  <label class="form-label fw-bold">Managers</label>
                  <div class="form-check" v-for="m in managers" :key="m.id">
                    <input 
                      class="form-check-input"
                      type="checkbox"
                      :id="'manager-' + m.id"
                      :value="m.id"
                      v-model="selectedManagers"
                    />
  
                    <label class="form-check-label" :for="'manager-' + m.id">
                      {{ m.name }}
                    </label>
                  </div>
                </div>
  
                <div class="d-flex justify-content-between">
                  <button type="button" @click="router.back();" class="btn btn-outline-secondary">
                    Cancel
                  </button>
                  <button type="submit" class="btn btn-primary px-4">
                    {{ mode === 'create' ? 'Create' : 'Update' }}
                  </button>
                </div>
  
              </form>
            </div>
          </div>
  
        </div>
      </div>
    </div>
  </template>