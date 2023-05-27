<script setup lang="ts">
import useTableLightsStore from '@/stores/tableLights'
import { VueFinalModal } from 'vue-final-modal'
import { XMarkIcon } from '@heroicons/vue/24/outline'
import { FormKit } from '@formkit/vue'

const emit = defineEmits<{
  (e: 'close'): void
}>()

const lights = useTableLightsStore()
</script>

<template>
  <VueFinalModal
    contentTransition="fade-y"
    overlayTransition="fade"
    class="flex justify-center items-center"
    content-class="w-[95vw] max-w-4xl p-4 bg-gray-900 border-[3px] border-gray-800 rounded-2xl"
  >
    <div class="flex flex-col justify-start h-full pb-4 gap-4 w-full items-center">
      <!-- Header -->
      <div class="flex justify-between w-full items-center pb-4">
        <div class="flex-1 flex justfiy-start items-center">
          <button @click="emit('close')" class="hover:scale-[1.2] transform-gpu duration-300">
            <XMarkIcon class="w-7 h-7" />
          </button>
        </div>
        <div>
          <span class="text-xl font-medium overflow-hidden line-clamp-1 break-words"
            >Lights (Advanced)</span
          >
        </div>
        <div class="flex-1"></div>
      </div>

      <div class="flex flex-col w-full gap-4 p-4 bg-gray-700 rounded-xl">
        <FormKit
          type="slider"
          label="Dimming Strength"
          min="0"
          max="10"
          step="0.2"
          v-model="lights.autoDimStrength"
          help="Set the lux level for maximum brightness"
          :delay="500"
        />
        <FormKit
          type="slider"
          label="Angle Offset"
          v-model="lights.angleOffset"
          help="Adjust if the lights do not line up with theta axis movement"
          :delay="500"
          min="0"
          max="255"
        />
      </div>
    </div>
  </VueFinalModal>
</template>

<style>
.vue-swatches__container {
  @apply border-[2px] border-gray-400;
}

.vue-swatches {
  @apply !flex !justify-center !items-center;
}

.vue-swatches__trigger__wrapper {
  @apply border-[2px] border-gray-400 rounded-xl;
}
</style>
