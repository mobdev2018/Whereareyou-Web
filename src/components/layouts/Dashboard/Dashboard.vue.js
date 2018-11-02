import Navbar from '@/components/atoms/Header/Navbar/Navbar'
import Sidebar from '@/components/atoms/Sidebar/Sidebar/Sidebar'
import Aside from '@/components/atoms/Aside/Aside'
import firebase from 'firebase'
import _ from 'lodash'
import { mapActions } from 'vuex'

export const NavItemsList = [
  {
    name: 'Dashboard',
    url: '/dashboard/home',
    icon: 'fa fa-tachometer fs-18'
  },
  {
    name: 'Recent Activity',
    url: '/dashboard/recent',
    icon: 'fa fa-calendar fs-18'
  },
  // {
  //   name: 'Account Management',
  //   url: '/dashboard/accounts',
  //   icon: 'fa fa-suitcase fs-18'
  // },
  {
    divider: true,
    class: 'mb-4'
  },
  {
    title: true,
    name: 'My Devices',
    class: 'fs-12 pb-0'
  }
]

export default {
  name: 'Dashbaord',

  components: {
    Navbar,
    Sidebar,
    Aside
  },

  data () {
    return {
      navItems: []
    }
  },

  mounted () {
    this.getDevices()
  },

  methods: {
    ...mapActions([
      'clearDevices',
      'updateDevices'
    ]),
    getDevices () {
      const database = firebase.database()
      var currentUser = firebase.auth().currentUser
      database.ref('users').child(currentUser.uid).child('devices').on('value', snapshot => {
        let data = snapshot.val()
        let allDevices = []
        this.clearDevices()
        this.navItems = _.cloneDeep(NavItemsList)

        if (data) {
          Object.keys(data).forEach((key) => {
            let deviceName = data[key].deviceName === undefined ? data[key].deviceModel : data[key].deviceName

            this.navItems.push({
              name: deviceName,
              url: '/dashboard/' + key,
              icon: 'fa fa-mobile fs-32',
              children: [
                {
                  name: 'Pings',
                  url: '/dashboard/' + key + '/pings',
                  icon: 'fas fa-globe fs-20'
                },
                {
                  name: 'History',
                  url: '/dashboard/' + key + '/history',
                  icon: 'fas fa-history fs-20'
                },
                {
                  name: 'Info',
                  url: '/dashboard/' + key + '/info',
                  icon: 'fas fa-info-circle fs-20'
                }
              ]
            })

            allDevices.push({
              deviceId: key,
              deviceModel: data[key].deviceModel,
              deviceName: data[key].deviceName,
              deviceMake: data[key].deviceMake,
              deviceImei: data[key].deviceImei,
              name: data[key].deviceName === undefined ? data[key].deviceModel : data[key].deviceName
            })
          })
          this.updateDevices(allDevices)
        }
      })
    }
  }
}
