import { ref } from 'vue'
import { defineStore } from 'pinia'
import table from '@/plugins/table'
import useLoader from '@/stores/loader'

export default defineStore('tableWireguard', () => {
  const loader = useLoader()
  const enabled = ref(false)
  const endpointPort = ref(51820)
  const endpointAddress = ref('')
  const privateKey = ref('')
  const publicKey = ref('')
  const psk = ref('')
  const localIP = ref('')

  const saveSettings = async () => {
    loader.showLoader('wireguard')
    const config = {
      enabled: enabled.value ? 1 : 0,
      endpointPort: endpointPort.value,
      endpointAddress: endpointAddress.value,
      privateKey: privateKey.value,
      publicKey: publicKey.value,
      psk: psk.value,
      localIP: localIP.value
    }

    await table.post('/settings/wireguard', config)
    loader.hideLoader('wireguard')
  }

  const getWireguardConfig = async () => {
    loader.showLoader('wireguard')
    const resp = await table.get('/settings/wireguard')
    const data = resp.data.wireGuard
    enabled.value = data.enabled === 1
    endpointPort.value = data.endpointPort ?? 51820
    endpointAddress.value = data.endpointAddress ?? ''
    privateKey.value = data.privateKey ?? ''
    publicKey.value = data.publicKey ?? ''
    psk.value = data.psk ?? ''
    localIP.value = data.localIP ?? ''
    loader.hideLoader('wireguard')
  }

  getWireguardConfig().then(() => {})

  return {
    enabled,
    endpointAddress,
    endpointPort,
    privateKey,
    publicKey,
    psk,
    localIP,
    saveSettings
  }
})
