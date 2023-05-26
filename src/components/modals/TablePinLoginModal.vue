<script setup lang="ts">
import { VueFinalModal } from 'vue-final-modal'
import table from '@/plugins/table'
import { useToast } from 'vue-toast-notification'
import useTableSecurityStore from '@/stores/tableSecurity'
import { isAxiosError } from 'axios'
import { ref, watch } from 'vue'

const emit = defineEmits<{
  (e: 'close'): void
}>()

const toast = useToast()
const pinCode = ref('')
const pinCodeBad = ref(false)
const security = useTableSecurityStore()

watch(pinCode, async () => {
  if (pinCode.value.length === 4) {
    try {
      security.loaderActive = true
      security.loaderMessage = 'Connecting'
      await table.get('/heap', {
        auth: {
          username: 'tranquil',
          password: pinCode.value
        }
      })

      window.tablePin = pinCode.value
      emit('close')
    } catch (e) {
      if (isAxiosError(e)) {
        if (e.response?.status === 401) {
          toast.error('Invalid PIN')
          pinCodeBad.value = true
          setTimeout(() => {
            pinCodeBad.value = false
          }, 1000)
        } else {
          toast.error('Network Error')
        }
      }
      pinCode.value = ''
    }
    security.loaderActive = false
  }
})
</script>

<template>
  <VueFinalModal
    class="flex justify-center items-center !z-[5000]"
    :clickToClose="false"
    :escToClose="false"
    contentTransition="fade-y"
    overlayTransition="fade"
    :content-class="
      `p-4 w-[95vw] max-w-md bg-gray-900 border-[3px] border-gray-800 rounded-2xl ` +
      (pinCodeBad ? 'animate-shake border-red-800' : '')
    "
  >
    <div class="flex flex-col gap-4">
      <div class="flex justify-center">
        <div>
          <span
            class="text-lg font-medium overflow-hidden line-clamp-1 break-words"
            :class="{ 'text-red-600': pinCodeBad }"
          >
            Device Locked
          </span>
        </div>
      </div>
      <div class="w-full flex items-center justify-center gap-5 mb-2">
        <div
          class="w-4 h-4 bg-gray-400 rounded-full transition transform-gpu duration-300"
          :class="{ 'bg-gray-600': pinCode.length < 1, '!bg-red-600': pinCodeBad }"
        />
        <div
          class="w-4 h-4 bg-gray-400 rounded-full transition transform-gpu duration-300"
          :class="{ 'bg-gray-600': pinCode.length < 2, '!bg-red-600': pinCodeBad }"
        />
        <div
          class="w-4 h-4 bg-gray-400 rounded-full transition transform-gpu duration-300"
          :class="{ 'bg-gray-600': pinCode.length < 3, '!bg-red-600': pinCodeBad }"
        />
        <div
          class="w-4 h-4 bg-gray-400 rounded-full transition transform-gpu duration-300"
          :class="{ 'bg-gray-600': pinCode.length < 4, '!bg-red-600': pinCodeBad }"
        />
      </div>
      <div class="flex w-full justify-evenly items-center mb-2">
        <button
          @click="pinCode += '1'"
          class="w-20 h-20 flex items-center justify-center bg-gray-700 hover:bg-gray-600 rounded-full transition transform-gpu duration-300 border-[3px] border-gray-500"
        >
          <span class="text-xl font-semibold">1</span>
        </button>
        <button
          @click="pinCode += '2'"
          class="w-20 h-20 flex items-center justify-center bg-gray-700 hover:bg-gray-600 rounded-full transition transform-gpu duration-300 border-[3px] border-gray-500"
        >
          <span class="text-xl font-semibold">2</span>
        </button>
        <button
          @click="pinCode += '3'"
          class="w-20 h-20 flex items-center justify-center bg-gray-700 hover:bg-gray-600 rounded-full transition transform-gpu duration-300 border-[3px] border-gray-500"
        >
          <span class="text-xl font-semibold">3</span>
        </button>
      </div>
      <div class="flex w-full justify-evenly items-center mb-2">
        <button
          @click="pinCode += '4'"
          class="w-20 h-20 flex items-center justify-center bg-gray-700 hover:bg-gray-600 rounded-full transition transform-gpu duration-300 border-[3px] border-gray-500"
        >
          <span class="text-xl font-semibold">4</span>
        </button>
        <button
          @click="pinCode += '5'"
          class="w-20 h-20 flex items-center justify-center bg-gray-700 hover:bg-gray-600 rounded-full transition transform-gpu duration-300 border-[3px] border-gray-500"
        >
          <span class="text-xl font-semibold">5</span>
        </button>
        <button
          @click="pinCode += '6'"
          class="w-20 h-20 flex items-center justify-center bg-gray-700 hover:bg-gray-600 rounded-full transition transform-gpu duration-300 border-[3px] border-gray-500"
        >
          <span class="text-xl font-semibold">6</span>
        </button>
      </div>
      <div class="flex w-full justify-evenly items-center mb-2">
        <button
          @click="pinCode += '7'"
          class="w-20 h-20 flex items-center justify-center bg-gray-700 hover:bg-gray-600 rounded-full transition transform-gpu duration-300 border-[3px] border-gray-500"
        >
          <span class="text-xl font-semibold">7</span>
        </button>
        <button
          @click="pinCode += '8'"
          class="w-20 h-20 flex items-center justify-center bg-gray-700 hover:bg-gray-600 rounded-full transition transform-gpu duration-300 border-[3px] border-gray-500"
        >
          <span class="text-xl font-semibold">8</span>
        </button>
        <button
          @click="pinCode += '9'"
          class="w-20 h-20 flex items-center justify-center bg-gray-700 hover:bg-gray-600 rounded-full transition transform-gpu duration-300 border-[3px] border-gray-500"
        >
          <span class="text-xl font-semibold">9</span>
        </button>
      </div>
      <div class="flex w-full justify-center items-center">
        <button
          @click="pinCode += '0'"
          class="w-20 h-20 flex items-center justify-center bg-gray-700 hover:bg-gray-600 rounded-full transition transform-gpu duration-300 border-[3px] border-gray-500"
        >
          <span class="text-xl font-semibold">0</span>
        </button>
      </div>
    </div>
  </VueFinalModal>
</template>
