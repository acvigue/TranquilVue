<script setup lang="ts">
import type { Playlist } from '@/stores/files'
import { computed } from 'vue'
import { VueFinalModal } from 'vue-final-modal'
import useFilesStore from '../stores/files'
import { XMarkIcon } from '@heroicons/vue/24/outline'
import PatternPreview from './PatternPreview.vue'
import DeleteConfirmationModal from './DeleteConfirmationModal.vue'

interface PlaylistModalProps {
  playlist: Playlist
}

const files = useFilesStore()

const props = defineProps<PlaylistModalProps>()

const isPlaylistDownloaded = computed(() => {
  return files.playlists.find((playlist) => playlist.uuid === props.playlist.uuid) !== undefined
})

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
        <div class="grow-1">
          <button @click="emit('close')" class="hover:scale-[1.2] transform-gpu duration-300">
            <XMarkIcon class="w-7 h-7" />
          </button>
        </div>
        <div>
          <span class="text-lg font-medium overflow-hidden line-clamp-1 break-words">{{
            playlist.name
          }}</span>
        </div>
        <div class="grow-1" />
      </div>
      <div class="flex items-center flex-col align-center w-full gap-3">
        <PatternPreview
          :pattern="{uuid: playlist.featured_pattern, name: '', date: ''}"
          class="md:h-80 md:w-80 w-[60vw] h-[60vw] rounded-full border-gray-500 border-[3px] bg-gray-800 group-hover:scale-105 transition transform-gpu duration-300"
          lineColor="#ffffff"
          :showBall="false"
        />
        <span class="text-md font-medium text-gray-300">{{ playlist.patterns.length }} patterns</span>
      </div>
      <!--
      <div class="flex justify-evenly" v-if="isPatternDownloaded">
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
      <div class="flex justify-evenly" v-else>
        <button
          :disabled="isPerformingAction"
          @click="downloadThisPattern"
          class="hover:scale-[1.2] transform-gpu duration-300 disabled:scale-100 disabled:text-gray-500"
        >
          <ArrowDownTrayIcon class="w-7 h-7" />
        </button>
      </div>
      -->
    </div>
  </VueFinalModal>
</template>
