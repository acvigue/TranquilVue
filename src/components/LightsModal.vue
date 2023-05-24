<script setup lang="ts">
import useTableLightsStore from '../stores/tableLights'
import { VueFinalModal } from 'vue-final-modal'
import { XMarkIcon } from '@heroicons/vue/24/outline'
import { computed } from 'vue'
import { useModal } from 'vue-final-modal'
import ColorPickerWidget from './ColorPickerWidget.vue'
import { FormKit } from '@formkit/vue'
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

const primaryColor = computed(() => {
  return `rgb(${lights.primaryColor.join(',')})`
})

const secondaryColor = computed(() => {
  return `rgb(${lights.secondaryColor.join(',')})`
})

const openPrimaryColorModal = async () => {
  const { open, close } = useModal({
    component: ColorPickerWidget,
    attrs: {
      color: primaryColor,
      onClose() {
        close()
      },
      onColorChange(color) {
        lights.primaryColor = color
          .slice(color.indexOf('(') + 1, color.indexOf(')'))
          .split(', ')
          .map((v) => {
            return parseInt(v)
          })
        lights.update()
      }
    }
  })
  await open()
}

const openSecondaryColorModal = async () => {
  const { open, close } = useModal({
    component: ColorPickerWidget,
    attrs: {
      color: secondaryColor,
      onClose() {
        close()
      },
      onColorChange(color) {
        lights.secondaryColor = color
          .slice(color.indexOf('(') + 1, color.indexOf(')'))
          .split(', ')
          .map((v) => {
            return parseInt(v)
          })
        lights.update()
      }
    }
  })
  await open()
}
</script>

<template>
  <VueFinalModal
    contentTransition="fade-y"
    overlayTransition="fade"
    class="flex justify-center items-end"
    content-class="w-full h-[70vh] p-4 bg-gray-900 border-[3px] border-gray-800 rounded-2xl overflow-scroll"
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
          <label class="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              v-model="lights.on"
              @change="lights.update()"
              class="sr-only peer"
            />
            <div
              class="w-11 h-6 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-800 rounded-full peer bg-gray-400 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all border-gray-600 peer-checked:bg-blue-600"
            ></div>
          </label>
        </div>
      </div>

      <!-- Brightness -->
      <div class="flex flex-col w-full gap-4 p-4 bg-gray-700 rounded-xl">
        <div class="flex justify-between w-full">
          <span class="text-lg font-medium">Brightness</span>
          <div class="flex items-center gap-4">
            <span class="text-md font-medium">Automatic</span>
            <label class="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                v-model="lights.autoDimEnabled"
                @change="lights.update()"
                class="sr-only peer"
              />
              <div
                class="w-11 h-6 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-800 rounded-full peer bg-gray-400 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all border-gray-600 peer-checked:bg-blue-600"
              ></div>
            </label>
          </div>
        </div>
        <input
          id="default-range"
          type="range"
          min="0"
          max="255"
          v-model="lights.brightness"
          @change="lights.update()"
          v-if="!lights.autoDimEnabled"
          class="w-full h-3 rounded-lg cursor-pointer bg-gray-600 disabled:opacity-75 disabled:pointer-events-none"
        />
      </div>

      <!-- Colors -->
      <div class="flex flex-col w-full gap-4 p-4 bg-gray-700 rounded-xl">
        <div class="flex justify-between w-full items-center">
          <span class="text-lg font-medium">Primary Color</span>
          <button
            @click="openPrimaryColorModal()"
            class="w-10 h-10 rounded-full border-[2px] border-gray-400"
            :style="{ 'background-color': primaryColor }"
          ></button>
        </div>
      </div>

      <div class="flex flex-col w-full gap-4 p-4 bg-gray-700 rounded-xl -mt-2 mb-2">
        <div class="flex justify-between w-full items-center">
          <span class="text-lg font-medium">Secondary Color</span>
          <button
            @click="openSecondaryColorModal()"
            class="w-10 h-10 rounded-full border-[2px] border-gray-400"
            :style="{ 'background-color': secondaryColor }"
          ></button>
        </div>
      </div>

      <div class="flex flex-col w-full gap-4 p-4 bg-gray-700 rounded-xl -mt-2 pb-2">
        <div class="flex justify-between w-full items-center">
          <FormKit
            type="dropdown"
            name="effect"
            label="Light Effect"
            v-model="lights.effectID"
            @input="(_x: any, node: FormKitNode) => { lights.setEffect(node.value as number) }"
            :options="effects"
          />
        </div>
      </div>
    </div>
  </VueFinalModal>
</template>
