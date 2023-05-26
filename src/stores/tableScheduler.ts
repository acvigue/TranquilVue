import { ref } from 'vue'
import { defineStore } from 'pinia'
import table from '@/plugins/table'
import useLoader from '@/stores/loader'

interface SchedulerJob {
  hour: number
  minute: number
  dow: number
  cmd: string
}

export default defineStore('tableScheduler', () => {
  const jobs = ref([] as SchedulerJob[])
  const loader = useLoader()

  const saveSchedule = async () => {
    loader.showLoader('scheduler')
    const config = {
      jobs: jobs.value
    }

    await table.post('/settings/scheduler', config)
    loader.hideLoader('scheduler')
  }

  const getSecurityConfig = async () => {
    const resp = await table.get('/settings/scheduler')
    jobs.value = resp.data.jobs
  }

  getSecurityConfig().then(() => {})

  return {
    jobs,
    saveSchedule
  }
})
