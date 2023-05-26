<script setup lang="ts">
import useTableLightsStore from '@/stores/tableLights'
import { VueFinalModal } from 'vue-final-modal'
import { XMarkIcon } from '@heroicons/vue/24/outline'
import { computed } from 'vue'
import { FormKit } from '@formkit/vue'
import { VSwatches } from 'vue3-swatches-next'
import 'vue3-swatches-next/dist/style.css'
import swatches from '@/assets/colorSwatches'
import type { FormKitNode } from '@formkit/core'

const emit = defineEmits<{
  (e: 'close'): void
}>()

const effects = [
  { label: 'Solid', value: 0 },
  { label: 'Rainbow', value: 1 },
  { label: 'Motion Tracked', value: 2 }
]

const lights = useTableLightsStore()

const primaryColor = computed({
  // return hex
  get() {
    const rgb = lights.primaryColor
    const hex = rgbToHex(rgb)
    return hex
  },

  // given hex, set rgb
  set(newValue: string) {
    const rgb = hexToRgb(newValue)
    lights.primaryColor = rgb
  }
})

const secondaryColor = computed({
  // return hex
  get() {
    const rgb = lights.secondaryColor
    const hex = rgbToHex(rgb)
    return hex
  },

  // given hex, set rgb
  set(newValue: string) {
    const rgb = hexToRgb(newValue)
    lights.secondaryColor = rgb
  }
})

function hexToRgb(hex: string): [number, number, number] {
  var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex) ?? ['', '', '', '']
  return [parseInt(result[1], 16), parseInt(result[2], 16), parseInt(result[3], 16)]
}

function componentToHex(c: number) {
  var hex = c.toString(16)
  return hex.length === 1 ? '0' + hex : hex
}

function rgbToHex(color: number[]) {
  return '#' + componentToHex(color[0]) + componentToHex(color[1]) + componentToHex(color[2])
}
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
          <span class="text-xl font-medium overflow-hidden line-clamp-1 break-words">Lights</span>
        </div>
        <div class="flex-1 flex justify-end items-center">
          <FormKit
            type="toggle"
            outer-class="!mb-0"
            wrapper-class="!mb-0 justify-end"
            v-model="lights.on"
            off-value-label="OFF"
            on-value-label="ON"
          />
        </div>
      </div>

      <!-- Brightness -->
      <div class="flex flex-col w-full gap-4 p-4 bg-gray-700 rounded-xl">
        <FormKit
          type="toggle"
          off-value-label="OFF"
          on-value-label="ON"
          v-model="lights.autoDimEnabled"
          label="Automatic Brightness"
        />
        <FormKit
          type="slider"
          label="Brightness"
          v-model="lights.brightness"
          :disabled="lights.autoDimEnabled"
          :delay="500"
          min="0"
          max="255"
        />
      </div>

      <!-- Colors -->
      <div class="flex w-full justify-evenly gap-4">
        <div class="flex flex-col w-full items-center gap-4 p-4 bg-gray-700 rounded-xl">
          <span class="text-lg font-medium">Primary Color</span>
          <VSwatches background-color="#111827" v-model="primaryColor" :swatches="swatches" />
        </div>
        <div class="flex flex-col w-full items-center gap-4 p-4 bg-gray-700 rounded-xl">
          <span class="text-lg font-medium">Secondary Color</span>
          <VSwatches background-color="#111827" v-model="secondaryColor" :swatches="swatches" />
        </div>
      </div>

      <div class="flex flex-col w-full gap-4 p-4 bg-gray-700 rounded-xl pb-1">
        <div class="flex justify-between w-full items-center">
          <FormKit
            type="dropdown"
            name="effect"
            label="Light Effect"
            v-model="lights.effectID"
            @input="(_x: any, node: FormKitNode) => { lights.effectID = node.value as number }"
            :options="effects"
          />
        </div>
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
