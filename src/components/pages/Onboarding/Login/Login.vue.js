import firebase from 'firebase'
import { mapActions } from 'vuex'

export default {
  name: 'Login',

  data () {
    return {
      loading: false,
      email: '',
      password: '',
      modalMessage: ''
    }
  },

  methods: {
    ...mapActions([
      'updateUserInfo'
    ]),
    onLogin () {
      this.$validator.validateAll('login-form').then((v) => {
        if (v) {
          this.login()
        }
      })
    },
    login () {
      this.modalMessage = ''
      this.loading = true
      firebase.auth().signInWithEmailAndPassword(this.email, this.password).then(
        (user) => {
          this.loading = false
          this.$router.replace('/dashboard')
        },
        (err) => {
          this.loading = false
          this.modalMessage = err.message
          this.$refs.modal.show()
        }
      )
    }
  }
}
