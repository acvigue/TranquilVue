<script setup lang="ts">
import { HomeIcon, StopIcon, ShieldExclamationIcon } from '@heroicons/vue/24/outline'
import SettingsButton from '@/components/SettingsButton.vue'
import { useModal, type Constructor } from 'vue-final-modal'
import useTable from '@/stores/tableStatus'
import 'vue-toast-notification/dist/theme-sugar.css'

import AboutModal from '@/components/modals/AboutModal.vue'
import ScheduleSettingsModal from '@/components/modals/ScheduleSettingsModal.vue'
import AdvancedLightsSettingsModal from '@/components/modals/AdvancedLightsSettingsModal.vue'
import SecuritySettingsModal from '@/components/modals/SecuritySettingsModal.vue'
import WiFiSettingsModal from '@/components/modals/WiFiSettingsModal.vue'
import WireguardSettingsModal from '@/components/modals/WireguardSettingsModal.vue'

const table = useTable()

const openModal = async (modal: Constructor<any>) => {
  const { open, close } = useModal({
    component: modal,
    attrs: {
      canClose: true,
      onClose: () => {
        close()
      }
    }
  })
  await open()
}
</script>

<template>
  <div class="mx-[5vw] flex flex-col gap-5 justify-start items-center pt-5">
    <span class="font-semibold text-2xl text-center">Settings</span>
    <div class="flex flex-col w-full justify-evenly gap-4 px-4">
      <SettingsButton title="About" @click="openModal(AboutModal)" />
      <SettingsButton title="Security" @click="openModal(SecuritySettingsModal)" />
      <SettingsButton title="WireGuard" @click="openModal(WireguardSettingsModal)" />
      <SettingsButton title="Wi-Fi" @click="openModal(WiFiSettingsModal)" />
      <SettingsButton title="Lights" @click="openModal(AdvancedLightsSettingsModal)" />
      <SettingsButton title="Schedule" @click="openModal(ScheduleSettingsModal)" />
      <div
        class="flex flex-col w-full justify-center items-center p-4 bg-gray-700 rounded-xl gap-2"
      >
        <span class="text-lg font-medium">Commands</span>
        <div class="grid sm:grid-cols-3 grid-cols-1 w-full justify-evenly items-center gap-4">
          <button
            @click="table.executeCommand('G28')"
            class="flex flex-grow flex-col justify-center items-center p-4 bg-gray-600 hover:bg-gray-500 rounded-xl transform-gpu duration-300"
          >
            <HomeIcon class="w-6 h-6"></HomeIcon>
            <span class="text-lg font-medium">Home</span>
          </button>
          <button
            @click="table.resetTable()"
            class="flex flex-grow flex-col justify-center items-center p-4 bg-gray-600 hover:bg-gray-500 rounded-xl transform-gpu duration-300"
          >
            <ShieldExclamationIcon class="w-6 h-6"></ShieldExclamationIcon>
            <span class="text-lg font-medium">Restart</span>
          </button>
          <button
            @click="table.executeCommand('stop')"
            class="flex flex-grow flex-col justify-center items-center p-4 bg-gray-600 hover:bg-gray-500 rounded-xl transform-gpu duration-300"
          >
            <StopIcon class="w-6 h-6"></StopIcon>
            <span class="text-lg font-medium">E-Stop</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
