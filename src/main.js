import Vue from 'vue'
import App from './App.vue'
import VueMaterial from 'vue-material'
import 'vue-material/dist/vue-material.min.css'
import 'vue-material/dist/theme/default.css'
import VueGeolocation from "vue-browser-geolocation";
import * as VueGoogleMaps from "vue2-google-maps";

Vue.use(VueMaterial);
Vue.use(VueGeolocation);
Vue.use(VueGoogleMaps, {
  load: {
    key: 'AIzaSyDAhdNA0xjQpCKlNlME5cUHc5_ewc16TyA'
  },
  installComponents: true
});

Vue.config.productionTip = false

new Vue({
  render: h => h(App),
}).$mount('#app')
