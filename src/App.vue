<script setup lang="ts">
import { RouterView } from 'vue-router'

import useFilesStore from './stores/files'
import useTableStatusStore from './stores/tableStatus'
import useTableLightsStore from './stores/tableLights'
import useTableWiFiStore from './stores/tableWiFi'
import useTableSecurityStore from './stores/tableSecurity'
import { ModalsContainer } from 'vue-final-modal'
import 'vue-final-modal/style.css'

import AppFooter from './components/AppFooter.vue'
import FullScreenLoader from './components/FullScreenLoader.vue'

const files = useFilesStore()
const tableStatus = useTableStatusStore()
const tableLights = useTableLightsStore()
const tableWiFi = useTableWiFiStore()
const tableSecurity = useTableSecurityStore()

files.refreshFiles()
</script>

<template>
  <RouterView v-slot="{ Component, route }" class="h-[calc(100dvh-3.5rem)]">
    <Transition name="fade" mode="out-in">
      <component :is="Component" :key="route.path" />
    </Transition>
  </RouterView>

  <AppFooter />

  <!-- Loader messages -->
  <FullScreenLoader
    :active="files.loaderActive"
    :message="files.loaderMessage"
    :over-modal="true"
  ></FullScreenLoader>
  <FullScreenLoader
    :active="tableStatus.loaderActive"
    :message="tableStatus.loaderMessage"
    :over-modal="true"
  ></FullScreenLoader>
  <FullScreenLoader
    :active="tableLights.loaderActive"
    :message="tableLights.loaderMessage"
    :over-modal="true"
  ></FullScreenLoader>
  <FullScreenLoader
    :active="tableWiFi.loaderActive"
    :message="tableWiFi.loaderMessage"
    :over-modal="true"
  ></FullScreenLoader>
  <FullScreenLoader
    :active="tableSecurity.loaderActive"
    :message="tableSecurity.loaderMessage"
    :over-modal="true"
  ></FullScreenLoader>

  <ModalsContainer />
</template>
