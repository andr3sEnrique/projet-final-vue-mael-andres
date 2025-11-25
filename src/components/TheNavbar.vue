<script setup>
    import { useDataStore } from '@/stores/dataStore';
    import { useRouter } from 'vue-router';

    const store = useDataStore();
    const router = useRouter();
    function handleLogout() {
        store.logout();
        router.push('/login');
    }

</script>

<template>
    <nav class="navbar navbar-expand-lg navbar-dark bg-dark mb-4">
        <div class="container">
            <router-link class="navbar-brand" :to="{ name: 'home' }">
                <i class="bi bi-kanban"></i> Gestion des projets
            </router-link>
            <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarContent">
                <span class="navbar-toggler-icon"></span>
            </button>
            <div class="collapse navbar-collapse" id="navbarContent">
                <ul class="navbar-nav ms-auto mb-2 mb-lg-0 align-items-center">
                    <li v-if="store.user" class="nav-item dropdown">
                        <span class="nav-link text-light me-3">
                            Hi, <strong>{{ store.user.name }}</strong>
                        </span>
                    </li>
                    <li v-if="store.user" class="nav-item">
                        <button @click="handleLogout" class="btn btn-outline-danger btn-sm">
                            <i class="bi bi-box-arrow-right"></i> Logout
                        </button>
                    </li>
                    <li v-else class="nav-item">
                        <router-link to="/login" class="btn btn-primary btn-sm">
                            <i class="bi bi-box-arrow-in-right"></i> Login
                        </router-link>
                    </li>
                </ul>
            </div>
        </div>
    </nav>
</template>