<template>
  <div class="mx-[5vw] flex flex-col gap-3 justify-start items-center pt-5">
    <span class="font-semibold text-2xl text-center">Library</span>
    <TabNav :tabs="['Tracks', 'Playlists']" v-model="libraryView"></TabNav>
    {{ libraryView }}
  </div>
</template>

<script setup lang="ts">
import useTableStatusStore from '../stores/tableStatus'
import useFilesStore from '../stores/files'
import TrackPreview from '../components/TrackPreview.vue'
import TabNav from '../components/TabNav.vue'

import { useToast } from 'vue-toast-notification'
import 'vue-toast-notification/dist/theme-sugar.css'
import { computed, ref } from 'vue'

const tableStatus = useTableStatusStore()
const files = useFilesStore()
const toast = useToast()

//0 => tracks, 1 => playlists
const libraryView = ref(0);
</script>
