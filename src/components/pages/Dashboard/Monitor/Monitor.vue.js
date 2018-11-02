import { loaded } from 'vue2-google-maps'
import firebase from 'firebase'

export default {
  name: 'MonitorPage',

  data () {
    return {
      loading: false,
      isTracking: false,
      enableBait: false,
      isBaitMode: false,
      deviceId: undefined,
      selectedDevice: {},
      // for filter
      selectedDateString: 'Today',
      selectedDate: new Date(),
      selectedStartTime: '00:00 AM',
      selectedEndTime: '11:59 PM',
      dateFilterCollapse: true,
      // for details
      statusCollapse: false,
      status: {
        distance: 0,
        distanceString: '0 m',
        time: 0, // minutes
        timeString: '0h 00m',
        pace: '0 Km/min'
      },
      // for checkout
      baitStep: 0,
      // map data
      oldCenter: null,
      mapOptions: {
        zoom: 8,
        streetViewControl: false,
        mapTypeId: window.google.maps.MapTypeId.SATELLITE
      },
      center: { lat: 51.7519, lng: -1.2578 },
      markers: [],
      marker: {
        time: '',
        activityName: '',
        speed: '',
        battery: 0,
        provider: ''
      },
      normalPinIcon: {
        url: '/static/img/marker.png',
        scaledSize: new window.google.maps.Size(28, 36),
        labelOrigin: { x: 14, y: 14 }
      },
      lastPinIcon: {
        url: '/static/img/marker.png',
        scaledSize: new window.google.maps.Size(38, 48),
        labelOrigin: { x: 19, y: 20 }
      },
      directionPinIcon: {
        url: '/static/img/pin_red.svg',
        scaledSize: new window.google.maps.Size(30, 36),
        labelOrigin: { x: 15, y: 14 }
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
    this.dateFilterCollapse = false
    loaded.then(() => {
      this.directionsService = new window.google.maps.DirectionsService()
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
      if (this.$route.params != null) {
        this.deviceId = this.$route.params.id
      }

      for (var i = 0; i < this.devices.length; i++) {
        let deviceInfo = this.devices[i]
        if (deviceInfo.deviceId === this.deviceId) {
          this.selectedDevice = deviceInfo
          break
        }
      }

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

        Object.keys(data).forEach((key) => {
          let activityDate = this.$moment.utc(key, 'YYYYMMDDHHmmss').toDate()
          let dateString = this.$moment(activityDate).format('YYYY-MM-DD')

          if (strDate === dateString) {
            const activityInfo = data[key]

            let activityName = activityInfo.activityName
            let arrData = activityInfo.data
            this.oldCenter = null
            var oldTime = null

            if (arrData) {
              this.status.distance = 0
              this.status.time = 0

              var counter = 1
              Object.keys(arrData).forEach((key1) => {
                const deviceInfo = arrData[key1]
                this.center = {
                  lat: deviceInfo.latitude,
                  lng: deviceInfo.longitude
                }

                const time = deviceInfo.time
                let datetime = this.$moment.utc(time, 'YYYY-MM-DD HH:mm:ss').toDate()
                var strTime = this.$moment(datetime).format('YYYY-MM-DD HH:mm:ss')
                const hour = strTime.substring(11, 13)

                if (hour >= this.timepicker.value[0] && hour < this.timepicker.value[1]) {
                  const battery = deviceInfo.battery

                  strTime = this.$moment(datetime).format('MM/DD/YYYY hh:mm:ss a')

                  var strDistance = '0 Km'
                  var strPace = '00:00 Km/min'
                  if (this.oldCenter !== null && oldTime !== null) {
                    let distance = this.calcDistance(this.oldCenter, this.center)
                    let firstTime = this.$moment.utc(oldTime, 'YYYY-MM-DD HH:mm:ss')
                    let secondTime = this.$moment.utc(time, 'YYYY-MM-DD HH:mm:ss')
                    let duration = secondTime.diff(firstTime, 'seconds')

                    if (distance > 1000) {
                      strDistance = (distance / 1000).toFixed(1) + ' Km'
                    } else {
                      strDistance = (distance / 1).toFixed(1) + ' m'
                    }

                    if (duration === 0) {
                      strPace = '00:00 Km/min'
                    } else {
                      let pace = distance * 3600 / duration
                      if (pace > 100) {
                        strPace = (pace / 1000).toFixed(2) + ' Km/Hr'
                      } else {
                        strPace = (pace / 1).toFixed(1) + ' m/Hr'
                      }
                    }
                  }

                  this.markers.push({
                    activityName: activityName,
                    position: {lat: deviceInfo.latitude, lng: deviceInfo.longitude},
                    label: {
                      text: counter + '',
                      color: '#FFFFFF',
                      fontSize: '12px'
                    },
                    draggable: false,
                    title: '',
                    time: strTime,
                    distance: strDistance,
                    speed: strPace,
                    provider: deviceInfo.provider,
                    battery: battery === undefined ? 0 : Number((battery).toFixed(1)),
                    address: deviceInfo.address
                  })

                  if (this.oldCenter !== null && oldTime !== null) {
                    this.status.distance += this.calcDistance(this.oldCenter, this.center)
                    this.status.time += this.getTimeDifference(oldTime, time)
                  }
                  counter += 1

                  this.oldCenter = this.center
                  oldTime = time
                  this.getTotalDistance()
                }
                if (this.deviceId) {
                  this.updateLocations(this.markers)
                  if (this.$refs.gMap && this.$refs.gMap.$mapObject) {
                    this.$refs.gMap.$mapObject.setCenter(this.center)
                    this.smoothZoom(this.$refs.gMap.$mapObject, 12, this.$refs.gMap.$mapObject.getZoom())
                  }
                }
              })
            }
          }
        })
        // this.showDirections()
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
    // for map directions
    showRoute (origin, destination, idx) {
      if (!origin || !destination) return

      this.directionsService.route({
        origin,
        destination,
        avoidTolls: true,
        avoidHighways: false,
        travelMode: window.google.maps.TravelMode.WALKING
        // travelMode: window.google.maps.TravelMode.DRIVING
        // travelMode: window.google.maps.TravelMode.BICYCLING
        // travelMode: window.google.maps.TravelMode.TRANSIT
      }, (response, status) => {
        if (status === 'OK') {
          const directionsDisplay = new window.google.maps.DirectionsRenderer({
            map: this.$refs.gMap.$mapObject,
            suppressMarkers: true
          })
          directionsDisplay.setDirections(response)
          var leg = response.routes[0].legs[0]
          this.makeMarker(leg.start_location, this.directionPinIcon, 'title', idx)
          this.makeMarker(leg.end_location, this.directionPinIcon, 'title', idx + 1)
        } else {
          console.log(status)
        }
      })
    },
    makeMarker (position, icon, title, idx) {
      let marker = new window.google.maps.Marker({
        position: position,
        map: this.$refs.gMap.$mapObject,
        icon: icon,
        title: title
      })
      marker.addListener('click', () => {
        let markerInfo = this.markers[idx]
        markerInfo.position = position
        this.toggleInfoWindow(markerInfo, idx)
      })
      return marker
    },
    toggleInfoWindow (marker, idx) {
      let time = this.$moment.utc(marker.time, 'MM/DD/YYYY hh:mm:ss a')
      let timeString = this.$moment(time).format('YYYY-MM-DD HH:mm:ss')

      this.infoWindowPos = marker.position
      this.marker = {
        activityName: marker.activityName,
        time: timeString,
        speed: marker.speed,
        battery: marker.battery,
        provider: marker.provider
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

      let time = this.$moment.utc(marker.time, 'MM/DD/YYYY hh:mm:ss a')
      let timeString = this.$moment(time).format('YYYY-MM-DD HH:mm:ss')

      this.infoWindowPos = marker.position
      this.marker = {
        activityName: marker.activityName,
        time: timeString,
        speed: marker.speed,
        battery: marker.battery,
        provider: marker.provider
      }

      this.isGrouping = false

      // check if its the same marker that was selected if yes toggle
      if (this.currentMidx === idx) {
        this.infoWinOpen = !this.infoWinOpen
      } else {
        // if different marker set infowindow to open and reset current marker index
        this.currentMidx = idx
        this.infoWinOpen = true
      }
    },
    showDirections () {
      var origin = this.markers[0].position.lat + ',' + this.markers[0].position.lng
      for (var i = 1; i < this.markers.length - 1; i++) {
        let destination = this.markers[i].position.lat + ',' + this.markers[i].position.lng
        this.showRoute(origin, destination, i - 1)
        origin = destination
      }
    }
  }
}
