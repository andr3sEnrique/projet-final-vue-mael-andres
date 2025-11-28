<script setup>
import { ref, watch } from 'vue';
import { useDataStore } from '@/stores/dataStore';
import { useRouter } from 'vue-router';

const authStore = useDataStore();
const router = useRouter();

const roles = [
  { value: 'manager', label: 'Manager' },
  { value: 'developer', label: 'Développeur' },
];

const email = ref('');
const name = ref('');
const password = ref('');
const passwordErrors = ref(null);
const confirmPassword = ref('');
const confirmPasswordErrors = ref(null);
const userRoles = ref([]);
const errorMsg = ref('');

const handleRegister = () => {
  errorMsg.value = '';

  if (confirmPassword.value !== password.value) {
    errorMsg.value = 'Passwords do not match';
    return;
  }

  if (userRoles.value.length === 0) {
    errorMsg.value = 'You must select at least one role';
    return;
  }

  const success = authStore.register(name.value, email.value, password.value, userRoles.value);

  if (success) {
    router.push({ name: 'login' });
  } else {
    errorMsg.value = 'Email already used';
  }
};

watch(password, () => {
  let errors = [];
  if (!password.value || password.value.length < 10) errors.push('More than 10 characters');
  if (!/[A-Z]/.test(password.value)) errors.push('At least one uppercase letter');
  if (!/[a-z]/.test(password.value)) errors.push('At least one lowercase letter');
  if (!/\d/.test(password.value)) errors.push('At least one number');
  passwordErrors.value = errors;
});

watch(confirmPassword, () => {
  let errors = [];
  if (password.value !== confirmPassword.value) errors.push('Passwords must be the sames');
  confirmPasswordErrors.value = errors;
});
</script>

<template>
  <div class="d-flex justify-content-center align-items-center min-vh-100 bg-light">
    <div class="card shadow p-4 border-0" style="max-width: 500px; width: 100%">
      <div class="card-body">
        <h2 class="text-center mb-4 text-primary">Register</h2>

        <form @submit.prevent="handleRegister">
          <div class="mb-3">
            <label for="name" class="form-label fw-bold">Name surname</label>
            <input type="text" class="form-control" id="name" v-model="name" required placeholder="Laura Manager" />
          </div>

          <div class="mb-3">
            <label for="email" class="form-label fw-bold">Email</label>
            <input type="email" class="form-control" id="email" v-model="email" required placeholder="Ex: manager@test.com" />
          </div>

          <div class="mb-3">
            <label for="password" class="form-label fw-bold">Password</label>
            <input
              type="password"
              class="form-control"
              :class="{
                'is-invalid': passwordErrors && passwordErrors.length > 0,
                'is-valid': passwordErrors && passwordErrors.length === 0,
              }"
              id="password"
              v-model="password"
              required
              placeholder="Your password"
            />

            <div v-if="passwordErrors && passwordErrors.length > 0" class="text-danger small mt-2">
              <p class="mb-1 fw-bold">Your password must contain:</p>
              <ul class="mb-0 ps-3">
                <li v-for="err in passwordErrors" :key="err">{{ err }}</li>
              </ul>
            </div>
            <div v-else-if="passwordErrors && passwordErrors.length === 0" class="valid-feedback d-block">Password valid</div>
          </div>

          <div class="mb-3">
            <label for="confirmPassword" class="form-label fw-bold">Confirm password</label>
            <input
              type="password"
              class="form-control"
              :class="{
                'is-invalid': confirmPasswordErrors && confirmPasswordErrors.length > 0,
                'is-valid': confirmPasswordErrors && confirmPasswordErrors.length === 0,
              }"
              id="confirmPassword"
              v-model="confirmPassword"
              required
              placeholder="Confirm your password"
            />

            <div v-if="confirmPasswordErrors && confirmPasswordErrors.length > 0" class="invalid-feedback d-block">
              <ul class="mb-0 ps-3">
                <li v-for="err in confirmPasswordErrors" :key="err">{{ err }}</li>
              </ul>
            </div>
            <div v-else-if="confirmPasswordErrors && confirmPasswordErrors.length === 0" class="valid-feedback d-block">Passwords match</div>
          </div>

          <div class="mb-3">
            <label class="form-label fw-bold">Roles:</label>
            <div>
              <div v-for="role in roles" :key="role.value" class="form-check">
                <input class="form-check-input" type="checkbox" :value="role.value" :id="role.value" v-model="userRoles" />
                <label class="form-check-label" :for="role.value">
                  {{ role.label }}
                </label>
              </div>
            </div>
          </div>

          <div v-if="errorMsg" class="alert alert-danger py-2 mt-3" role="alert">
            {{ errorMsg }}
          </div>

          <div class="d-grid gap-2 mt-4">
            <button type="submit" class="btn btn-primary">Register</button>
          </div>

          <div class="text-center mt-3">
            <span class="text-muted">Already have an account?</span>
            <RouterLink :to="{ name: 'login' }" class="text-decoration-none fw-bold ms-1 text-primary"> Login </RouterLink>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
