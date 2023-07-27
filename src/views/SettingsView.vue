<script setup lang="ts">
import AdvancedLightsSettingsModal from '@/components/modals/AdvancedLightsSettingsModal.vue'
import SecuritySettingsModal from '@/components/modals/SecuritySettingsModal.vue'
import WiFiSettingsModal from '@/components/modals/WiFiSettingsModal.vue'
import WireguardSettingsModal from '@/components/modals/WireguardSettingsModal.vue'
import {
  ArrowRightIcon,
  HomeIcon,
  StopIcon,
  ShieldExclamationIcon
} from '@heroicons/vue/24/outline'
import { useModal } from 'vue-final-modal'
import { useRouter } from 'vue-router'
import useTable from '@/stores/tableStatus'
import 'vue-toast-notification/dist/theme-sugar.css'
import AboutModal from '@/components/modals/AboutModal.vue'

const router = useRouter()
const table = useTable()

const openSecuritySettingsModal = async () => {
  const { open, close } = useModal({
    component: SecuritySettingsModal,
    attrs: {
      onClose: () => {
        close()
      }
    }
  })
  await open()
}

const openAboutModal = async () => {
  const { open, close } = useModal({
    component: AboutModal,
    attrs: {
      onClose: () => {
        close()
      }
    }
  })
  await open()
}

const openWireguardSettingsModal = async () => {
  const { open, close } = useModal({
    component: WireguardSettingsModal,
    attrs: {
      onClose: () => {
        close()
      }
    }
  })
  await open()
}

const openWiFiSettingsModal = async () => {
  const { open, close } = useModal({
    component: WiFiSettingsModal,
    attrs: {
      canClose: true,
      onClose: () => {
        close()
      }
    }
  })
  await open()
}
const openLightsSettingsModal = async () => {
  const { open, close } = useModal({
    component: AdvancedLightsSettingsModal,
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
      <button
        @click="openAboutModal"
        class="flex w-full justify-between items-center p-4 bg-gray-700 hover:bg-gray-600 rounded-xl transform-gpu duration-300"
      >
        <span class="text-lg font-medium">About</span>
        <ArrowRightIcon class="w-6 h-6"></ArrowRightIcon>
      </button>
      <button
        @click="openSecuritySettingsModal"
        class="flex w-full justify-between items-center p-4 bg-gray-700 hover:bg-gray-600 rounded-xl transform-gpu duration-300"
      >
        <span class="text-lg font-medium">PIN Code</span>
        <ArrowRightIcon class="w-6 h-6"></ArrowRightIcon>
      </button>
      <button
        @click="openWireguardSettingsModal"
        class="flex w-full justify-between items-center p-4 bg-gray-700 hover:bg-gray-600 rounded-xl transform-gpu duration-300"
      >
        <span class="text-lg font-medium">WireGuard Remote Access</span>
        <ArrowRightIcon class="w-6 h-6"></ArrowRightIcon>
      </button>
      <button
        @click="openWiFiSettingsModal"
        class="flex w-full justify-between items-center p-4 bg-gray-700 hover:bg-gray-600 rounded-xl transform-gpu duration-300"
      >
        <span class="text-lg font-medium">Wi-Fi</span>
        <ArrowRightIcon class="w-6 h-6"></ArrowRightIcon>
      </button>
      <button
        @click="openLightsSettingsModal"
        class="flex w-full justify-between items-center p-4 bg-gray-700 hover:bg-gray-600 rounded-xl transform-gpu duration-300"
      >
        <span class="text-lg font-medium">Lights</span>
        <ArrowRightIcon class="w-6 h-6"></ArrowRightIcon>
      </button>
      <button
        @click="router.push('/settings/schedule')"
        class="flex w-full justify-between items-center p-4 bg-gray-700 hover:bg-gray-600 rounded-xl transform-gpu duration-300"
      >
        <span class="text-lg font-medium">Schedule</span>
        <ArrowRightIcon class="w-6 h-6"></ArrowRightIcon>
      </button>
      <div
        class="flex flex-col w-full justify-center items-center p-4 bg-gray-700 rounded-xl gap-2"
      >
        <span class="text-lg font-medium">Commands</span>
        <div class="flex w-full justify-evenly items-center gap-4">
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
            <span class="text-lg font-medium">Reset</span>
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
