<script setup lang="ts">
import { VueFinalModal } from 'vue-final-modal'
import { FormKit } from '@formkit/vue'
import { type FormKitNode } from '@formkit/core'
import webcenter from '../plugins/webcenter'
import { useToast } from 'vue-toast-notification'
import axios from 'axios'

const emit = defineEmits<{
  (e: 'loggedin'): void
}>()

const toast = useToast()

interface SignInFields {
  email: string
  password: string
  sisbot_id: string
  sisbot_mac: string
}

const signInAction = async (fields: SignInFields) => {
  try {
    const refreshTokenResponse = await webcenter.post('/auth/getRefreshToken', {
      email: fields.email,
      password: fields.password,
      sisbot: {
        id: fields.sisbot_id,
        mac: fields.sisbot_mac
      }
    })

    //valid refresh token!
    window.localStorage.setItem('refreshToken', refreshTokenResponse.data.refreshToken)

    emit('loggedin')
  } catch (e) {
    if(axios.isAxiosError(e)) {
      if(e.response) {
        toast.error(e.response.data.error)
      } else {
        toast.error("Network Error")
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
    content-class="p-4 md:w-[60vw] w-[80vw] bg-gray-900 border-[3px] border-gray-800 rounded-2xl"
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
        <FormKit
          type="text"
          name="sisbot_id"
          id="sisbot_id"
          label="Sisbot ID"
          validation="sisbotid|required"
        />
        <FormKit
          type="text"
          name="sisbot_mac"
          id="sisbot_mac"
          label="Sisbot MAC"
          validation="macaddress|required"
        />
      </FormKit>
    </div>
  </VueFinalModal>
</template>
