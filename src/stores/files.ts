import { ref, computed } from 'vue'
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

  const downloadTrack = async function (track: Track) {
    loaderMessage.value = `Fetching track ${track.name}`
    loaderActive.value = true

    const trackData = (await webcenter.post(`/tracks/${track.track_id}/download`)).data

    const formData = new FormData()
    const trackDataBlob = new Blob([trackData], { type: 'text/plain' })
    formData.append('file', trackDataBlob, `sd/${track.id}.thr`)

    loaderMessage.value = `Sending track ${track.name} to table`

    await table.post(`/uploadtofileman`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })

    tracks.value.push(track)
    try {
      await saveManifest()
      return true
    } catch (e) {
      console.error(e)
      loaderActive.value = false
      await table.get(`/deleteFile/sd/${track.id}.thr`)
    }
  }

  return { loaderActive, loaderMessage, tracks, playlists, refreshFiles, downloadTrack }
})
/*
export const useFilesStore = defineStore('files', {
  state: () => ({
    semaphore: false,
    tracks: undefined,
    playlists: undefined
  }),

  actions: {
    async refreshFiles() {
      Loading.show({ message: 'Refreshing files', group: 'files' })
      const main = useMainStore()
      this.semaphore = true
      const response = await axios.get(`${main.tableBaseURL}/files/sd/manifest.json`)
      this.tracks = response.data.tracks
      this.playlists = response.data.playlists
      this.semaphore = false
      Loading.hide('files')
    },
    async addTrack(track) {
      Loading.show({ message: `Fetching track ${track.name}`, group: 'files' })
      this.semaphore = true
      const main = useMainStore()

      const ptData = (
        await axios.post(
          'https://webcenter.sisyphus-industries.com/tracks/' + track.track_id + '/download',
          `pi_id=${main.secure.sisbotID}&mac_address=${main.secure.sisbotMAC}`,
          { headers: { Authorization: main.secure.webcenterToken } }
        )
      ).data

      var formData = new FormData()
      var blob = new Blob([ptData], { type: 'text/plain' })
      formData.append('file', blob, `sd/${track.id}.thr`)
      Loading.show({
        message: `Sending track ${track.name} to table`,
        group: 'files'
      })
      await axios.post(`${main.tableBaseURL}/uploadtofileman`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })

      this.tracks.push(track)
      try {
        await this.saveManifest()
        return true
      } catch (e) {
        console.error(e)
        this.semaphore = false
        await axios.get(`${main.tableBaseURL}/deleteFile/sd/${track.id}.thr`)
      }
    },
    async addPlaylist(playlist) {
      const main = useMainStore()
      this.semaphore = true
      Loading.show({
        message: `Fetching playlist`,
        group: 'files'
      })
      const playlistData = (
        await axios.get(
          `https://webcenter.sisyphus-industries.com/playlists/${playlist.playlist_id}.json`,
          { headers: { Authorization: main.secure.webcenterToken } }
        )
      ).data.resp

      for (const item of playlistData) {
        if (item.type == 'track') {
          //Check if track is not already downloaded.
          if (this.tracks.find((trackobj) => trackobj.id === item.id) == undefined) {
            console.log(`${item.name} is not downloaded..`)
            await this.addTrack(item)
          } else {
            console.log(`${item.name} is downloaded..`)
          }
        } else if (item.type == 'playlist') {
          var itm = item
          delete item.sorted_tracks

          let playlistFileLines = itm.tracks.map((a) => a.id + '.thr')

          let playlistFileContent = playlistFileLines.join('\n')

          var formData = new FormData()
          var blob = new Blob([playlistFileContent], { type: 'text/plain' })
          formData.append('file', blob, `sd/${itm.id}.seq`)

          await axios.post(`${main.tableBaseURL}/uploadtofileman`, formData, {
            headers: {
              'Content-Type': 'multipart/form-data'
            }
          })

          this.playlists.push(itm)
          try {
            await this.saveManifest()
            return true
          } catch (e) {
            Loading.hide('files')
            console.error(e)
            this.semaphore = false
            await axios.get(`${main.tableBaseURL}/deleteFile/sd/${itm.id}.seq`)
          }
        }
      }
    },
    async saveManifest() {
      Loading.show({ message: 'Saving manifest', group: 'files' })
      this.semaphore = true
      const main = useMainStore()

      const manifest = {
        tracks: toRaw(this.tracks),
        playlists: toRaw(this.playlists)
      }

      let content = JSON.stringify(manifest)

      var formData = new FormData()
      var blob = new Blob([content], { type: 'text/plain' })
      formData.append('file', blob, `sd/manifest.json`)
      await axios.post(`${main.tableBaseURL}/uploadtofileman`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })

      this.semaphore = false
      Loading.hide('files')
      return true
    },
    getPlaylist(id) {
      return (this.playlists ?? []).find((trackobj) => trackobj.id === id)
    },
    getTrack(id) {
      return (this.tracks ?? []).find((trackobj) => trackobj.id === id)
    }
  }
})
*/
