import Avatar from 'vue-avatar'
import firebase from 'firebase'

export default {
  name: 'header-dropdown-accnt',

  components: {
    Avatar
  },

  data: () => {
    return {
      username: '',
      itemsCount: 42
    }
  },

  mounted () {
    this.username = firebase.auth().currentUser.email
  },

  methods: {
    onLogout () {
      this.$cookie.delete('token')

      firebase.auth().signOut().then(() => {
        this.$router.replace('/login')
      })
    }
  }
}
