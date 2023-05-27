<script setup lang="ts">
import { useToast } from 'vue-toast-notification'
import useTableSchedulerStore from '@/stores/tableScheduler'
import { FormKit } from '@formkit/vue'
import { XMarkIcon } from '@heroicons/vue/24/outline'
import { useRouter } from 'vue-router'

const scheduler = useTableSchedulerStore()
const router = useRouter()

const scheduleActionOptions = [
  { label: 'Sleep', value: 'exec/sleep' },
  { label: 'Wake Up', value: 'exec/resume' },
  { label: 'Pause', value: 'exec/pause' },
  { label: 'Resume', value: 'exec/resume' }
]

const daysOfWeek = [
  { label: 'Sunday', value: 0 },
  { label: 'Monday', value: 1 },
  { label: 'Tuesday', value: 2 },
  { label: 'Wednesday', value: 3 },
  { label: 'Thursday', value: 4 },
  { label: 'Friday', value: 5 },
  { label: 'Saturday', value: 6 }
]

const toast = useToast()

const formHandler = async () => {
  try {
    await scheduler.saveSettings()
    toast.success('Scheduler settings updated')
  } catch (e) {
    toast.error('Error updating scheduler settings')
  }
  router.go(-1)
}
</script>

<template>
  <div class="flex flex-col gap-5 justify-start items-center pt-5 w-full px-5">
    <div class="w-full flex">
      <div class="flex-1">
        <button @click="router.go(-1)" class="hover:scale-[1.2] transform-gpu duration-300">
          <XMarkIcon class="w-7 h-7" />
        </button>
      </div>
      <span class="font-semibold text-2xl">Schedule Settings</span>
      <div class="flex-1"></div>
    </div>
    <div class="w-[95vw] max-w-2xl pb-20">
      <FormKit type="form" @submit="formHandler" submit-label="Save">
        <FormKit
          id="repeater"
          name="jobs"
          type="repeater"
          label="Jobs"
          add-label="New Job"
          v-model="scheduler.jobs"
        >
          <FormKit
            type="dropdown"
            label="Action"
            name="action"
            :options="scheduleActionOptions"
            :value="scheduleActionOptions[0].value"
          />
          <FormKit type="time" label="Execution Time" name="time" value="12:00" />
          <FormKit type="checkbox" :options="daysOfWeek" label="Days to run" name="dow" />
        </FormKit>
      </FormKit>
    </div>
  </div>
</template>
