import HeaderDropdownAccnt from '../HeaderDropdownAccnt/HeaderDropdownAccnt'
import _ from 'lodash'

export default {
  name: 'Navbar',
  components: {
    HeaderDropdownAccnt
  },

  data () {
    return {
      hideAsideMenu: true
    }
  },

  created () {
    // document.body.classList.toggle('sidebar-hidden')
  },

  watch: {
    '$route' () {
      if (_.includes(this.$route.path, '/pings')) {
        this.hideAsideMenu = false
      } else {
        this.hideAsideMenu = true
      }

      if (!document.body.classList.contains('aside-menu-hidden')) {
        document.body.classList.toggle('aside-menu-hidden')
      }
    }
  },

  methods: {
    sidebarToggle (e) {
      e.preventDefault()
      document.body.classList.toggle('sidebar-hidden')
    },
    sidebarMinimize (e) {
      e.preventDefault()
      document.body.classList.toggle('sidebar-minimized')
    },
    mobileSidebarToggle (e) {
      e.preventDefault()
      document.body.classList.toggle('sidebar-mobile-show')
    },
    asideToggle (e) {
      e.preventDefault()
      document.body.classList.toggle('aside-menu-hidden')
    }
  }
}
