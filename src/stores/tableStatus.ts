import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import table from '@/plugins/table'
import { useModal } from 'vue-final-modal'
import { useToast } from 'vue-toast-notification'
import TranquilWiFiSetupModal from '@/components/modals/TranquilWiFiSetupModal.vue'

const toast = useToast()

export default defineStore('tableStatus', () => {
  const status = computed(() => {
    if (raw.value.pause === 0 && raw.value.file !== '') {
      return 'playing'
    }
    if (
      (raw.value.pause === 0 && raw.value.Qd === 0) ||
      (raw.value.file !== '' && raw.value.Qd < 3)
    ) {
      return 'idle'
    }
    return 'paused'
  })

  const loaderActive = ref(false)
  const loaderMessage = ref('')

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
    shuffleMode: false,
    repeatMode: false,
    pause: 0,
    Hmd: 0
  })

  const setPausedState = async (pausedState: boolean) => {
    executeCommand(pausedState ? 'pause' : 'resume')
  }

  const playFile = async (fileName: string) => {
    loaderActive.value = true
    try {
      loaderMessage.value = 'Homing'
      await homeTable()
      loaderMessage.value = ''
      await table.get(`/playFile/sd/${fileName}`)
    } catch (e) {
      console.log(e)
      toast.error('Could not home table!')
    }
    loaderActive.value = false
  }

  const homeTable = () => {
    return new Promise<void>((resolve, reject) => {
      if(raw.value.Hmd === 1) {
        resolve()
      }
      executeCommand('G28').then(() => {
        loaderActive.value = true
        let i = 0
        setInterval(() => {
          if (raw.value.Hmd === 1) {
            resolve()
          }
          if (i > 40) {
            reject()
          }
          i++
        }, 1000)
      })
    })
  }

  const stopMotion = async () => {
    executeCommand('stop')
  }

  const resetTable = async () => {
    await table.get(`/reset`)
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
    loaderActive.value = true
    await table.get(`/exec/${command}`)
    loaderActive.value = false
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
    raw.value.shuffleMode = data.shuffleMode ?? false
    raw.value.repeatMode = data.repeatMode ?? false
    raw.value.pause = data.pause ?? 0
    raw.value.Hmd = data.Hmd ?? 0

    //ap mode, start connection loop
    if (data.wifiConn === 'A') {
      if (!_isWiFiSetupModalShowing.value) {
        showWiFiSetupModal()
        _isWiFiSetupModalShowing.value = true
      }
    }
  }

  const _sse = new EventSource(`${table.defaults.baseURL ?? ''}/events`)

  const _parseStatusEvent = (evt: Event) => {
    const messageEvent = evt as MessageEvent
    const data: any = JSON.parse(messageEvent.data)
    _updateRaw(data)
  }

  _sse.addEventListener('status', _parseStatusEvent)

  table.get('/status').then((resp) => {
    _updateRaw(resp.data)
  })

  const showWiFiSetupModal = function (): Promise<void> {
    return new Promise((resolve) => {
      const modal = useModal({
        component: TranquilWiFiSetupModal,

        attrs: {
          onSaved() {
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
    loaderActive,
    loaderMessage,
    skipPattern,
    setShuffle,
    setRepeat
  }
})
