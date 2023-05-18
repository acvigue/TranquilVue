<script setup lang="ts">
import type { Track } from '@/stores/files'
import { VueFinalModal } from 'vue-final-modal'

interface TrackModalProps {
  track: Track
}

defineProps<TrackModalProps>()

const emit = defineEmits<{
  (e: 'confirm'): void
}>()
</script>
<template>
  <VueFinalModal
    :transition="{
      'enter-active-class': 'transition duration-1000 ease-in-out transform-gpu',
      'enter-from-class': 'translate-y-full',
      'enter-to-class': 'translate-y-0',
      'leave-active-class': 'transition duration-1000 ease-in-out transform-gpu',
      'leave-to-class': 'translate-y-full',
      'leave-from-class': 'translate-y-0'
    }"
    class="flex justify-center items-end"
    content-class="flex flex-col w-full h-[80vh] mx-4 p-4 bg-white dark:bg-gray-900 border dark:border-gray-700 rounded-lg space-y-2"
  >
    <h1 class="text-xl">
      {{ track.name }}
    </h1>

    <button class="mt-1 ml-auto px-2 border rounded-lg" @click="emit('confirm')">Confirm</button>
  </VueFinalModal>
</template>
