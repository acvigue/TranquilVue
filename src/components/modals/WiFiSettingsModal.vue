<script setup lang="ts">
import { VueFinalModal } from 'vue-final-modal'
import { FormKit } from '@formkit/vue'
import useTableWiFiStore from '@/stores/tableWiFi'
import { useToast } from 'vue-toast-notification'
import { XMarkIcon } from '@heroicons/vue/24/outline'

const emit = defineEmits<{
  (e: 'close'): void
}>()

defineProps({canClose: Boolean})

const toast = useToast()
const tableWiFi = useTableWiFiStore()

const formHandler = async () => {
  try {
    await tableWiFi.saveSettings()
  } catch (e) {
    console.log('caught wifi error')
  }
  toast.success('WiFi settings saved')
  emit('close')
}
</script>

<template>
  <VueFinalModal
    class="flex justify-center items-center"
    :clickToClose="canClose"
    :escToClose="canClose"
    contentTransition="fade-y"
    overlayTransition="fade"
    content-class="p-4 w-[95vw] max-w-xl bg-gray-900 border-[3px] border-gray-800 rounded-2xl"
  >
    <div class="flex flex-col gap-4">
      <div class="flex justify-between">
        <div class="flex-1 flex justfiy-start items-center">
          <button @click="emit('close')" class="hover:scale-[1.2] transform-gpu duration-300" v-if="canClose">
            <XMarkIcon class="w-7 h-7" />
          </button>
        </div>
        <div>
          <span class="text-lg font-medium overflow-hidden line-clamp-1 break-words">
            WiFi Settings
          </span>
        </div>
        <div class="flex-1">
        </div>
      </div>
      <FormKit type="form" @submit="formHandler" submit-label="Save">
        <FormKit
          type="text"
          name="ssid"
          id="ssid"
          v-model="tableWiFi.ssid"
          label="Network Name"
          validation="required"
        />
        <FormKit
          type="radio"
          name="type"
          id="type"
          v-model="tableWiFi.connectionType"
          label="Security"
          :options="[
            { label: 'Open', value: 0 },
            { label: 'PSK', value: 1 },
            { label: 'EAP-MSCHAPv2', value: 2 }
          ]"
        />
        <FormKit
          type="password"
          name="password"
          id="password"
          v-model="tableWiFi.password"
          v-if="tableWiFi.connectionType === 1"
          label="Network Password"
          validation="required|length:8"
        />
        <FormKit
          type="text"
          name="peapid"
          id="peapid"
          v-model="tableWiFi.peapIdentity"
          v-if="tableWiFi.connectionType === 2"
          label="Network Identity"
          validation="required"
        />
        <FormKit
          type="text"
          name="peapuser"
          id="peapuser"
          v-model="tableWiFi.peapUsername"
          v-if="tableWiFi.connectionType === 2"
          label="Network Username"
          validation="required"
        />
        <FormKit
          type="password"
          name="peappassword"
          id="peappassword"
          v-model="tableWiFi.peapPassword"
          v-if="tableWiFi.connectionType === 2"
          label="Network Password"
          validation="required"
        />
        <FormKit
          type="text"
          name="hostname"
          id="hostname"
          v-model="tableWiFi.hostname"
          label="Hostname"
          validation="required"
        />
      </FormKit>
    </div>
  </VueFinalModal>
</template>
