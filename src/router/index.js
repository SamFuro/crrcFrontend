import Vue from 'vue'
import VueRouter from 'vue-router'
import Test1 from '../test/test1.vue'
import Test2 from '@/test/test2.vue'
import Test3 from '@/test/test3.vue'
import Register from '@/Register/Register.vue'
import Login from '@/Login/Login.vue'
import home from '@/home/home.vue'
import adminPage from '@/adminPage/adminPage.vue'
import userPage from '@/userPage/userPage.vue'
Vue.use(VueRouter)

const routes = [
  // 默认跳转路径
  {
    path: '/',
    redirect: '/login'
  },

  {
    name: 'Test1',
    path: '/test',
    component: Test1,
  },

  {
    name: 'Test2',
    path: '/test2',
    component: Test2,
  },

  {
    name: 'Test3',
    path: '/test3',
    component: Test3,
  },

  // {
  //   name: 'Register',
  //   path: '/Register',
  //   component: Register,
  // },

  {
    name: 'Login',
    path: '/Login',
    component: Login,
  },

  {
    name: 'home',
    path: '/home',
    component: home,
  },

  {
    name: 'adminPage',
    path: '/adminPage',
    component: adminPage,
  },

  {
    name: 'userPage',
    path: '/userPage',
    component: userPage,
  },

]

const router = new VueRouter({
  // mode: 'history',
  routes
})
const changePush = VueRouter.prototype.push;
VueRouter.prototype.push = function push(location) {
  return changePush.call(this, location).catch((err) => err);
};

export default router
