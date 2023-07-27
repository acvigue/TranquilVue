<script setup lang="ts">
import useTableLightsStore from '@/stores/tableLights'
import ModalHeader from './helpers/ModalHeader.vue'
import ModalTemplate from './helpers/ModalTemplate.vue'
import { FormKit } from '@formkit/vue'

const emit = defineEmits<{
  (e: 'close'): void
}>()

const lights = useTableLightsStore()
</script>

<template>
  <ModalTemplate @close="emit('close')">
    <ModalHeader title="Light Configuration" @close="emit('close')" />
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
  </ModalTemplate>
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
