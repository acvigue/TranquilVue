<script setup lang="ts">
import type { StyleValue } from 'vue'

interface PatternGridItemPlaceholderProps {
  style?: StyleValue
}

defineProps<PatternGridItemPlaceholderProps>()
</script>

<template>
  <div :style="style" class="flex flex-col items-center m-4 p-2">
    <div class="h-36 w-36 md:h-44 md:w-44 rounded-full border-[3px]"></div>
    <span class="w-[90%] text-md font-medium">...</span>
  </div>
</template>
