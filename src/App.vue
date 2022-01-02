<template>
    <!-- Navigation -->
    <div id="nav">
      <router-link to="/">
      <img src="./assets/logo.svg" style="width: 48px"/> Face Authentication
      </router-link>
    </div>

    <!-- Main -->
    <section class="section">
      <div class="vertical-center">
        <div class="inner-block">
          <router-view />
        </div>
      </div>
    </section>
</template>

<style>

  #app {
    padding: 15px;
    font-family: Avenir, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
  }

  #nav {
    padding: 30px;
    font-size: 25px;
    font-weight: bold;
    color: #090909;
  }

  #nav a {
    color: #090909;
    text-decoration: none; 
  }

  @import './assets/main.css';

</style>
