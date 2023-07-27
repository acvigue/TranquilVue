<script setup lang="ts">
import { type Pattern, default as useFilesStore } from '@/stores/files'
import { FormKit } from '@formkit/vue'
import { XMarkIcon } from '@heroicons/vue/24/outline'
import ModalHeader from './helpers/ModalHeader.vue'
import ModalTemplate from './helpers/ModalTemplate.vue'

interface AddItemToPlaylistModalProps {
  item: Pattern
}

const files = useFilesStore()
const props = defineProps<AddItemToPlaylistModalProps>()

const formAction = async (fields: { playlist: string }) => {
  files.getPlaylist(fields.playlist).patterns.push(props.item.uuid)
  await files.saveManifest()
  emit('close')
}

const emit = defineEmits<{
  (e: 'close'): void
}>()
</script>

<template>
  <ModalTemplate @close="emit('close')">
    <ModalHeader title="Add to Playlist" @close="emit('close')" />
    <FormKit type="form" submit-label="Add" @submit="formAction">
      <FormKit
        type="dropdown"
        label="Playlist"
        name="playlist"
        :options="
          files.playlists.map((playlist) => {
            return { label: playlist.name, value: playlist.uuid }
          })
        "
        :value="files.playlists[0]?.uuid"
      />
    </FormKit>
  </ModalTemplate>
</template>
