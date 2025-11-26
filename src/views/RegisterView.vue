<script setup>
import { ref, watch } from "vue";
import { useDataStore } from "@/stores/dataStore";
import { useRouter } from "vue-router";

const authStore = useDataStore();
const router = useRouter();

const roles = [
  { value: "manager", label: "Manager" },
  { value: "developer", label: "Développeur" },
];

const email = ref("");
const name = ref("");
const password = ref("");
const passwordErrors = ref(null);
const confirmPassword = ref("");
const confirmPasswordErrors = ref(null);
const userRoles = ref([]);
const errorMsg = ref("");

const handleRegister = () => {
  errorMsg.value = "";

  if (confirmPassword.value !== password.value) {
    errorMsg.value = "Les mots de passes ne correspondent pas";
    return;
  }

  if (userRoles.value.length === 0) {
    errorMsg.value = "Veuillez sélectionner au moins un rôle";
    return;
  }

  const success = authStore.register(name.value, email.value, password.value, userRoles.value);

  if (success) {
    console.log("Utilisateur connecté");
    router.push({ name: "home" });
  } else {
    errorMsg.value = "Email déjà utilisé";
  }
};

watch(password, () => {
  let errors = [];
  if (!password.value || password.value.length < 10) errors.push("Plus de 10 caractères");
  if (!/[A-Z]/.test(password.value)) errors.push("Au moins une majuscule");
  if (!/[a-z]/.test(password.value)) errors.push("Au moins une minuscule");
  if (!/\d/.test(password.value)) errors.push("Au moins un chiffre");
  passwordErrors.value = errors;
});

watch(confirmPassword, () => {
  let errors = [];
  if (password.value !== confirmPassword.value) errors.push("Les mots de passes doivent être identiques");
  confirmPasswordErrors.value = errors;
});
</script>

<template>
  <div class="login-container">
    <div class="login-card">
      <h2>Créer un compte</h2>

      <form @submit.prevent="handleRegister">
        <div class="form-group">
          <label for="name">Prénom nom</label>
          <input type="name" id="name" v-model="name" required placeholder="Laura Manager" />
        </div>

        <div class="form-group">
          <label for="email">Email</label>
          <input type="email" id="email" v-model="email" required placeholder="Ex: manager@test.com" />
        </div>

        <div class="form-group">
          <label for="password">Mot de passe</label>
          <input type="password" id="password" v-model="password" required placeholder="Votre mot de passe" />
          <div class="error-message" v-if="passwordErrors && passwordErrors.length > 0">
            <p>Le mot de passe doit contenir :</p>
            <ul>
              <li v-for="err in passwordErrors">{{ err }}</li>
            </ul>
          </div>
          <div class="password-valid" v-else-if="passwordErrors && passwordErrors.length === 0">Mot de passe correct</div>
        </div>

        <div class="form-group">
          <label for="confirmPassword">Confirmer votre mot de passe</label>
          <input type="password" id="confirmPassword" v-model="confirmPassword" required placeholder="Confirmer votre mot de passe" />
          <div class="error-message" v-if="confirmPasswordErrors && confirmPasswordErrors.length > 0">
            <ul>
              <li v-for="err in confirmPasswordErrors">{{ err }}</li>
            </ul>
          </div>
          <div class="password-valid" v-else-if="confirmPasswordErrors && confirmPasswordErrors.length === 0">Confirmation du mot de passe correct</div>
        </div>

        <div class="form-group">
          <label>Rôles :</label>
          <div class="checkbox-container">
            <div v-for="role in roles" :key="role.value" class="checkbox-item">
              <input type="checkbox" :id="role.value" :value="role.value" v-model="userRoles" />
              <label :for="role.value">{{ role.label }}</label>
            </div>
          </div>
        </div>
        <div v-if="errorMsg" class="error-message">
          {{ errorMsg }}
        </div>

        <button type="submit" class="btn-login">Créer un compte</button>
        <div class="register-link">Déjà un compte ? <RouterLink :to="{ name: 'login' }">Ce connecter</RouterLink></div>
      </form>
    </div>
  </div>
</template>

<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #f4f4f9;
}

.login-card {
  background: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 400px;
  text-align: center;
}

.form-group {
  margin-bottom: 1rem;
  text-align: left;
}

label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: bold;
}

input {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  box-sizing: border-box;
}

.btn-login {
  width: 100%;
  padding: 0.75rem;
  background-color: #42b883;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
  margin-top: 1rem;
}

.btn-login:hover {
  background-color: #3aa876;
}

.error-message {
  color: red;
  margin-top: 0.5rem;
  font-size: 0.9rem;
}

.password-valid {
  color: green;
  margin-top: 0.5rem;
  font-size: 0.9rem;
}

.register-link {
  margin-top: 1rem;
  font-size: 0.9rem;
}
.register-link a {
  color: #42b883;
  text-decoration: none;
  font-weight: bold;
}
.register-link a:hover {
  text-decoration: underline;
}
.checkbox-container {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.checkbox-item {
  display: flex;
  align-items: center;
  cursor: pointer;
}

input[type="checkbox"] {
  width: auto;
  margin-right: 10px;
  cursor: pointer;
}

.checkbox-item label {
  font-weight: normal;
  cursor: pointer;
  margin-bottom: 0;
}
</style>
