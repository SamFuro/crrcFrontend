<template>
  <div class="registerBackground">
    <el-image style="margin-left: 5px; margin-top: 5px; width: 260px;"  :src= "require('../images/logo.png')"></el-image>
    <el-card class="box-card">
      <h2>注册</h2>
      <el-form
        :model="userInfo"
        status-icon
        :rules="rules"
        ref="userInfo"
        label-position="left"
        label-width="80px"
        class="demo-userInfo"
      >
        <el-form-item label="用户名" prop="username">
          <el-input v-model="userInfo.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input type="passConfirm" v-model="userInfo.password" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="确认密码" prop="passConfirm">
          <el-input type="passConfirm" v-model="userInfo.passConfirm" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="姓名" prop="name">
          <el-input v-model="userInfo.name"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="phone">
          <el-input v-model="userInfo.phone"></el-input>
        </el-form-item>
        <el-form-item label="公司" prop="companyId">
          <el-select v-model="userInfo.companyId" placeholder="请选择">
            <el-option
              v-for="item in companyOptions"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>

      <div class="btnGroup">
        <el-button type="danger" @click="submitForm">提交</el-button>
        <el-button @click="resetForm('userInfo')">重置</el-button>
        <el-button @click="goBack">返回</el-button>
      </div>
    </el-card>
  </div>
</template>

<script>
import axios from 'axios';
import CryptoJS from 'crypto-js';

export default {
  data() {
    var validatePass = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入密码"));
      } else {
        if (this.userInfo.checkPass !== "") {
          this.$refs.userInfo.validateField("checkPass");
        }
        callback();
      }
    };
    var validatePass2 = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请再次输入密码"));
      } else if (value !== this.userInfo.password) {
        callback(new Error("两次输入密码不一致!"));
      } else {
        callback();
      }
    };

    return {
      userInfo: {
        username: "",
        password: "",
        passConfirm: "",
        name: "",
        phone: "",
        companyId: "",
      },
      rules: {
        username: [{ required: true, message: "用户名不能为空！", trigger: "blur" }],
        password: [{ required: true, validator: validatePass, trigger: "blur" }],
        passConfirm: [{ required: true, validator: validatePass2, trigger: "blur" }],
        name: [{ required: true, message: "姓名不能为空！", trigger: "blur" }],
        phone: [{ required: true, message: "手机号码不能为空！", trigger: "blur" }],
        companyId: [{required: true, message: "请选择隶属公司！", trigger: "change" }],
      },

      companyOptions: [{
          value: '1',
          label: '公司1'
        }, {
          value: '2',
          label: '公司2'
        }, {
          value: '3',
          label: '公司3'
        }],

        companyId: '',
        //设置秘钥和秘钥偏移量
        SECRET_KEY: CryptoJS.enc.Utf8.parse("ul29s9b5l1x8sqo7"),
        SECRET_IV: CryptoJS.enc.Utf8.parse("d8g65df9vc6s23df"),
    };
  },
  mounted(){
    // 获取公司列表
    axios({
        method: 'get',
        url: 'api/company/list/notLogin?size=100',
      }).then((result) => {
          console.log(result.data)
          this.companyOptions = result.data.data.records
          console.log("公司列表：" ,this.companyOptions)
      }).catch(error => {
          this.handleError(error)
      })
  },

  methods: {
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
    // 注册功能确认提交
    submitForm() {
      // 如果两次密码不一致，则提示信息
      if(this.userInfo.password != this.userInfo.passConfirm){
        this.$message.error("两次密码不一致！");
      }
      else {
        axios({
            method: 'post',
            url: 'api/main/register/' + this.userInfo.companyId,
            data: {
              username: this.userInfo.username,
              password: this.encrypt(this.userInfo.password),
              name: this.userInfo.name,
              phone: this.userInfo.phone,
            }
          }).then((result) => {
              console.log(result.data)
              this.receiveData = result.data
              this.$message({
                message: '注册成功，请等待管理员审批！',
                type: 'success'
              });
              this.$router.push("/login")
          }).catch(error => {
              // 特殊情况处理
              if (this.userInfo.companyId == "" || this.userInfo.name == "" || this.userInfo.passConfirm == "" || this.userInfo.password == "" || this.userInfo.phone == "" || this.userInfo.username == "") {
                this.$message.error("有必填项为空，请检查！");
              }
              this.handleError(error)
          })
      }
    },
    // 错误处理
    handleError(error) {
        if (error.response) {
            // error.response包含了服务器响应的详细信息
            const statusCode = error.response.status;
            const errorMessage = error.response.data.error;
            // 根据不同的错误代码，显示不同的错误消息           
            this.$message.error(`${statusCode}: ${errorMessage}`);
            } else {
                // 其他错误（例如网络问题）
                this.$message.error(`${error}`);
            }
    },

    // 重置表单数据
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    // 返回登录界面
    goBack() {
      this.$router.push("/login");
    },
    
  },
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

.login-from {
  margin: auto auto;
}
</style>