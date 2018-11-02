import vue2Dropzone from 'vue2-dropzone'
import 'vue2-dropzone/dist/vue2Dropzone.min.css'

export default {
  title: 'UploadView',

  props: ['type', 'successUpload'],

  components: {
    vueDropzone: vue2Dropzone
  },

  data () {
    return {
      ok: true,
      dropzoneOptions: {
        // url: 'http://127.0.0.1:3000/api/uploadFile',
        url: '/api/uploadFile',
        acceptedFiles: 'image/*, application/docx, application/pdf',
        dictDefaultMessage: `
          <i class="fas fa-cloud-upload-alt fs-36 red-color"></i>
          <p class="fs-14">Drag here or <a href="onTriggerBrowse" class="red-color">browse</a> to upload</p>
          <p class="gray-color">CSV FILES</p>`,
        maxFiles: 1,
        thumbnailWidth: 150,
        maxFilesize: 5,
        headers: { 'My-Awesome-Header': 'header value' },
        addRemoveLinks: true,
        autoProcessQueue: true,
        accept (file, done) {
          console.log(file)
          done()
        }
      },

      fileAdded: false,
      filesAdded: false,
      success: false,
      error: false,
      removedFile: false,
      // sending: false,
      // successMultiple: false,
      // sendingMultiple: false,
      queueComplete: false,
      uploadProgress: false,
      progress: false,
      myProgress: 0,
      isMounted: false
    }
  },

  mounted () {
    if (this.$cookie.get('token')) {
      this.dropzoneOptions.headers['token'] = this.$cookie.get('token')
      console.log('added SPA token to an outgoing request')
    } else {
      console.log("no SPA token found, so it wasn't added to this request.")
    }

    this.eventHub.$on('closedUploadDialog', () => {
      this.initDropzone()
    })
  },

  beforeDestroy () {
    this.eventHub.$off('closedUploadDialog')
  },

  methods: {
    initDropzone () {
      this.$refs.myDropzone.dropzone.removeAllFiles(true)
    },
    vfileAdded (file) {
      this.fileAdded = true
      // window.toastr.info('', 'Event : vdropzone-file-added')

      // if (this.$refs.myDropzone.files.length === 1) {
      //   alert("You can Select upto 1 Pictures for Venue Profile.", "error");
      //   this.removeFile(file);
      // }
    },
    vfilesAdded (file) {
      this.filesAdded = true
      // window.toastr.info('', 'Event : vdropzone-files-added')
    },
    vsuccess (file, response) {
      this.success = true
      // window.toastr.success('', 'Event : vdropzone-success')
      console.log('----uploaded----')
    },
    verror (file) {
      this.error = true
      // window.toastr.error(file.upload.filename, 'Event : vdropzone-error - ' + file.status)
      console.log('----upload error----')
    },
    vremoved (file, xhr, error) {
      this.removedFile = true
      // window.toastr.warning('', 'Event : vdropzone-removedFile')
    },
    vsending (file, xhr, formData) {
      // this.sending = true
      // window.toastr.warning('', 'Event : vdropzone-sending')

      formData.append('transactionId', this.$route.params.id)
      formData.append('type', this.type)
    },
    vsuccessMuliple (files, response) {
      // this.successMultiple = true
      // window.toastr.success('', 'Event : vdropzone-success-multiple')
    },
    vsendingMuliple (file, xhr, formData) {
      // this.sendingMultiple = true
      // window.toastr.warning('', 'Event : vdropzone-sending-multiple')
    },
    vqueueComplete (file, xhr, formData) {
      this.queueComplete = true
      // window.toastr.success('', 'Event : vdropzone-queue-complete')
    },
    vprogress (totalProgress, totalBytes, totalBytesSent) {
      this.progress = true
      this.myProgress = Math.floor(totalProgress)
      // window.toastr.success('', 'Event : vdropzone-sending')
    },
    vmounted () {
      this.isMounted = true
    },
    vddrop () {
      this.dDrop = true
    },
    vdstart () {
      this.dStarted = true
    },
    vdend () {
      this.dEnded = true
    },
    vdenter () {
      this.dEntered = true
    },
    vdover () {
      this.dOver = true
    },
    vdleave () {
      this.dLeave = true
    }
  },
  watch: {
    fileAdded () {
      let that = this
      setTimeout(function () {
        that.fileAdded = false
      }, 2000)
      console.log('--file added--')
    },
    filesAdded () {
      let that = this
      setTimeout(function () {
        that.filesAdded = false
      }, 2000)
      console.log('--files added--')
    },
    success () {
      console.log('----success----')
      setTimeout(function () {

      }, 2000)
      this.successUpload()
    },
    error () {
      let that = this
      setTimeout(function () {
        that.error = false
      }, 2000)
    },
    removedFile () {
      let that = this
      setTimeout(function () {
        that.removedFile = false
      }, 2000)
    },
    sending () {
      // let that = this
      setTimeout(function () {
        // that.sending = false
      }, 2000)
      console.log('--sending--')
    },
    successMultiple () {
      // let that = this
      setTimeout(function () {
        // that.successMultiple = false
      }, 2000)
      console.log('--success multiple--')
    },
    sendingMultiple () {
      // let that = this
      setTimeout(function () {
        // that.sendingMultiple = false
      }, 2000)
      console.log('--send multiple--')
    },
    queueComplete () {
      let that = this
      setTimeout(function () {
        that.queueComplete = false
      }, 2000)
      console.log('--queue complete--')
    },
    progress () {
      let that = this
      setTimeout(function () {
        that.progress = false
      }, 2000)
    },
    isMounted () {
      let that = this
      setTimeout(function () {
        that.isMounted = false
      }, 2000)
    }
  }
}
