<script setup lang="ts">
import ModalTemplate from './helpers/ModalTemplate.vue'
import ModalHeader from './helpers/ModalHeader.vue'

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
  <ModalTemplate border-color="red" @close="emit('close')">
    <ModalHeader title="Are you sure?" @close="emit('close')"/>
    <div class="flex flex-col gap-8">
      <span class="text-md font-medium w-full text-center">
        Deleting '{{ itemName.trim() }}' cannot be undone
      </span>
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
  </ModalTemplate>
</template>
