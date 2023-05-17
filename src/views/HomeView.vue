<template>
  <div class="mx-[5vw] flex flex-col gap-4 justify-between items-center pt-5">
    <span class="font-semibold text-2xl text-center">{{
      tableSettings.tableName === '' ? 'Oasis Control' : tableSettings.tableName
    }}</span>
    <template v-if="tableStatus.status === 'idle'">
      <template v-if="tableStatus.raw.file !== ''">
        <div class="flex flex-col from-red-50 via-slate-50 items-center flex-grow justify-center">
          <span class="font-semibold text-xl">Last Played</span>
          <div :style="tableStatus.gradientColorStops" class="p-[4px] rounded-full">
            <TrackPreview
              class="w-64 h-64 rounded-full bg-gray-800"
              lineColor="#ffffff"
              :showBall="false"
              :track="files.getTrack(tableStatus.currentTrackID)"
            >
              <div
                class="cursor-pointer relative w-full h-full rounded-full flex justify-center items-center group"
              >
                <div
                  class="absolute inset-0 rounded-full bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-gray-900 via-gray-900 to-gray-800 w-full h-full opacity-50 group-hover:from-gray-700"
                ></div>
                <div class="relative">
                  <PlayIcon class="w-10 h-10"></PlayIcon>
                </div>
              </div>
            </TrackPreview>
          </div>
          <span class="mt-2 text-lg font-semibold">{{
            files.getTrack(tableStatus.currentTrackID).name
          }}</span>
        </div>
      </template>
      <template v-else>
        <div class="flex flex-col from-red-50 via-slate-50 items-center flex-grow justify-center">
          <span class="mb-2 text-lg font-semibold">Play Something</span>
          <div :style="tableStatus.gradientColorStops" class="p-[4px] rounded-full">
            <TrackPreview
              class="w-64 h-64 rounded-full bg-gray-800"
              lineColor="#ffffff"
              :showBall="false"
              :track="files.tracks[randomTrackIndex]"
            >
              <div
                class="cursor-pointer relative w-full h-full rounded-full flex justify-center items-center group"
                @click="playRandom()"
              >
                <div
                  class="absolute inset-0 rounded-full bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-gray-900 via-gray-900 to-gray-800 w-full h-full opacity-50 group-hover:from-gray-700"
                ></div>
                <div class="relative">
                  <PlayIcon class="w-10 h-10"></PlayIcon>
                </div>
              </div>
            </TrackPreview>
          </div>
        </div>
      </template>
    </template>
    <template v-else>
      <div
        class="flex flex-col from-red-50 via-slate-50 items-center flex-grow justify-center mt-12"
      >
        <span class="font-semibold text-xl mb-2">Now Playing</span>
        <div class="flex flex-row items-center justify-around gap-4">
          <BackwardIcon @click.stop="tableStatus.skipTrack(-1)" v-if="tableStatus.isPlaylist" class="w-8 hover:text-white cursor-pointer"></BackwardIcon>
          <div :style="tableStatus.gradientColorStopsProgress" class="p-[4px] rounded-full">
            <TrackPreview
              class="w-64 h-64 rounded-full bg-gray-800"
              lineColor="#ffffff"
              :track="files.getTrack(tableStatus.currentTrackID)"
            >
              <div
                class="relative w-full h-full rounded-full flex justify-center items-center"
              >
                <div
                  class="absolute inset-0 rounded-full bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-gray-900 via-gray-900 to-gray-800 w-full h-full opacity-50"
                ></div>
                <div class="relative" @click="tableStatus.setPausedState(tableStatus.raw.pause == 0)">
                  <PlayIcon v-if="tableStatus.raw.pause == 1" class="cursor-pointer w-14 hover:text-white"></PlayIcon>
                  <PauseIcon v-else class="cursor-pointer w-14 hover:text-white"></PauseIcon>
                </div>
              </div>
            </TrackPreview>
          </div>
          <ForwardIcon @click.stop="tableStatus.skipTrack(1)" v-if="tableStatus.isPlaylist" class="w-8 hover:text-white cursor-pointer"></ForwardIcon>
        </div>
        <span class="mt-2 text-lg font-semibold">{{
          files.getTrack(tableStatus.currentTrackID).name
        }}</span>
        <span class="text-sm font-medium text-gray-400"
          >by {{ files.getTrack(tableStatus.currentTrackID).created_by_name }}</span
        >
        <div class="flex items-center mt-4 gap-4">
          <span>rep</span>
          <span>shuf</span>
        </div>
      </div>
      <template v-if="tableStatus.isPlaylist">
        <div
          class="flex flex-col from-red-50 via-slate-50 items-center flex-grow justify-center mt-12 pb-16"
        >
          <span class="font-semibold text-xl mb-2">Up Next</span>
          <div class="grid grid-cols-2 gap-8">
            <div
              class="p-4 flex flex-col items-center justify-between h-60 bg-gray-800 rounded-xl"
              v-for="[i, pattern] of Object.entries(
                files
                  .getPlaylist(tableStatus.currentPlaylistID)
                  ?.db_tracks?.slice(tableStatus.raw.playlistIdx)
                  .map((v, i) => {
                    return files.getTrackByDBID(v)
                  }) ?? []
              )"
              :key="pattern.id"
            >
              <div class="mb-2">
                <TrackPreview class="w-40 h-40" lineColor="#ffffff" :track="pattern"></TrackPreview>
              </div>
              <span class="font-medium text-ellipsis text-center overflow-hidden line-clamp-1 w-[80%]">{{ pattern.name }}</span>
            </div>
          </div>
        </div>
      </template>
    </template>
  </div>
</template>

<script setup lang="ts">
import useTableStatusStore from '../stores/tableStatus'
import useTableSettingsStore from '../stores/tableSettings'
import useFilesStore from '../stores/files'
import TrackPreview from '@/components/TrackPreview.vue'

import { PlayIcon, PauseIcon, ForwardIcon, BackwardIcon } from '@heroicons/vue/24/outline'

const tableStatus = useTableStatusStore()
const tableSettings = useTableSettingsStore()
const files = useFilesStore()

import { useToast } from 'vue-toast-notification'
import 'vue-toast-notification/dist/theme-sugar.css'
import { ref } from 'vue'

const toast = useToast()
const randomTrackIndex = ref(0)
toast.info('test')

const playRandom = async function () {
  const randomTrack = files.tracks[randomTrackIndex.value]
  await tableStatus.playFile(`/sd/${randomTrack.id}.thr`)
}

setInterval(() => {
  randomTrackIndex.value = Math.floor(Math.random() * files.tracks.length)
}, 2500)
</script>
