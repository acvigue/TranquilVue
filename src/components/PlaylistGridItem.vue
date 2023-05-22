<template>
  <button
    :style="style"
    class="group flex flex-col items-center p-4 rounded-xl bg-gray-700 gap-3 hover:bg-gray-600 active:scale-90 transition transform-gpu duration-300 relative"
  >
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

<script setup lang="ts">
import { type Playlist } from '@/stores/files'
import { type StyleValue } from 'vue'
import PatternPreview from '../components/PatternPreview.vue'

interface PlaylistGridItemPlaceholderProps {
  style?: StyleValue
  item: Playlist
}

defineProps<PlaylistGridItemPlaceholderProps>()
</script>
