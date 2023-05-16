<script setup lang="ts">
import { RouterView } from 'vue-router'
import AppFooter from './components/AppFooter.vue'

import useFilesStore from './stores/files';
const files = useFilesStore();

import FullScreenLoader from './components/FullScreenLoader.vue'
</script>

<template>
  <RouterView class="mb-16" />
  <AppFooter />

  <!-- Loader messages -->
  <FullScreenLoader :active="files.loaderActive" :message="files.loaderMessage"></FullScreenLoader>
</template>
