<template>
  <div class="vue-tempalte">
    <h3>Authenticate</h3>

    <clip-loader v-if="isLoading"/>

    <div v-show="!isLoading">
      <div v-if="!submitted" class="form-group">
        <form class="form" @submit.prevent="setup">
          <label>Username</label>
          <input v-model="username" class="form-control form-control-lg" required type="text">

          <button class="btn btn-dark btn-lg btn-block mt-2" type="submit">Log In</button>
        </form>
      </div>

      <div v-show="submitted" class="text-center">
        <camera v-if="camera" ref="camera" @image="authenticate"/>
        <clip-loader v-if="authenticating" :size="'30px'"/>
        <button v-else class="btn btn-dark btn-block" type="reset" @click="retry">Retry</button>
      </div>

      <p class="sidelink text-right mt-2 mb-4">
        <router-link to="/register">Create User?</router-link>
      </p>
    </div>
  </div>
</template>

<script>
import Camera from "../components/Camera";
import ClipLoader from "../components/ClipLoader";
import {API, errorHandler} from "../helpers/utils";

const apiBase = process.env.VUE_APP_APIURL;
const api = new API(apiBase);

export default {
  components: {
    Camera,
    ClipLoader,
  },
  data() {
    return {
      authenticating: false,
      camera: false,
      isLoading: false,
      submitted: false,
      username: '',
    }
  },
  methods: {
    authenticate(photo) {
      const formData = new FormData();

      formData.append("image", photo)
      formData.append("username", this.username);

      api.authenticateUser(formData)
          .then(res => {
            if (this.$route.query.redirect_uri) {
              window.location.href = `${this.$route.query.redirect_uri}?code=${res.data.access_token}&state=${this.$route.query.state}`;
            } else {
              localStorage.setItem("token", res.data.access_token);
              this.$router.push({name: 'Details'})
            }
          })
          .catch(error => {
            var msg = errorHandler(error);
            this.authenticating = false;
            alert(msg);
          });
    },
    retry() {
      this.authenticating = true;
      this.$refs.camera.capture();
    },
    async setup() {
      this.isLoading = true;
      this.submitted = true;

      api.verifyUser(this.username)
          .then(res => {
            if (res.data) {
              this.authenticating = true;
              this.camera = true;
              this.isLoading = false;
            } else {
              this.isLoading = false;
              this.submitted = false;

              alert("invalid username");
            }
          })
          .catch(error => {
            const msg = errorHandler(error);
            this.isLoading = false;
            this.submitted = false;
            alert(msg);
          });
    },
  },
}

</script>