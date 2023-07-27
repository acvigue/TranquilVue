<script setup lang="ts">
import { FormKit } from '@formkit/vue'
import { XMarkIcon } from '@heroicons/vue/24/outline'
import { watch } from 'vue';
import { ref } from 'vue';

interface ModalHeaderProps {
  title: string
  toggle?: boolean
}

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'update:toggle'): void
}>()

const props = withDefaults(defineProps<ModalHeaderProps>(), {
  toggle: undefined
})
const toggleModel = ref(false)

watch(() => props.toggle, () => {
  toggleModel.value = props.toggle
})
</script>

<template>
  <div class="flex justify-between w-full items-center pb-4">
    <div class="flex-1 flex justfiy-start items-center">
      <button @click="emit('close')" class="hover:scale-[1.2] transform-gpu duration-300">
        <XMarkIcon class="w-7 h-7" />
      </button>
    </div>
    <span class="text-xl font-medium"> {{ title }}</span>
    <div class="flex-1 flex justify-end items-center" v-if="toggle !== undefined">
      <FormKit
        type="toggle"
        outer-class="!mb-0"
        wrapper-class="!mb-0 justify-end"
        v-model="toggleModel"
        @input="
          (newValue: boolean) => {
            toggleModel = newValue
            $emit('update:toggle', newValue)
          }
        "
        off-value-label="OFF"
        on-value-label="ON"
      />
    </div>
    <div class="flex-1" v-else></div>
  </div>
</template>
