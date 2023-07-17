<script setup lang="ts">
import useFilesStore, { type Playlist } from '@/stores/files'

import tranquilapi from '@/plugins/tranquilapi'
import { useModal, VueFinalModal } from 'vue-final-modal'
import { useToast } from 'vue-toast-notification'

import ScrollGrid from 'vue-virtual-scroll-grid'
import { computed, onMounted, ref } from 'vue'
import type { StyleValue } from 'vue'

import TabNav from '@/components/TabNav.vue'
import PlaylistModal from '@/components/modals/PlaylistModal.vue'
import NewPlaylistModal from '@/components/modals/NewPlaylistModal.vue'
import PatternGridItemPlaceholder from '@/components/PatternGridItemPlaceholder.vue'
import PlaylistGridItem from '@/components/PlaylistGridItem.vue'
import { PlusIcon, FunnelIcon } from '@heroicons/vue/24/outline'

const files = useFilesStore()
const toast = useToast()

let allPlaylists = ref([] as Playlist[])
onMounted(async () => {
  try {
    allPlaylists.value = (await tranquilapi.get('/playlists')).data as Playlist[]
  } catch (e) {
    toast.error(`Couldn't get hosted playlists`)
    return
  }
})

const playlistsScrollLength = computed(() => {
  switch (viewType.value) {
    case 0:
      return files.playlists.length
    case 1:
      return allPlaylists.value.length
  }
  return 0
})

const playlistsScrollPageProvider = computed(() => {
  return async (pageNumber: number, pageSize: number) => {
    let rawItems
    if (viewType.value === 0) {
      rawItems = files.playlists
    } else {
      rawItems = allPlaylists.value
    }

    if (sortType.value === 0) {
      rawItems = rawItems.sort((a, b) => a.name.localeCompare(b.name))
    } else if (sortType.value === 1) {
      rawItems = rawItems.sort((a, b) => {
        return new Date(b.date).getDate() - new Date(a.date).getDate()
      })
    }

    if (sortReverse.value) {
      rawItems = rawItems.reverse()
    }

    const items = rawItems.slice(pageNumber * pageSize, (pageNumber + 1) * pageSize)

    return Promise.resolve(items)
  }
})

const showPlaylistModal = async (playlist: Playlist) => {
  const { open, close } = useModal({
    component: PlaylistModal,
    attrs: {
      playlist: playlist,
      onClose() {
        newModalOpen.value = newModalOpen.value + 10
        close()
      }
    }
  })
  await open()
}

const showNewPlaylistModal = async () => {
  const { open, close } = useModal({
    component: NewPlaylistModal,
    attrs: {
      onClose() {
        close()
        newModalOpen.value *= 2
      }
    }
  })
  await open()
}

//0 => downloaded
//1 => all
const viewType = ref(0)

//0 => name
//1 => date created descending
//2 => date added descending
const sortType = ref(0)
const sortModalOpen = ref(false)
const sortReverse = ref(false)
const newModalOpen = ref(1)

const sortModalOptions = [
  { label: 'Name', value: 0 },
  { label: 'Creation Date', value: 1 }
]
</script>

<template>
  <div class="mx-[5vw] flex flex-col gap-5 justify-start items-center pt-5">
    <span class="font-semibold text-2xl text-center mb-[-1rem]">Playlists</span>
    <div class="w-full flex justify-evenly items-center gap-4">
      <TabNav :tabs="['Saved', 'All']" v-model="viewType"></TabNav>
      <button
        @click="sortModalOpen = true"
        class="h-10 w-10 mt-4 bg-gray-700 p-1 flex items-center justify-center rounded-full group hover:bg-gray-800 duration-300 transform-gpu disabled:pointer-events-none disabled:opacity-50"
      >
        <FunnelIcon
          class="w-6 h-6 text-gray-200 group-hover:text-blue-600 duration-300 transform-gpu"
        />
      </button>
      <button
        @click="showNewPlaylistModal"
        :disabled="viewType != 0"
        class="h-10 w-10 mt-4 bg-gray-700 p-1 flex items-center justify-center rounded-full group hover:bg-gray-800 duration-300 transform-gpu disabled:pointer-events-none disabled:opacity-50"
      >
        <PlusIcon
          class="w-6 h-6 text-gray-200 group-hover:text-blue-600 duration-300 transform-gpu"
        />
      </button>
    </div>
    <Transition name="fade" mode="out-in">
      <div class="w-full pb-20" :key="viewType + sortType + newModalOpen + (sortReverse ? 1 : 0)">
        <!-- downloaded -->
        <ScrollGrid
          :length="playlistsScrollLength"
          :pageProvider="playlistsScrollPageProvider"
          :pageSize="2"
          class="grid xl:grid-cols-5 lg:grid-cols-4 md:grid-cols-3 grid-cols-2 gap-6"
        >
          <template v-slot:default="{ item, style }: { item: Playlist; style: StyleValue }">
            <PlaylistGridItem :item="item" :style="style" @click="showPlaylistModal(item)" />
          </template>
          <template v-slot:placeholder="{ style }: { style: StyleValue }">
            <PatternGridItemPlaceholder :style="style" />
          </template>
          <template v-slot:probe>
            <PatternGridItemPlaceholder />
          </template>
        </ScrollGrid>
      </div>
    </Transition>
    <VueFinalModal
      class="flex justify-center items-center"
      contentTransition="fade-y"
      overlayTransition="fade"
      content-class="p-4 bg-gray-900 border-[3px] border-gray-800 rounded-2xl w-[70vw] max-w-sm flex flex-col"
      v-model="sortModalOpen"
    >
      <FormKit
        type="dropdown"
        :options="sortModalOptions"
        v-model="sortType"
        label="Sort patterns by"
      />
      <FormKit type="toggle" v-model="sortReverse" label="Reverse" />
      <div class="flex justify-end">
        <button
          @click="sortModalOpen = false"
          class="hover:scale-105 hover:bg-blue-500 transform-gpu duration-300 disabled:scale-100 disabled:text-gray-500 px-4 py-2 rounded-lg bg-blue-600"
        >
          OK
        </button>
      </div>
    </VueFinalModal>
  </div>
</template>
