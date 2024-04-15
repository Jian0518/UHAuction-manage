import axios from 'axios'
import router from '../router'

const BASE_URL = process.env.NODE_HOST

axios.defaults.timeout = 5000 // time out setting
axios.defaults.withCredentials = true // allow for cross domain 
axios.defaults.baseURL = BASE_URL
// Content-Type response head
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8'

// response to interceptors
axios.interceptors.response.use(
  response => {
    // 200 means success
    // else error
    if (response.status === 200) {
      return Promise.resolve(response)
    } else {
      return Promise.reject(response)
    }
  },
  
  error => {
    if (error.response.status) {
      switch (error.response.status) {
        // 401: not login 
        case 401:
          router.replace({
            path: "/",
            query: {
              // redirect: router.currentRoute.fullPath
            },
          });
          break;
        case 403:
          // redirect login page 
          setTimeout(() => {
            router.replace({
              path: "/",
              query: {
                // redirect: router.currentRoute.fullPath
              },
            });
          }, 1000);
          break;

        // 404 request does not exist
        case 404:
          break;
      }
      return Promise.reject(error.response);
    }
  }
)

export function getBaseURL() {
  return BASE_URL;
}

/**
 * encapsulate get method
 * @param url
 * @param data
 * @returns {Promise}
 */
export function get(url, params?: object) {
  return new Promise((resolve, reject) => {
    axios.get(url, params).then(
      response => resolve(response.data),
      error => reject(error)
    )
  });
}

/**
 * encapsulate post request
 * @param url
 * @param data
 * @returns {Promise}
 */
export function post(url, data = {}) {
  return new Promise((resolve, reject) => {
    axios.post(url, data).then(
      response => resolve(response.data),
      error => reject(error)
    );
  });
}

/**
 * encapsulate delete request
 * @param url
 * @param data
 * @returns {Promise}
 */
export function deletes(url, data = {}) {
  return new Promise((resolve, reject) => {
    axios.delete(url, data).then(
      response => resolve(response.data),
      error => reject(error)
    );
  });
}

/**
 * encapsulate put request 
 * @param url
 * @param data
 * @returns {Promise}
 */
export function put(url, data = {}) {
  return new Promise((resolve, reject) => {
    axios.put(url, data).then(
      response => resolve(response.data),
      error => reject(error)
    );
  });
}
