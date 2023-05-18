<script setup lang="ts">
import { RouterView } from 'vue-router'

import useFilesStore from './stores/files'
import useTableStatusStore from './stores/tableStatus'

import { ModalsContainer } from 'vue-final-modal'
import 'vue-final-modal/style.css'

import AppFooter from './components/AppFooter.vue'
import FullScreenLoader from './components/FullScreenLoader.vue'

const files = useFilesStore()
const tableStatus = useTableStatusStore()

files.refreshFiles()
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

  <ModalsContainer />
</template>
