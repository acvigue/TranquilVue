<template>
  <div class="mx-[5vw] flex flex-col gap-5 justify-start items-center pt-5">
    <span class="font-semibold text-2xl text-center mb-[-1rem]">Webcenter</span>
    <TabNav :tabs="['Patterns', 'Playlists']" v-model="libraryView"></TabNav>
    <Transition name="fade" mode="out-in">
      <div v-if="libraryView == 0" class="w-full pb-20">
        <!-- patterns -->
        <ScrollGrid
          :length="files.patterns.length"
          :pageProvider="patternScrollPageProvider"
          :pageSize="Math.min(files.patterns.length, 2)"
          class="grid xl:grid-cols-5 lg:grid-cols-4 md:grid-cols-3 grid-cols-2 gap-6"
        >
          <template v-slot:default="{ item, style }: { item: Pattern, style: StyleValue }">
            <button
              :style="style"
              @click="showPatternModal(item)"
              class="group flex flex-col items-center p-4 rounded-xl bg-gray-700 gap-3 hover:bg-gray-600 active:scale-90 transition transform-gpu duration-300"
            >
              <PatternPreview
                :pattern="item"
                :key="item.id"
                class="h-44 w-44 rounded-full border-gray-500 border-[3px] bg-gray-800 group-hover:scale-105 transition transform-gpu duration-300"
                lineColor="#ffffff"
                :showBall="false"
              />
              <span
                class="w-[90%] text-center text-md font-medium line-clamp-1 text-ellipsis overflow-hidden break-words"
              >
                {{ item.name }}</span
              >
            </button>
          </template>
          <template v-slot:placeholder="{ style }: { style: StyleValue }">
            <div :style="style" class="flex flex-col items-center m-4 p-2">
              <div class="h-44 w-44 rounded-full border-[3px]"></div>
              <span class="w-[90%] text-md font-medium">...</span>
            </div>
          </template>
          <template v-slot:probe>
            <div class="flex flex-col items-center m-4 p-2">
              <div class="h-44 w-44 rounded-full border-[3px]"></div>
              <span class="w-[90%] text-md font-medium">...</span>
            </div>
          </template>
        </ScrollGrid>
      </div>
      <div v-else class="w-full pb-20">
        <!-- patterns -->
        <ScrollGrid
          :length="files.playlists.length"
          :pageProvider="playlistScrollPageProvider"
          :pageSize="Math.min(files.playlists.length, 2)"
          class="grid xl:grid-cols-5 lg:grid-cols-4 md:grid-cols-3 grid-cols-2 gap-6"
        >
          <template v-slot:default="{ item, style }: { item: Playlist, style: StyleValue }">
            <button
              @click="showPlaylistModal(item)"
              :style="style"
              class="group flex flex-col items-center p-4 rounded-xl bg-gray-700 gap-3 hover:bg-gray-600 transition transform-gpu duration-300"
            >
              <PatternPreview
                :pattern="files.getPatternByDBID(item.db_patterns?.[item.featured_pattern] ?? '466')"
                :key="item.id"
                class="h-44 w-44 rounded-full border-gray-500 border-[3px] bg-gray-800 group-hover:scale-105 transition transform-gpu duration-300"
                lineColor="#ffffff"
                :showBall="false"
              />
              <span
                class="w-[90%] text-center text-md font-medium line-clamp-1 text-ellipsis overflow-hidden break-words"
              >
                {{ item.name }}</span
              >
            </button>
          </template>
          <template v-slot:placeholder="{ style }: { style: StyleValue }">
            <div :style="style" class="flex flex-col items-center m-4 p-2">
              <div class="h-44 w-44 rounded-full border-[3px]"></div>
              <span class="w-[90%] text-md font-medium">...</span>
            </div>
          </template>
          <template v-slot:probe>
            <div class="flex flex-col items-center m-4 p-2">
              <div class="h-44 w-44 rounded-full border-[3px]"></div>
              <span class="w-[90%] text-md font-medium">...</span>
            </div>
          </template>
        </ScrollGrid>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import useFilesStore, { type Playlist, type Pattern } from '../stores/files'
import PatternPreview from '../components/PatternPreview.vue'
import TabNav from '../components/TabNav.vue'
import ScrollGrid from 'vue-virtual-scroll-grid'
import { ref } from 'vue'
import type { StyleValue } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useToast } from 'vue-toast-notification'

import { useModal } from 'vue-final-modal'
import PlaylistModal from '../components/PlaylistModal.vue'
import PatternModal from '../components/PatternModal.vue'

const files = useFilesStore()

const patternScrollPageProvider = async function (pageNumber: number, pageSize: number) {
  const slice = files.patterns.slice(pageNumber * pageSize, (pageNumber + 1) * pageSize)
  return Promise.resolve(slice)
}

const playlistScrollPageProvider = async function (pageNumber: number, pageSize: number) {
  const slice = files.playlists.slice(pageNumber * pageSize, (pageNumber + 1) * pageSize)
  console.log(slice)
  return Promise.resolve(slice)
}

const showPatternModal = async function (pattern: Pattern) {
  const { open, close } = useModal({
    component: PatternModal,
    attrs: {
      pattern: pattern,
      onClose() {
        close()
      }
    }
  })
  await open()
}

const showPlaylistModal = async function (playlist: Playlist) {
  const { open, close } = useModal({
    component: PlaylistModal,
    attrs: {
      playlist: playlist,
      onClose() {
        close()
      }
    }
  })
  await open()
}

//0 => patterns, 1 => playlists
const libraryView = ref(0)
</script>
