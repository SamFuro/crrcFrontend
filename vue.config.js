<<<<<<< HEAD
const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  lintOnSave:false,
  devServer:{
    port:7000,
    proxy: {
      '/api': {
        target: 'http://localhost:8080',  // 设置后端接口的访问地址
        changeOrigin: true,
        pathRewrite: {
          '^/api': ''  // 将请求路径中的 '/api' 替换为空字符串
        }
      }
    }
  }
})
=======
const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  lintOnSave:false,
  devServer:{
    port:7000,
    proxy: {
      '/api': {
        target: 'http://localhost:8080',  // 设置后端接口的访问地址
        changeOrigin: true,
        pathRewrite: {
          '^/api': ''  // 将请求路径中的 '/api' 替换为空字符串
        }
      }
    }
  }
})
>>>>>>> 105480e25c232a7fce82b71e618b69e31db3f2df
