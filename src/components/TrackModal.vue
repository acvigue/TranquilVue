<script setup lang="ts">
import type { Track } from '@/stores/files'
import { VueFinalModal, useModal } from 'vue-final-modal'
import { XMarkIcon, PlayIcon, TrashIcon, PlusIcon } from '@heroicons/vue/24/outline'
import TrackPreview from './TrackPreview.vue'
import DeleteConfirmationModal from './DeleteConfirmationModal.vue'
import useTableStatusStore from '../stores/tableStatus'
import { computed, ref } from 'vue'
import { useToast } from 'vue-toast-notification'
import { useRouter } from 'vue-router'
import useFilesStore from '../stores/files'

interface TrackModalProps {
  track: Track
}

const props = defineProps<TrackModalProps>()

const emit = defineEmits<{
  (e: 'close'): void
}>()

const table = useTableStatusStore()
const files = useFilesStore()
const toast = useToast()
const router = useRouter()

const playThisTrack = async function () {
  isPerformingAction.value = true
  try {
    await table.playFile(`${props.track.id}.thr`)
    emit('close')
    router.push('/')
  } catch (e) {
    toast.error('Error playing track!')
  }
  isPerformingAction.value = false
}

const deleteThisTrack = async function () {
  isPerformingAction.value = true

  //Check if track is not in any playlists first
  const playlistsWithTrack = files.playlists
    .filter((v) => {
      return (v.db_tracks ?? []).includes(props.track.track_id)
    })
    .map((v) => v.name)

  if (playlistsWithTrack.length !== 0) {
    toast.error(`Cannot remove track as it is used in: ${playlistsWithTrack.join(', ')}`)
    isPerformingAction.value = false
    return
  }

  const { open, close } = useModal({
    component: DeleteConfirmationModal,
    attrs: {
      itemName: props.track.name,
      onClose() {
        close()
        isPerformingAction.value = false
      },
      onConfirm() {
        close()
        files
          .deleteFile(`${props.track.id}.thr`)
          .catch(() => {
            toast.error('Error deleting track!')
          })
          .finally(() => {
            isPerformingAction.value = false
          })
      }
    }
  })
  await open()
}

const isCurrentlyPlayingThisTrack = computed(() => {
  return table.currentTrackID === props.track.id
})

const isPerformingAction = ref(false)
</script>
<template>
  <VueFinalModal
    contentTransition="fade-y"
    overlayTransition="fade"
    class="flex justify-center items-end"
    content-class="w-full h-[90vh] p-4 bg-gray-900 border-[3px] border-gray-800 rounded-2xl overflow-scroll"
  >
    <div class="flex flex-col gap-8">
      <div class="flex justify-between">
        <div class="flex-1">
          <button @click="emit('close')" class="hover:scale-[1.2] transform-gpu duration-300">
            <XMarkIcon class="w-7 h-7" />
          </button>
        </div>
        <div>
          <span class="text-lg font-medium overflow-hidden line-clamp-1 break-words">{{
            track.name
          }}</span>
        </div>
        <div class="flex-1"></div>
      </div>
      <div class="flex justify-center">
        <TrackPreview
          :track="track"
          class="md:h-80 md:w-80 w-[60vw] h-[60vw] rounded-full border-gray-500 border-[3px] bg-gray-800 group-hover:scale-105 transition transform-gpu duration-300"
          lineColor="#ffffff"
          :showBall="false"
        />
      </div>
      <div class="flex justify-center mt-[-1em]">
        <span class="text-md font-medium text-gray-400">by {{ track.created_by_name }}</span>
      </div>
      <div class="flex justify-evenly">
        <button
          :disabled="isCurrentlyPlayingThisTrack || isPerformingAction"
          @click="playThisTrack()"
          class="hover:scale-[1.2] transform-gpu duration-300 disabled:scale-100 disabled:text-gray-500"
        >
          <PlayIcon class="w-7 h-7" />
        </button>
        <button
          :disabled="true || isPerformingAction"
          @click="null"
          class="hover:scale-[1.2] transform-gpu duration-300 disabled:scale-100 disabled:text-gray-500"
        >
          <PlusIcon class="w-7 h-7" />
        </button>
        <button
          :disabled="isPerformingAction"
          @click="deleteThisTrack()"
          class="hover:scale-[1.2] transform-gpu duration-300 disabled:scale-100 disabled:text-gray-500"
        >
          <TrashIcon class="w-7 h-7" />
        </button>
      </div>
    </div>
  </VueFinalModal>
</template>
