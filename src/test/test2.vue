<template>
    <div>
      <el-card class="box-card">
        <h2>登录</h2>
        <el-form
          :model="ruleForm"
          status-icon
          :rules="rules"
          ref="ruleForm"
          label-position="left"
          label-width="70px"
          class="login-form"
        >
          <el-form-item label="用户名" prop="uname">
            <el-input v-model="ruleForm.uname"></el-input>
          </el-form-item>
          <el-form-item label="密码" prop="password">
            <el-input
              type="password"
              v-model="ruleForm.password"
              autocomplete="off"
            ></el-input>
          </el-form-item>
        </el-form>
        <div class="btnGroup">
          <el-button type="primary" @click="submitForm()">注册测试</el-button>
          <el-button @click="resetForm('ruleForm')">重置</el-button>
          <router-link to="/register">
            <el-button style="margin-left:10px">注册</el-button>
          </router-link>
          <el-button type="primary" @click="getUserData" style="margin-top: 20px;">获取用户信息</el-button>
          <el-button type="primary" @click="getUserData" style="margin-top: 20px;">跳转测试</el-button>
        </div>
      </el-card>
    </div>
  </template>
  
  <script>
  import axios from 'axios';
  export default {
    data() {
      return {
        userInfo: {
          "username": "user",
          "password": "123",
          "name": "张三",
          "phone": "15015015150",
          "companyId": 1,
        },
        receiveData: {},
        UserDataTest: {},
        ruleForm: {
          uname: "",
          password: "",
        },
        rules: {
          uname: [
            { required: true, message: "用户名不能为空！", trigger: "blur" },
          ],
          password: [
            { required: true, message: "密码不能为空！", trigger: "blur" },
          ],
        },
      };
    },
    methods: {
      handleError(error) {
          if (error.response) {
              // error.response包含了服务器响应的详细信息
              const statusCode = error.response.status;
              const errorMessage = error.response.data.msg;
              // 根据不同的错误代码，显示不同的错误消息
              switch (statusCode) {
                  case 400:
                      alert(`400: ${errorMessage}`);
                      break;
                  case 404:
                      alert(`404: ${errorMessage}`);
                      break;
                  case 500:
                      alert(`服务器错误，请稍后重试。`);
                      break;
                  default:
                      alert(`未知错误: ${errorMessage}`);
              }
          } else {
              // 其他错误（例如网络问题）
              alert('网络错误，请检查你的连接。');
          }
      },

      submitForm() {
        axios({
              method: 'post',
              url: 'api/main/register/' + this.userInfo.companyId,
              data: {
                username: this.userInfo.username,
                password: this.userInfo.password,
                name: this.userInfo.name,
                phone: this.userInfo.phone,
              }
          }).then((result) => {
              console.log(result.data)
              this.receiveData = result.data
          }).catch(error => {
              this.handleError(error)
          })
      },

      getUserData(){
        axios({
              method: 'get',
              url: 'api/main/userInfo',
              // params: {
              //   username: this.userInfo.username,
              //   password: this.userInfo.password,
              //   name: this.userInfo.name,
              //   phone: this.userInfo.phone,
              // }
          }).then((result) => {
              console.log(result.data)
              this.UserDataTest = result.data
          }).catch(error => {
              this.handleError(error)
          })
      },
        

      resetForm(formName) {
        this.$refs[formName].resetFields();
      },
    },
  };
  </script>
  
  <style scoped>
  .box-card {
    margin-top: 150px;
    margin-left: 550px;
    width: 400px;
  }
  .login-form {
    margin: auto auto;
  }
  </style>