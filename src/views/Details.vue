<template>
  <div class="vue-tempalte flex">
    <h3>User Details</h3>

    <clip-loader v-if="isLoading" />
    <div v-else>
      <p>Welcome {{ username }}</p>
      <p>
        You have successfully logged in and your secret is "<b>{{ secret }}</b
        >"
      </p>
    </div>
    <p class="sidelink text-right mt-2 mb-4">
      <router-link to="/">Home</router-link>
    </p>
  </div>
</template>

<script>
import ClipLoader from "../components/ClipLoader";
import { API, errorHandler } from "../helpers/utils";

const apiBase = process.env.VUE_APP_APIURL;
const api = new API(apiBase);

export default {
  components: {
    ClipLoader,
  },
  data() {
    return {
      isLoading: true,
      username: "",
      secret: "",
    };
  },
  mounted() {
    const token = localStorage.getItem("token");
    if (token) {
      api
        .getUser(token)
        .then((res) => {
          this.username = res.data.username;
          this.secret = res.data.secret;
          this.isLoading = false;
        })
        .catch((error) => {
          errorHandler(error);
          this.$router.push({ name: "Login" });
        });
    } else {
      this.$router.push({ name: "Login" });
    }
  },
};
</script>