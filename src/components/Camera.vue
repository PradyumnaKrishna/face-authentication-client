<template>
  <div class="v-camera">
    <video ref="camera" v-bind:style="cameraStyle" autoplay />
  </div>
</template>

<script>
export default {
  name: "Camera",

  props: {
    height: {
      type: String,
      default: "auto",
    },
    width: {
      type: String,
      default: "100%",
    },
  },
  computed: {
    cameraStyle() {
      return {
        height: this.height,
        width: this.width,
      };
    },
  },
  data() {
    return {
      imageCapture: null,
    }
  },
  beforeUnmount() {
    let tracks = this.$refs.camera.srcObject.getTracks();

    tracks.forEach((track) => {
      track.stop();
    });
  },
  async created() {
    const constraints = {
      audio: false,
      video: true,
    };

    let stream = null;

    try {
      stream = await navigator.mediaDevices.getUserMedia(constraints);
      this.$refs.camera.srcObject = stream;
      
      const track = stream.getVideoTracks()[0];
      this.imageCapture = new ImageCapture(track);

      await this.sleep(3000);
      await this.capture();
    } catch (error) {
      console.log(error);
      alert("May the browser didn't support or there is some errors.");
    }
  },
  methods: {
    async capture() {
      this.imageCapture.grabFrame()
      .then(img => {
        return new Promise(res => {
          const canvas = document.createElement('canvas');
          canvas.width = img.width;
          canvas.height = img.height;

          let ctx = canvas.getContext('bitmaprenderer');
          if (ctx) {
            ctx.transferFromImageBitmap(img);
          }
          else {
            canvas.getContext('2d').drawImage(img,0,0);
          }

          canvas.toBlob(res);
        });
      })
      .then(blob => this.$emit("image", blob))
      .catch(error => console.log(error));
    },
    sleep(ms) {
      return new Promise((resolve) => {
        setTimeout(resolve, ms);
      });
    },
  },
};
</script>

<style>
.v-camera {
  text-align: center;
  display: inline-block;
}
</style>
