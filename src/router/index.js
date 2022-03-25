import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'

Vue.use(VueRouter)

const routes = [{
        path: '/',
        name: 'Home',
        component: Home
    },
    {
        path: '/record/list',
        name: 'Record',
        // redirect: '/',
        component: () =>
            import ('../views/Record.vue'),
        beforeEnter: (to, from, next) => {
            console.log(to)
            const token = localStorage.getItem('token')
            if (!token) {
                next({ path: './login/login-in', query: { from: to.fullPath } })
            } else {
                next()
            }
        },

    },
    {
        path: '/login',
        name: 'login',
        component: () =>
            import ('../views/Login.vue')
    },
    {
        path: '/login/login-in',
        name: 'login-in',
        component: () =>
            import ('../views/Login-in.vue')
    }
]

const router = new VueRouter({
    mode: 'history',
    base: process.env.BASE_URL,
    routes
})


export default router