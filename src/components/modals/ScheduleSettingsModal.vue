<script setup lang="ts">
import { useToast } from 'vue-toast-notification'
import useTableSchedulerStore from '@/stores/tableScheduler'
import { FormKit } from '@formkit/vue'
import ModalTemplate from './helpers/ModalTemplate.vue'
import ModalHeader from './helpers/ModalHeader.vue'

const scheduler = useTableSchedulerStore()

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
}

const emit = defineEmits<{
  (e: 'close'): void
}>()
</script>

<template>
  <ModalTemplate :z="5000" @close="emit('close')">
    <ModalHeader title="Schedule Settings" @close="emit('close')" />
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
  </ModalTemplate>
</template>
