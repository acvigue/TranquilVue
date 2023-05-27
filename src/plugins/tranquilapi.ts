import axios, { AxiosError } from 'axios'
import table from './table'
import { useModal } from 'vue-final-modal'
import { useToast } from 'vue-toast-notification'

import TranquilLoginModal from '@/components/modals/TranquilLoginModal.vue'
declare global {
  interface Window {
    authInProgress: boolean
  }
}

const toast = useToast()

const http = axios.create({
  baseURL: 'https://tranquilapi.fiftytwo.workers.dev'
})

http.interceptors.response.use(
  (response) => {
    // Any status code that lie within the range of 2xx cause this function to trigger
    // Do something with response data
    return response
  },
  async (error) => {
    if (!axios.isAxiosError(error)) {
      return Promise.reject(error)
    }
    const e = error as AxiosError

    if (axios.getUri(e.config).includes('auth')) {
      return Promise.reject(error)
    }

    if (e.response?.status === 401) {
      toast.error('Please sign in again')
      window.authInProgress = true
      await showLoginModal()
      const tranquilToken = window.localStorage.getItem('tranquilToken')

      try {
        await table.post('/settings/tranquil', {
          token: tranquilToken
        })
      } catch (e) {
        toast.error('Error updating stored token')
      }

      window.localStorage.setItem('tranquilToken', tranquilToken!)
      window.authInProgress = false
    }
  }
)

http.interceptors.request.use(
  async (config) => {
    //ignore interceptor for these paths
    if (axios.getUri(config).includes('auth')) {
      return config
    }

    //hack to pause all requests while in login -> auth flow
    const startTime = Date.now()
    await waitForAuthorization()
    const endTime = Date.now()
    if (axios.getUri(config).includes('data') && endTime - startTime > 5 * 1000) {
      throw new axios.Cancel()
    }

    //Authorize all requests
    let tranquilToken = window.localStorage.getItem('tranquilToken')
    if (!tranquilToken || tranquilToken === null) {
      window.authInProgress = true
      let settings
      try {
        settings = await table.get('/settings/tranquil')
      } catch (e) {
        toast.error('Error fetching stored token')
        throw new axios.Cancel()
      }

      tranquilToken = settings.data.tranquil.token

      if (!tranquilToken || tranquilToken === null) {
        await showLoginModal()
        tranquilToken = window.localStorage.getItem('tranquilToken')

        try {
          await table.post('/settings/tranquil', {
            token: tranquilToken
          })
        } catch (e) {
          toast.error('Error updating stored token')
        }
      }

      window.localStorage.setItem('tranquilToken', tranquilToken!)
      window.authInProgress = false
    }

    config.headers['Authorization'] = `Bearer ${tranquilToken}`

    return config
  },
  function (error) {
    return Promise.reject(error)
  }
)

//hacks
function waitForAuthorization() {
  return new Promise<void>((resolve) => {
    if (!window.authInProgress) {
      resolve()
    }

    setInterval(() => {
      if (!window.authInProgress) {
        resolve()
      }
    }, 500)
  })
}

function showLoginModal() {
  return new Promise<void>((resolve) => {
    const modal = useModal({
      component: TranquilLoginModal,

      attrs: {
        onClose() {
          modal.close()
          toast.success('Signed in successfully')
          resolve()
        }
      }
    })
    modal.open()
  })
}

export default http
