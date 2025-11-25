<script setup>
import { computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useDataStore } from '@/stores/dataStore';

const route = useRoute();
const router = useRouter();
const store = useDataStore();

const projectId = route.params.id;
const project = computed(() => store.projects.find(p => p.id === projectId));

const goBack = () => router.push('/');
</script>