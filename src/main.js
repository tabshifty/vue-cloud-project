import Vue from 'vue'
import App from './App.vue'
import router from './router'
import VueLazyload from 'vue-lazyload'

const errorimage = require('./assets/images/FKlrH4nUUAQugUG.jpg')
    // const loadimage = require('./assets/images/clock-loading.gif')
Vue.config.productionTip = false

Vue.use(VueLazyload, {
    preLoad: 1.3,
    error: errorimage,
    // loading: loadimage,
    attempt: 1
})
new Vue({
    router,
    render: h => h(App)
}).$mount('#app')