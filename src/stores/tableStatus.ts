import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import table from '../plugins/table';

export default  defineStore('tableStatus', () => {
  const status = computed(() => {
    if((raw.value.pause == 0 && raw.value.Qd == 0) || (raw.value.file != "" && raw.value.Qd > 0)) {
      return 'idle'
    }
    if(raw.value.pause == 1 && raw.value.file != "") {
      return 'playing'
    }
    return 'paused'
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
    pause: 0,
  });

  return {status, raw}
});

/*

  state: () => ({
    status: '',
    raw: {
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
      lux: -1
    },
    robotSettings: {},
    tableBaseURL: process.env.DEV ? 'http://sandytable.local' : '',
    secure: {
      webcenterUsername: '',
      webcenterPassword: '',
      sisbotID: '',
      sisbotMAC: '',
      webcenterToken: ''
    },
    effectArray: ['Static Color', 'Rainbow', 'Motion Tracked']
  }),

  getters: {
    isPlaylist(state) {
      return (state.raw.playlist ?? false) == true
    },
    queuedMoves(state) {
      return state.raw.Qd ?? 0
    },
    trackID(state) {
      return (state.raw.file ?? '').replace('sd/', '').replaceAll('/', '').replace('.thr', '')
    },
    playlistID(state) {
      return (state.raw.playlistName ?? '')
        .replace('sd/', '')
        .replaceAll('/', '')
        .replace('.seq', '')
    }
  },

  actions: {
    pause() {
      axios.get(`${this.tableBaseURL}/exec/pause`)
    },
    resume() {
      axios.get(`${this.tableBaseURL}/exec/resume`)
    },
    play(file) {
      axios.get(`${this.tableBaseURL}/playFile/${file}`)
    },
    stop() {
      axios.get(`${this.tableBaseURL}/exec/stop`)
    },
    reset() {
      axios.get(`${this.tableBaseURL}/reset`)
    },
    exec(cmd) {
      axios.get(`${this.tableBaseURL}/exec/${cmd}`)
    },
    delete(file) {
      axios.get(`${this.tableBaseURL}/deleteFile/${file}`)
    },
    setNewStatus(newStatus) {
      this.raw = newStatus

      if (newStatus.pause == 0 && newStatus.file != '' && newStatus.Qd != 0) {
        this.status = 'playing'
      } else if (newStatus.pause == 1 && newStatus.file != '') {
        this.status = 'paused'
      } else {
        this.status = 'idle'
      }
    },

    async setBrightness(number) {
      if (this.raw.ledBrightness != number) {
        this.raw.ledBrightness = number
        await this._updateLedConfig()
      }
    },

    async setLedOn(enabled) {
      let int = enabled == true ? 1 : 0
      if (this.raw.ledOn != int) {
        this.raw.ledOn = int
        await this._updateLedConfig()
      }
    },

    async setAutoDim(enabled) {
      if (this.raw.autoDim != enabled) {
        this.raw.autoDim = enabled
        await this._updateLedConfig()
      }
    },

    async setPrimaryColor(red, green, blue) {
      if (
        this.raw.primaryRedVal != red ||
        this.raw.primaryGreenVal != green ||
        this.raw.primaryBlueVal != blue
      ) {
        this.raw.primaryRedVal = red
        this.raw.primaryGreenVal = green
        this.raw.primaryBlueVal = blue
        await this._updateLedConfig()
      }
    },

    async setSecondaryColor(red, green, blue) {
      if (
        this.raw.secRedVal != red ||
        this.raw.secGreenVal != green ||
        this.raw.secBlueVal != blue
      ) {
        this.raw.secRedVal = red
        this.raw.secGreenVal = green
        this.raw.secBlueVal = blue
        await this._updateLedConfig()
      }
    },

    async setEffect(id) {
      if (this.raw.effectID != id) {
        this.raw.effectID = id
        await this._updateLedConfig()
      }
    },

    async setSpeed(number) {
      if (this.raw.effectSpeed != number) {
        this.raw.effectSpeed = number
        await this._updateLedConfig()
      }
    },

    fetchInitialStatus() {
      axios.get(this.tableBaseURL + '/status').then((resp) => {
        this.setNewStatus(resp.data)
      })
      axios.get(this.tableBaseURL + '/getsettings').then((resp) => {
        this.robotSettings = resp.data
      })
    },

    async loginToWebCenter() {
      const wc = await axios.get(`${this.tableBaseURL}/webCenterGet`)
      this.secure.webcenterUsername = wc.data.webcenter.email
      this.secure.webcenterPassword = wc.data.webcenter.password
      this.secure.sisbotID = wc.data.webcenter.sisbot_id
      this.secure.sisbotMAC = wc.data.webcenter.sisbot_mac

      const request = await axios.post('https://webcenter.sisyphus-industries.com/auth_user', {
        email: this.secure.webcenterUsername,
        password: this.secure.webcenterPassword
      })

      this.secure.webcenterToken = request.data.resp[0].auth_token

      return true
    },

    async _updateLedConfig() {
      const config = {
        ledOn: this.raw.ledOn,
        ledBrightness: this.raw.ledBrightness,
        primaryRedVal: this.raw.primaryRedVal,
        primaryGreenVal: this.raw.primaryGreenVal,
        primaryBlueVal: this.raw.primaryBlueVal,
        secRedVal: this.raw.secRedVal,
        secGreenVal: this.raw.secGreenVal,
        secBlueVal: this.raw.secBlueVal,
        effectID: this.raw.effectID,
        effectSpeed: this.raw.effectSpeed,
        autoDim: this.raw.autoDim
      }

      await axios.post(`${this.tableBaseURL}/setled`, JSON.stringify(config), {
        headers: {
          'Content-Type': 'text/plain'
        }
      })
    }
  }
})

*/