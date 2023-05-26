<script setup lang="ts">
import { ArrowRightIcon } from '@heroicons/vue/24/outline'
import 'vue-toast-notification/dist/theme-sugar.css'

const openSecuritySettingsModal = async () => {}
</script>

<template>
  <div class="mx-[5vw] flex flex-col gap-5 justify-start items-center pt-5">
    <span class="font-semibold text-2xl text-center">Settings</span>
    <div class="flex flex-col w-full justify-evenly gap-4 px-4">
      <button
        @click="openSecuritySettingsModal"
        class="flex w-full justify-between items-center p-4 bg-gray-700 hover:bg-gray-600 rounded-xl transform-gpu duration-300"
      >
        <span class="text-lg font-medium">Security Settings</span>
        <span class="text-lg font-medium"><ArrowRightIcon class="w-7 h-7"></ArrowRightIcon></span>
      </button>
    </div>
  </div>
</template>
