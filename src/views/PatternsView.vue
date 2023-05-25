<template>
  <div class="mx-[5vw] flex flex-col gap-5 justify-start items-center pt-5">
    <span class="font-semibold text-2xl text-center mb-[-1rem]">Patterns</span>
    <div class="w-full px-4">
      <TabNav :tabs="['Saved', 'All', 'Favorites']" v-model="viewType"></TabNav>
    </div>
    <Transition name="fade" mode="out-in">
      <div class="w-full pb-20" :key="viewType">
        <ScrollGrid
          :length="patternsScrollLength"
          :pageProvider="patternsScrollPageProvider"
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
import { computed, onMounted, ref } from 'vue'
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

const patternsScrollLength = computed(() => {
  switch (viewType.value) {
    case 0:
      return files.patterns.length
    case 1:
      return allPatterns.value.length
    case 2:
      return files.favoritePatterns.length
  }
  return 0
})

const patternsScrollPageProvider = async function (pageNumber: number, pageSize: number) {
  let rawItems: Pattern[] = []
  switch (viewType.value) {
    case 0:
      rawItems = files.patterns
      break
    case 1:
      rawItems = allPatterns.value
      break
    case 2:
      rawItems = files.favoritePatterns
      break
  }

  if (sortType.value === 0) {
    rawItems = rawItems.sort((a, b) => a.name.localeCompare(b.name))
  } else if (sortType.value === 1) {
    rawItems = rawItems.sort((a, b) => {
      return new Date(b.date).getDate() - new Date(a.date).getDate()
    })
  } else {
    rawItems = rawItems.sort((a, b) => {
      return (
        new Date(b.dateAdded ?? Date.now()).getDate() -
        new Date(a.dateAdded ?? Date.now()).getDate()
      )
    })
  }

  const items = rawItems.slice(pageNumber * pageSize, (pageNumber + 1) * pageSize)

  return Promise.resolve(items)
}

const showPatternModal = async function (pattern: Pattern) {
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

//0 => downloaded
//1 => all
//2 => favorites
const viewType = ref(0)

//0 => name
//1 => date created descending
//2 => date added descending
const sortType = ref(0)
</script>
