# Système de Gestion de Projets et Tâches

## Description du Projet

Cette application web est une **plateforme de gestion de projets** développée avec Vue.js 3 dans le cadre d'un projet final académique. Elle a pour objectif de permettre la création de projets, la gestion de tâches, l'affectation de personnes aux tâches et le suivi de l'avancement des projets. L'application propose une interface intuitive avec un système de rôles différencié permettant une collaboration efficace entre les équipes de développement et de management.

## Fonctionnalités Principales

L'application implémente deux rôles principaux avec des fonctionnalités spécifiques :

### 👨‍💻 Rôle Développeur (Developer)

**Gestion des projets :**
- Voir la liste des projets sur lesquels au moins une tâche leur est affectée
- Accéder aux détails des projets visibles

**Gestion des tâches :**
- Créer des tâches au sein des projets visibles (statut initial "Non validé")
- Voir la liste de toutes les tâches (affectées ou non) dans chaque projet visible
- Voir spécifiquement les tâches qui leur sont affectées
- Marquer les tâches affectées comme complétées
- Commenter les tâches pour engager des conversations collaboratives

### 👨‍💼 Rôle Manager

**Gestion des projets :**
- Créer, modifier et supprimer des projets
- Voir la liste de tous les projets
- Se désigner comme gérant d'un projet spécifique (plusieurs managers peuvent gérer un même projet)

**Gestion des tâches (pour les projets gérés) :**
- Créer, modifier et supprimer toutes les tâches
- Valider les tâches soumises par les développeurs
- Affecter ou désaffecter des personnes aux tâches
- Afficher une vue synthétique des tâches en cours par projet
- Suivre l'état d'avancement global incluant les projets en retard ou à risque basé sur les échéances

### 👥 Rôles Cumulés
- Une personne peut cumuler les deux rôles (Manager + Développeur)
- Interface adaptative permettant de choisir entre les deux vues selon le contexte

### 🔐 Système d'Authentification
- Accès sécurisé avec formulaire de connexion obligatoire
- Possibilité d'inscription pour nouveaux utilisateurs
- Hachage des mots de passe avec bcryptjs
- Persistance des sessions utilisateur avec localStorage

## Technologies Utilisées

### Frontend
- **Vue.js 3** - Framework JavaScript progressif avec Composition API
- **Vue Router 4** - Routage côté client
- **Pinia** - Gestion d'état moderne pour Vue
- **Bootstrap 5** - Framework CSS pour l'interface utilisateur
- **Vite** - Outil de build rapide et moderne

### Sécurité et Utilitaires
- **bcryptjs** - Hachage sécurisé des mots de passe
- **SweetAlert2** - Notifications et alertes élégantes
- **@popperjs/core** - Positionnement des éléments UI

### Outils de Développement
- **@vitejs/plugin-vue** - Plugin Vite pour Vue.js
- **vite-plugin-vue-devtools** - Outils de développement Vue

## Dépendances Clés

```json
{
  "vue": "^3.5.22",
  "vue-router": "^4.6.3",
  "pinia": "^3.0.4",
  "bootstrap": "^5.3.8",
  "bcryptjs": "^3.0.3",
  "sweetalert2": "^11.26.3",
  "vite": "^7.1.11"
}
```

## Installation et Lancement en Local

### Prérequis
- Node.js (version 20.19.0 ou supérieure, ou version 22.12.0+)
- npm ou yarn

### Étapes d'installation

1. **Cloner le repository**
```bash
git clone https://github.com/andr3sEnrique/projet-final-vue-mael-andres.git
cd projet-final-vue-mael-andres
```

2. **Installer les dépendances**
```bash
npm install
```

3. **Lancer l'application en mode développement**
```bash
npm run dev
```

4. **Accéder à l'application**
Ouvrez votre navigateur et rendez-vous sur `http://localhost:5173`

### Commandes disponibles
- `npm run dev` - Lance le serveur de développement
- `npm run build` - Construit l'application pour la production
- `npm run preview` - Prévisualise la version de production

