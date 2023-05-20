import { ref, toRaw } from 'vue'
import { defineStore } from 'pinia'
import table from '../plugins/table'
import tranquilapi from '../plugins/tranquilapi'

export interface Pattern {
  uuid: string //uuid
  name: string
  date: string
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

    await _uploadFile(`${pattern.uuid}.thr`, patternData)

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

    const playlistData = (await tranquilapi.get(`playlists/${playlist.uuid}`)).data.resp

    for (const item of playlistData) {
      if (item.type == 'pattern') {
        //Check if pattern is not already downloaded.
        if (patterns.value.find((pattern) => pattern.uuid === item.id) == undefined) {
          console.log(`${item.name} is not downloaded..`)
          await downloadPattern(item as Pattern)
        } else {
          console.log(`${item.name} is already downloaded!`)
        }
      } else if (item.type == 'playlist') {
        const playlistFileLines = item.patterns.map((a: { id: string }) => a.id + '.thr')
        const playlistFileContent = playlistFileLines.join('\n')

        await _uploadFile(`${item.id}.seq`, playlistFileContent)

        playlists.value.push(item)
        try {
          await saveManifest()
        } catch (e) {
          loaderActive.value = false
          console.error(e)
          await table.get(`/fs/delete/sd/${item.id}.seq`)
        }
      }
    }
  }

  const _uploadFile = async function (fileName: string, content: any) {
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

    await _uploadFile('manifest.json', content)

    loaderActive.value = false
  }

  return {
    loaderActive,
    loaderMessage,
    patterns,
    playlists,
    refreshFiles,
    downloadPattern,
    downloadPlaylist,
    getPattern,
    getPlaylist,
    saveManifest,
    deleteFile
  }
})
