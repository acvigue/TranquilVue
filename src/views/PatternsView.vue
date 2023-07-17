<script setup lang="ts">
import useFilesStore, { type Pattern } from '@/stores/files'
import tranquilapi from '@/plugins/tranquilapi'
import { useModal, VueFinalModal } from 'vue-final-modal'
import { useToast } from 'vue-toast-notification'
import { FunnelIcon } from '@heroicons/vue/24/outline'
import ScrollGrid from 'vue-virtual-scroll-grid'
import { computed, onMounted, ref } from 'vue'
import type { StyleValue } from 'vue'

import TabNav from '@/components/TabNav.vue'
import PatternModal from '@/components/modals/PatternModal.vue'
import PatternGridItemPlaceholder from '@/components/PatternGridItemPlaceholder.vue'
import PatternGridItem from '@/components/PatternGridItem.vue'
import { FormKit } from '@formkit/vue'

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
  return itemGetter.value.length
})

const itemGetter = computed(() => {
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

  if (sortReverse.value) {
    rawItems = rawItems.reverse()
  }

  if (sortNotDownloaded.value && viewType.value !== 0) {
    rawItems = rawItems.filter((pattern) => {
      return !files.getPattern(pattern.uuid)
    })
  }
  return rawItems
})

const patternsScrollPageProvider = async (pageNumber: number, pageSize: number) => {
  const items = itemGetter.value.slice(pageNumber * pageSize, (pageNumber + 1) * pageSize)

  return Promise.resolve(items)
}

const showPatternModal = async (pattern: Pattern) => {
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
const sortModalOpen = ref(false)
const sortReverse = ref(false)
const sortNotDownloaded = ref(false)

const sortModalOptions = [
  { label: 'Name', value: 0 },
  { label: 'Creation Date', value: 1 },
  { label: 'Download Date', value: 2 }
]
</script>

<template>
  <div class="mx-[5vw] flex flex-col gap-5 justify-start items-center pt-5">
    <span class="font-semibold text-2xl text-center mb-[-1rem]">Patterns</span>
    <div class="w-full flex justify-evenly items-center gap-4">
      <TabNav :tabs="['Saved', 'All', 'Favorites']" v-model="viewType"></TabNav>
      <button
        @click="sortModalOpen = true"
        :disabled="viewType === 2"
        class="h-10 w-10 mt-4 bg-gray-700 p-1 flex items-center justify-center rounded-full group hover:bg-gray-800 duration-300 transform-gpu disabled:pointer-events-none disabled:opacity-50"
      >
        <FunnelIcon
          class="w-6 h-6 text-gray-200 group-hover:text-blue-600 duration-300 transform-gpu"
        />
      </button>
    </div>
    <Transition name="fade" mode="out-in">
      <div
        class="w-full pb-20"
        :key="viewType + sortType + (sortReverse ? 1 : 0) + (sortNotDownloaded ? 1 : 0)"
      >
        <ScrollGrid
          :length="patternsScrollLength"
          :pageProvider="patternsScrollPageProvider"
          :pageSize="10"
          class="grid xl:grid-cols-5 lg:grid-cols-4 md:grid-cols-3 grid-cols-2 gap-6"
        >
          <template v-slot:default="{ item, style }: { item: Pattern; style: StyleValue }">
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
      <FormKit
        type="toggle"
        v-model="sortNotDownloaded"
        label="Not Downloaded"
        :disabled="viewType === 0"
      />
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
