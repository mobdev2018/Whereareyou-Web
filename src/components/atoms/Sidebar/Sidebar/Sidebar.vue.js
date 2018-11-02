import SidebarHeader from '../SidebarHeader'
import SidebarNavDivider from '../SidebarNavDivider'
import SidebarNavTitle from '../SidebarNavTitle'
import SidebarNavDropdown from '../SidebarNavDropdown'
import SidebarNavLink from '../SidebarNavLink'
import SidebarNavItem from '../SidebarNavItem'
import UploadView from '@/components/atoms/UploadView/UploadView'

export default {
  name: 'sidebar',
  props: {
    navItems: {
      type: Array,
      required: true,
      default: () => []
    }
  },
  components: {
    SidebarHeader,
    SidebarNavDivider,
    SidebarNavTitle,
    SidebarNavDropdown,
    SidebarNavLink,
    SidebarNavItem,
    UploadView
  },

  data () {
    return {
      inviteStep: 0,
      inviteModalTitle: 'Invite Devices',
      inviteType: '',
      deviceName: '',
      email: '',
      selectedDocType: ''
    }
  },

  methods: {
    handleClick (e) {
      e.preventDefault()
      e.target.parentElement.classList.toggle('open')
    },
    onAddNewDevice () {
      this.inviteStep = 0
      this.$refs.inviteDeviceModal.show()
    },
    successUpload () {
      this.requirements[this.selectedIndex].actions = 'view'
    },
    onSendInvite () {
      this.inviteStep = 1
      this.inviteModalTitle = 'Register a Payment Method'
    },
    onPayWithPaypal () {
      this.inviteStep = 2
      this.inviteModalTitle = 'Register a Paypal'
    },
    onPayWithCredit () {
      this.inviteStep = 2
      this.inviteModalTitle = 'Register a Credit Card'
    }
  }
}
