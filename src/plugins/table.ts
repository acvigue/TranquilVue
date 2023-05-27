import axios, { type AxiosError } from 'axios'
import { useModal } from 'vue-final-modal'

import TablePinLoginModal from '@/components/modals/TablePinLoginModal.vue'
declare global {
  interface Window {
    pinInProgress: boolean
    tablePin?: string
  }
}
const http = axios.create({
  baseURL: import.meta.env.PROD ? '/' : 'https://deskbot.vigue.me/'
})

http.interceptors.response.use(
  (response) => {
    return response
  },
  async (error) => {
    if (!axios.isAxiosError(error)) {
      return Promise.reject(error)
    }
    const e = error as AxiosError

    //If heap had a bad response, reject it (this makes pin error work)
    if (axios.getUri(e.config).includes('heap')) {
      return Promise.reject(error)
    }

    await waitForAuthorization()

    if (e.response?.status === 401) {
      if (!window.tablePin) {
        window.pinInProgress = true
        await showLoginModal()
        window.pinInProgress = false
      }

      const reqConfig = e.config!

      reqConfig.auth = {
        username: 'tranquil',
        password: window.tablePin!
      }

      return http(reqConfig)
    }
  }
)

http.interceptors.request.use(
  async (config) => {
    //We use /heap as a test url to check for valid pin!
    if (axios.getUri(config).includes('heap')) {
      return config
    }

    await waitForAuthorization()

    //Authorize all requests
    const pinCode = window.tablePin
    if (pinCode) {
      config.auth = {
        username: 'tranquil',
        password: pinCode
      }
    }

    return config
  },
  function (error) {
    return Promise.reject(error)
  }
)

//hacks
function waitForAuthorization() {
  return new Promise<void>((resolve) => {
    if (!window.pinInProgress) {
      resolve()
    }

    setInterval(() => {
      if (!window.pinInProgress) {
        resolve()
      }
    }, 500)
  })
}

function showLoginModal() {
  return new Promise<void>((resolve) => {
    const modal = useModal({
      component: TablePinLoginModal,

      attrs: {
        onClose() {
          modal.close()
          resolve()
        }
      }
    })
    modal.open()
  })
}

export default http
