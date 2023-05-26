<script setup lang="ts">
import { VueFinalModal } from 'vue-final-modal'
import { FormKit } from '@formkit/vue'
import tranquilapi from '@/plugins/tranquilapi'
import { useToast } from 'vue-toast-notification'
import { isAxiosError } from 'axios'
import type { FormKitNode } from '@formkit/core'

const emit = defineEmits<{
  (e: 'close'): void
}>()

const toast = useToast()

interface SignInFields {
  email: string
  password: string
}

const signInAction = async (fields: SignInFields, node: FormKitNode<unknown> | undefined) => {
  try {
    const refreshTokenResponse = await tranquilapi.post('/auth', {
      email: fields.email,
      password: fields.password
    })

    //valid refresh token!
    window.localStorage.setItem('tranquilToken', refreshTokenResponse.data.token)

    emit('close')
  } catch (e) {
    if (isAxiosError(e)) {
      if (e.response && node) {
        node.setErrors([e.response.data.error])
      } else {
        toast.error('Network Error')
      }
    }
  }
}
</script>

<template>
  <VueFinalModal
    class="flex justify-center items-center"
    :clickToClose="false"
    :escToClose="false"
    contentTransition="fade-y"
    overlayTransition="fade"
    content-class="p-4 w-[95vw] max-w-xl bg-gray-900 border-[3px] border-gray-800 rounded-2xl z-[10000]"
  >
    <div class="flex flex-col gap-4">
      <div class="flex justify-center">
        <div>
          <span class="text-lg font-medium overflow-hidden line-clamp-1 break-words">
            Sign in to continue
          </span>
        </div>
      </div>
      <FormKit type="form" @submit="signInAction" submit-label="Sign In">
        <FormKit type="text" name="email" id="email" label="Email" validation="email|required" />
        <FormKit
          type="password"
          name="password"
          id="password"
          label="Password"
          validation="required"
        />
      </FormKit>
    </div>
  </VueFinalModal>
</template>
