<template>
  <div class="mx-[5vw] flex flex-col gap-5 justify-start items-center pt-5">
    <span class="font-semibold text-2xl text-center mb-[-1rem]">Patterns</span>
    <TabNav :tabs="['Downloaded', 'All']" v-model="viewType"></TabNav>
    <Transition name="fade" mode="out-in">
      <div v-if="viewType == 0" class="w-full pb-20">
        <!-- downloaded -->
        <ScrollGrid
          :length="files.patterns.length"
          :pageProvider="downloadedPatternScrollPageProvider"
          :pageSize="Math.min(files.patterns.length, 2)"
          class="grid xl:grid-cols-5 lg:grid-cols-4 md:grid-cols-3 grid-cols-2 gap-6"
        >
          <template v-slot:default="{ item, style }: { item: Pattern, style: StyleValue }">
            <button
              :style="style"
              @click="showDownloadedPatternModal(item)"
              class="group flex flex-col items-center p-4 rounded-xl bg-gray-700 gap-3 hover:bg-gray-600 active:scale-90 transition transform-gpu duration-300"
            >
              <PatternPreview
                :pattern="item"
                :key="item.uuid"
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
        <!-- all -->
        <ScrollGrid
          :length="allPatterns.length"
          :pageProvider="allPatternsScrollPageProvider"
          :pageSize="Math.min(allPatterns.length, 2)"
          class="grid xl:grid-cols-5 lg:grid-cols-4 md:grid-cols-3 grid-cols-2 gap-6"
        >
          <template v-slot:default="{ item, style }: { item: Pattern, style: StyleValue }">
            <button
              :style="style"
              @click="showDownloadedPatternModal(item)"
              class="group flex flex-col items-center p-4 rounded-xl bg-gray-700 gap-3 hover:bg-gray-600 active:scale-90 transition transform-gpu duration-300"
            >
              <PatternPreview
                :pattern="item"
                :key="item.uuid"
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
import tranquilapi from '../plugins/tranquilapi'

import PatternPreview from '../components/PatternPreview.vue'
import TabNav from '../components/TabNav.vue'
import ScrollGrid from 'vue-virtual-scroll-grid'
import { onMounted, ref } from 'vue'
import type { StyleValue } from 'vue'

import { useModal } from 'vue-final-modal'
import PlaylistModal from '../components/PlaylistModal.vue'
import PatternModal from '../components/PatternModal.vue'
import { useToast } from 'vue-toast-notification'

const files = useFilesStore()
const toast = useToast()

let allPatterns = ref([] as Pattern[])
onMounted(async () => {
  try {
    allPatterns.value = (await tranquilapi.get('/patterns')).data as Pattern[]
  } catch (e) {
    toast.error(`Couldn't get hosted patterns`)
    return
  }
})

const downloadedPatternScrollPageProvider = async function (pageNumber: number, pageSize: number) {
  const slice = files.patterns.slice(pageNumber * pageSize, (pageNumber + 1) * pageSize)
  return Promise.resolve(slice)
}

const allPatternsScrollPageProvider = async function (pageNumber: number, pageSize: number) {
  const slice = allPatterns.value.slice(pageNumber * pageSize, (pageNumber + 1) * pageSize)
  return Promise.resolve(slice)
}

const showDownloadedPatternModal = async function (pattern: Pattern) {
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

const showDownloadablePatternModal = async function (pattern: Pattern) {
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

//0 => patterns, 1 => playlists
const viewType = ref(0)
</script>
