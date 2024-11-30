const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  lintOnSave:false,
  devServer:{
    port:7000,
    proxy: {
      '/api': {
        target: 'http://localhost:8080',  // 设置后端接口的访问地址 http://192.168.1.105:8080/RestWebService http://192.168.1.112:8080
        changeOrigin: true,
        pathRewrite: {
          '^/api': ''  // 将请求路径中的 '/api' 替换为空字符串
        }
      }
    }
  }
})
