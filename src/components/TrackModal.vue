<script setup lang="ts">
import type { Pattern } from '@/stores/files'
import { VueFinalModal, useModal } from 'vue-final-modal'
import { XMarkIcon, PlayIcon, TrashIcon, PlusIcon } from '@heroicons/vue/24/outline'
import PatternPreview from './PatternPreview.vue'
import DeleteConfirmationModal from './DeleteConfirmationModal.vue'
import useTableStatusStore from '../stores/tableStatus'
import { computed, ref } from 'vue'
import { useToast } from 'vue-toast-notification'
import { useRouter } from 'vue-router'
import useFilesStore from '../stores/files'

interface PatternModalProps {
  pattern: Pattern
}

const props = defineProps<PatternModalProps>()

const emit = defineEmits<{
  (e: 'close'): void
}>()

const table = useTableStatusStore()
const files = useFilesStore()
const toast = useToast()
const router = useRouter()

const playThisPattern = async function () {
  isPerformingAction.value = true
  try {
    await table.playFile(`${props.pattern.id}.thr`)
    emit('close')
    router.push('/')
  } catch (e) {
    toast.error('Error playing pattern!')
  }
  isPerformingAction.value = false
}

const deleteThisPattern = async function () {
  isPerformingAction.value = true

  //Check if pattern is not in any playlists first
  const playlistsWithPattern = files.playlists
    .filter((v) => {
      return (v.db_patterns ?? []).includes(props.pattern.pattern_id)
    })
    .map((v) => v.name)

  if (playlistsWithPattern.length !== 0) {
    toast.error(`Cannot remove pattern as it is used in: ${playlistsWithPattern.join(', ')}`)
    isPerformingAction.value = false
    return
  }

  const { open, close } = useModal({
    component: DeleteConfirmationModal,
    attrs: {
      itemName: props.pattern.name,
      onClose() {
        close()
        isPerformingAction.value = false
      },
      onConfirm() {
        close()
        files
          .deleteFile(`${props.pattern.id}.thr`)
          .catch(() => {
            toast.error('Error deleting pattern!')
          })
          .finally(() => {
            isPerformingAction.value = false
          })
      }
    }
  })
  await open()
}

const isCurrentlyPlayingThisPattern = computed(() => {
  return table.currentPatternID === props.pattern.id
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
            pattern.name
          }}</span>
        </div>
        <div class="flex-1"></div>
      </div>
      <div class="flex justify-center">
        <PatternPreview
          :pattern="pattern"
          class="md:h-80 md:w-80 w-[60vw] h-[60vw] rounded-full border-gray-500 border-[3px] bg-gray-800 group-hover:scale-105 transition transform-gpu duration-300"
          lineColor="#ffffff"
          :showBall="false"
        />
      </div>
      <div class="flex justify-center mt-[-1em]">
        <span class="text-md font-medium text-gray-400">by {{ pattern.created_by_name }}</span>
      </div>
      <div class="flex justify-evenly">
        <button
          :disabled="isCurrentlyPlayingThisPattern || isPerformingAction"
          @click="playThisPattern()"
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
          @click="deleteThisPattern()"
          class="hover:scale-[1.2] transform-gpu duration-300 disabled:scale-100 disabled:text-gray-500"
        >
          <TrashIcon class="w-7 h-7" />
        </button>
      </div>
    </div>
  </VueFinalModal>
</template>
