<script setup lang="ts">
import ModalTemplate from './helpers/ModalTemplate.vue'
import ModalHeader from './helpers/ModalHeader.vue'

interface OverplayConfirmationModalProps {
  currentlyPlayingItemName: string
}

defineProps<OverplayConfirmationModalProps>()

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'confirm'): void
}>()
</script>

<template>
  <ModalTemplate @close="emit('close')">
    <ModalHeader title="Wait!" @close="emit('close')"/>
    <span class="text-md text-medium"
      >'{{ currentlyPlayingItemName }}' is already playing. Continuing will stop playback.</span
    >
    <div class="flex justify-end gap-4">
      <button
        @click="emit('close')"
        class="hover:scale-105 hover:bg-gray-500 transform-gpu duration-300 disabled:scale-100 disabled:text-gray-500 px-4 py-2 rounded-lg bg-gray-600"
      >
        Cancel
      </button>
      <button
        @click="emit('confirm')"
        class="hover:scale-105 hover:bg-blue-500 transform-gpu duration-300 disabled:scale-100 disabled:text-gray-500 px-4 py-2 rounded-lg bg-blue-600"
      >
        OK
      </button>
    </div>
  </ModalTemplate>
</template>
