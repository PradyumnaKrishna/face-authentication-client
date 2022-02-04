<template>
  <div class="vue-tempalte">
    <h3>Registration</h3>

    <clip-loader v-if="isLoading"/>

    <div v-show="!isLoading">
      <div v-if="!submitted" class="form-group">
        <form class="form" @submit.prevent="setup">
          <label>Username</label>
          <input v-model="username" class="form-control form-control-lg" required type="text">

          <label>Secret</label>
          <input v-model="secret" class="form-control form-control-lg" placeholder="Any secret you want to bury?"
                 required type="text">

          <button class="btn btn-dark btn-lg btn-block mt-2" type="submit">Continue</button>
        </form>
      </div>

      <div v-show="submitted" class="text-center">
        <camera v-if="camera" ref="camera" @image="create"/>
        <clip-loader v-if="creating" :size="'30px'"/>
        <button v-else class="btn btn-dark btn-block" type="reset" @click="retry">Retry</button>
      </div>

      <p class="sidelink text-right mt-2 mb-4">
        <router-link to="/">Login?</router-link>
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
      camera: false,
      creating: false,
      isLoading: false,
      submitted: false,
      secret: '',
      username: '',
    }
  },
  methods: {
    create(photo) {
      const formData = new FormData();

      formData.append("image", photo)
      formData.append("secret", this.secret)
      formData.append("username", this.username);

      api.createUser(formData)
          .then(res => {
            //handle success
            console.log(res.data);
            this.$router.push({name: 'Registered'})
          })
          .catch(error => {
            //handle error
            const msg = errorHandler(error);
            this.submitted = false;
            alert(msg);
          });
    },
    retry() {
      this.creating = true;
      this.$refs.camera.capture();
    },
    async setup() {
      this.isLoading = true;
      this.submitted = true;

      api.verifyUser(this.username)
          .then(res => {
            if (res.data) {
              this.isLoading = false;
              this.submitted = false;

              alert("username already exist");
            } else {
              this.camera = true;
              this.creating = true;
              this.isLoading = false;
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