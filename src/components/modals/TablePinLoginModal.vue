<script setup lang="ts">
import { VueFinalModal } from 'vue-final-modal'
import table from '@/plugins/table'
import { useToast } from 'vue-toast-notification'
import { isAxiosError } from 'axios'
import { ref, watch } from 'vue'
import useLoader from '@/stores/loader'

const emit = defineEmits<{
  (e: 'close'): void
}>()

const toast = useToast()
const pinCode = ref('')
const pinCodeBad = ref(false)
const pinCodeGood = ref(false)
const loader = useLoader()

watch(pinCode, async () => {
  if (pinCode.value.length === 4) {
    try {
      loader.showLoader('pinLogin', undefined, 11000)
      await table.get('/heap', {
        auth: {
          username: 'tranquil',
          password: pinCode.value
        }
      })

      window.tablePin = pinCode.value
      pinCodeGood.value = true
      setTimeout(() => {
        pinCodeGood.value = false
        emit('close')
      }, 500)
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
    loader.hideLoader('pinLogin')
  }
})
</script>

<template>
  <VueFinalModal
    class="flex justify-center items-center !z-[10000]"
    :clickToClose="false"
    :escToClose="false"
    contentTransition="fade-y"
    overlayTransition="fade"
    :content-class="
      `p-4 w-[95vw] max-w-md bg-gray-900 border-[3px] border-gray-800 rounded-2xl` +
      (pinCodeBad ? ' animate-shake border-red-800' : '') +
      (pinCodeGood ? ' border-green-800' : '')
    "
  >
    <div class="flex flex-col gap-4">
      <div class="flex justify-center">
        <span
          class="text-lg font-medium"
          :class="{ 'text-red-600': pinCodeBad, '!text-green-600': pinCodeGood }"
        >
          Enter PIN
        </span>
      </div>
      <div class="w-full flex items-center justify-center gap-5 mb-2">
        <div
          class="w-4 h-4 bg-gray-400 rounded-full transition transform-gpu duration-300"
          :class="{
            'bg-gray-600': pinCode.length < 1,
            '!bg-red-600': pinCodeBad,
            '!bg-green-600': pinCodeGood
          }"
        />
        <div
          class="w-4 h-4 bg-gray-400 rounded-full transition transform-gpu duration-300"
          :class="{
            'bg-gray-600': pinCode.length < 2,
            '!bg-red-600': pinCodeBad,
            '!bg-green-600': pinCodeGood
          }"
        />
        <div
          class="w-4 h-4 bg-gray-400 rounded-full transition transform-gpu duration-300"
          :class="{
            'bg-gray-600': pinCode.length < 3,
            '!bg-red-600': pinCodeBad,
            '!bg-green-600': pinCodeGood
          }"
        />
        <div
          class="w-4 h-4 bg-gray-400 rounded-full transition transform-gpu duration-300"
          :class="{
            'bg-gray-600': pinCode.length < 4,
            '!bg-red-600': pinCodeBad,
            '!bg-green-600': pinCodeGood
          }"
        />
      </div>
      <div class="flex w-full justify-evenly items-center mb-2">
        <button
          @click="pinCode += '1'"
          class="w-20 h-20 flex items-center justify-center bg-gray-700 hover:bg-gray-600 rounded-full transition transform-gpu duration-300 border-[3px] border-gray-500"
        >
          <span class="text-3xl font-bold text-gray-400">1</span>
        </button>
        <button
          @click="pinCode += '2'"
          class="w-20 h-20 flex items-center justify-center bg-gray-700 hover:bg-gray-600 rounded-full transition transform-gpu duration-300 border-[3px] border-gray-500"
        >
          <span class="text-3xl font-bold text-gray-400">2</span>
        </button>
        <button
          @click="pinCode += '3'"
          class="w-20 h-20 flex items-center justify-center bg-gray-700 hover:bg-gray-600 rounded-full transition transform-gpu duration-300 border-[3px] border-gray-500"
        >
          <span class="text-3xl font-bold text-gray-400">3</span>
        </button>
      </div>
      <div class="flex w-full justify-evenly items-center mb-2">
        <button
          @click="pinCode += '4'"
          class="w-20 h-20 flex items-center justify-center bg-gray-700 hover:bg-gray-600 rounded-full transition transform-gpu duration-300 border-[3px] border-gray-500"
        >
          <span class="text-3xl font-bold text-gray-400">4</span>
        </button>
        <button
          @click="pinCode += '5'"
          class="w-20 h-20 flex items-center justify-center bg-gray-700 hover:bg-gray-600 rounded-full transition transform-gpu duration-300 border-[3px] border-gray-500"
        >
          <span class="text-3xl font-bold text-gray-400">5</span>
        </button>
        <button
          @click="pinCode += '6'"
          class="w-20 h-20 flex items-center justify-center bg-gray-700 hover:bg-gray-600 rounded-full transition transform-gpu duration-300 border-[3px] border-gray-500"
        >
          <span class="text-3xl font-bold text-gray-400">6</span>
        </button>
      </div>
      <div class="flex w-full justify-evenly items-center mb-2">
        <button
          @click="pinCode += '7'"
          class="w-20 h-20 flex items-center justify-center bg-gray-700 hover:bg-gray-600 rounded-full transition transform-gpu duration-300 border-[3px] border-gray-500"
        >
          <span class="text-3xl font-bold text-gray-400">7</span>
        </button>
        <button
          @click="pinCode += '8'"
          class="w-20 h-20 flex items-center justify-center bg-gray-700 hover:bg-gray-600 rounded-full transition transform-gpu duration-300 border-[3px] border-gray-500"
        >
          <span class="text-3xl font-bold text-gray-400">8</span>
        </button>
        <button
          @click="pinCode += '9'"
          class="w-20 h-20 flex items-center justify-center bg-gray-700 hover:bg-gray-600 rounded-full transition transform-gpu duration-300 border-[3px] border-gray-500"
        >
          <span class="text-3xl font-bold text-gray-400">9</span>
        </button>
      </div>
      <div class="flex w-full justify-center items-center">
        <button
          @click="pinCode += '0'"
          class="w-20 h-20 flex items-center justify-center bg-gray-700 hover:bg-gray-600 rounded-full transition transform-gpu duration-300 border-[3px] border-gray-500"
        >
          <span class="text-3xl font-bold text-gray-400">0</span>
        </button>
      </div>
    </div>
  </VueFinalModal>
</template>
