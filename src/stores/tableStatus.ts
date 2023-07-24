import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import table from '@/plugins/table'
import { useModal } from 'vue-final-modal'
import { useToast } from 'vue-toast-notification'
import WiFiSettingsModal from '@/components/modals/WiFiSettingsModal.vue'
import useLoader from '@/stores/loader'

const toast = useToast()

export default defineStore('tableStatus', () => {
  const loader = useLoader()
  const status = computed(() => {
    if (raw.value.pause === 0 && raw.value.file !== '') {
      return 'playing'
    }
    if ((raw.value.Qd <= 1 && raw.value.pause === 0) || raw.value.file === '') {
      return 'idle'
    }
    return 'paused'
  })

  const currentPatternID = computed(() => {
    return (raw.value.file ?? '').replace('sd/', '').replace('/', '').replace('.thr', '')
  })

  const currentPlaylistID = computed(() => {
    return (raw.value.playlistName ?? '').replace('sd/', '').replace('/', '').replace('.seq', '')
  })

  const isPlaylist = computed(() => {
    return (raw.value.playlist ?? false) === true
  })

  const _isWiFiSetupModalShowing = ref(false)

  const raw = ref({
    Qd: 0,
    playlist: false,
    file: '',
    rpm: 0,
    playlistName: '',
    espV: '',
    filePos: 0,
    fileLen: 0,
    playlistIdx: 0,
    XYZ: [0, 0, 0],
    tod: '',
    wifiIP: '',
    wifiConn: '',
    shuffleMode: false,
    repeatMode: false,
    pause: 0,
    Hmd: 0,
    wgConn: false
  })

  const setPausedState = async (pausedState: boolean) => {
    executeCommand(pausedState ? 'pause' : 'resume')
  }

  const playFile = async (fileName: string) => {
    loader.showLoader('status')
    try {
      loader.showLoader('status', 'Homing')
      await homeTable()
      await table.get(`/playFile/sd/${fileName}`)
    } catch (e) {
      toast.error('Could not home table!')
    }
    loader.hideLoader('status')
  }

  const homeTable = () => {
    loader.showLoader('status')
    return new Promise<void>((resolve, reject) => {
      table.get('/status').then((initialResp) => {
        _updateRaw(initialResp.data)
        if (raw.value.Hmd === 1) {
          resolve()
        } else {
          executeCommand('G28').then(() => {
            loader.showLoader('status', 'Homing')
            let i = 0
            setInterval(() => {
              table.get('/status').then((resp) => {
                _updateRaw(resp.data)
                if (raw.value.Hmd === 1) {
                  resolve()
                }
                if (i > 40) {
                  reject()
                }
                i++
              })
            }, 5000)
          })
        }
      })
    })
  }

  const stopMotion = async () => {
    executeCommand('stop')
  }

  const resetTable = async () => {
    loader.showLoader('reset')
    await table.get(`/reset`)
    loader.hideLoader('reset')
    toast.success('Table reset')
  }

  const skipPattern = async (dir: number) => {
    executeCommand(`seq_${dir > 0 ? 'next' : 'prev'}`)
  }

  const setShuffle = async (state: boolean) => {
    executeCommand(`seq_shuffle_${state ? 'on' : 'off'}`)
  }

  const setRepeat = async (state: boolean) => {
    executeCommand(`seq_repeat_${state ? 'on' : 'off'}`)
  }

  const executeCommand = async (command: string) => {
    loader.showLoader('status')
    await table.get(`/exec/${command}`)
    loader.hideLoader('status')
    toast.success(`${command}: executed`)
  }

  const _updateRaw = (data: any) => {
    raw.value.Qd = data.Qd ?? 0
    raw.value.playlist = data.playlist ?? false
    raw.value.file = data.file ?? ''
    raw.value.rpm = data.rpm ?? 0
    raw.value.playlistName = data.playlistName ?? ''
    raw.value.espV = data.espV ?? ''
    raw.value.filePos = data.filePos ?? 0
    raw.value.fileLen = data.fileLen ?? 0
    raw.value.playlistIdx = data.playlistIdx ?? 0
    raw.value.XYZ = data.XYZ ?? [0, 0, 0]
    raw.value.tod = data.tod ?? ''
    raw.value.wifiIP = data.wifiIP ?? ''
    raw.value.wifiConn = data.wifiConn ?? 'A'
    raw.value.shuffleMode = data.shuffleMode ?? false
    raw.value.repeatMode = data.repeatMode ?? false
    raw.value.pause = data.pause ?? 0
    raw.value.Hmd = data.Hmd ?? 0
    raw.value.wgConn = data.wgConn ?? false

    //ap mode, start connection loop
    if (raw.value.wifiConn === 'A') {
      if (!_isWiFiSetupModalShowing.value) {
        showWiFiSetupModal()
        _isWiFiSetupModalShowing.value = true
      }
    }
  }

  const baseURL = table.defaults.baseURL ?? '/'

  function connect() {
    loader.showLoader('ws', 'Establishing event loop')
    const ws = new WebSocket(`${baseURL}socket`.replace('http', 'ws'))
    ws.onopen = async function () {
      console.log("Socket opened.")
      loader.hideLoader('ws')
    }

    ws.onmessage = async function (e) {
      const msg = await(e.data as Blob).text()
      _updateRaw(JSON.parse(msg))
    }

    ws.onclose = async function (e) {
      loader.showLoader('ws', 'Establishing event loop')
      console.log('Socket is closed. Reconnect will be attempted in 1 second.', e.reason)
      setTimeout(function () {
        connect()
      }, 1000)
    }

    ws.onerror = async function (err) {
      console.error('Socket encountered error: ', err, 'Closing socket')
      ws.close()
    }
  }

  connect()

  const showWiFiSetupModal = function (): Promise<void> {
    return new Promise((resolve) => {
      const modal = useModal({
        component: WiFiSettingsModal,
        attrs: {
          canClose: false,
          onClose() {
            modal.close()
            toast.success('WiFi settings saved. Please reconnect or refresh as necessary.')
            _isWiFiSetupModalShowing.value = false
            resolve()
          }
        }
      })
      modal.open()
    })
  }

  return {
    status,
    raw,
    currentPatternID,
    currentPlaylistID,
    isPlaylist,
    setPausedState,
    stopMotion,
    resetTable,
    executeCommand,
    playFile,
    skipPattern,
    setShuffle,
    setRepeat
  }
})
