<template>
  <div class="v-camera">
    <video ref="camera" v-bind:style="cameraStyle" autoplay />
    <canvas ref="capture" v-show="false" v-bind:style="cameraStyle" />
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
  beforeUnmount() {
    let tracks = this.$refs.camera.srcObject.getTracks();

    tracks.forEach((track) => {
      track.stop();
    });
  },
  async created() {
    const constraints = (window.constraints = {
      video: true,
      audio: false,
    });

    try {
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      this.$refs.camera.srcObject = stream;
      await this.sleep(3000);
      await this.capture();
    } catch (error) {
      console.log(error);
      alert("May the browser didn't support or there is some errors.");
    }
  },
  methods: {
    async capture() {
      const capture = this.$refs.capture;
      const context = capture.getContext("2d");
      context.drawImage(this.$refs.camera, 0, 0, capture.width, capture.height);
      const src = capture.toDataURL("image/jpeg");

      this.$emit("canvas-src", src);
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
