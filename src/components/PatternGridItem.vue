<script setup lang="ts">
import type { Pattern } from '@/stores/files'
import type { StyleValue } from 'vue'
import { HeartIcon, ArrowDownTrayIcon } from '@heroicons/vue/24/solid'
import useFilesStore from '@/stores/files'
import PatternPreview from '@/components/PatternPreview.vue'
import { computed } from 'vue'

interface PatternGridItemPlaceholderProps {
  style?: StyleValue
  item: Pattern
}

const files = useFilesStore()
const props = defineProps<PatternGridItemPlaceholderProps>()

const isPatternDownloaded = computed(() => {
  return files.patterns.find((pattern) => pattern.uuid === props.item.uuid) !== undefined
})
</script>

<template>
  <button
    :style="style"
    :class="{ 'border-orange-500': !isPatternDownloaded }"
    class="group flex flex-col items-center border border-gray-500 p-4 rounded-xl bg-gray-700 gap-3 hover:bg-gray-600 active:scale-90 transition transform-gpu duration-300 relative"
  >
    <HeartIcon class="absolute z-20 top-3 right-3 text-red-400 w-4 md:w-7" v-if="item.isFavorite" />
    <ArrowDownTrayIcon
      class="absolute z-20 top-3 right-3 text-orange-400 w-3 md:w-6"
      v-if="!isPatternDownloaded"
    />
    <PatternPreview
      :pattern="item"
      :key="item.uuid"
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
