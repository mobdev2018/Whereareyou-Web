import firebase from 'firebase'

export const interceptRouter = function (router) {
  // Authentication logic
  router.beforeEach((to, from, next) => {
    let currentUser = firebase.auth().currentUser
    let requiresAuth = to.matched.some(record => record.meta.requiresAuth)

    if (requiresAuth && !currentUser) next('login')
    else if (!requiresAuth && currentUser) next()
    next()
  })
  router.afterEach(() => {

  })
}
