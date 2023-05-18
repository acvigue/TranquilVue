<script setup lang="ts">
import type { Playlist } from '@/stores/files'
import { VueFinalModal } from 'vue-final-modal'

interface PlaylistModalProps {
  playlist: Playlist
}

defineProps<PlaylistModalProps>()

const emit = defineEmits<{
  (e: 'confirm'): void
}>()
</script>
<template>
  <VueFinalModal
    transition="modal-sheet"
    class="flex justify-center items-center"
    content-class="flex flex-col max-w-xl mx-4 p-4 bg-white dark:bg-gray-900 border dark:border-gray-700 rounded-lg space-y-2"
  >
    <h1 class="text-xl">
      {{ playlist.name }}
    </h1>

    <button class="mt-1 ml-auto px-2 border rounded-lg" @click="emit('confirm')">Confirm</button>
  </VueFinalModal>
</template>
