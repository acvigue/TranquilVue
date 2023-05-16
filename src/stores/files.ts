import { ref, toRaw } from 'vue'
import { defineStore } from 'pinia'
import table from '../plugins/table'
import webcenter from '../plugins/webcenter'

interface Track {
  id: string
  track_id: string
  type: string
  name: string
  original_file_type: string
  created_by_name: string
  sm_thumb: string
  thumb: string
  large_photo: string
  download_count: number
  created_at: string
  date_created: string
  is_public: string
  is_locked: string
  two_ball: string
  reversible: string
  popularity: number
  default_vel: number
  user_id: string
  r_type: string
  firstR: number
  lastR: number
  is_approved: boolean
}

interface Playlist {
  id: string
  playlist_id: string
  type: string
  name: string
  description: string
  db_tracks?: string[] | null
  created_by_name: string
  created_at: string
  date_created: string
  is_public: string
  is_featured: string
  featured_track: number
  bg_color: string
  sort_order: number
  user_id: string
}

export default defineStore('files', () => {
  const tracks = ref([] as Track[])
  const playlists = ref([] as Playlist[])
  const loaderActive = ref(false)
  const loaderMessage = ref('')

  const getPlaylist = function (playlist_id: string): Playlist {
    return playlists.value.find((playlist) => playlist.id === playlist_id)!
  }

  const getTrack = function (track_id: string): Track {
    return tracks.value.find((track) => track.id === track_id)!
  }

  const downloadTrack = async function (track: Track) {
    loaderMessage.value = `Downloading ${track.name}`
    loaderActive.value = true

    const trackData = (await webcenter.post(`/tracks/${track.track_id}/download`)).data

    const formData = new FormData()
    const trackDataBlob = new Blob([trackData], { type: 'text/plain' })
    formData.append('file', trackDataBlob, `sd/${track.id}.thr`)

    loaderMessage.value = `Sending track ${track.name}`

    await table.post(`/uploadtofileman`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })

    tracks.value.push(track)
    try {
      await saveManifest()
    } catch (e) {
      console.error(e)
      loaderActive.value = false
      await table.get(`/deleteFile/sd/${track.id}.thr`)
    }
  }

  const downloadPlaylist = async function (playlist: Playlist) {
    loaderMessage.value = 'Fetching playlist'
    loaderActive.value = true

    const playlistData = (await webcenter.get(`playlists/${playlist.playlist_id}.json`)).data.resp

    for (const item of playlistData) {
      if (item.type == 'track') {
        //Check if track is not already downloaded.
        if (tracks.value.find((track) => track.id === item.id) == undefined) {
          console.log(`${item.name} is not downloaded..`)
          await downloadTrack(item as Track)
        } else {
          console.log(`${item.name} is already downloaded!`)
        }
      } else if (item.type == 'playlist') {
        const playlistFileLines = item.tracks.map((a: { id: string }) => a.id + '.thr')
        const playlistFileContent = playlistFileLines.join('\n')

        const formData = new FormData()
        const blob = new Blob([playlistFileContent], { type: 'text/plain' })
        formData.append('file', blob, `sd/${item.id}.seq`)

        await table.post('/uploadtofileman', formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        })

        playlists.value.push(item)
        try {
          await saveManifest()
        } catch (e) {
          loaderActive.value = false
          console.error(e)
          await table.get(`/deleteFile/sd/${item.id}.seq`)
        }
      }
    }
  }

  const refreshFiles = async function () {
    loaderMessage.value = 'Refreshing files'
    loaderActive.value = true
    const response = await table.get(`/files/sd/manifest.json`)

    tracks.value = []
    playlists.value = []

    for (const track of response.data.tracks) {
      tracks.value.push(track)
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
      tracks: toRaw(tracks.value),
      playlists: toRaw(playlists.value)
    }

    const content = JSON.stringify(manifest)

    const formData = new FormData()
    const manifestBlob = new Blob([content], { type: 'text/plain' })
    formData.append('file', manifestBlob, 'sd/manifest.json')
    await table.post('/uploadtofileman', formData)

    loaderActive.value = false
  }

  return {
    loaderActive,
    loaderMessage,
    tracks,
    playlists,
    refreshFiles,
    downloadTrack,
    downloadPlaylist,
    getTrack,
    getPlaylist,
    saveManifest
  }
})