## Utilisateurs de Test

L'application inclut des utilisateurs de test avec différents rôles pour faciliter les démonstrations :

### 👨‍💼 Manager
- **Email :** `manager@test.com`
- **Mot de passe :** `123`
- **Rôles :** Manager
- **Permissions :** Création/édition de projets, gestion complète des tâches

### 👨‍💻 Développeur
- **Email :** `dev@test.com`
- **Mot de passe :** `123`
- **Rôles :** Développeur
- **Permissions :** Consultation et mise à jour des tâches assignées

### 👨‍💼👨‍💻 Utilisateur Dual
- **Email :** `dual@test.com`
- **Mot de passe :** `123`
- **Rôles :** Manager + Développeur
- **Permissions :** Accès complet aux fonctionnalités

## ⚠️ Note sur les Données Statiques

L'application contient des données statiques pré-configurées pour faciliter les tests et démonstrations. Cependant, lors de nos tests, nous avons identifié certains bugs liés à l'utilisation de ces données statiques.

**Recommandation :** Pour une expérience optimale et éviter les problèmes potentiels, nous recommandons fortement de créer vos propres données (projets, tâches, utilisateurs) plutôt que d'utiliser les données de démonstration existantes.

## 🤖 Utilisation de l'Intelligence Artificielle

L'intelligence artificielle a joué un rôle fondamental dans le développement de ce projet, particulièrement dans :

- **Sélection des dépendances** : Aide à choisir les meilleures bibliothèques et frameworks pour les besoins du projet
- **Implémentation des dépendances** : Assistance dans la configuration et l'intégration des différentes technologies
- **Architecture du code** : Conseils sur la structure et l'organisation du projet
- **Résolution de problèmes** : Support pour déboguer et optimiser le code
- **Bonnes pratiques** : Guidance sur les standards de développement Vue.js et JavaScript

## Structure du Projet

```
projet-final-vue-mael-andres/
├── public/
│   └── favicon.ico
├── src/
│   ├── assets/                 # Ressources statiques (CSS, images)
│   │   ├── base.css
│   │   ├── logo.svg
│   │   └── main.css
│   ├── components/             # Composants réutilisables
│   │   ├── TheNavbar.vue
│   │   ├── projects/           # Composants liés aux projets
│   │   │   ├── ProjectActions.vue
│   │   │   ├── ProjectForm.vue
│   │   │   └── TaskDetailsModal.vue
│   │   └── tasks/              # Composants liés aux tâches
│   │       ├── DeveloperTasksView.vue
│   │       ├── ManagerTasksView.vue
│   │       ├── TaskDetailsModal.vue
│   │       ├── TaskFiltersBar.vue
│   │       └── TaskFormModal.vue
│   ├── data/                   # Données statiques et énumérations
│   │   ├── seed.js
│   │   └── statusEnum.js
│   ├── router/                 # Configuration du routage
│   │   └── index.js
│   ├── stores/                 # Gestion d'état Pinia
│   │   └── dataStore.js
│   ├── utils/                  # Fonctions utilitaires
│   │   ├── auth.js
│   │   ├── statusTransitions.js
│   │   └── statusUtils.js
│   ├── views/                  # Pages principales
│   │   ├── CreateProjectView.vue
│   │   ├── EditProjectView.vue
│   │   ├── HomeView.vue
│   │   ├── LoginView.vue
│   │   ├── ProjectView.vue
│   │   ├── RegisterView.vue
│   │   └── TaskView.vue
│   ├── App.vue                 # Composant racine
│   └── main.js                 # Point d'entrée de l'application
├── index.html                  # Template HTML principal
├── package.json                # Dépendances et scripts
├── vite.config.js             # Configuration Vite
└── README.md                   # Documentation du projet
```

## Contributeurs

- **Maël** - Développeur Frontend
- **Andrés** - Développeur Frontend

---

*Développé avec ❤️ en utilisant Vue.js 3 et les technologies web modernes*
