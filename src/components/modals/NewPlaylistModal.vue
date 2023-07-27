<script setup lang="ts">
import { VueFinalModal } from 'vue-final-modal'
import useFilesStore, { type Playlist } from '@/stores/files'
import { FormKit } from '@formkit/vue'
import { v4 as uuidv4 } from 'uuid'
import { XMarkIcon } from '@heroicons/vue/24/outline'
import { useToast } from 'vue-toast-notification'

const files = useFilesStore()
const toast = useToast()

const formHandler = async (fields: { name: string }) => {
  const newPlaylistObject: Playlist = {
    uuid: uuidv4(),
    name: fields.name,
    description: '',
    date: new Date().toISOString(),
    patterns: ['2cbdae96-ec22-48b4-a369-bfc624463c5f'],
    featured_pattern: '2cbdae96-ec22-48b4-a369-bfc624463c5f'
  }
  files.playlists.push(newPlaylistObject)
  await files.saveManifest()
  toast.success(`Created playlist '${fields.name}'`)
  emit('close')
}

const emit = defineEmits<{
  (e: 'close'): void
}>()
</script>

<template>
  <VueFinalModal
    class="flex justify-center items-center"
    contentTransition="fade-y"
    overlayTransition="fade"
    content-class="p-4 bg-gray-900 border-[3px] border-gray-800 rounded-2xl w-[90vw] max-w-md"
  >
    <div class="flex flex-col gap-8">
      <div class="flex justify-between">
        <div class="flex-1">
          <button @click="emit('close')" class="hover:scale-[1.2] transform-gpu duration-300">
            <XMarkIcon class="w-7 h-7" />
          </button>
        </div>
        <span class="text-lg font-medium"> New Playlist </span>
        <div class="flex-1"></div>
      </div>
      <FormKit type="form" @submit="formHandler" submit-label="Create">
        <FormKit type="text" name="name" id="name" label="Playlist Name" validation="required" />
      </FormKit>
    </div>
  </VueFinalModal>
</template>
