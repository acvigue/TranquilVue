<script setup lang="ts">
import { VueFinalModal } from 'vue-final-modal'
import useFilesStore, { type Playlist } from '@/stores/files'
import { FormKit } from '@formkit/vue'
import { v4 as uuidv4 } from 'uuid'
import { XMarkIcon } from '@heroicons/vue/24/outline'
import { useToast } from 'vue-toast-notification'
import ModalTemplate from './helpers/ModalTemplate.vue'
import ModalHeader from './helpers/ModalHeader.vue'

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
  <ModalTemplate @close="emit('close')">
    <ModalHeader title="New Playlist" @close="emit('close')"/>
    <FormKit type="form" @submit="formHandler" submit-label="Create">
        <FormKit type="text" name="name" id="name" label="Playlist Name" validation="required" />
      </FormKit>
  </ModalTemplate>
</template>
