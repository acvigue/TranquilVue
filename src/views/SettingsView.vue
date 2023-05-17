<template>
  <div class="mx-[5vw] flex flex-col gap-5 justify-start items-center pt-5">
    <span class="font-semibold text-2xl text-center mb-[-1rem]">Settings</span>
    {{ tableLights }}
  </div>
</template>

<script setup lang="ts">
import useTableStatusStore from '../stores/tableStatus'
import useTableLightsStore from '../stores/tableLights'

import { useToast } from 'vue-toast-notification'
import 'vue-toast-notification/dist/theme-sugar.css'
import { computed, ref } from 'vue'

const tableStatus = useTableStatusStore()
const tableLights = useTableLightsStore()
const toast = useToast()
</script>
