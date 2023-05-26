import { ref } from 'vue'
import { defineStore } from 'pinia'
import table from '@/plugins/table'
import useLoader from '@/stores/loader'

export default defineStore('tableWiFi', () => {
  const loader = useLoader()

  const connectionType = ref(-1)
  const ssid = ref('')
  const password = ref('')
  const hostname = ref('')
  const peapUsername = ref('')
  const peapPassword = ref('')
  const peapIdentity = ref('')

  const saveSettings = async () => {
    loader.showLoader('wifi')
    const config = {
      WiFiMode: connectionType.value ?? 3,
      WiFiSSID: ssid.value,
      WiFiPW: password.value,
      WiFiPEAPIdentity: peapIdentity.value,
      WiFiPEAPUsername: peapUsername.value,
      WiFiPEAPPassword: peapPassword.value,
      WiFiHostname: hostname.value ?? 'Tranquil'
    }

    await table.post('/settings/wifi', config)
    loader.hideLoader('wifi')
  }

  const _update = function (dto: any) {
    const data = dto.wifi
    connectionType.value = data.WiFiMode ?? 3
    ssid.value = data.WiFiSSID ?? ''
    password.value = data.WiFiPW ?? ''
    peapIdentity.value = data.WiFiPEAPIdentity ?? ''
    peapUsername.value = data.WiFiPEAPUsername ?? ''
    peapPassword.value = data.WiFiPEAPPassword ?? ''
    hostname.value = data.WiFiHostname ?? 'Tranquil'
  }

  const getWiFiConfig = async () => {
    loader.showLoader('wifi')
    const data = await table.get('/settings/wifi')
    _update(data.data)
    loader.hideLoader('wifi')
  }

  getWiFiConfig().then(() => {})

  return {
    connectionType,
    ssid,
    password,
    hostname,
    peapIdentity,
    peapUsername,
    peapPassword,
    saveSettings
  }
})
