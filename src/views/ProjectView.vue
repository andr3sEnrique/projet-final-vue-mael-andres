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
const newTask = ref({ title: "", description: "", assignedTo: "", status: "NON_VALIDE" });
const selectedTask = ref(null);
const newCommentText = ref("");

function saveTask() {
  if (!newTask.value.title) return;

  const { title, description, assignedTo, status } = newTask.value;
  store.addTask(projectId, title, description, status, assignedTo, "");
  showModal.value = false;
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
                    <TaskView :task="task" @view-task="openTaskDetails" />
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

.comments-list {
  max-height: 300px;
  overflow-y: auto;
  padding-right: 5px;
}
</style>
