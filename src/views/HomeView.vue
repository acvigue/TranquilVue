<template>
  <div class="mx-[5vw] flex flex-col justify-between items-center pt-5 pb-5">
    <TranquilLogoWhite class="font-semibold text-2xl text-center fill-gray-200 h-20" />

    <template v-if="tableStatus.status === 'idle'">
      <div
        class="flex flex-col from-red-50 via-slate-50 items-center flex-grow justify-center gap-4 absolute mb-auto mt-auto top-0 bottom-0 w-full"
      >
        <span class="text-lg font-semibold">Play Something</span>
        <div class="flex flex-row items-center justify-center w-full overflow-hidden">
          <div :style="gradientColorStops" class="p-1 rounded-full">
            <PatternPreview
              class="w-64 h-64 rounded-full bg-gray-800"
              lineColor="#ffffff"
              :key="files.patterns[randomPatternIndex]?.uuid ?? ''"
              :pattern="files.patterns[randomPatternIndex]"
            >
              <div
                class="cursor-pointer relative w-full h-full rounded-full flex justify-center items-center group"
                @click="router.push('/patterns')"
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
      </div>
    </template>
    <template v-else>
      <div
        class="flex flex-col from-red-50 via-slate-50 items-center flex-grow justify-center gap-4 absolute mb-auto mt-auto top-0 bottom-0 w-full"
      >
        <span class="font-semibold text-xl">Now Playing</span>

        <div
          class="flex flex-row items-center justify-between w-full overflow-hidden lg:px-80"
          :class="{ '!justify-center': !tableStatus.isPlaylist }"
        >
          <div
            class="w-32 h-32 rounded-full ml-[-4rem] opacity-40"
            v-if="tableStatus.isPlaylist"
            :class="{ '!opacity-0': tableStatus.raw.playlistIdx == 1 }"
          >
            <PatternPreview
              class="w-full h-full rounded-full bg-gray-800"
              lineColor="#ffffff"
              :pattern="previousPatternInPlaylist"
            >
            </PatternPreview>
          </div>
          <button
            @click="skipPattern(-1)"
            class="w-8 h-8 -ml-16 text-white z-50"
            v-if="tableStatus.isPlaylist"
            :class="{ '!opacity-0': tableStatus.raw.playlistIdx == 1 }"
          >
            <BackwardIcon />
          </button>
          <div :style="gradientColorStops" class="rounded-full">
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
          </div>
          <button
            @click="skipPattern(1)"
            class="w-8 h-8 -mr-16 text-white z-50"
            v-if="tableStatus.isPlaylist"
            :class="{ '!opacity-0': upNextPatterns.length == 0 }"
          >
            <ForwardIcon />
          </button>
          <div
            class="w-32 h-32 rounded-full mr-[-4rem] opacity-40"
            v-if="tableStatus.isPlaylist"
            :class="{ '!opacity-0': upNextPatterns.length == 0 }"
          >
            <PatternPreview
              class="w-full h-full rounded-full bg-gray-800"
              lineColor="#ffffff"
              :pattern="nextPatternInPlaylist"
            />
          </div>
        </div>

        <div class="flex flex-col items-center">
          <span class="mt-2 text-lg font-semibold">{{ currentPattern?.name ?? '...' }} • {{ Math.floor((tableStatus.raw.filePos / tableStatus.raw.fileLen) * 100) }}%</span>
        </div>

        <div v-if="tableStatus.isPlaylist" class="items-center gap-4 hidden">
          <div @click="toggleRepeatState()">rep {{}}</div>
          <div @click="toggleShuffleState()">shuf</div>
        </div>
      </div>
    </template>
    <div class="flex justify-center items-center w-full gap-4">
      <button
        @click="openLightsModal()"
        :class="{ 'border-[2px] border-yellow-200 text-yellow-200 hover:border-blue-600': tableLights.on }"
        class="flex items-center gap-2 justify-center px-4 py-2 bg-gray-700 hover:text-blue-600 hover:bg-gray-800 text-gray-400 group transition transform-gpu duration-300 rounded-full"
      >
        <LightBulbIcon class="h-6 w-6"></LightBulbIcon>
        <span class="text-sm font-medium">Lights</span>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import useTableStatusStore from '../stores/tableStatus'

import useFilesStore, { type Pattern } from '../stores/files'
import useTableLightsStore from '../stores/tableLights'

import LightsModal from '../components/LightsModal.vue'
import PatternPreview from '../components/PatternPreview.vue'
import {
  PlayIcon,
  PauseIcon,
  ForwardIcon,
  BackwardIcon,
  LightBulbIcon
} from '@heroicons/vue/24/outline'
import TranquilLogoWhite from '../assets/tranquil-logo-white.svg'

import { useToast } from 'vue-toast-notification'
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useModal } from 'vue-final-modal'

import 'vue-toast-notification/dist/theme-sugar.css'

const tableStatus = useTableStatusStore()
const tableLights = useTableLightsStore()
const files = useFilesStore()
const router = useRouter()

const toast = useToast()
const randomPatternIndex = ref(0)

const openLightsModal = async () => {
  const { open, close } = useModal({
    component: LightsModal,
    attrs: {
      onClose() {
        close()
      }
    }
  })
  await open()
}

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

const previousPatternInPlaylist = computed(() => {
  if (tableStatus.currentPlaylistID === '') {
    return {
      name: '',
      uuid: '',
      date: '',
      isFavorite: false
    } as Pattern
  }
  const ptrn = files.getPlaylist(tableStatus.currentPlaylistID).patterns[
    Math.max(tableStatus.raw.playlistIdx - 2, 0)
  ]
  return files.getPattern(ptrn)
})

const nextPatternInPlaylist = computed(() => {
  if (tableStatus.currentPlaylistID === '') {
    return {
      name: '',
      uuid: '',
      date: '',
      isFavorite: false
    } as Pattern
  }
  const ptrn = files.getPlaylist(tableStatus.currentPlaylistID).patterns[
    tableStatus.raw.playlistIdx
  ]
  return files.getPattern(ptrn)
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

  return `background: conic-gradient(rgba(0,0,0,0) 0deg, rgba(0,0,0,0) ${progressDeg}deg, rgba(31,44,55,1) ${
    progressDeg + 0.001
  }deg);`
})

setInterval(() => {
  randomPatternIndex.value = Math.floor(Math.random() * files.patterns.length)
}, 2500)
</script>
