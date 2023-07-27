<script setup lang="ts" async>
import type { Pattern, Playlist } from '@/stores/files'
import { computed, ref, onMounted } from 'vue'
import { VueFinalModal } from 'vue-final-modal'
import useFilesStore from '@/stores/files'
import {
  XMarkIcon,
  PlayIcon,
  PencilIcon,
  TrashIcon,
  ArrowDownTrayIcon,
  CheckIcon
} from '@heroicons/vue/24/outline'
import PatternPreview from '@/components/PatternPreview.vue'
import DeleteConfirmationModal from '@/components/modals/DeleteConfirmationModal.vue'
import draggable from 'vuedraggable'
import tranquilapi from '@/plugins/tranquilapi'
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

let patterns = ref([] as Pattern[])

onMounted(async () => {
  try {
    const allPatterns = (await tranquilapi.get('/patterns')).data as Pattern[]
    patterns.value = props.playlist.patterns
      .map((uuid) => allPatterns.find((p) => p.uuid === uuid)!)
      .filter((v) => v !== undefined)
  } catch (e) {
    toast.error(`Couldn't get hosted patterns`)
    return
  }
})

const isPlaylistDownloaded = computed(() => {
  return files.playlists.find((playlist) => playlist.uuid === props.playlist.uuid) !== undefined
})

const isCurrentlyPlayingThisPlaylist = computed(() => {
  return table.currentPlaylistID === props.playlist.uuid
})

const downloadThisPlaylist = async () => {
  try {
    await files.downloadPlaylist(props.playlist)
    toast.success(`Downloaded ${props.playlist.name}`)
  } catch (e) {
    console.log(e)
    toast.error('Error downloading playlist!')
  }
}

const playThisPlaylist = async () => {
  try {
    await table.playFile(`${props.playlist.uuid}.seq`)
    toast.success(`Playing ${props.playlist.name}`)
  } catch (e) {
    toast.error('Error playing playlist!')
  }
}

const deleteThisPlaylist = async () => {
  const { open, close } = useModal({
    component: DeleteConfirmationModal,
    attrs: {
      itemName: props.playlist.name,
      onClose() {
        close()
      },
      onConfirm() {
        close()
        files
          .deleteFile(`${props.playlist.uuid}.seq`)
          .catch(() => {
            toast.error('Error deleting playlist!')
          })
          .finally(async () => {
            files.playlists = files.playlists.filter(
              (playlist) => playlist.uuid !== props.playlist.uuid
            )
            await files.saveManifest()
            toast.success(`Deleted ${props.playlist.name}`)
            emit('close')
          })
      }
    }
  })
  await open()
}

const savePlaylistEdits = async () => {
  isEditing.value = false
  files.getPlaylist(props.playlist.uuid).patterns = patterns.value.map((pattern) => pattern.uuid)

  await files.saveManifest()
}

const isEditing = ref(false)

const emit = defineEmits<{
  (e: 'close'): void
}>()
</script>

<template>
  <VueFinalModal
    contentTransition="fade-y"
    overlayTransition="fade"
    class="flex justify-center items-end"
    content-class="absolute inset-0"
  >
    <div class="absolute inset-0 h-full overflow-auto" @click.self="() => emit('close')">
      <div
        class="flex flex-col justify-between mt-12 p-4 bg-gray-900 border-[3px] border-gray-800 rounded-2xl"
      >
        <div class="flex justify-between pb-20">
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
            :pattern="{
              uuid: playlist.featured_pattern,
              name: '',
              date: '',
              creator: '',
              popularity: 0
            }"
            mode="thumb"
            class="md:h-80 md:w-80 w-[60vw] h-[60vw] rounded-full border-gray-500 border-[3px] bg-gray-800 group-hover:scale-105 transition transform-gpu duration-300"
            lineColor="#ffffff"
          />
          <div class="flex items-center flex-col align-center w-full gap-3 mt-6 mb-5">
            <div class="flex justify-evenly w-full">
              <button
                v-if="isPlaylistDownloaded"
                :disabled="isCurrentlyPlayingThisPlaylist || isEditing"
                @click="playThisPlaylist"
                class="hover:scale-[1.2] transform-gpu duration-300 disabled:scale-100 disabled:text-gray-500"
              >
                <PlayIcon class="w-7 h-7" />
              </button>
              <button
                v-if="isPlaylistDownloaded && !isEditing"
                @click="isEditing = true"
                class="hover:scale-[1.2] transform-gpu duration-300 disabled:scale-100 disabled:text-gray-500"
              >
                <PencilIcon class="w-7 h-7" />
              </button>
              <button
                v-if="isPlaylistDownloaded && isEditing"
                @click="savePlaylistEdits"
                class="hover:scale-[1.2] transform-gpu duration-300 disabled:scale-100 disabled:text-gray-500"
              >
                <CheckIcon class="w-7 h-7" />
              </button>
              <button
                v-if="isPlaylistDownloaded"
                :disabled="isEditing"
                @click="deleteThisPlaylist"
                class="hover:scale-[1.2] transform-gpu duration-300 disabled:scale-100 disabled:text-gray-500"
              >
                <TrashIcon class="w-7 h-7" />
              </button>
              <button
                v-if="!isPlaylistDownloaded"
                @click="downloadThisPlaylist"
                class="hover:scale-[1.2] transform-gpu duration-300 disabled:scale-100 disabled:text-gray-500"
              >
                <ArrowDownTrayIcon class="w-7 h-7" />
              </button>
            </div>
          </div>

          <draggable
            v-model="patterns"
            :disabled="!isEditing"
            class="w-full flex flex-col gap-4 mb-4"
            ghost-class="!bg-gray-600"
            item-key="uuid"
          >
            <template #item="{ element: pattern, index }: { element: Pattern; index: number }">
              <div
                class="rounded-lg py-2 px-5 w-full bg-gray-700 flex justify-between items-center"
                :class="{ 'animate-wiggle': isEditing }"
                :style="{ 'animation-delay': `${-0.2 * index}s` }"
              >
                <div class="flex items-center gap-8">
                  <PatternPreview
                    :pattern="pattern"
                    mode="thumb"
                    lineColor="#ffffff"
                    class="md:h-32 md:w-32 w-10 h-10 rounded-full border-gray-600 border-[2px] bg-gray-800 group-hover:scale-105 transition transform-gpu duration-300"
                  />
                  <div class="flex flex-col">
                    <span class="text-md font-medium">{{ pattern.name }}</span>
                    <span class="text-sm font-medium text-gray-400">by {{ pattern.creator }}</span>
                  </div>
                </div>
                <div v-if="isEditing">
                  <button
                    @click="patterns.splice(index, 1)"
                    class="hover:scale-[1.2] transform-gpu duration-300 disabled:scale-100 disabled:text-gray-500"
                  >
                    <TrashIcon class="w-7 h-7" />
                  </button>
                </div>
              </div>
            </template>
          </draggable>
        </div>
      </div>
    </div>
  </VueFinalModal>
</template>
