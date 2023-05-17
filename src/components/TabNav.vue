<template>
  <div class="flex flex-col justify-center w-full rounded">
    <div class="mx-8 shadow rounded-full h-10 mt-4 flex p-1 items-center bg-gray-700">
      <div
        v-for="(tabName, index) in tabs"
        :key="index"
        class="w-full flex justify-center relative"
      >
        <button
          class="w-full bg-opacity-0 z-50 text-md font-medium"
          @click.stop="updateValue(index)"
        >
          {{ tabName }}
        </button>
        <div
          :class="{ hidden: modelValue != index }"
          class="elSwitch bg-blue-600 shadow text-white flex items-center justify-center w-full rounded-full h-8 transition-all absolute mt-[-4px]"
        ></div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface TabNavProps {
  tabs: string[]
  modelValue: Number
}

defineProps<TabNavProps>()

const emit = defineEmits(['update:modelValue'])

function updateValue(value: number) {
  emit('update:modelValue', value)
}
</script>
