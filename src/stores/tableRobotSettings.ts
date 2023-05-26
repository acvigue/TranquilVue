import { ref } from 'vue'
import { defineStore } from 'pinia'
import table from '@/plugins/table'
import useLoader from '@/stores/loader'

export default defineStore('tableRobotSettings', () => {
  const tableName = ref('')
  const tableConfig = ref({})
  const loader = useLoader()

  const _update = (data: any) => {
    tableConfig.value = data.robotConfig
    tableName.value = data.name
  }

  const postState = async () => {
    loader.showLoader('robotSettings')
    const config = {
      robotConfig: tableConfig.value,
      name: tableName.value
    }
    await table.post('/settings/robot', config)
    loader.hideLoader('robotSettings')
  }

  const getTableRobotSettings = async () => {
    loader.showLoader('robotSettings')
    const resp = await table.get('/settings/robot')
    _update(resp.data)
    loader.hideLoader('robotSettings')
  }

  getTableRobotSettings().then(() => {})

  return {
    tableConfig,
    tableName,
    postState
  }
})
