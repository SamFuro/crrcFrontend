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
          <el-button type="primary" @click="dialogFormVisible = true" style="margin-top: 20px;">打开上传文件的Dialog</el-button>
          <el-button type="danger" @click="getImageFileForBuild">获取用于build镜像的资源测试</el-button>
        </div>
      </el-card>

      <el-dialog title="上传镜像" :visible.sync="dialogFormVisible">
      <el-form :model="imageform">
        <el-form-item label="tar包名称：">
          <el-input v-model="imageform.name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item>
          
          <!-- 上传文件测试 -->
          <!-- <el-upload
            action="http://localhost:8080/image/upload"
            :headers="uploadHeaders"
            :on-success="handleSuccess"
            :limit="1"
            :file-list="fileList">
            <el-button type="primary">点击上传</el-button>
          </el-upload> -->

          <el-button icon="el-icon-document-copy" type="primary" @click="checkFile">上传镜像测试</el-button>
                    <input id="fileInput" type="file" style="display: none;" @change="update($event)" />


        </el-form-item>
      </el-form>


      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogFormVisible = false">确 定</el-button>
      </div>
    </el-dialog>

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

        // 镜像
        imageform:{
          name: ""
        },

        // 文件上传headers
        uploadHeaders: {
                        'Content-Type': 'multipart/form-data'
                    },
        

        fileList: [], // 用于存储已上传的文件列表

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

        dialogFormVisible: false,
      };
    },
    methods: {
      // 获取用于build镜像的资源测试
      getImageFileForBuild() {
        axios({
              method: 'get',
              url: 'api/image/getResourcesForBuild?namespace=1&image=myimage2:v1.0',
              headers: {
                      "Authorization": `${sessionStorage.getItem('userToken')}`,
                  },
          }).then((result) => {
              console.log(result.data)
          }).catch(error => {
              this.handleError(error)
          })
      },



      checkFile() {
            document.querySelector('#fileInput').click()
      },
      

      // 调用接口 上传文件
      update(e) {
          let file = e.target.files[0]
          let formData = new FormData()
          formData.append('file', file)
          
          axios({
                  method: 'post',
                  url: 'api/image/upload',
                  headers: {
                      "Authorization": `${sessionStorage.getItem('adminToken')}`,
                      'content-Type' : "multipart/form-data",
                  },
                  data: formData
              }).then((result) => {
                  console.log(result)
                  if (result.code) {
                      this.$message({
                          message: '上传失败！',
                          type: 'error'
                      });
                      this.uploadHeaders
                  }
                  else {
                      this.$message({
                          message: '上传成功！',
                          type: 'success'
                      });
                  }
              }).catch(error => {
                  this.handleError(error)
              });
      },


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

      // 上传文件测试
      uploadTar(){

      },
        

      resetForm(formName) {
        this.$refs[formName].resetFields();
      },
    },
  };
  </script>
  
  <style scoped>
  .box-card {
    margin-top: 80px;
    margin-left: 440px;
    width: 400px;
  }
  .login-form {
    margin: auto auto;
  }
  </style>