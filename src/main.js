import Vue from 'vue'
import App from './App.vue'
import VueMaterial from 'vue-material'
import 'vue-material/dist/vue-material.min.css'
import 'vue-material/dist/theme/default.css'
import {LMap, LTileLayer, LMarker, LPopup, LTooltip} from 'vue2-leaflet';
import 'leaflet/dist/leaflet.css';
import { latLng } from "leaflet";

Vue.use(VueMaterial);
Vue.component('l-map', LMap);
Vue.component('l-tile-layer', LTileLayer);
Vue.component('l-marker', LMarker);
Vue.component('l-popup', LPopup);
Vue.component('l-tooltip', LTooltip);
Vue.component(latLng);


Vue.config.productionTip = false

new Vue({
  render: h => h(App),
}).$mount('#app')
