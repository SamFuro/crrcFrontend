import Vue from 'vue'
import App from './App.vue'
import router from './router'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import inputDirective from 'vue-el-input-directive';
import axios from 'axios';

Vue.config.productionTip = false
Vue.use(ElementUI)
Vue.use( inputDirective ); //input输入框check

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
