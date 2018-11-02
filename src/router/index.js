import Vue from 'vue'
import Router from 'vue-router'

import LoginPage from '@/components/pages/Onboarding/Login/Login'
import RegisterPage from '@/components/pages/Onboarding/Register/Register'
import MonitorPage from '@/components/pages/Dashboard/Monitor/Monitor'

Vue.use(Router)

export default new Router({
  mode: 'hash',
  linkActiveClass: 'open active',
  scrollBehavior: () => ({ y: 0 }),
  routes: [
    {
      path: '/',
      redirect: '/dashboard'
    },
    {
      path: '/login',
      name: 'Login',
      component: LoginPage
    },
    {
      path: '/register',
      name: 'Register',
      component: RegisterPage
    },
    {
      path: '/dashboard',
      name: 'home',
      component: MonitorPage
    }
  ]
})
