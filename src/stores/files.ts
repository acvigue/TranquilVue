import { computed, ref, toRaw } from 'vue'
import { defineStore } from 'pinia'
import table from '@/plugins/table'
import tranquilapi from '@/plugins/tranquilapi'
import useLoader from '@/stores/loader'
import { useToast } from 'vue-toast-notification'

export interface Pattern {
  //provided by API
  uuid: string
  name: string
  date: string
  popularity: number
  creator: string

  //provided by table
  isFavorite?: boolean
  dateAdded?: string
}

export interface Playlist {
  uuid: string
  name: string
  description: string
  patterns: string[]
  featured_pattern: string
  date: string
}

const toast = useToast()

export default defineStore('files', () => {
  const loader = useLoader()
  const patterns = ref([] as Pattern[])
  const playlists = ref([] as Playlist[])

  const favoritePatterns = computed(() => {
    return patterns.value.filter((pattern) => pattern.isFavorite === true)
  })

  const setUploadProgress = (progress: number) => {
    loader.showLoader('files', `${progress}%`)
  }

  const getPlaylist = (uuid: string): Playlist => {
    return playlists.value.find((playlist) => playlist.uuid === uuid)!
  }

  const getPattern = (uuid: string): Pattern => {
    return patterns.value.find((pattern) => pattern.uuid === uuid)!
  }

  const downloadPattern = async (pattern: Pattern) => {
    loader.showLoader('files', `Downloading ${pattern.name}`)

    const patternData = (await tranquilapi.get(`/patterns/${pattern.uuid}/data`)).data

    loader.showLoader('files', `Saving ${pattern.name}`)

    await uploadFile(`${pattern.uuid}.thr`, patternData)

    patterns.value.push(pattern)
    try {
      await saveManifest()
    } catch (e) {
      console.error(e)
      loader.hideLoader('files')
      await table.get(`/fs/delete/sd/${pattern.uuid}.thr`)
    }
  }

  const deleteFile = async (path: string) => {
    loader.showLoader('files', 'Removing')

    await table.get(`/fs/delete/sd/${path}`)

    loader.hideLoader('files')
  }

  const downloadPlaylist = async (playlist: Playlist) => {
    loader.showLoader('files', 'Fetching playlist')

    const playlistData = (await tranquilapi.get(`playlists/${playlist.uuid}`)).data as Playlist

    for (const patternUUID of playlistData.patterns) {
      loader.showLoader('files', 'Fetching pattern')
      const pattern = (await tranquilapi.get(`/patterns/${patternUUID}`)).data as Pattern
      if (patterns.value.find((p) => p.uuid === pattern.uuid) === undefined) {
        await downloadPattern(pattern)
      }
    }

    const patternFilenameList = playlist.patterns.map(
      (pattern) => getPattern(pattern).uuid + '.thr'
    )
    const playlistFileContent = patternFilenameList.join('\n')

    await uploadFile(`${playlist.uuid}.seq`, playlistFileContent)

    playlists.value.push(playlist)
    try {
      await saveManifest()
    } catch (e) {
      loader.hideLoader('files')
      console.error(e)
      await table.get(`/fs/delete/sd/${playlist.uuid}.seq`)
    }
  }

  const uploadFile = async (fileName: string, content: any) => {
    const formData = new FormData()
    const manifestBlob = new Blob([content], { type: 'text/plain' })
    formData.append('file', manifestBlob, `sd/${fileName}`)

    await table.post('/fs/upload', formData)
  }

  const refreshFiles = async () => {
    loader.showLoader('files', 'Refreshing files')
    try {
      const response = await table.get(`/files/sd/manifest.json`)

      patterns.value = []
      playlists.value = []

      for (const pattern of response.data.patterns) {
        patterns.value.push(pattern)
      }
      for (const playlist of response.data.playlists) {
        playlists.value.push(playlist)
      }
    } catch (e) {
      toast.error('Error fetching file manifest')
    }

    loader.hideLoader('files')
  }

  const saveManifest = async () => {
    loader.showLoader('files', 'Saving manifest')

    const manifest = {
      patterns: toRaw(patterns.value),
      playlists: toRaw(playlists.value)
    }

    const content = JSON.stringify(manifest)

    await uploadFile('manifest.json', content)

    loader.hideLoader('files')
  }

  refreshFiles().then(() => { })

  return {
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
    uploadFile,
    setUploadProgress
  }
})
