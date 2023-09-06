<script setup lang="ts">
import type { Pattern } from '@/stores/files'
import { VueFinalModal, useModal } from 'vue-final-modal'
import {
  XMarkIcon,
  PlayIcon,
  TrashIcon,
  PlusIcon,
  ArrowDownTrayIcon,
  HeartIcon as HeartIconOutline
} from '@heroicons/vue/24/outline'
import { HeartIcon } from '@heroicons/vue/24/solid'
import PatternPreview from '@/components/PatternPreview.vue'
import DeleteConfirmationModal from '@/components/modals/DeleteConfirmationModal.vue'
import AddItemToPlaylistModal from '@/components/modals/AddItemToPlaylistModal.vue'
import useTableStatusStore from '@/stores/tableStatus'
import { computed } from 'vue'
import { useToast } from 'vue-toast-notification'
import useFilesStore from '@/stores/files'
import dayjs from 'dayjs'

interface PatternModalProps {
  pattern: Pattern
}

const props = defineProps<PatternModalProps>()

const emit = defineEmits<{
  (e: 'close'): void
}>()

const isPatternDownloaded = computed(() => {
  return files.patterns.find((v) => v.uuid === props.pattern.uuid)
})

const table = useTableStatusStore()
const files = useFilesStore()
const toast = useToast()

const playThisPattern = async () => {
  try {
    await table.playFile(`${props.pattern.uuid}.thr`)
    emit('close')
    toast.success(`Playing ${props.pattern.name}`)
  } catch (e) {
    toast.error('Error playing pattern!')
  }
}

const downloadThisPattern = async () => {
  try {
    await files.downloadPattern(props.pattern)
    toast.success(`Downloaded ${props.pattern.name}`)
  } catch (e) {
    toast.error('Error downloading pattern!')
  }
}

const openAddToPlaylistModal = async () => {
  const { open, close } = useModal({
    component: AddItemToPlaylistModal,
    attrs: {
      item: props.pattern,
      onClose() {
        close()
      }
    }
  })
  await open()
}

const deleteThisPattern = async () => {
  //Check if pattern is not in any playlists first
  const playlistsWithPattern = files.playlists
    .filter((v) => {
      return (v.patterns ?? []).includes(props.pattern.uuid)
    })
    .map((v) => v.name)

  if (playlistsWithPattern.length !== 0) {
    toast.error(`Cannot remove pattern as it is used in: ${playlistsWithPattern.join(', ')}`)
    return
  }

  const { open, close } = useModal({
    component: DeleteConfirmationModal,
    attrs: {
      itemName: props.pattern.name,
      onClose() {
        close()
      },
      onConfirm() {
        close()
        files
          .deleteFile(`${props.pattern.uuid}.thr`)
          .catch(() => {
            toast.error('Error deleting pattern!')
          })
          .finally(async () => {
            files.patterns = files.patterns.filter((pattern) => pattern.uuid !== props.pattern.uuid)
            await files.saveManifest()
            toast.success(`Deleted ${props.pattern.name}`)
          })
      }
    }
  })
  await open()
}

const togglePatternFavorite = async () => {
  const fav = files.getPattern(props.pattern.uuid).isFavorite
  files.getPattern(props.pattern.uuid).isFavorite = !fav
  await files.saveManifest()
}

const isCurrentlyPlayingThisPattern = computed(() => {
  return table.currentPatternID === props.pattern.uuid
})
</script>
<template>
  <VueFinalModal
    contentTransition="fade-y"
    overlayTransition="fade"
    class="flex justify-center items-end"
    content-class="w-full h-[90vh] p-4 bg-gray-900 border-[3px] border-gray-800 rounded-2xl"
  >
    <div class="flex flex-col justify-between h-full pb-20">
      <div class="flex justify-between">
        <div class="flex-1 items-center">
          <button @click="emit('close')" class="hover:scale-[1.2] transform-gpu duration-300">
            <XMarkIcon class="w-7 h-7" />
          </button>
        </div>
        <div class="flex items-center">
          <span class="text-lg font-medium overflow-hidden line-clamp-1 break-words">{{
            pattern.name
          }}</span>
        </div>
        <div class="flex-1 justify-center">
          <div class="w-full flex justify-end items-center">
            <button
              @click="togglePatternFavorite"
              class="hover:scale-[1.2] transform-gpu duration-300"
              v-if="isPatternDownloaded"
            >
              <HeartIcon class="w-7 h-7 fill-red-400" v-if="pattern.isFavorite" />
              <HeartIconOutline class="w-7 h-7" v-else />
            </button>
          </div>
        </div>
      </div>
      <div class="flex justify-center flex-col items-center">
        <PatternPreview
          :pattern="pattern"
          mode="thumb"
          class="md:h-80 md:w-80 w-[60vw] h-[60vw] rounded-full border-gray-500 border-[3px] bg-gray-800 group-hover:scale-105 transition transform-gpu duration-300"
          lineColor="#ffffff"
        />
        <span class="pt-4 font-medium">by {{ pattern.creator }}</span>
        <span class="text-gray-400 text-sm">{{ dayjs(pattern.date).format('MM/DD/YYYY') }}</span>
      </div>
      <div class="flex justify-evenly" v-if="isPatternDownloaded">
        <button
          :disabled="isCurrentlyPlayingThisPattern"
          @click="playThisPattern()"
          class="hover:scale-[1.2] transform-gpu duration-300 disabled:scale-100 disabled:text-gray-500"
        >
          <PlayIcon class="w-7 h-7" />
        </button>
        <button
          @click="openAddToPlaylistModal"
          :disabled="files.playlists.length === 0"
          class="hover:scale-[1.2] transform-gpu duration-300 disabled:scale-100 disabled:text-gray-500"
        >
          <PlusIcon class="w-7 h-7" />
        </button>
        <button
          @click="deleteThisPattern()"
          class="hover:scale-[1.2] transform-gpu duration-300 disabled:scale-100 disabled:text-gray-500"
        >
          <TrashIcon class="w-7 h-7" />
        </button>
      </div>
      <div class="flex justify-evenly" v-else>
        <button
          @click="downloadThisPattern"
          class="hover:scale-[1.2] transform-gpu duration-300 disabled:scale-100 disabled:text-gray-500"
        >
          <ArrowDownTrayIcon class="w-7 h-7" />
        </button>
      </div>
    </div>
  </VueFinalModal>
</template>
