<script setup lang="ts">
import { VueFinalModal } from 'vue-final-modal'
import { useToast } from 'vue-toast-notification'
import useTableSecurityStore from '@/stores/tableSecurity'
import { FormKit } from '@formkit/vue'
import { XMarkIcon } from '@heroicons/vue/24/outline'

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
  <VueFinalModal
    class="flex justify-center items-center !z-[5000]"
    contentTransition="fade-y"
    overlayTransition="fade"
    content-class="p-4 w-[95vw] max-w-md bg-gray-900 border-[3px] border-gray-800 rounded-2xl"
  >
    <div class="flex flex-col gap-4">
      <div class="flex justify-between">
        <div class="flex-1">
          <button @click="emit('close')" class="hover:scale-[1.2] transform-gpu duration-300">
            <XMarkIcon class="w-7 h-7" />
          </button>
        </div>
        <div>
          <span class="text-lg font-medium overflow-hidden line-clamp-1 break-words">
            Security Settings
          </span>
        </div>
        <div class="flex-1"></div>
      </div>
      <FormKit type="form" @submit="formHandler" submit-label="Save">
        <FormKit
          type="toggle"
          v-model="security.pinEnabled"
          name="enabled"
          id="enabled"
          label="PIN Enabled"
        />
        <FormKit
          type="text"
          v-model="security.pinCode"
          name="pincode"
          id="pincode"
          label="PIN Code"
          validation="required|number|length:4,4"
        />
      </FormKit>
    </div>
  </VueFinalModal>
</template>
