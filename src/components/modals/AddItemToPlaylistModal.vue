<script setup lang="ts">
import { type Pattern, default as useFilesStore } from '@/stores/files'
import { VueFinalModal } from 'vue-final-modal'
import { FormKit } from '@formkit/vue'
import { XMarkIcon } from '@heroicons/vue/24/outline'

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
  <VueFinalModal
    class="flex justify-center items-center"
    contentTransition="fade-y"
    overlayTransition="fade"
    content-class="p-4 bg-gray-900 border-[3px] border-gray-800 rounded-2xl max-w-lg w-full"
  >
    <div class="flex flex-col gap-4">
      <div class="flex justify-between">
        <div class="flex-1">
          <button @click="emit('close')" class="hover:scale-[1.2] transform-gpu duration-300">
            <XMarkIcon class="w-7 h-7" />
          </button>
        </div>
        <div>
          <span class="text-lg font-medium overflow-hidden line-clamp-1 break-words">
            Add to Playlist
          </span>
        </div>
        <div class="flex-1"></div>
      </div>
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
    </div>
  </VueFinalModal>
</template>
