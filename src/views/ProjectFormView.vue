<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useDataStore } from '../stores/dataStore';

const store = useDataStore();
const router = useRouter();

const form = ref({
  title: '',
  description: ''
});

const errors = ref({
  title: '',
  description: ''
});

function handleSubmit() {
    errors.value = { title: '', description: '' };

    if (!validateForm()) {
      return;
    }

    store.createProject(form.value.title, form.value.description, [store.user.id]);

    router.push('/');
}

function validateForm() {
    let isValid = true;
    if (!form.value.title) {
      errors.value.title = "The project name is required";
      isValid = false;
    }

    if (!form.value.description) {
      errors.value.description = "The description is required";
      isValid = false;
    }

    return isValid;
}

function handleCancel() {
  router.back();
}
</script>

<template>
  <div class="container mt-5">
    <div class="row justify-content-center">
      <div class="col-md-8 col-lg-6">
        
        <div class="card shadow">
          <div class="card-header bg-primary text-white">
            <h4 class="mb-0"><i class="bi bi-folder-plus"></i> Create a new project</h4>
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

              <div class="d-flex justify-content-between">
                <button type="button" @click="handleCancel" class="btn btn-outline-secondary">
                  Cancel
                </button>
                <button type="submit" class="btn btn-primary px-4">
                  Create
                </button>
              </div>

            </form>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>