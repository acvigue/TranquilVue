import { ref } from 'vue'
import { defineStore } from 'pinia'
import table from '@/plugins/table'
import useLoader from '@/stores/loader'
import { useToast } from 'vue-toast-notification'

const toast = useToast()

export default defineStore('tableWireguard', () => {
  const loader = useLoader()
  const enabled = ref(false)
  const endpointPort = ref('51820')
  const endpointAddress = ref('')
  const privateKey = ref('')
  const publicKey = ref('')
  const psk = ref('')
  const localIP = ref('')

  const saveSettings = async () => {
    loader.showLoader('wireguard')
    const config = {
      enabled: enabled.value ? 1 : 0,
      endpointPort: parseInt(endpointPort.value),
      endpointAddress: endpointAddress.value,
      privateKey: privateKey.value,
      publicKey: publicKey.value,
      psk: psk.value,
      localIP: localIP.value
    }

    try {
      await table.post('/settings/wireguard', config)
    } catch (e) {
      toast.error('Error updating WireGuard settings')
    }
    loader.hideLoader('wireguard')
  }

  const getWireguardConfig = async () => {
    loader.showLoader('wireguard')
    try {
      const resp = await table.get('/settings/wireguard')
      const data = resp.data.wireGuard
      enabled.value = data.enabled === 1
      endpointPort.value = data.endpointPort.toString()
      endpointAddress.value = data.endpointAddress ?? ''
      privateKey.value = data.privateKey ?? ''
      publicKey.value = data.publicKey ?? ''
      psk.value = data.psk ?? ''
      localIP.value = data.localIP ?? ''
    } catch (e) {
      toast.error('Error fetching WireGuard settings')
    }
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
