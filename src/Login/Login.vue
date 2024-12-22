<template>
  <div class="registerBackground">
    <el-image style="margin-left: 5px; margin-top: 5px; width: 260px;"  :src= "require('../images/logo.png')"></el-image>
    <el-card class="box-card">
      <h2>登录</h2>
      <el-form
        :model="userInfo"
        status-icon
        :rules="rules"
        ref="userInfo"
        label-position="left"
        label-width="70px"
        class="login-form"
      >
        <el-form-item label="用户名" prop="username">
          <el-input v-model="userInfo.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input
            type="password"
            v-model="userInfo.password"
            autocomplete="off"
          ></el-input>
        </el-form-item>

        <!-- 验证码 -->
        <el-form-item label="验证码" prop="inputCode" style="display: block;">
          <el-input
            ref="inputCode"
            v-model="userInfo.inputCode"
            style="width: 130px; display: inline-block; margin-top: 5px; vertical-align: middle;"
            placeholder="请输入验证码"
          ></el-input>
          <span @click="createCode" id="spancode" style="display: inline-block; margin-left: 10px; margin-top: 5px; vertical-align: middle;">
                  <verificationCode :identifyCode="code"></verificationCode>
                </span>
        </el-form-item>
      </el-form>

      <div class="btnGroup">
        <el-button type="danger" @click="submitForm">登录</el-button>
        <el-button @click="resetForm('userInfo')">重置</el-button>
        <router-link to="/Register">
          <el-button style="margin-left:10px">注册</el-button>
        </router-link>
      </div>
    </el-card>
  </div>
</template>

<script>
import axios from 'axios';
import CryptoJS from 'crypto-js';
import verificationCode from './verificationCode.vue';

export default {
  components: {
    verificationCode
  },

  data() {
    return {
      token: "",
      code: "", // 真实验证码
    
      // 用户数据
      userInfo: {
        username: "", // 用户名
        password: "", // 密码
        inputCode: "", // 用户输入的验证码
      },
      // 表单验证数据
      rules: {
        username: [{ required: true, message: "用户名不能为空！", trigger: "blur" },],
        password: [{ required: true, message: "密码不能为空！", trigger: "blur" },],
        inputCode: [{ required: true, message: "验证码不能为空！", trigger: "blur" },],
      },
      //设置秘钥和秘钥偏移量
      SECRET_KEY: CryptoJS.enc.Utf8.parse("ul29s9b5l1x8sqo7"),
      SECRET_IV: CryptoJS.enc.Utf8.parse("d8g65df9vc6s23df"),
    };
  },
  methods: {
    // 创建验证码
    createCode() {
      let text = "";
      let possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
      // 设置验证码长度，
      for( let i=0; i < 4; i++ ){
        text += possible.charAt(Math.floor(Math.random() * possible.length));
      }
      this.code = text
    },
    // 点击登录按钮触发
    submitForm() {
      if (this.userInfo.inputCode == '') {
        this.$message.error("请输入验证码！");
      }
      else if(this.userInfo.inputCode.toLowerCase() != this.code.toLowerCase()){
        this.$message.error("验证码错误！");
        this.userInfo.inputCode = ''
        this.createCode()
      }
      else {
        let isAdmin = false;
        axios({
            method: 'post',
            url: 'api/main/login',
            data: {
              username: this.userInfo.username,
              password: this.encrypt(this.userInfo.password),
            }
          }).then((result) => {
              console.log(result.data)
              if(result.data.code == 0){
                this.$message({
                message: '登录成功！',
                type: 'success'
                });
                this.token = result.data.data.token
                isAdmin = result.data.data.isAdmin
                // 根据是否是管理员，将token设置为不同的名称存入sessionStorage中
                // 如果是管理员则跳转到管理系统，如果是用户则跳转到用户界面
                if (isAdmin) {
                  sessionStorage.setItem('adminToken', this.token);
                  this.$router.push("/adminpage")
                } else {
                  sessionStorage.setItem('userToken', this.token);
                  this.$router.push("/userpage")
                };
              }
              if (this.userInfo.username == '') {
                this.$message.error('用户名为空！');
              }
              else if (this.userInfo.password == '') {
                this.$message.error('密码为空！');
              }
              else if(result.data.code == 1){
                this.$message.error('密码错误，请检查用户名和密码！');
              }
          }).catch(error => {
              this.handleError(error)
          })
        }
    },

    // 错误处理
    handleError(error) {
        if (error.response) {
            // error.response包含了服务器响应的详细信息
            const statusCode = error.response.status;
            const errorMessage = error.response.data.msg;
            // 根据不同的错误代码，显示不同的错误消息           
            this.$message.error(`${statusCode}: ${errorMessage}`);
            } else {
                // 其他错误（例如网络问题）
                this.$message.error(`${error}`);
            }
    },

    // 密码传输过程 数据加密
    encrypt(word) {
      let srcs = CryptoJS.enc.Utf8.parse(word);
      let encrypted = CryptoJS.AES.encrypt(srcs, this.SECRET_KEY, {
          iv: this.SECRET_IV ,
          mode: CryptoJS.mode.CBC,
          padding: CryptoJS.pad.ZeroPadding
      })
      return CryptoJS.enc.Base64.stringify(encrypted.ciphertext);
    },

    // 重置内容
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
  
  },
  mounted () {
    this.createCode();
  }
};
</script>

<style scoped>

/* 背景图样式 */
.registerBackground {
  position: relative; /* 设置为相对定位，使其成为 .box-card 的定位上下文 */
  width: 100%; /* 使容器宽度为100% */
  height: 100vh; /* 设置容器高度为视口高度 */
  background-image: url('../images/background.jpg'); /* 替换为您的图片路径 */
  background-size: cover; /* 覆盖整个容器 */
  background-position: center; /* 将图片置于容器中心 */
  background-repeat: no-repeat; /* 防止图片重复 */
}

.box-card {
  position: absolute; /* 设置为绝对定位 */
  top: 50%; /* 水平居中 */
  left: 50%; /* 垂直居中 */
  transform: translate(-50%, -50%); /* 通过转换修正位置以确保居中 */
  margin: 0; /* 重置默认边距 */
  width: 400px;
}
.login-form {
  margin: auto auto;
}
.captcha-image {
  vertical-align: middle;
  margin-left: 10px;
  cursor: pointer;
}
</style>