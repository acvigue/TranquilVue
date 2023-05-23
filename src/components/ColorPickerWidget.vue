<script setup lang="ts">
import { ColorPicker } from 'vue3-colorpicker'
import { VueFinalModal } from 'vue-final-modal'
import 'vue3-colorpicker/style.css'
import { ref, type Ref, watch } from 'vue';

interface ColorPickerWidgetProps {
  color: Ref<string>
}

const emit = defineEmits<{
  (e: 'colorChange', color: string): void
}>()

const props = defineProps<ColorPickerWidgetProps>()
const color = ref(props.color)

watch(color, () => {
    emit("colorChange", color.value)
})
</script>

<template>
  <VueFinalModal
    contentTransition="fade"
    overlayTransition="fade"
    class="flex justify-center items-center"
    content-class="rounded-2xl"
  >
    <ColorPicker
      shape="circle"
      :disableAlpha="true"
      :disableHistory="true"
      :isWidget="true"
      v-model:pureColor="color"
    />
  </VueFinalModal>
</template>
