import axios from 'axios'

export default axios.create({
  baseURL: import.meta.env.PROD ? '/' : 'http://sandytable.local'
})
