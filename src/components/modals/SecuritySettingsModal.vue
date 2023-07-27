<script setup lang="ts">
import { useToast } from 'vue-toast-notification'
import useTableSecurityStore from '@/stores/tableSecurity'
import { FormKit } from '@formkit/vue'
import { XMarkIcon } from '@heroicons/vue/24/outline'
import ModalTemplate from './helpers/ModalTemplate.vue'
import ModalHeader from './helpers/ModalHeader.vue'

const emit = defineEmits<{
  (e: 'close'): void
}>()

const toast = useToast()
const security = useTableSecurityStore()

const formHandler = async () => {
  try {
    await security.saveSettings()
    toast.success('Security settings updated')
  } catch (e) {
    toast.error('Error updating security settings')
  }
}
</script>

<template>
  <ModalTemplate :z="5000" @close="emit('close')">
    <ModalHeader title="Security Settings" @close="emit('close')" v-model:toggle="security.pinEnabled"/>
    <FormKit type="form" @submit="formHandler" submit-label="Save">
      <FormKit
        type="text"
        v-model="security.pinCode"
        name="pincode"
        id="pincode"
        label="PIN Code"
        validation="required|number|length:4,4"
      />
    </FormKit>
  </ModalTemplate>
</template>
