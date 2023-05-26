import { ref, watch } from 'vue'
import { defineStore } from 'pinia'
import table from '@/plugins/table'

export default defineStore('tableSecurity', () => {
  const loaderActive = ref(false)
  const loaderMessage = ref('')

  const pinEnabled = ref(false)
  const pinCode = ref('')

  const postState = async () => {
    loaderActive.value = true
    const config = {
      pinEnabled: pinEnabled.value,
      pinCode: pinCode.value
    }

    await table.post('/settings/security', JSON.stringify(config), {
      headers: {
        'Content-Type': 'application/json'
      }
    })
    window.tablePin = pinCode.value
    loaderActive.value = false
  }

  const _update = function (dto: any) {
    const data = dto.security
    pinCode.value = data.pinCode
    pinEnabled.value = data.pinEnabled
  }

  const getSecurityConfig = async () => {
    const data = await table.get('/settings/security')
    _update(data.data)
  }

  getSecurityConfig().then(() => {})

  watch([pinCode, pinEnabled], async () => {
    await postState()
  })

  return {
    loaderActive,
    loaderMessage,
    pinCode,
    pinEnabled
  }
})
