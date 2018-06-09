<template>
  <div id="app">
    <transition name="fade" mode="out-in">
      <router-view/>
    </transition>
  </div>
</template>

<script>
export default {
  name: 'app'
}
</script>

<style>
  @import "asserts/fonts/iconfont.css";
  @import "asserts/fonts/vueboot-icons.css";
  #app {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    height: 100%;
    width: 100%;
  }
  html,body{
    height: 100%;
    margin: 0 !important;
  }
</style>
