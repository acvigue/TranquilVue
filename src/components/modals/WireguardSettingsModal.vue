<script setup lang="ts">
import { VueFinalModal } from 'vue-final-modal'
import { useToast } from 'vue-toast-notification'
import useTableWireguardStore from '@/stores/tableWireguard'
import { FormKit } from '@formkit/vue'
import { XMarkIcon } from '@heroicons/vue/24/outline'
import ModalTemplate from './helpers/ModalTemplate.vue'
import ModalHeader from './helpers/ModalHeader.vue'

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
  <ModalTemplate @close="emit('close')">
    <ModalHeader title="WireGuard" v-model:toggle="wireguard.enabled" @close="emit('close')"/>
    <FormKit type="form" @submit="formHandler" submit-label="Save">
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
  </ModalTemplate>
</template>
