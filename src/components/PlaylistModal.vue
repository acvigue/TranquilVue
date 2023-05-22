<script setup lang="ts">
import type { Playlist } from '@/stores/files'
import { computed, ref } from 'vue'
import { VueFinalModal } from 'vue-final-modal'
import useFilesStore from '../stores/files'
import {
  XMarkIcon,
  PlayIcon,
  PencilIcon,
  TrashIcon,
  ArrowDownTrayIcon
} from '@heroicons/vue/24/outline'
import PatternPreview from './PatternPreview.vue'
import DeleteConfirmationModal from './DeleteConfirmationModal.vue'
import draggable from 'vuedraggable'
import { useToast } from 'vue-toast-notification'
import { useModal } from 'vue-final-modal'
import useTableStatusStore from '@/stores/tableStatus'

interface PlaylistModalProps {
  playlist: Playlist
}

const table = useTableStatusStore()
const files = useFilesStore()
const toast = useToast()

const props = defineProps<PlaylistModalProps>()

const isPlaylistDownloaded = computed(() => {
  return files.playlists.find((playlist) => playlist.uuid === props.playlist.uuid) !== undefined
})

const isCurrentlyPlayingThisPlaylist = computed(() => {
  return table.currentPlaylistID === props.playlist.uuid
})

const downloadThisPlaylist = async function () {
  isPerformingAction.value = true
  try {
    await files.downloadPlaylist(props.playlist)
    toast.success(`Downloaded ${props.playlist.name}`)
  } catch (e) {
    toast.error('Error downloading playlist!')
  }
  isPerformingAction.value = false
}

const playThisPlaylist = async function () {
  isPerformingAction.value = true
  try {
    await table.playFile(`${props.playlist.uuid}.seq`)
    toast.success(`Playling ${props.playlist.name}`)
  } catch (e) {
    toast.error('Error playing playlist!')
  }
  isPerformingAction.value = false
}

const deleteThisPlaylist = async function () {
  isPerformingAction.value = true

  const { open, close } = useModal({
    component: DeleteConfirmationModal,
    attrs: {
      itemName: props.playlist.name,
      onClose() {
        close()
        isPerformingAction.value = false
      },
      onConfirm() {
        close()
        files
          .deleteFile(`${props.playlist.uuid}.seq`)
          .catch(() => {
            toast.error('Error deleting playlist!')
          })
          .finally(async () => {
            files.playlists = files.playlists.filter((playlist) => playlist.uuid !== props.playlist.uuid)
            await files.saveManifest()
            toast.success(`Deleted ${props.playlist.name}`)
            isPerformingAction.value = false
          })
      }
    }
  })
  await open()
}

const isPerformingAction = ref(false)

const emit = defineEmits<{
  (e: 'close'): void
}>()
</script>
<template>
  <VueFinalModal
    contentTransition="fade-y"
    overlayTransition="fade"
    class="flex justify-center items-end"
    content-class="w-full h-[90vh] p-4 bg-gray-900 border-[3px] border-gray-800 rounded-2xl overflow-scroll"
  >
    <div class="flex flex-col justify-between h-full pb-20">
      <div class="flex justify-between">
        <div class="flex-1">
          <button @click="emit('close')" class="hover:scale-[1.2] transform-gpu duration-300">
            <XMarkIcon class="w-7 h-7" />
          </button>
        </div>
        <div>
          <span class="text-lg font-medium overflow-hidden line-clamp-1 break-words">{{
            playlist.name
          }}</span>
        </div>
        <div class="flex-1" />
      </div>
      <div class="flex items-center flex-col align-center w-full gap-3">
        <PatternPreview
          :pattern="{ uuid: playlist.featured_pattern, name: '', date: '' }"
          class="md:h-80 md:w-80 w-[60vw] h-[60vw] rounded-full border-gray-500 border-[3px] bg-gray-800 group-hover:scale-105 transition transform-gpu duration-300"
          lineColor="#ffffff"
          :showBall="false"
        />
        <span class="text-md font-medium text-gray-300"
          >{{ playlist.patterns.length }} patterns</span
        >
        <div class="flex items-center flex-col align-center w-full gap-3 mt-6">
          <div class="flex justify-evenly w-full">
            <button
              v-if="isPlaylistDownloaded"
              :disabled="isCurrentlyPlayingThisPlaylist || isPerformingAction"
              @click="playThisPlaylist"
              class="hover:scale-[1.2] transform-gpu duration-300 disabled:scale-100 disabled:text-gray-500"
            >
              <PlayIcon class="w-7 h-7" />
            </button>
            <button
              v-if="isPlaylistDownloaded"
              :disabled="isPerformingAction"
              @click="null"
              class="hover:scale-[1.2] transform-gpu duration-300 disabled:scale-100 disabled:text-gray-500"
            >
              <PencilIcon class="w-7 h-7" />
            </button>
            <button
              v-if="isPlaylistDownloaded"
              :disabled="isPerformingAction"
              @click="deleteThisPlaylist"
              class="hover:scale-[1.2] transform-gpu duration-300 disabled:scale-100 disabled:text-gray-500"
            >
              <TrashIcon class="w-7 h-7" />
            </button>
            <button
              v-if="!isPlaylistDownloaded"
              :disabled="isPerformingAction"
              @click="downloadThisPlaylist"
              class="hover:scale-[1.2] transform-gpu duration-300 disabled:scale-100 disabled:text-gray-500"
            >
              <ArrowDownTrayIcon class="w-7 h-7" />
            </button>
          </div>
        </div>
      </div>
    </div>
  </VueFinalModal>
</template>
