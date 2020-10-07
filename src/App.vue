<template>
  <div id="app">
    <ListeDesRestaurants msg="oui oui"/>
  </div>
</template>

<script>
import ListeDesRestaurants from "./components/ListeDesRestaurants.vue";

export default {
  name: 'App',
  components: {
    ListeDesRestaurants
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>