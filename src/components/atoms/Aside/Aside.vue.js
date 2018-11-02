import Callout from '../Callout'
import cSwitch from '../Switch'
import { mapGetters } from 'vuex'

export default {
  name: 'c-aside',
  components: {
    Callout,
    cSwitch
  },

  computed: {
    ...mapGetters([
      'locations'
    ])
  },

  data () {
    return {
    }
  }
}
