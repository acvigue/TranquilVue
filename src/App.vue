<script setup lang="ts">
import { RouterView } from 'vue-router'
import AppFooter from './components/AppFooter.vue'

import useFilesStore from './stores/files'
import useTableStatusStore from './stores/tableStatus'

const files = useFilesStore()
const tableStatus = useTableStatusStore()

files.refreshFiles()

import FullScreenLoader from './components/FullScreenLoader.vue'
</script>

<template>
  <RouterView v-slot="{ Component, route }" class="h-screen pb-14">
    <Transition name="fade" mode="out-in">
      <component :is="Component" :key="route.path" />
    </Transition>
  </RouterView>

  <AppFooter />

  <!-- Loader messages -->
  <FullScreenLoader :active="files.loaderActive" :message="files.loaderMessage"></FullScreenLoader>
  <FullScreenLoader
    :active="tableStatus.loaderActive"
    :message="tableStatus.loaderMessage"
  ></FullScreenLoader>
</template>
