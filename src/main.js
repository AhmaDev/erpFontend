import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import vuetify from './plugins/vuetify'
import axios from 'axios'
import VuePageTransition from 'vue-page-transition'
import Loading from 'vue-loading-overlay';
import 'vue-loading-overlay/dist/vue-loading.css';
import 'line-awesome/dist/line-awesome/css/line-awesome.css'
import VueToast from 'vue-toast-notification';
import 'vue-toast-notification/dist/theme-sugar.css';
import Print from 'vue-printjs'
import FloatingVue from 'floating-vue'

var token = localStorage.getItem('token');

Vue.config.productionTip = false
Vue.prototype.$baseUrl = 'http://10.0.3.55:5088/api/'; // PORTAL BASE_URL
Vue.prototype.$appVersion = '5.0.0';
const axiosConfig = {
  headers: { Authorization: `Bearer ${token}` },
  baseURL: Vue.prototype.$baseUrl,
  timeout: 30000,
  
};
Vue.http = Vue.prototype.$http = axios.create(axiosConfig);
Vue.prototype.$background = "#2C86FC"
Vue.use(VuePageTransition);
Vue.use(Print);
Vue.use(Loading , {
  color: "#FFFFFF",
  backgroundColor: "#00000074",
  blur: "5px",
  opacity: 1,

});
Vue.use(VueToast, {
  position: 'bottom-left',
});
Vue.use(FloatingVue)
new Vue({
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount('#app')
