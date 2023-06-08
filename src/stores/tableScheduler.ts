import { ref } from 'vue'
import { defineStore } from 'pinia'
import table from '@/plugins/table'
import useLoader from '@/stores/loader'
import { useToast } from 'vue-toast-notification'

interface SchedulerJob {
  hour: number
  minute: number
  dow: number
  cmd: string
}
export interface FormKitJob {
  action: string
  time: string
  dow: number[]
}

const toast = useToast()

export default defineStore('tableScheduler', () => {
  const jobs = ref([] as FormKitJob[])
  const loader = useLoader()

  const saveSettings = async () => {
    loader.showLoader('scheduler')
    const config = {
      jobs: _jobsToScheduler(jobs.value)
    }
    await table.post('/settings/scheduler', config)
    loader.hideLoader('scheduler')
  }

  const _jobsToFormKit = (jobs: SchedulerJob[]): FormKitJob[] => {
    const jobsOut = []
    for (const job of jobs) {
      const dow = []
      for (let i = 0; i < 7; i++) {
        if ((job.dow & (1 << i)) !== 0) {
          dow.push(i)
        }
      }

      const formattedHour = job.hour.toLocaleString('en-US', {
        minimumIntegerDigits: 2,
        useGrouping: false
      })

      const formattedMinute = job.minute.toLocaleString('en-US', {
        minimumIntegerDigits: 2,
        useGrouping: false
      })

      const time = `${formattedHour}:${formattedMinute}`
      const jobOut = {
        dow: dow,
        time: time,
        action: job.cmd
      }
      jobsOut.push(jobOut)
    }
    return jobsOut
  }

  const _jobsToScheduler = (jobs: FormKitJob[]): SchedulerJob[] => {
    const jobsOut: SchedulerJob[] = []
    for (const job of jobs) {
      let mask = 0
      for (const dow of job.dow) {
        mask = mask | (1 << dow)
      }

      const hour = parseInt(job.time.split(':')[0])
      const minute = parseInt(job.time.split(':')[1])
      const jobOut = {
        hour: hour,
        minute: minute,
        cmd: job.action,
        dow: mask
      }
      jobsOut.push(jobOut)
    }
    return jobsOut
  }

  const getSchedulerConfig = async () => {
    loader.showLoader('scheduler')
    try {
      const resp = await table.get('/settings/scheduler')
      jobs.value = _jobsToFormKit(resp.data.scheduler.jobs)
      console.log(jobs.value)
    } catch (e) {
      console.log(e)
      toast.error('Error fetching scheduler settings')
    }
    loader.hideLoader('scheduler')
  }

  getSchedulerConfig().then(() => {})

  return {
    jobs,
    saveSettings
  }
})
