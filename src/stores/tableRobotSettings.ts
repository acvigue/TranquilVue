import { ref } from 'vue'
import { defineStore } from 'pinia'
import table from '@/plugins/table'
import useLoader from '@/stores/loader'
import { useToast } from 'vue-toast-notification'

const toast = useToast()

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
    try {
      await table.post('/settings/robot', config)
    } catch (e) {
      toast.error('Error updating Robot settings')
    }
    loader.hideLoader('robotSettings')
  }

  const getTableRobotSettings = async () => {
    loader.showLoader('robotSettings')
    try {
      const resp = await table.get('/settings/robot')
      _update(resp.data)
    } catch (e) {
      toast.error('Error fetching Robot settings')
    }
    loader.hideLoader('robotSettings')
  }

  getTableRobotSettings().then(() => {})

  return {
    tableConfig,
    tableName,
    postState
  }
})
