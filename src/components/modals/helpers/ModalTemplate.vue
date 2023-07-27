<script setup lang="ts">
import { VueFinalModal } from 'vue-final-modal'

interface ModalTemplateProps {
  borderColor?: 'red' | 'gray' | 'green'
  z?: 5000 | 10000
}

const emit = defineEmits(['close'])

defineProps<ModalTemplateProps>()
</script>

<template>
  <VueFinalModal
    :class="{
      '!z-[5000]': z === 5000,
      '!z-[10000]': z === 10000
    }"
    contentTransition="fade-y"
    overlayTransition="fade"
    content-class="absolute inset-0"
  >
    <div class="absolute inset-0 h-full overflow-auto" @click.self="() => emit('close')">
      <div
        class="flex flex-col max-w-xl mx-auto my-12 p-4 gap-4 bg-gray-900 border-[3px] rounded-2xl"
        :class="{
          'border-red-800': borderColor === 'red',
          'border-green-800': borderColor === 'green',
          'border-gray-800': !borderColor || borderColor === 'gray'
        }"
      >
        <slot></slot>
      </div>
    </div>
  </VueFinalModal>
</template>
