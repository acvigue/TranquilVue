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
  <RouterView v-slot="{ Component, route }">
    <Transition name="fade" mode="out-in">
      <component :is="Component" :key="route.path" class="mb-20" />
    </Transition>
  </RouterView>

  <AppFooter />

  <!-- Loader messages -->
  <FullScreenLoader
    :message="loader.loaderMessages[loader.activeLoaders[0]].message"
    :z-index="loader.loaderMessages[loader.activeLoaders[0]].zIndex"
    v-if="loader.activeLoaders.length !== 0"
  ></FullScreenLoader>

  <ModalsContainer />
</template>
