import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import table from '../plugins/table'

export default defineStore('tableStatus', () => {
  const status = computed(() => {
    if ((raw.value.pause == 0 && raw.value.Qd == 0) || (raw.value.file != '' && raw.value.Qd > 0)) {
      return 'idle'
    }
    if (raw.value.pause == 1 && raw.value.file != '') {
      return 'playing'
    }
    return 'paused'
  })

  const currentTrackID = computed(() => {
    return (raw.value.file ?? '').replace('sd/', '').replace('/', '').replace('.thr', '')
  })

  const currentPlaylistID = computed(() => {
    return (raw.value.playlistName ?? '').replace('sd/', '').replace('/', '').replace('.seq', '')
  })

  const isPlaylist = computed(() => {
    return (raw.value.playlist ?? false) == true
  })

  const raw = ref({
    Qd: 0,
    playlist: false,
    file: '',
    rpm: 0,
    playlistName: '',
    autoDim: 0,
    primaryRedVal: 0,
    primaryGreenVal: 0,
    primaryBlueVal: 0,
    secRedVal: 0,
    secGreenVal: 0,
    secBlueVal: 0,
    ledBrightness: 0,
    ledOn: 0,
    effectID: 0,
    effectSpeed: 0,
    espV: '',
    filePos: 0,
    fileLen: 0,
    playlistIdx: 0,
    XYZ: [0, 0, 0],
    tod: '',
    wifiIP: '',
    shuffleMode: false,
    repeatMode: false,
    lux: -1,
    pause: 0
  })

  const setPausedState = async function (pausedState: boolean) {
    if (pausedState == true) {
      await table.get(`/exec/pause`)
    } else {
      await table.get(`/exec/resume`)
    }
  }

  const stopMotion = async function () {
    await table.get(`/exec/stop`)
  }

  const resetTable = async function () {
    await table.get(`/reset`)
  }

  const executeCommand = async function (command: string) {
    await table.get(`/exec/${command}`)
  }

  const setLightBrightness = async function (newBrightness: number) {
    if (raw.value.ledBrightness != newBrightness) {
      raw.value.ledBrightness = newBrightness
      await _updateLedConfig()
    }
  }

  const setLightEnabled = async function (enabled: boolean) {
    const int = enabled == true ? 1 : 0
    if (raw.value.ledOn != int) {
      raw.value.ledOn = int
      await _updateLedConfig()
    }
  }

  const setLightAutoDim = async function (autoDimEnabled: boolean) {
    const int = autoDimEnabled == true ? 1 : 0
    if (raw.value.autoDim != int) {
      raw.value.autoDim = int
      await _updateLedConfig()
    }
  }

  const setLightPrimaryColor = async function (red: number, green: number, blue: number) {
    if (
      raw.value.primaryRedVal != red ||
      raw.value.primaryGreenVal != green ||
      raw.value.primaryBlueVal != blue
    ) {
      raw.value.primaryRedVal = red
      raw.value.primaryGreenVal = green
      raw.value.primaryBlueVal = blue
      await _updateLedConfig()
    }
  }

  const setLightSecondaryColor = async function (red: number, green: number, blue: number) {
    if (
      raw.value.secRedVal != red ||
      raw.value.secGreenVal != green ||
      raw.value.secBlueVal != blue
    ) {
      raw.value.secRedVal = red
      raw.value.secGreenVal = green
      raw.value.secBlueVal = blue
      await _updateLedConfig()
    }
  }

  const setLightEffect = async function (newEffectID: number) {
    if (raw.value.effectID != newEffectID) {
      raw.value.effectID = newEffectID
      await _updateLedConfig()
    }
  }

  const setLightSpeed = async function (newSpeed: number) {
    if (raw.value.effectSpeed != newSpeed) {
      raw.value.effectSpeed = newSpeed
      await _updateLedConfig()
    }
  }

  const _updateLedConfig = async function () {
    const config = {
      ledOn: raw.value.ledOn,
      ledBrightness: raw.value.ledBrightness,
      primaryRedVal: raw.value.primaryRedVal,
      primaryGreenVal: raw.value.primaryGreenVal,
      primaryBlueVal: raw.value.primaryBlueVal,
      secRedVal: raw.value.secRedVal,
      secGreenVal: raw.value.secGreenVal,
      secBlueVal: raw.value.secBlueVal,
      effectID: raw.value.effectID,
      effectSpeed: raw.value.effectSpeed,
      autoDim: raw.value.autoDim
    }

    await table.post('/setled', JSON.stringify(config))
  }

  const _updateRaw = function (data: any) {
    raw.value.Qd = data.Qd ?? 0
    raw.value.playlist = data.playlist ?? false
    raw.value.file = data.file ?? ''
    raw.value.rpm = data.rpm ?? 0
    raw.value.playlistName = data.playlistName ?? ''
    raw.value.autoDim = data.autoDim ?? 0
    raw.value.primaryRedVal = data.primaryRedVal ?? 0
    raw.value.primaryGreenVal = data.primaryGreenVal ?? 0
    raw.value.primaryBlueVal = data.primaryBlueVal ?? 0
    raw.value.secRedVal = data.secRedVal ?? 0
    raw.value.secGreenVal = data.secGreenVal ?? 0
    raw.value.secBlueVal = data.secBlueVal ?? 0
    raw.value.ledBrightness = data.ledBrightness ?? 0
    raw.value.ledOn = data.ledOn ?? 0
    raw.value.effectID = data.effectID ?? 0
    raw.value.effectSpeed = data.effectSpeed ?? 0
    raw.value.espV = data.espV ?? ''
    raw.value.filePos = data.filePos ?? 0
    raw.value.fileLen = data.fileLen ?? 0
    raw.value.playlistIdx = data.playlistIdx ?? 0
    raw.value.XYZ = data.XYZ ?? [0, 0, 0]
    raw.value.tod = data.tod ?? ''
    raw.value.wifiIP = data.wifiIP ?? ''
    raw.value.shuffleMode = data.shuffleMode ?? false
    raw.value.repeatMode = data.repeatMode ?? false
    raw.value.lux = data.lux ?? -1
    raw.value.pause = data.pause ?? 0
  }

  const _sse = new EventSource(import.meta.env.PROD ? '/events' : 'http://sandytable.local/events')

  const _parseStatusEvent = (evt: Event) => {
    const messageEvent = evt as MessageEvent
    const data: any = JSON.parse(messageEvent.data)
    console.log(data)

    _updateRaw(data)
  }

  _sse.addEventListener('status', _parseStatusEvent)

  table.get('/status').then((resp) => {
    _updateRaw(resp.data)
  })

  return {
    status,
    raw,
    currentTrackID,
    currentPlaylistID,
    isPlaylist,
    setPausedState,
    stopMotion,
    resetTable,
    executeCommand,
    setLightBrightness,
    setLightAutoDim,
    setLightEffect,
    setLightEnabled,
    setLightPrimaryColor,
    setLightSecondaryColor,
    setLightSpeed
  }
})
