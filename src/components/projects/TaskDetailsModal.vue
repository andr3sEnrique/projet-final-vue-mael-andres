<script setup>
import { ref } from "vue";
import Swal from "sweetalert2";
import { useDataStore } from "@/stores/dataStore";

const props = defineProps({
  task: {
    type: Object,
    default: null,
  },
  isOpen: {
    type: Boolean,
    required: true,
  },
  isPostingComment: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(["close", "comment-added"]);

const store = useDataStore();
const newCommentText = ref("");

function getAuthorName(userId) {
  if (!userId) return "Inconnu";

  if (!store.users || !Array.isArray(store.users)) return "Inconnu";

  const user = store.users.find((u) => u?.id === userId);
  return user?.name || "Inconnu";
}

function formatDate(isoString) {
  return new Date(isoString).toLocaleString("fr-FR", {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

async function postComment() {
  if (!newCommentText.value?.trim()) {
    Swal.fire({
      title: "Error!",
      text: "Comment cannot be empty",
      icon: "error",
    });
    return;
  }

  if (!props.task?.id || !store.user?.id) {
    Swal.fire({
      title: "Error!",
      text: "Invalid task or user",
      icon: "error",
    });
    return;
  }

  try {
    store.addComment(props.task.id, newCommentText.value, store.user.id);

    Swal.fire({
      title: "Success!",
      text: "Comment added successfully",
      icon: "success",
      timer: 1500,
      showConfirmButton: false,
    });

    newCommentText.value = "";
    emit("comment-added");
  } catch (error) {
    Swal.fire({
      title: "Error!",
      text: "Failed to add comment",
      icon: "error",
    });
  }
}

function closeModal() {
  newCommentText.value = "";
  emit("close");
}
</script>

<template>
  <div v-if="isOpen && task" class="modal d-block" tabindex="-1" style="background-color: rgba(0, 0, 0, 0.5)" @click.self="closeModal" role="dialog" aria-modal="true" aria-labelledby="taskDetailTitle">
    <div class="modal-dialog modal-lg">
      <div class="modal-content">
        <div class="modal-header">
          <h3 class="modal-title" id="taskDetailTitle">{{ task?.title }}</h3>
          <button @click="closeModal" class="btn-close" aria-label="Close modal"></button>
        </div>

        <div class="modal-body">
          <div class="row">
            <div class="col-md-7 border-end">
              <h6 class="text-muted">Description</h6>
              <p>{{ task?.description || "No description" }}</p>

              <div class="mt-4">
                <span class="badge bg-secondary me-2">{{ task?.status }}</span>
                <small class="text-muted">ID: {{ task?.id }}</small>
              </div>
            </div>

            <div class="col-md-5">
              <h6 class="text-muted mb-3">Commentaires</h6>

              <div class="comments-list mb-3">
                <div v-if="!task?.comments || task.comments.length === 0" class="text-center text-muted fst-italic mt-4">Pas encore de commentaires.</div>

                <div v-else v-for="comment in task.comments" :key="comment?.id" class="comment-item mb-3">
                  <div class="d-flex justify-content-between">
                    <strong class="text-primary small">{{ getAuthorName(comment?.authorId) }}</strong>
                    <span class="text-muted x-small" style="font-size: 0.75rem">{{ formatDate(comment?.date) }}</span>
                  </div>
                  <div class="bg-light p-2 rounded mt-1 text-dark">
                    {{ comment?.content }}
                  </div>
                </div>
              </div>

              <form @submit.prevent="postComment">
                <div class="input-group">
                  <input v-model="newCommentText" type="text" class="form-control" placeholder="Write a comment..." required :disabled="isPostingComment" aria-label="Write a comment" />
                  <button class="btn btn-primary" type="submit" :disabled="isPostingComment" aria-label="Send comment">
                    <span v-if="isPostingComment" class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                    <i v-else class="bi bi-send"></i> {{ isPostingComment ? "Envoi..." : "Envoyer" }}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.comments-list {
  max-height: 300px;
  overflow-y: auto;
  padding-right: 5px;
}
</style>
