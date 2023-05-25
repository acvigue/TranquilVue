<script setup lang="ts">
import useTableLightsStore from '../stores/tableLights'
import 'vue-toast-notification/dist/theme-sugar.css'

const tableLights = useTableLightsStore()
</script>

<template>
  <div class="mx-[5vw] flex flex-col gap-5 justify-start items-center pt-5">
    <span class="font-semibold text-2xl text-center mb-[-1rem]">Settings</span>
    {{ tableLights }}
  </div>
</template>
