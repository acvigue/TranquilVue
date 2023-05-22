<template>
  <div class="mx-[5vw] flex flex-col gap-5 justify-start items-center pt-5">
    <span class="font-semibold text-2xl text-center mb-[-1rem]">Playlists</span>
    <div class="w-full flex justify-evenly items-center gap-8">
      <TabNav :tabs="['Saved', 'All']" v-model="viewType"></TabNav>
      <button @click="console.log('x')" :disabled="viewType != 0" class="h-10 w-10 mt-4 bg-gray-700 p-1 flex items-center justify-center rounded-full group hover:bg-gray-800 duration-300 transform-gpu disabled:pointer-events-none disabled:opacity-50">
        <PlusIcon class="w-6 h-6 text-gray-200 group-hover:text-blue-600 duration-300 transform-gpu"/>
      </button>
    </div>
    <Transition name="fade" mode="out-in">
      <div v-if="viewType == 0" class="w-full pb-20">
        <!-- downloaded -->
        <ScrollGrid
          :length="files.playlists.length"
          :pageProvider="downloadedPlaylistsScrollPageProvider"
          :pageSize="2"
          class="grid xl:grid-cols-5 lg:grid-cols-4 md:grid-cols-3 grid-cols-2 gap-6"
        >
          <template v-slot:default="{ item, style }: { item: Playlist, style: StyleValue }">
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
      <div v-else class="w-full pb-20">
        <!-- all -->
        <ScrollGrid
          :length="allPlaylists.length"
          :pageProvider="allPlaylistsScrollPageProvider"
          :pageSize="2"
          class="grid xl:grid-cols-5 lg:grid-cols-4 md:grid-cols-3 grid-cols-2 gap-6"
        >
          <template v-slot:default="{ item, style }: { item: Playlist, style: StyleValue }">
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
  </div>
</template>

<script setup lang="ts">
import useFilesStore, { type Playlist } from '../stores/files'

import tranquilapi from '../plugins/tranquilapi'
import { useModal } from 'vue-final-modal'
import { useToast } from 'vue-toast-notification'

import ScrollGrid from 'vue-virtual-scroll-grid'
import { onMounted, ref } from 'vue'
import type { StyleValue } from 'vue'

import TabNav from '../components/TabNav.vue'
import PlaylistModal from '../components/PlaylistModal.vue'
import PatternGridItemPlaceholder from '@/components/PatternGridItemPlaceholder.vue'
import PlaylistGridItem from '@/components/PlaylistGridItem.vue'
import { PlusIcon } from '@heroicons/vue/24/outline'

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

const downloadedPlaylistsScrollPageProvider = async function (
  pageNumber: number,
  pageSize: number
) {
  const slice = files.playlists.slice(pageNumber * pageSize, (pageNumber + 1) * pageSize)
  return Promise.resolve(slice)
}

const allPlaylistsScrollPageProvider = async function (pageNumber: number, pageSize: number) {
  const slice = allPlaylists.value.slice(pageNumber * pageSize, (pageNumber + 1) * pageSize)
  return Promise.resolve(slice)
}

const showPlaylistModal = async function (playlist: Playlist) {
  const { open, close } = useModal({
    component: PlaylistModal,
    attrs: {
      playlist: playlist,
      onClose() {
        close()
      }
    }
  })
  await open()
}

//0 => downloaded
//1 => all
const viewType = ref(0)
</script>
