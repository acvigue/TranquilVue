<script setup lang="ts">
import { RouterView } from 'vue-router'

import useLoader from '@/stores/loader'
import { ModalsContainer } from 'vue-final-modal'
import 'vue-final-modal/style.css'

import AppFooter from '@/components/AppFooter.vue'
import FullScreenLoader from '@/components/FullScreenLoader.vue'

const loader = useLoader()
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
    :message="loader.loaderMessages[loaderID].message"
    :z-index="loader.loaderMessages[loaderID].zIndex"
    v-for="loaderID in loader.activeLoaders"
    :key="loaderID"
  ></FullScreenLoader>

  <ModalsContainer />
</template>
