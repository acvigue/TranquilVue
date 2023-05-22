import { computed, ref, toRaw } from 'vue'
import { defineStore } from 'pinia'
import table from '../plugins/table'
import tranquilapi from '../plugins/tranquilapi'

export interface Pattern {
  uuid: string //uuid
  name: string
  date: string
  isFavorite?: boolean
}

export interface Playlist {
  uuid: string
  name: string
  description: string
  patterns: string[]
  featured_pattern: string
  date: string
}

export default defineStore('files', () => {
  const patterns = ref([] as Pattern[])
  const playlists = ref([] as Playlist[])
  const loaderActive = ref(false)
  const loaderMessage = ref('')

  const favoritePatterns = computed(() => {
    return patterns.value.filter((pattern) => pattern.isFavorite === true)
  })

  const getPlaylist = function (uuid: string): Playlist {
    return playlists.value.find((playlist) => playlist.uuid === uuid)!
  }

  const getPattern = function (uuid: string): Pattern {
    return patterns.value.find((pattern) => pattern.uuid === uuid)!
  }

  const downloadPattern = async function (pattern: Pattern) {
    loaderMessage.value = `Downloading ${pattern.name}`
    loaderActive.value = true

    const patternData = (await tranquilapi.get(`/patterns/${pattern.uuid}/data`)).data

    loaderMessage.value = `Sending pattern ${pattern.name}`

    await uploadFile(`${pattern.uuid}.thr`, patternData)

    patterns.value.push(pattern)
    try {
      await saveManifest()
    } catch (e) {
      console.error(e)
      loaderActive.value = false
      await table.get(`/fs/delete/sd/${pattern.uuid}.thr`)
    }
  }

  const deleteFile = async function (path: string) {
    loaderMessage.value = `Removing`
    loaderActive.value = true

    await table.get(`/fs/delete/sd/${path}`)

    loaderActive.value = false
  }

  const downloadPlaylist = async function (playlist: Playlist) {
    loaderMessage.value = 'Fetching playlist'
    loaderActive.value = true

    const playlistData = (await tranquilapi.get(`playlists/${playlist.uuid}`)).data as Playlist

    for (const patternUUID of playlistData.patterns) {
      const pattern = getPattern(patternUUID)
      if (patterns.value.find((p) => p.uuid === pattern.uuid) == undefined) {
        console.log(`${pattern.name} is not downloaded..`)
        await downloadPattern(pattern)
      } else {
        console.log(`${pattern.name} is already downloaded!`)
      }
    }

    const patternFilenameList = playlist.patterns.map((pattern) => getPattern(pattern).uuid + '.thr')
    const playlistFileContent = patternFilenameList.join('\n')

    await uploadFile(`${playlist.uuid}.seq`, playlistFileContent)

    playlists.value.push(playlist)
    try {
      await saveManifest()
    } catch (e) {
      loaderActive.value = false
      console.error(e)
      await table.get(`/fs/delete/sd/${playlist.uuid}.seq`)
    }
  }

  const uploadFile = async function (fileName: string, content: any) {
    const formData = new FormData()
    const manifestBlob = new Blob([content], { type: 'text/plain' })
    formData.append('file', manifestBlob, `sd/${fileName}`)
    await table.post('/fs/upload', formData)
  }

  const refreshFiles = async function () {
    loaderMessage.value = 'Refreshing files'
    loaderActive.value = true
    const response = await table.get(`/files/sd/manifest.json`)

    patterns.value = []
    playlists.value = []

    for (const pattern of response.data.patterns) {
      patterns.value.push(pattern)
    }
    for (const playlist of response.data.playlists) {
      playlists.value.push(playlist)
    }

    loaderActive.value = false
  }

  const saveManifest = async function () {
    loaderMessage.value = 'Saving manifest'
    loaderActive.value = true

    const manifest = {
      patterns: toRaw(patterns.value),
      playlists: toRaw(playlists.value)
    }

    const content = JSON.stringify(manifest)

    await uploadFile('manifest.json', content)

    loaderActive.value = false
  }

  return {
    loaderActive,
    loaderMessage,
    patterns,
    playlists,
    favoritePatterns,
    refreshFiles,
    downloadPattern,
    downloadPlaylist,
    getPattern,
    getPlaylist,
    saveManifest,
    deleteFile,
    uploadFile
  }
})
