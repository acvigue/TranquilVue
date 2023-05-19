import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import table from '../plugins/table'

export default defineStore('tableRobotSettings', () => {
  const tableName = ref('')
  const tableConfig = ref('')
  const tableScheduler = ref('')

  const tableRadius = computed(() => {
    const robotConfig = JSON.parse(tableConfig.value)
    return robotConfig.robotGeom.axis0.maxVal + robotConfig.robotGeom.axis1.maxVal
  })

  const getTableRobotSettings = async function () {
    const resp = await table.get('/settings/robot')
    tableScheduler.value = JSON.stringify(resp.data.cmdSched)
    tableConfig.value = JSON.stringify(resp.data.robotConfig)
    tableName.value = resp.data.name
  }

  getTableRobotSettings()

  return {
    tableConfig,
    tableName,
    tableScheduler,
    getTableRobotSettings,
    tableRadius
  }
})
