<script setup lang="ts">
import ModalHeader from './helpers/ModalHeader.vue'
import ModalTemplate from './helpers/ModalTemplate.vue'
import useStatusStore from '@/stores/tableStatus'
import useLoader from '@/stores/loader'
import { useToast } from 'vue-toast-notification'
import table from '@/plugins/table'

const status = useStatusStore()
const loader = useLoader()
const toast = useToast()

const emit = defineEmits<{
  (e: 'close'): void
}>()

async function checkForUpdate() {
  loader.showLoader('update')
  await table.get('/update')
  loader.hideLoader('update')
  toast.info('Update queued')
}
</script>

<template>
  <ModalTemplate @close="emit('close')">
    <ModalHeader title="About" @close="emit('close')" />
    <span class="w-full text-center text-md font-mono">{{ status.raw.espV }}</span>
    <button
      @click="checkForUpdate"
      class="hover:scale-105 hover:bg-blue-500 transform-gpu duration-300 disabled:scale-100 disabled:text-gray-500 px-4 py-2 rounded-lg bg-blue-600"
    >
      Check for updates
    </button>
  </ModalTemplate>
</template>
