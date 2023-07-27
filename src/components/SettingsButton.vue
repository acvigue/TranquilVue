<script setup lang="ts">
import { ArrowRightIcon } from '@heroicons/vue/24/outline'

interface SettingsButtonProps {
  title: string
}

defineProps<SettingsButtonProps>()

const emit = defineEmits(['click'])
</script>

<template>
  <button
    @click="emit('click')"
    class="flex w-full justify-between items-center p-4 bg-gray-700 hover:bg-gray-600 rounded-xl transform-gpu duration-300"
  >
    <span class="text-lg font-medium">{{ title }}</span>
    <ArrowRightIcon class="w-6 h-6"></ArrowRightIcon>
  </button>
</template>
