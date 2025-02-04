import axios from 'axios'

export const myAxios = axios.create()

myAxios.interceptors.request.use(async (config) => {
  return config
})
