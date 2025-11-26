<script setup>
import { computed, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useDataStore } from "@/stores/dataStore";
import TaskView from "./TaskView.vue";

const route = useRoute();
const router = useRouter();
const store = useDataStore();

const projectId = route.params.id;

const project = computed(() => store.projects.find((p) => p.id === projectId));
const tasks = computed(() => store.tasks.filter((task) => task.projectId === projectId));

const goBack = () => router.push("/");

const showModal = ref(false);
const newTask = ref({ title: "", description: "", assignedTo: "", status: "PAS_COMMENCE" });

function saveTask() {
  if (!newTask.value.title) return;

  const { title, description, assignedTo, status } = newTask.value;
  store.addTask(projectId, title, description, status, assignedTo, "");
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
      <div class="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h1 class="display-6">{{ project.title }}</h1>
          <p class="text-muted">{{ project.description }}</p>
        </div>
        <button @click="goBack" class="btn btn-outline-secondary"><i class="bi bi-arrow-left"></i> Go back</button>
      </div>

      <hr />

      <div class="row">
        <div class="col-12">
          <div class="card bg-light border-0">
            <div class="card-body text-center py-5">
              <div v-if="tasks?.length > 0" class="text-start">
                <h6 class="text-muted mb-3 ps-1">Tâches du projet ({{ tasks.length }})</h6>

                <div class="row row-cols-1 row-cols-md-2 g-3">
                  <div class="col" v-for="task in tasks" :key="task.id">
                    <TaskView :task="task" />
                  </div>
                </div>
              </div>

              <div v-else>
                <h5 class="text-secondary">Aucune tâche pour le moment</h5>
                <p>
                  ID du projet: <strong>{{ project.id }}</strong>
                </p>
              </div>
              <button class="btn btn-primary mt-3" @click="showModal = true">+ Nouvelle Tâche</button>

              <div v-if="showModal" class="modal-overlay">
                <div class="modal-card">
                  <h3>Nouvelle Tâche</h3>

                  <form @submit.prevent="saveTask">
                    <div class="mb-3">
                      <label class="form-label">Titre</label>
                      <input v-model="newTask.title" type="text" class="form-control" required placeholder="Ex: Créer la DB" />
                    </div>

                    <div class="mb-3">
                      <label class="form-label">Description</label>
                      <textarea v-model="newTask.description" class="form-control" rows="3"></textarea>
                    </div>

                    <div class="mb-3">
                      <label class="form-label">Assigner à</label>
                      <select v-model="newTask.assignedTo" class="form-select">
                        <option disabled value="">Choisir un membre...</option>
                        <option v-for="user in store.users" :key="user.id" :value="user.id">{{ user.name }} ({{ user.roles.join(", ") }})</option>
                      </select>
                    </div>

                    <div class="d-flex justify-content-end gap-2">
                      <button type="button" @click="showModal = false" class="btn btn-secondary">Annuler</button>
                      <button type="submit" class="btn btn-success">Créer</button>
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
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-card {
  background: white;
  padding: 2rem;
  border-radius: 8px;
  width: 90%;
  max-width: 500px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
}
</style>
