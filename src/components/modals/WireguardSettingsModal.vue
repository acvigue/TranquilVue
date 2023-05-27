<script setup lang="ts">
import { VueFinalModal } from 'vue-final-modal'
import { useToast } from 'vue-toast-notification'
import useTableWireguardStore from '@/stores/tableWireguard'
import { FormKit } from '@formkit/vue'
import { XMarkIcon } from '@heroicons/vue/24/outline'

const emit = defineEmits<{
  (e: 'close'): void
}>()

const toast = useToast()
const wireguard = useTableWireguardStore()

const formHandler = async () => {
  try {
    await wireguard.saveSettings()
    toast.success('WireGuard settings updated')
  } catch (e) {
    toast.error('Error updating WireGuard settings')
  }
}
</script>

<template>
  <VueFinalModal
    class="flex justify-center items-center !z-[5000]"
    contentTransition="fade-y"
    overlayTransition="fade"
    content-class="p-4 w-[95vw] max-w-xl bg-gray-900 border-[3px] border-gray-800 rounded-2xl"
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
            WireGuard Settings
          </span>
        </div>
        <div class="flex-1"></div>
      </div>
      <FormKit type="form" @submit="formHandler" submit-label="Save">
        <FormKit
          type="toggle"
          v-model="wireguard.enabled"
          name="enabled"
          id="enabled"
          label="Enabled"
        />
        <FormKit
          type="text"
          v-model="wireguard.endpointAddress"
          name="endpointAddress"
          id="endpointAddress"
          label="Endpoint Address"
          validation="required"
        />
        <FormKit
          type="number"
          v-model="wireguard.endpointPort"
          name="endpointPort"
          id="endpointPort"
          label="Endpoint Port"
          validation="required"
        />
        <FormKit
          type="text"
          v-model="wireguard.privateKey"
          name="privateKey"
          id="privateKey"
          label="Private Key"
          validation="required"
        />
        <FormKit
          type="text"
          v-model="wireguard.publicKey"
          name="publicKey"
          id="publicKey"
          label="Public Key"
          validation="required"
        />
        <FormKit
          type="text"
          v-model="wireguard.psk"
          name="psk"
          id="psk"
          label="Preshared Key"
          validation="required"
        />
        <FormKit
          type="text"
          v-model="wireguard.localIP"
          name="localIP"
          id="localIP"
          label="Local IP"
          validation="required"
        />
      </FormKit>
    </div>
  </VueFinalModal>
</template>
