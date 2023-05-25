<script setup lang="ts">
import {
  HomeIcon,
  MusicalNoteIcon,
  QueueListIcon,
  AdjustmentsVerticalIcon
} from '@heroicons/vue/24/outline'
import { RouterLink } from 'vue-router'
import useFilesStore from '../stores/files'

const files = useFilesStore()
</script>

<template>
  <div class="fixed bottom-0 left-0 z-40 w-full h-14 bg-gray-700">
    <div class="grid h-full grid-cols-4 mx-auto font-medium">
      <router-link
        to="/"
        active-class="bg-gray-800 [&_*]:text-blue-600"
        class="inline-flex flex-col items-center justify-center px-5 hover:bg-gray-800 group transition transform-gpu duration-300"
      >
        <HomeIcon class="h-6 text-gray-400 group-hover:text-blue-600 duration-300 transform-gpu" />
      </router-link>
      <router-link
        to="/patterns"
        :class="{ 'pointer-events-none': files.loaderActive }"
        active-class="bg-gray-800 [&_*]:text-blue-600"
        class="inline-flex flex-col items-center justify-center px-5 hover:bg-gray-800 group transition transform-gpu duration-300"
      >
        <MusicalNoteIcon
          class="h-6 text-gray-400 group-hover:text-blue-600 duration-300 transform-gpu"
        />
      </router-link>
      <router-link
        to="/playlists"
        :class="{ 'pointer-events-none': files.loaderActive }"
        active-class="bg-gray-800 [&_*]:text-blue-600"
        class="inline-flex flex-col items-center justify-center px-5 hover:bg-gray-800 group transition transform-gpu duration-300"
      >
        <QueueListIcon
          class="h-6 text-gray-400 group-hover:text-blue-600 duration-300 transform-gpu"
        />
      </router-link>
      <router-link
        to="/settings"
        active-class="bg-gray-800 [&_*]:text-blue-600"
        class="inline-flex flex-col items-center justify-center px-5 hover:bg-gray-800 group transition transform-gpu duration-300"
      >
        <AdjustmentsVerticalIcon
          class="h-6 text-gray-400 group-hover:text-blue-600 duration-300 transform-gpu"
        />
      </router-link>
    </div>
  </div>
</template>
