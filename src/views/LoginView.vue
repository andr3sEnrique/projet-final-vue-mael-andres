<script setup>
import { ref } from 'vue';
import { useDataStore } from '@/stores/dataStore';
import { RouterLink, useRouter } from 'vue-router';

const authStore = useDataStore();
const router = useRouter();

const email = ref('');
const password = ref('');
const errorMsg = ref('');

const handleLogin = () => {
  errorMsg.value = '';

  const success = authStore.login(email.value, password.value);

  if (success) {
    router.push({ name: 'home' });
  } else {
    errorMsg.value = 'Unknowed user or incorrect password.';
  }
};
</script>

<template>
  <div class="d-flex justify-content-center align-items-center min-vh-100">
    <div class="card shadow p-4 border-0" style="max-width: 400px; width: 100%">
      <div class="card-body">
        <h2 class="text-center mb-4 text-primary">Login</h2>

        <form @submit.prevent="handleLogin">
          <div class="mb-3">
            <label for="email" class="form-label fw-bold">Email</label>
            <input type="email" class="form-control" id="email" v-model="email" required placeholder="Ex: manager@test.com" />
          </div>

          <div class="mb-3">
            <label for="password" class="form-label fw-bold">Password</label>
            <input type="password" class="form-control" id="password" v-model="password" required placeholder="Your password" />
          </div>

          <div v-if="errorMsg" class="alert alert-danger py-2 mt-3" role="alert">
            {{ errorMsg }}
          </div>

          <div class="d-grid gap-2 mt-4">
            <button type="submit" class="btn btn-primary">Login</button>
          </div>

          <div class="text-center mt-3">
            <span class="text-muted">No account yet?</span>
            <RouterLink :to="{ name: 'register' }" class="text-decoration-none fw-bold ms-1 text-primary"> Register </RouterLink>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
