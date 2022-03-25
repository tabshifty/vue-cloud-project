import nProgress from "nprogress";
import axios from "axios";

const axiosInstance = axios.create({
    baseURL: 'http://124.223.65.151',
    timeout: 20000
})
nProgress.configure({
    showSpinner: false,

})
const token = localStorage.getItem('token')
    // alert(token)

axiosInstance.interceptors.request.use(
    function(config) {
        nProgress.start()
        config.headers.authorization = 'Bearer ' + token
        return config
    },
    function(error) {
        nProgress.done()
        return Promise.reject(error)
    }
)

axiosInstance.interceptors.response.use(function(response) {
    nProgress.done()
    return response
}, function(error) {
    nProgress.done()
    return Promise.reject(error)
})

export default axiosInstance