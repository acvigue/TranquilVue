import axios from 'axios'
import table from './table'
import { Buffer } from 'buffer'

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
  baseURL: 'https://webcenter.sisyphus-industries.com'
})

http.interceptors.request.use(
  async function (config) {
    //We don't want to intercept on the auth call, this will create a loop!
    if (axios.getUri(config).includes('auth_user')) {
      return config
    }

    //Authorize all requests
    let token = window.localStorage.getItem('sis_wc_jwt')
    if (token === null || isJWTExpired(token)) {
      const credentialsRequest = await table.get('/webCenterGet')

      const authRequest = await http.post('/auth_user', {
        email: credentialsRequest.data.webcenter.email,
        password: credentialsRequest.data.webcenter.password
      })

      const returnedToken: string = authRequest.data.resp[0].auth_token
      window.localStorage.setItem('sis_wc_jwt', returnedToken)

      window.localStorage.setItem('sis_sisbot_id', credentialsRequest.data.webcenter.sisbot_id)
      window.localStorage.setItem('sis_sisbot_mac', credentialsRequest.data.webcenter.sisbot_mac)
      token = returnedToken
    }

    config.headers['Authorization'] = token

    // Add sisbot ID parameters to track download requests
    if (axios.getUri(config).includes('download')) {
      const sisbotID = window.localStorage.getItem('sis_sisbot_id') ?? ''
      let sisbotMAC = window.localStorage.getItem('sis_sisbot_mac') ?? ''
      sisbotMAC = sisbotMAC.match(/.{2}/g)?.join(':') ?? ''
      config.url += `?pi_id=${sisbotID}&mac_address=${sisbotMAC}&class=wcdownload`
    }

    return config
  },
  function (error) {
    return Promise.reject(error)
  }
)

export default http
