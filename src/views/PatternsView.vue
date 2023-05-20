<template>
  <div class="mx-[5vw] flex flex-col gap-5 justify-start items-center pt-5">
    <span class="font-semibold text-2xl text-center mb-[-1rem]">Patterns</span>
    <TabNav :tabs="['Downloaded', 'All', 'Favorites']" v-model="viewType"></TabNav>
    <Transition name="fade" mode="out-in">
      <div v-if="viewType == 0" class="w-full pb-20">
        <!-- downloaded -->
        <ScrollGrid
          :length="files.patterns.length"
          :pageProvider="downloadedPatternsScrollPageProvider"
          :pageSize="2"
          class="grid xl:grid-cols-5 lg:grid-cols-4 md:grid-cols-3 grid-cols-2 gap-6"
        >
          <template v-slot:default="{ item, style }: { item: Pattern, style: StyleValue }">
            <PatternGridItem :item="item" :style="style" @click="showPatternModal(item)" />
          </template>
          <template v-slot:placeholder="{ style }: { style: StyleValue }">
            <PatternGridItemPlaceholder :style="style" />
          </template>
          <template v-slot:probe>
            <PatternGridItemPlaceholder />
          </template>
        </ScrollGrid>
      </div>
      <div v-else-if="viewType == 1" class="w-full pb-20">
        <!-- all -->
        <ScrollGrid
          :length="allPatterns.length"
          :pageProvider="allPatternsScrollPageProvider"
          :pageSize="2"
          class="grid xl:grid-cols-5 lg:grid-cols-4 md:grid-cols-3 grid-cols-2 gap-6"
        >
          <template v-slot:default="{ item, style }: { item: Pattern, style: StyleValue }">
            <PatternGridItem :item="item" :style="style" @click="showPatternModal(item)" />
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
        <!-- favorites -->
        <ScrollGrid
          :length="files.favoritePatterns.length"
          :pageProvider="favoritePatternsScrollPageProvider"
          :pageSize="2"
          class="grid xl:grid-cols-5 lg:grid-cols-4 md:grid-cols-3 grid-cols-2 gap-6"
        >
          <template v-slot:default="{ item, style }: { item: Pattern, style: StyleValue }">
            <PatternGridItem :item="item" :style="style" @click="showPatternModal(item)" />
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
import useFilesStore, { type Pattern } from '../stores/files'
import tranquilapi from '../plugins/tranquilapi'
import { useModal } from 'vue-final-modal'
import { useToast } from 'vue-toast-notification'

import ScrollGrid from 'vue-virtual-scroll-grid'
import { onMounted, ref } from 'vue'
import type { StyleValue } from 'vue'

import TabNav from '../components/TabNav.vue'
import PatternModal from '../components/PatternModal.vue'
import PatternGridItemPlaceholder from '@/components/PatternGridItemPlaceholder.vue'
import PatternGridItem from '@/components/PatternGridItem.vue'

const files = useFilesStore()
const toast = useToast()

let allPatterns = ref([] as Pattern[])
onMounted(async () => {
  try {
    allPatterns.value = (await tranquilapi.get('/patterns')).data as Pattern[]
  } catch (e) {
    toast.error(`Couldn't get hosted patterns`)
    return
  }
})

const downloadedPatternsScrollPageProvider = async function (pageNumber: number, pageSize: number) {
  const slice = files.patterns.slice(pageNumber * pageSize, (pageNumber + 1) * pageSize)
  return Promise.resolve(slice)
}

const allPatternsScrollPageProvider = async function (pageNumber: number, pageSize: number) {
  const slice = allPatterns.value.slice(pageNumber * pageSize, (pageNumber + 1) * pageSize)
  return Promise.resolve(slice)
}

const favoritePatternsScrollPageProvider = async function (pageNumber: number, pageSize: number) {
  const slice = files.favoritePatterns.slice(pageNumber * pageSize, (pageNumber + 1) * pageSize)
  return Promise.resolve(slice)
}

const showPatternModal = async function (pattern: Pattern) {
  const isPatternDownloaded = files.patterns.find((v) => v.uuid === pattern.uuid)
  if (!isPatternDownloaded) {
    console.log('Not implemented')
  } else {
    const { open, close } = useModal({
      component: PatternModal,
      attrs: {
        pattern: pattern,
        onClose() {
          close()
        }
      }
    })
    await open()
  }
}

//0 => downloaded
//1 => all
//2 => favorites
const viewType = ref(0)
</script>
