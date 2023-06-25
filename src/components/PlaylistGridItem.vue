<script setup lang="ts">
import { type Playlist } from '@/stores/files'
import { ArrowDownTrayIcon } from '@heroicons/vue/24/outline'
import { computed, type StyleValue } from 'vue'
import PatternPreview from '@/components/PatternPreview.vue'
import useFilesStore from '@/stores/files'

interface PlaylistGridItemPlaceholderProps {
  style?: StyleValue
  item: Playlist
}

const files = useFilesStore()
const props = defineProps<PlaylistGridItemPlaceholderProps>()

const isPlaylistDownloaded = computed(() => {
  return files.playlists.find((playlist) => playlist.uuid === props.item.uuid) !== undefined
})
</script>

<template>
  <button
    :style="style"
    :class="{ 'border-orange-500': !isPlaylistDownloaded }"
    class="group flex flex-col items-center border border-gray-500 p-4 rounded-xl bg-gray-700 gap-3 hover:bg-gray-600 active:scale-90 transition transform-gpu duration-300 relative"
  >
    <ArrowDownTrayIcon
      class="absolute z-20 top-3 right-3 text-orange-400 w-3 md:w-6"
      v-if="!isPlaylistDownloaded"
    />
    <PatternPreview
      :pattern="{ uuid: item.featured_pattern, name: '', date: '' }"
      class="h-36 w-36 md:h-44 md:w-44 rounded-full border-gray-500 border-[3px] bg-gray-800 group-hover:scale-105 transition transform-gpu duration-300"
      lineColor="#ffffff"
    />
    <span
      class="w-[90%] text-center text-md font-medium line-clamp-1 text-ellipsis overflow-hidden break-words"
    >
      {{ item.name }}</span
    >
  </button>
</template>
