<script setup>
import { ref } from "vue";
import { useDataStore } from '@/stores/dataStore';
import { RouterLink, useRouter } from "vue-router";

const authStore = useDataStore();
const router = useRouter();

const email = ref("");
const password = ref("");
const errorMsg = ref("");

const handleLogin = () => {
  errorMsg.value = "";

  const success = authStore.login(email.value, password.value);

  if (success) {
    console.log("Utilisateur connecté");
    router.push({ name: "home" });
  } else {
    errorMsg.value = "Utilisateur inconnu ou mot de passe incorrect.";
  }
};
</script>

<template>
  <div class="login-container">
    <div class="login-card">
      <h2>Connexion</h2>

      <form @submit.prevent="handleLogin">
        <div class="form-group">
          <label for="email">Email</label>
          <input type="email" id="email" v-model="email" required placeholder="Ex: manager@test.com" />
        </div>

        <div class="form-group">
          <label for="password">Mot de passe</label>
          <input type="password" id="password" v-model="password" required placeholder="Votre mot de passe" />
        </div>

        <div v-if="errorMsg" class="error-message">
          {{ errorMsg }}
        </div>

        <button type="submit" class="btn-login">Se connecter</button>
        <div class="register-link">Pas encore de compte ? <RouterLink :to="{ name: 'register' }">Créer un compte</RouterLink></div>
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
  box-sizing: border-box; /* Important pour le padding */
}

.btn-login {
  width: 100%;
  padding: 0.75rem;
  background-color: #42b883; /* Couleur Vue.js */
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
</style>
