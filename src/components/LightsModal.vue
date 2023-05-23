<script setup lang="ts">
import useTableLightsStore from '../stores/tableLights'
import { VueFinalModal } from 'vue-final-modal'
import { XMarkIcon } from '@heroicons/vue/24/outline'
const emit = defineEmits<{
  (e: 'close'): void
}>()

const lights = useTableLightsStore()
</script>
<template>
  <VueFinalModal
    contentTransition="fade-y"
    overlayTransition="fade"
    class="flex justify-center items-end"
    content-class="w-full h-[90vh] p-4 bg-gray-900 border-[3px] border-gray-800 rounded-2xl overflow-scroll"
  >
    <div class="flex flex-col justify-between h-full pb-20">
      <div class="flex justify-between">
        <div class="flex-1">
          <button @click="emit('close')" class="hover:scale-[1.2] transform-gpu duration-300">
            <XMarkIcon class="w-7 h-7" />
          </button>
        </div>
        <div>
          <span class="text-lg font-medium overflow-hidden line-clamp-1 break-words">Lights</span>
        </div>
        <div class="flex-1" />
      </div>
    </div>
  </VueFinalModal>
</template>
