<template>
  <div id="app">
       <!-- {{ mess }} -->
    <router-view v-if="isRouterAlive"></router-view>
  </div>
</template>

<script>
export default {
  components: {  },
  provide() {
    return {
      reloadAll: this.reloadAll
    }
  },
  data () {
    return {
      mess: "ZBJ_",
      isRouterAlive: true
    }
  },
  methods: {
    reloadAll() {
      this.isRouterAlive = false
      this.$nextTick(() => {
        this.isRouterAlive = true
      })
    }
  }

}
const debounce = (fn, delay) => {
  let timer
   return (...args) => {
     if (timer) {
       clearTimeout(timer)
     }
     timer = setTimeout(() => {
       fn(...args)
     }, delay)
   }
}
  
const _ResizeObserver = window.ResizeObserver;
window.ResizeObserver = class ResizeObserver extends _ResizeObserver{
   constructor(callback) {
     callback = debounce(callback, 200);
     super(callback);
   }
}
</script>
<style>

</style>
