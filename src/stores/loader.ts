import { ref } from 'vue'
import { defineStore } from 'pinia'

export default defineStore('loader', () => {
  const activeLoaders = ref([] as string[])
  const loaderMessages = ref({} as { [name: string]: { message?: string; zIndex?: number } })

  const showLoader = (loaderID: string, loaderMessage?: string, zIndex?: number) => {
    if (!loaderMessages.value[loaderID]) {
      loaderMessages.value[loaderID] = {}
    }
    loaderMessages.value[loaderID].message = loaderMessage
    loaderMessages.value[loaderID].zIndex = zIndex
    if (!activeLoaders.value.includes(loaderID)) {
      activeLoaders.value.push(loaderID)
    }
  }

  const hideLoader = (loaderID: string) => {
    activeLoaders.value = activeLoaders.value.filter((id) => {
      return id !== loaderID
    })
  }

  return {
    activeLoaders,
    loaderMessages,
    showLoader,
    hideLoader
  }
})
