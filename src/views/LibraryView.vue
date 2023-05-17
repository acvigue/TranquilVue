<template>
  <div>
    <TrackPreview
      class="w-64 h-64 rounded-full bg-gray-800"
      lineColor="#ffffff"
      :showBall="false"
      :track="files.tracks.find((v) => v.id === '2CBDAE96-EC22-48B4-A369-BFC624463C5F')"
    />
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
import { computed, ref } from 'vue'

const toast = useToast()
const randomTrackIndex = ref(0)

const playRandom = async function () {
  const randomTrack = files.tracks[randomTrackIndex.value]
  await tableStatus.playFile(`/sd/${randomTrack.id}.thr`)
}

const togglePauseState = async () => {
  try {
    tableStatus.setPausedState(tableStatus.raw.pause === 0)
  } catch (e) {
    toast.error(`Connection error: ${e}`)
  }
}

const skipTrack = async (dir: number) => {
  try {
    tableStatus.skipTrack(dir)
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

const upNextTracks = computed(() => {
  return (
    files
      .getPlaylist(tableStatus.currentPlaylistID)
      ?.db_tracks?.slice(tableStatus.raw.playlistIdx)
      .map((v, i) => {
        return files.getTrackByDBID(v)
      }) ?? []
  )
})

const currentTrack = computed(() => {
  return files.getTrack(tableStatus.currentTrackID)
})

setInterval(() => {
  randomTrackIndex.value = Math.floor(Math.random() * files.tracks.length)
}, 2500)
</script>
