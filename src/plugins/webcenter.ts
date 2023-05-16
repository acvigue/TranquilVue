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
    // Do something before request is sent
    let token = window.localStorage.getItem('sis_wc_jwt') //do not store token on localstorage!!!
    if (token === null || isJWTExpired(token)) {
      const credentialsRequest = await table.get('/webCenterGet')

      const authRequest = await http.post('/auth_user', {
        email: credentialsRequest.data.webcenter.email,
        password: credentialsRequest.data.webcenter.password
      })

      const returnedToken: string = authRequest.data.resp[0].auth_token
      window.localStorage.setItem('sis_wc_jwt', returnedToken)
      token = returnedToken

      window.localStorage.setItem('sis_sisbot_id', credentialsRequest.data.webcenter.sisbot_id)
    }

    console.log(token)

    config.headers['Authorization'] = token
    return config
  },
  function (error) {
    return Promise.reject(error)
  }
)

export default http
