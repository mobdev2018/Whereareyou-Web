// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import VueRouter from 'vue-router'

import BootstrapVue from 'bootstrap-vue'
import VeeValidate from 'vee-validate'
import VueCookie from 'vue-cookie'
import moment from 'moment'
import VueMomentJS from 'vue-momentjs'
import ToggleButton from 'vue-js-toggle-button'

import * as VueGoogleMaps from 'vue2-google-maps'
import GmapCluster from 'vue2-google-maps/dist/components/cluster'
import firebase from 'firebase'

import router from './router'
import { interceptRouter } from './router/middleware'
import mixin from './mixins'
import store from './store'

import App from './App'

Vue.use(VueRouter)
Vue.use(BootstrapVue)
Vue.use(VeeValidate, { fieldsBagName: 'veeFields' })
Vue.use(VueCookie)
Vue.use(VueMomentJS, moment)
Vue.use(ToggleButton)

Vue.use(VueGoogleMaps, {
  load: {
    libraries: 'geometry, places, directions',
    key: 'AIzaSyD-g-Zt50FvrV6QClytIBUKnNj7CLoxujY'
  }
})
Vue.component('GmapCluster', GmapCluster)
Vue.use(firebase)
Vue.mixin(mixin)

interceptRouter(router)

Vue.config.debug = true
Vue.config.lang = 'en'
Vue.config.productionTip = false

let app
var config = {
  apiKey: 'AIzaSyADa8-Vepa5KJYVps92ZEY7n8xkXkMmFpU',
  authDomain: 'where-are-you-3ff82.firebaseapp.com',
  databaseURL: 'https://where-are-you-3ff82.firebaseio.com',
  projectId: 'where-are-you-3ff82',
  storageBucket: 'where-are-you-3ff82.appspot.com',
  messagingSenderId: '187809553029'
}

firebase.initializeApp(config)
firebase.auth().onAuthStateChanged(function (user) {
  if (!app) {
    /* eslint-disable no-new */
    app = new Vue({
      el: '#app',
      router,
      store,
      template: '<App/>',
      components: {
        App
      }
    })
  }
})
