import { ref } from 'vue'
import { defineStore } from 'pinia'
import table from '../plugins/table'

export default defineStore('tableSettings', () => {
  const tableName = ref('')
  const tableConfig = ref({})
  const tableScheduler = ref({})
  const tableRadius = ref(0)

  const getTableSettings = async function () {
    const resp = await table.get('/getsettings')
    tableScheduler.value = resp.data.cmdSched
    tableConfig.value = resp.data.robotConfig
    tableName.value = resp.data.name
    tableRadius.value =
      (resp.data.robotConfig.robotGeom.axis0.maxVal ?? 0) +
      (resp.data.robotConfig.robotGeom.axis1.maxVal ?? 0)
  }

  getTableSettings()

  return {
    tableConfig,
    tableName,
    tableScheduler,
    getTableSettings,
    tableRadius
  }
})
