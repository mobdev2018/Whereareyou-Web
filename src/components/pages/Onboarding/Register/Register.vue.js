import firebase from 'firebase'
import { mapActions } from 'vuex'

export default {
  name: 'Register',

  data () {
    return {
      loading: false,
      email: '',
      password: '',
      repeatPassword: '',
      modalMessage: ''
    }
  },

  methods: {
    ...mapActions([
      'updateUserInfo'
    ]),
    onSignUp () {
      this.$validator.validateAll('register-form').then((v) => {
        if (v) {
          this.signup()
        }
      })
    },
    signup () {
      this.modalMessage = ''
      this.loading = true

      firebase.auth().createUserWithEmailAndPassword(this.email, this.password).then(
        (user) => {
          this.loading = false

          this.$router.replace('/dashboard')
        },
        (err) => {
          this.loading = false
          this.modalMessage = 'Oops. ' + err.message
          this.$refs.modal.show()
        }
      )
    }
  }
}
