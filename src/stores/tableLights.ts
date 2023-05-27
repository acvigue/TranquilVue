import { ref, watch } from 'vue'
import { defineStore } from 'pinia'
import table from '@/plugins/table'
import useLoader from '@/stores/loader'
import { useToast } from 'vue-toast-notification'

const toast = useToast()

export default defineStore('tableLights', () => {
  const loader = useLoader()

  const on = ref(false)
  const autoDimEnabled = ref(false)
  const autoDimStrength = ref(0)
  const primaryColor = ref([0, 0, 0])
  const secondaryColor = ref([0, 0, 0])
  const brightness = ref(0)
  const effectID = ref(0)
  const effectSpeed = ref(0)
  const angleOffset = ref(0)
  const lux = ref(-1)

  const postState = async () => {
    loader.showLoader('lights')
    const config = {
      ledOn: on.value ? 1 : 0,
      ledBrightness: brightness.value,
      primaryRedVal: primaryColor.value[0],
      primaryGreenVal: primaryColor.value[1],
      primaryBlueVal: primaryColor.value[2],
      secRedVal: secondaryColor.value[0],
      secGreenVal: secondaryColor.value[1],
      secBlueVal: secondaryColor.value[2],
      effectID: effectID.value,
      effectSpeed: effectSpeed.value,
      autoDim: autoDimEnabled.value ? 1 : 0,
      autoDimStrength: autoDimStrength.value,
      ledAngleOffset: angleOffset.value
    }
    try {
      await table.post('/settings/led', config)
    } catch (e) {
      toast.error('Error updating light settings')
    }
    loader.hideLoader('lights')
  }

  const _update = function (dto: any) {
    const data = dto.led
    on.value = data.ledOn === 1
    brightness.value = data.ledBrightness
    primaryColor.value = [data.primaryRedVal, data.primaryGreenVal, data.primaryBlueVal]
    secondaryColor.value = [data.secRedVal, data.secGreenVal, data.secBlueVal]
    effectID.value = data.effectID
    effectSpeed.value = data.effectSpeed
    autoDimEnabled.value = data.autoDim === 1
    autoDimStrength.value = data.autoDimStrength
    angleOffset.value = data.ledAngleOffset
  }

  const getLedConfig = async () => {
    try {
      const data = await table.get('/settings/led')
      _update(data.data)
    } catch (e) {
      toast.error('Network Error')
    }
  }

  getLedConfig().then(() => {})

  watch(
    [
      on,
      autoDimEnabled,
      autoDimStrength,
      brightness,
      primaryColor,
      secondaryColor,
      effectID,
      effectSpeed,
      angleOffset
    ],
    async () => {
      await postState()
    }
  )

  return {
    on,
    autoDimEnabled,
    autoDimStrength,
    brightness,
    primaryColor,
    secondaryColor,
    effectID,
    effectSpeed,
    angleOffset,
    lux,
    getLedConfig
  }
})
