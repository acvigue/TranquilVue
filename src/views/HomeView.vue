<template>
  <div class="mx-[5vw] flex flex-col gap-4 justify-evenly items-center pt-5">
    <TranquilLogoWhite class="font-semibold text-2xl text-center fill-gray-200 h-20" />

    <template v-if="tableStatus.status === 'idle'">
      <div class="flex flex-col from-red-50 via-slate-50 items-center flex-grow justify-center gap-4">
        <span class="text-lg font-semibold">Play Something</span>
        <div :style="gradientColorStops" class="p-1 rounded-full">
          <PatternPreview
            class="w-64 h-64 rounded-full bg-gray-800"
            lineColor="#ffffff"
            :showBall="false"
            :pattern="files.patterns[randomPatternIndex]"
          >
            <div
              class="cursor-pointer relative w-full h-full rounded-full flex justify-center items-center group"
              @click="router.push('/library')"
            >
              <div
                class="absolute inset-0 rounded-full bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-gray-900 via-gray-900 to-gray-800 w-full h-full opacity-50 group-hover:opacity-80 transition transform-gpu duration-300"
              ></div>
              <div class="relative">
                <PlayIcon
                  class="w-10 h-10 group-hover:scale-105 transition transform-gpu duration-300"
                ></PlayIcon>
              </div>
            </div>
          </PatternPreview>
        </div>
      </div>
    </template>
    <template v-else>
      <div
        class="flex flex-col from-red-50 via-slate-50 items-center flex-grow justify-center gap-8"
      >
        <span class="font-semibold text-xl">Now Playing</span>

        <div class="flex flex-row items-center justify-around gap-4">
          <BackwardIcon
            @click.stop="skipPattern(-1)"
            v-if="tableStatus.isPlaylist"
            class="w-8 hover:text-white cursor-pointer"
          ></BackwardIcon>
          <div :style="gradientColorStopsProgress" class="p-1 rounded-full">
            <PatternPreview
              class="w-64 h-64 rounded-full bg-gray-800"
              lineColor="#ffffff"
              :pattern="currentPattern"
            >
              <div
                class="relative w-full h-full rounded-full flex justify-center items-center group cursor-pointer"
                @click="togglePauseState()"
              >
                <div
                  class="absolute inset-0 rounded-full bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-gray-900 via-gray-900 to-gray-800 w-full h-full opacity-50 group-hover:opacity-80 transition transform-gpu duration-300"
                ></div>
                <div class="relative">
                  <PlayIcon
                    v-if="tableStatus.raw.pause === 1"
                    class="w-14 group-hover:scale-105 transition transform-gpu duration-300"
                  ></PlayIcon>
                  <PauseIcon
                    v-else
                    class="w-14 group-hover:scale-105 transition transform-gpu duration-300"
                  ></PauseIcon>
                </div>
              </div>
            </PatternPreview>
          </div>
          <ForwardIcon
            @click.stop="skipPattern(1)"
            v-if="tableStatus.isPlaylist"
            class="w-8 hover:text-white cursor-pointer"
          ></ForwardIcon>
        </div>
        <div class="flex flex-col items-center">
          <span class="mt-2 text-lg font-semibold">{{ currentPattern?.name ?? '...' }}</span>
        </div>

        <div v-if="tableStatus.isPlaylist" class="flex items-center gap-4">
          <div @click="toggleRepeatState()">rep</div>
          <div @click="toggleShuffleState()">shuf</div>
        </div>
      </div>
      <template v-if="tableStatus.isPlaylist">
        <div
          class="flex flex-col from-red-50 via-slate-50 items-center flex-grow justify-center mt-4 pb-16"
        >
          <span class="font-semibold text-xl mb-2">Up Next</span>
          <div class="grid grid-cols-2 gap-8">
            <div
              class="p-4 flex flex-col items-center justify-between h-60 bg-gray-800 rounded-xl"
              v-for="pattern of upNextPatterns"
              :key="pattern.uuid"
            >
              <div class="mb-2">
                <PatternPreview
                  class="w-40 h-40"
                  lineColor="#ffffff"
                  :pattern="pattern"
                ></PatternPreview>
              </div>
              <span
                class="font-medium text-ellipsis text-center overflow-hidden line-clamp-1 w-[80%]"
                >{{ pattern.name }}</span
              >
            </div>
          </div>
        </div>
      </template>
    </template>
  </div>
</template>

<script setup lang="ts">
import useTableStatusStore from '../stores/tableStatus'

import useFilesStore from '../stores/files'
import useTableLightsStore from '../stores/tableLights'

import PatternPreview from '../components/PatternPreview.vue'
import { PlayIcon, PauseIcon, ForwardIcon, BackwardIcon } from '@heroicons/vue/24/outline'
import TranquilLogoWhite from '../assets/tranquil-logo-white.svg'

import { useToast } from 'vue-toast-notification'
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'

import 'vue-toast-notification/dist/theme-sugar.css'

const tableStatus = useTableStatusStore()
const tableLights = useTableLightsStore()
const files = useFilesStore()
const router = useRouter()

const toast = useToast()
const randomPatternIndex = ref(0)

const togglePauseState = async () => {
  try {
    tableStatus.setPausedState(tableStatus.raw.pause === 0)
  } catch (e) {
    toast.error(`Connection error: ${e}`)
  }
}

const skipPattern = async (dir: number) => {
  try {
    tableStatus.skipPattern(dir)
  } catch (e) {
    toast.error(`Connection error: ${e}`)
  }
}

const toggleRepeatState = async () => {
  try {
    tableStatus.setRepeat(!tableStatus.raw.repeatMode)
  } catch (e) {
    toast.error(`Connection error: ${e}`)
  }
}

const toggleShuffleState = async () => {
  try {
    tableStatus.setShuffle(!tableStatus.raw.shuffleMode)
  } catch (e) {
    toast.error(`Connection error: ${e}`)
  }
}

const upNextPatterns = computed(() => {
  return (
    files
      .getPlaylist(tableStatus.currentPlaylistID)
      ?.patterns?.slice(tableStatus.raw.playlistIdx)
      .map((pattern) => files.getPattern(pattern)) ?? []
  )
})

const currentPattern = computed(() => {
  return files.getPattern(tableStatus.currentPatternID)
})

const gradientColorStops = computed(() => {
  const primaryColor = `rgb(${tableLights.primaryColor.join(',')})`
  const secondaryColor = `rgb(${tableLights.secondaryColor.join(',')})`

  return `background: conic-gradient(${primaryColor}, ${secondaryColor}, ${primaryColor});`
})

const gradientColorStopsProgress = computed(() => {
  const progress = tableStatus.raw.filePos / tableStatus.raw.fileLen // 0.00 -> 1.00
  const progressDeg = parseFloat((progress * 360).toFixed(2))

  const primaryColor = `rgb(${tableLights.primaryColor.join(',')})`
  const secondaryColor = `rgb(${tableLights.secondaryColor.join(',')})`

  return `background: conic-gradient(${primaryColor} 0deg, ${secondaryColor} ${
    progressDeg / 2
  }deg, ${primaryColor} ${progressDeg}deg, rgb(31,41,55) ${progressDeg + 0.001}deg);`
})

setInterval(() => {
  randomPatternIndex.value = Math.floor(Math.random() * files.patterns.length)
}, 2500)
</script>
