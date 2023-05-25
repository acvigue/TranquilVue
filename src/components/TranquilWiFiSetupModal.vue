<script setup lang="ts">
import { VueFinalModal } from 'vue-final-modal'
import { FormKit } from '@formkit/vue'
import useTableWiFiStore from '../stores/tableWiFi'

const emit = defineEmits<{
  (e: 'saved'): void
}>()

const tableWiFi = useTableWiFiStore()
const connectAction = async () => {
  console.log(tableWiFi)
  await tableWiFi.update().catch(() => {
    emit('saved')
  })
}
</script>

<template>
  <VueFinalModal
    class="flex justify-center items-center"
    :clickToClose="false"
    :escToClose="false"
    contentTransition="fade-y"
    overlayTransition="fade"
    content-class="p-4 md:w-[60vw] w-[80vw] bg-gray-900 border-[3px] border-gray-800 rounded-2xl"
  >
    <div class="flex flex-col gap-4">
      <div class="flex justify-center">
        <div>
          <span class="text-lg font-medium overflow-hidden line-clamp-1 break-words">
            WiFi Settings
          </span>
        </div>
      </div>
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
        validation="required"
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
      <div class="flex w-full justify-end items-center">
        <button
          @click.stop="connectAction()"
          class="px-4 py-2 bg-blue-600 hover:bg-blue-500 transition-gpu duration-300 transform-gpu rounded-xl"
        >
          Save
        </button>
      </div>
    </div>
  </VueFinalModal>
</template>
