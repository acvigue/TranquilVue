import axios, { Axios } from 'axios'
import table from './table'
import { Buffer } from 'buffer'
import { useModal } from 'vue-final-modal'
import { useToast } from 'vue-toast-notification'

import WebcenterLoginModal from '../components/WebcenterLoginModal.vue'
declare global {
  interface Window {
    authInProgress: boolean
  }
}

const toast = useToast()

function isJWTExpired(jwt: string): boolean {
  try {
    const payload = JSON.parse(Buffer.from(jwt.split('.')[1], 'base64').toString())
    const exp: number = payload.exp * 1000

    return Date.now() >= exp
  } catch (e) {
    console.error(e)
    return true
  }
}

const http = axios.create({
  baseURL: 'https://sis.vigue.me'
})

http.interceptors.request.use(
  async function (config) {
    //ignore interceptor for these paths
    if (
      axios.getUri(config).includes('getRefreshToken') ||
      axios.getUri(config).includes('getAccessToken')
    ) {
      return config
    }

    //hack to pause all requests while in login -> auth flow
    await waitForAuthorization()

    //Authorize all requests
    let accessToken = window.localStorage.getItem('accessToken')
    if (accessToken === null || isJWTExpired(accessToken)) {
      let refreshToken = window.localStorage.getItem('refreshToken')
      if (refreshToken === null) {
        window.authInProgress = true
        let webcenterCredentials
        try {
          webcenterCredentials = await table.get('/settings/webcenter')
        } catch (e) {
          toast.error(`Couldn't connect to table backend!`)
          throw new axios.Cancel()
        }

        refreshToken = webcenterCredentials.data.webcenter.token

        if (!refreshToken || refreshToken == null) {
          await showLoginModal()
          refreshToken = window.localStorage.getItem('refreshToken')

          try {
            webcenterCredentials = await table.post('/settings/webcenter', {
              token: refreshToken
            })
          } catch (e) {
            toast.error(`Couldn't save login data`)
          }
        } else {
          window.localStorage.setItem('refreshToken', refreshToken!)
        }
        window.authInProgress = false
      }

      try {
        const authRequest = await http.post('/auth/getAccessToken', {
          refreshToken
        })
  
        accessToken = authRequest.data.accessToken
      } catch(e) {
        toast.error(`Couldn't get access token!`)
        throw new axios.Cancel()
      }

      window.localStorage.setItem('accessToken', accessToken!)
    }

    //holy grail
    config.headers['Authorization'] = `Bearer ${accessToken}`

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
  console.log(`opening modal`)
  return new Promise<void>((resolve) => {
    const modal = useModal({
      component: WebcenterLoginModal,

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
