import axios from 'axios'


axios.defaults.baseURL = import.meta.env.VITE_APP_BASE_API
axios.defaults.timeout = 10000
axios.defaults.withCredentials = true
axios.defaults.headers['X-Requested-With'] = 'XMLHttpRequest'
axios.defaults.headers.post['Content-Type'] = 'application/json'


axios.interceptors.request.use(config => {
    // return new Promise(resolve => setTimeout(() => resolve(config), 500));
    return config;
}, error => {
    return Promise.reject(error);
})

axios.interceptors.response.use(res => {
    return res.data
}, error => {
    return error.response.data
})

export default axios