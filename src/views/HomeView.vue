<script setup lang="ts">
import useTableStatus from '../stores/tableStatus'
import useFilesStore from '../stores/files'
const tableStatus = useTableStatus()
const files = useFilesStore()

import { useToast } from 'vue-toast-notification'
import 'vue-toast-notification/dist/theme-sugar.css'

const toast = useToast()
toast.info('test')

files.refreshFiles()
</script>

<template>
  <div class="mx-[5vw] mt-[5vw] flex flex-col gap-4">
    <div>{{ tableStatus.raw }}</div>
    <div v-for="track of files.tracks" :key="track.id">
      {{ track.name }}
    </div>
  </div>
</template>
