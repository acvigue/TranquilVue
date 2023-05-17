import { ref } from 'vue'
import { defineStore } from 'pinia'
import table from '../plugins/table'

export default defineStore('tableLights', () => {
  const loaderActive = ref(false)
  const loaderMessage = ref('')

  const on = ref(false)
  const autoDimEnabled = ref(false)
  const autoDimStrength = ref(0)
  const primaryColor = ref([0, 0, 0])
  const secondaryColor = ref([0, 0, 0])
  const brightness = ref(0)
  const effectID = ref(0)
  const effectSpeed = ref(0)
  const lux = ref(-1)

  const setBrightness = async function (newBrightness: number) {
    if (brightness.value != newBrightness) {
      brightness.value = newBrightness
      await _updateLedConfig()
    }
  }

  const setEnabled = async function (enabled: boolean) {
    if (on.value != enabled) {
      on.value = enabled
      await _updateLedConfig()
    }
  }

  const setAutoDimEnabled = async function (enabled: boolean) {
    if (autoDimEnabled.value != enabled) {
      autoDimEnabled.value = enabled
      await _updateLedConfig()
    }
  }

  const setAutoDimStrength = async function (maxlux: number) {
    if (autoDimStrength.value != maxlux) {
      autoDimStrength.value = maxlux
      await _updateLedConfig()
    }
  }

  const setPrimaryColor = async function (color: [number, number, number]) {
    if (JSON.stringify(color) != JSON.stringify(primaryColor.value)) {
      primaryColor.value[0] = color[0]
      primaryColor.value[1] = color[1]
      primaryColor.value[2] = color[2]
      await _updateLedConfig()
    }
  }

  const setSecondaryColor = async function (color: [number, number, number]) {
    if (JSON.stringify(color) != JSON.stringify(primaryColor.value)) {
      primaryColor.value[0] = color[0]
      primaryColor.value[1] = color[1]
      primaryColor.value[2] = color[2]
      await _updateLedConfig()
    }
  }

  const setEffect = async function (newEffectID: number) {
    if (effectID.value != newEffectID) {
      effectID.value = newEffectID
      await _updateLedConfig()
    }
  }

  const setEffectSpeed = async function (newSpeed: number) {
    if (effectSpeed.value != newSpeed) {
      effectSpeed.value = newSpeed
      await _updateLedConfig()
    }
  }

  const _updateLedConfig = async function () {
    loaderActive.value = true
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
      autoDimStrength: autoDimStrength.value
    }

    await table.post('/settings/led', JSON.stringify(config))
    loaderActive.value = false
  }

  const _update = function (dto: any) {
    const data = dto.led;
    on.value = data.ledOn == 1
    brightness.value = data.ledBrightness
    primaryColor.value = [data.primaryRedVal, data.primaryGreenVal, data.primaryBlueVal]
    secondaryColor.value = [data.secRedVal, data.secGreenVal, data.secBlueVal]
    effectID.value = data.effectID
    effectSpeed.value = data.effectSpeed
    autoDimEnabled.value = data.autoDim == 1
    autoDimStrength.value = data.autoDimStrength
  }

  const getLedConfig = async function() {
    const data = await table.get("/settings/led");
    _update(data.data);
  }

  getLedConfig().then(() => {})

  return {
    loaderActive,
    loaderMessage,
    on,
    autoDimEnabled,
    autoDimStrength,
    brightness,
    primaryColor,
    secondaryColor,
    effectID,
    effectSpeed,
    lux,
    setAutoDimEnabled,
    setAutoDimStrength,
    setBrightness,
    setEffect,
    setEffectSpeed,
    setEnabled,
    setPrimaryColor,
    setSecondaryColor,
    getLedConfig
  }
})
