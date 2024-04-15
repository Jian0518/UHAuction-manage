import axios from 'axios'
import { Message, MessageBox } from 'element-ui'
import store from '@/store'
import { getToken } from '@/utils/auth'

// 1.create axios instance 
const service = axios.create({
  // public interface, url = base url + request url
  baseURL: process.env.VUE_APP_SERVER_URL,

  // baseURL: 'https://api.example.com',
  // The timeout unit is ms. A timeout of 5s is set here.
  timeout: 5 * 1000
})

// 2.request interceptor
service.interceptors.request.use(
  config => {
    // Some processing before sending the request, data conversion, 
    // configuring request headers, setting tokens, setting loading, etc., add them according to needs
    // when using tokens,  need to introduce the cookie method or use localStorage  
    // js-cookie is recommended.
    if (store.getters.token) {
      // config.params = {'token': token}    
      // config.headers.token = token;      
      // bearer：w3c standardize
      config.headers['Authorization'] = 'Bearer ' + getToken()
    }
    return config
  },
  error => {
    // do something with request error
    // console.log(error) // for debug
    return Promise.reject(error)
  }
)

// Set cross-domain and set access permissions to allow cookie information to be carried across domains
// can be turned off using JWT
service.defaults.withCredentials = false

service.interceptors.response.use(
  // Some common processing after receiving the response data and successfully, closing loading
  response => {
    const res = response.data
    // wrong if customize code is not 200
    if (res.code !== 200) {
      // 50008: illegal Token; 50012: Remote login; 50014: Token invalid;
      if (res.code === 401 || res.code === 50012 || res.code === 50014) {
        // Relogin
        MessageBox.confirm('Session invalid, you can stay at current page or login again', 'Permission denied', {
          confirmButtonText: 'Confirm',
          cancelButtonText: 'Cancel',
          type: 'warning',
          center: true
        }).then(() => {
          window.location.href = '#/login'
        })
      } else { // prompt directly for other errors
        Message({
          showClose: true,
          message: '⚠' + res.message || 'Error',
          type: 'error',
          duration: 3 * 1000
        })
      }
      return Promise.reject(new Error(res.message || 'Error'))
    } else {
      return res
    }
  },
  error => {

    // console.log('err' + error) // for debug
    Message({
      showClose: true,
      message: error.message,
      type: 'error',
      duration: 5 * 1000
    })
    return Promise.reject(error)
  }
)
export default service