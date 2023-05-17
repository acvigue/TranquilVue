<template>
  <div class="mx-[5vw] flex flex-col gap-5 justify-start items-center pt-5">
    <span class="font-semibold text-2xl text-center mb-[-1rem]">Library</span>
    <TabNav :tabs="['Tracks', 'Playlists']" v-model="libraryView"></TabNav>
    <Transition name="fade" mode="out-in">
      <div v-if="libraryView == 0" class="grid grid-cols-2 gap-5">
        <!-- tracks -->
        <div
          v-for="track of files.tracks"
          :key="track.id"
          class="flex flex-col items-center p-4 rounded bg-gray-700 max-w-44 gap-4"
        >
          <TrackPreview
            :track="track"
            class="h-[33vw] w-[33vw] rounded-full border-gray-600 border-[3px]"
            lineColor="#ffffff"
            :showBall="false"
          />
          <span class="w-full text-left pl-2 line-clamp-1 text-ellipsis overflow-hidden">
            {{ track.name }}</span
          >
        </div>
      </div>
      <div v-else class="grid grid-cols-2 w-full">
        <!-- playlists -->
        <div v-for="playlist of files.playlists" :key="playlist.id">
          {{ playlist.name }}
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import useTableStatusStore from '../stores/tableStatus'
import useFilesStore from '../stores/files'
import TrackPreview from '../components/TrackPreview.vue'
import TabNav from '../components/TabNav.vue'

import { useToast } from 'vue-toast-notification'
import 'vue-toast-notification/dist/theme-sugar.css'
import { computed, ref } from 'vue'

const tableStatus = useTableStatusStore()
const files = useFilesStore()
const toast = useToast()

//0 => tracks, 1 => playlists
const libraryView = ref(0)
</script>
