import { loaded } from 'vue2-google-maps'
import firebase from 'firebase'

export default {
  name: 'MonitorPage',

  data () {
    return {
      loading: false,
      center: { lat: 51.7519, lng: -1.2578 },
      markers: [],
      marker: {
        time: ''
      },
      normalPinIcon: {
        url: '/static/img/pin_red.png',
        scaledSize: new window.google.maps.Size(28, 36),
        labelOrigin: { x: 14, y: 14 }
      },
      infoWindowPos: {
        lat: 0,
        lng: 0
      },
      infoWinOpen: false,
      currentMidx: null,
      // optional: offset infowindow so it visually sits nicely on top of our marker
      infoOptions: {
        pixelOffset: {
          width: 0,
          height: -35
        }
      }
    }
  },

  mounted () {
    loaded.then(() => {
      this.getLocations()
    })
  },

  watch: {
    '$route' () {
      this.getLocations()
    }
  },

  methods: {
    getLocations () {
      this.markers = []
      this.status = {
        distance: 0,
        distanceString: '0 m',
        time: 0,
        timeString: '0h 00m',
        pace: '0 Km/Hr'
      }

      const database = firebase.database()
      var currentUser = firebase.auth().currentUser

      let ref = database.ref('users').child(currentUser.uid)

      ref.on('value', snapshot => {
        let data = snapshot.val()

        if (data === undefined || data == null) {
          return
        }

        this.markers = []

        console.log('========', data)

        this.markers.push({
          position: {lat: data.latitude, lng: data.longitude},
          label: {
            text: 'F'
          },
          draggable: false,
          title: 'Stanford',
          time: data.lastTime,
          address: data.address
        })

        this.center = {lat: data.latitude, lng: data.longitude}

        if (this.$refs.gMap && this.$refs.gMap.$mapObject) {
          this.$refs.gMap.$mapObject.setCenter(this.center)
          this.smoothZoom(this.$refs.gMap.$mapObject, 12, this.$refs.gMap.$mapObject.getZoom())
        }
      })
    },
    // the smooth zoom function
    smoothZoom (map, max, cnt) {
      if (cnt < max) {
        let z = window.google.maps.event.addListener(map, 'zoom_changed', (event) => {
          window.google.maps.event.removeListener(z)
          this.smoothZoom(map, max, cnt + 1)
        })
        setTimeout(() => {
          map.setZoom(cnt)
        }, 80) // 80ms is what I found to work well on my system -- it might not work well on all systems
      }
    },
    toggleInfoWindow (marker, idx) {
      this.infoWindowPos = marker.position
      this.marker = {
        time: marker.time
      }

      // check if its the same marker that was selected if yes toggle
      if (this.currentMidx === idx) {
        this.infoWinOpen = !this.infoWinOpen
      } else {
        // if different marker set infowindow to open and reset current marker index
        this.currentMidx = idx
        this.infoWinOpen = true
      }
    },
    showInfoWindow (idx) {
      let marker = this.markers[idx]

      this.infoWindowPos = marker.position
      this.marker = {
        time: marker.time
      }

      // check if its the same marker that was selected if yes toggle
      if (this.currentMidx === idx) {
        this.infoWinOpen = !this.infoWinOpen
      } else {
        // if different marker set infowindow to open and reset current marker index
        this.currentMidx = idx
        this.infoWinOpen = true
      }
    }
  }
}
