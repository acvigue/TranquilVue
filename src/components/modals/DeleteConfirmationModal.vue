<script setup lang="ts">
import { VueFinalModal } from 'vue-final-modal'

interface DeleteConfirmationModalProps {
  itemName: string
}

defineProps<DeleteConfirmationModalProps>()

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'confirm'): void
}>()
</script>

<template>
  <VueFinalModal
    class="flex justify-center items-center"
    contentTransition="fade-y"
    overlayTransition="fade"
    content-class="p-4 bg-gray-900 border-[3px] border-red-800 rounded-2xl"
  >
    <div class="flex flex-col gap-8">
      <span class="text-lg font-medium w-full text-center"> Are you sure? </span>
      <span class="text-md text-medium">Deleting '{{ itemName }}' cannot be undone</span>
      <div class="flex justify-end gap-4">
        <button
          @click="emit('close')"
          class="hover:scale-105 hover:bg-gray-500 transform-gpu duration-300 disabled:scale-100 disabled:text-gray-500 px-4 py-2 rounded-lg bg-gray-600"
        >
          Cancel
        </button>
        <button
          @click="emit('confirm')"
          class="hover:scale-105 hover:bg-red-500 transform-gpu duration-300 disabled:scale-100 disabled:text-gray-500 px-4 py-2 rounded-lg bg-red-600"
        >
          Delete
        </button>
      </div>
    </div>
  </VueFinalModal>
</template>
