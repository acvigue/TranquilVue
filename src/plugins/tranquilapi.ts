import axios from 'axios'
import table from './table'
import { Buffer } from 'buffer'
import { useModal } from 'vue-final-modal'
import { useToast } from 'vue-toast-notification'

import TranquilLoginModal from '../components/TranquilLoginModal.vue'
declare global {
  interface Window {
    authInProgress: boolean
  }
}

const toast = useToast()

const http = axios.create({
  baseURL: 'https://tranquilapi.fiftytwo.workers.dev'
})

http.interceptors.request.use(
  async function (config) {
    //ignore interceptor for these paths
    if (axios.getUri(config).includes('auth')) {
      return config
    }

    //hack to pause all requests while in login -> auth flow
    await waitForAuthorization()

    //Authorize all requests
    let tranquilToken = window.localStorage.getItem('tranquilToken')
    if (!tranquilToken || tranquilToken === null) {
      window.authInProgress = true
      let settings
      try {
        settings = await table.get('/settings/tranquil')
      } catch (e) {
        toast.error(`Couldn't connect to robot backend!`)
        throw new axios.Cancel()
      }

      tranquilToken = settings.data.tranquil.token

      if (!tranquilToken || tranquilToken == null) {
        await showLoginModal()
        tranquilToken = window.localStorage.getItem('tranquilToken')

        try {
          await table.post('/settings/tranquil', {
            token: tranquilToken
          })
        } catch (e) {
          toast.error(`Couldn't save token`)
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
        onLoggedin() {
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
