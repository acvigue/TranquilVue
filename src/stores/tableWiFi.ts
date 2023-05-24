import { ref } from 'vue'
import { defineStore } from 'pinia'
import table from '../plugins/table'

export default defineStore('tableWiFi', () => {
  const loaderActive = ref(false)
  const loaderMessage = ref('Saving')

  const connectionType = ref(3);
  const ssid = ref("");
  const password = ref("");
  const hostname = ref("");
  const peapUsername = ref("");
  const peapPassword = ref("");
  const peapIdentity = ref("");

  const update = async function () {
    loaderActive.value = true
    const config = {
      WiFiMode: connectionType.value ?? 3,
      WiFiSSID: ssid.value,
      WiFiPW: password.value,
      WiFiPEAPIdentity: peapIdentity.value,
      WiFiPEAPUsername: peapUsername.value,
      WiFiPEAPPassword: peapPassword.value,
      WiFiHostname: hostname.value ?? "Tranquil"
    }

    await table.post('/settings/wifi', JSON.stringify(config), {
      headers: {
        'Content-Type': 'application/json'
      }
    })
    loaderActive.value = false
  }

  const _update = function (dto: any) {
    const data = dto.wifi
    connectionType.value = data.WiFiMode ?? 3;
    ssid.value = data.WiFiSSID ?? "";
    password.value = data.WiFiPW ?? "";
    peapIdentity.value = data.WiFiPEAPIdentity ?? "";
    peapUsername.value = data.WiFiPEAPUsername ?? "";
    peapPassword.value = data.WiFiPEAPPassword ?? "";
    hostname.value = data.WiFiHostname ?? "Tranquil";
  }

  const getWiFiConfig = async function () {
    const data = await table.get('/settings/wifi')
    _update(data.data)
  }

  getWiFiConfig().then(() => {})

  return {
    loaderActive,
    loaderMessage,
    connectionType,
    ssid,
    password,
    hostname,
    peapIdentity,
    peapUsername,
    peapPassword,
    update
  }
})
