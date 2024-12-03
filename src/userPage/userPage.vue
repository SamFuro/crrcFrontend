<template>
    <div>
        <el-container style="height: 700px; border: 1px solid #eee">
        <el-header style="font-size: 37px; background-color: rgb(199, 0, 25); color: white;">用户界面</el-header>
        <el-container>
            <el-aside width="200px" style="background-color: rgb(238, 241, 246)">
                <el-menu :default-openeds="['1']">
                    <el-submenu index="1">
                        <template slot="title"><i class="el-icon-message"></i>信息管理</template>
                        <el-menu-item index="1-1" @click="changeMainTo1">个人信息</el-menu-item>
                        <el-menu-item index="1-2" @click="changeMainTo2">个人日志</el-menu-item>
                        <el-menu-item index="1-3" @click="changeMainTo3">镜像信息</el-menu-item>
                        <el-menu-item index="1-4" @click="changeMainTo4">容器实例信息</el-menu-item>
                        <el-menu-item index="1-5" @click="changeMainTo5">软件运行态log信息</el-menu-item>
                    </el-submenu>
                </el-menu>
            </el-aside>
            <!-- 个人信息页面 -->
            <el-main v-if="mainValue == 1">
            <el-descriptions title="个人信息" border column="1" style="width: 500px; margin-left: 350px; margin-top: 50px;">
                <el-descriptions-item label="头像">
                    <el-avatar :src="avatarPath"></el-avatar>
                </el-descriptions-item>
                <el-descriptions-item label="用户名">{{ userData.username }}</el-descriptions-item>
                <el-descriptions-item label="姓名">{{ userData.name }}</el-descriptions-item>
                <el-descriptions-item label="手机号">{{  userData.phone }}</el-descriptions-item>
                <el-descriptions-item label="公司">{{ userData.companyName }}</el-descriptions-item>
            </el-descriptions>
            <el-button type="primary" style="margin-left: 750px; margin-top: 20px;">修改</el-button>


            </el-main>
            
            <!-- 日志信息查看页面 -->
                <el-main v-if="mainValue == 2">
                    <!-- 内容表格 -->
                    <el-table :data="userLogData" border>
                        <el-table-column prop="talent" label="租户"></el-table-column>
                        <el-table-column prop="username" label="用户名"></el-table-column>
                        <el-table-column prop="date" label="日期"></el-table-column>
                        <el-table-column prop="status" label="状态"></el-table-column>
                        <el-table-column prop="time" label="时间"></el-table-column>
                        <el-table-column prop="url" label="URL"></el-table-column>
                        <el-table-column prop="fileName" label="文件名"></el-table-column>
                    </el-table>
                    <br>

                    <!-- 分页条 -->
                    <el-pagination
                        background
                        layout="prev, pager, next, jumper"
                        :total="1000">
                    </el-pagination>
                </el-main>
                
            <!-- 镜像信息页面 -->
                <el-main v-if="mainValue == 3">
                    <!-- 查询功能 -->
                    <el-form :inline="true" :model="imageSearchForm" align="center">
                        <el-form-item label="镜像名称" style="margin-left: 30px;">
                            <el-input v-model="imageSearchForm.searchImageName" placeholder="请输入内容"></el-input>
                        </el-form-item>
                        <el-form-item>
                            <el-button type="primary" @click="searchImage">查询</el-button>
                            <el-button type="danger" @click="cancelSearchImage">取消</el-button>
                        </el-form-item>
                        <!-- 创建镜像和删除镜像 -->
                        <el-form-item style="margin-left: 20px;">
                            <el-button type="primary" @click="createImage">上传</el-button>
                            <el-button type="danger" @click="deleteImage">删除</el-button>
                        </el-form-item>
                    </el-form>
                     <!-- 内容表格 -->
                    <el-table :data="imageData" border @selection-change="imageSelectionChange" key="imageDataTable" ref="imageData">
                        <el-table-column prop="name" label="镜像名称" align="center"></el-table-column>
                        <el-table-column prop="companyName" label="租户名称" align="center"></el-table-column>
                        <el-table-column prop="username" label="用户名称" align="center"></el-table-column>
                        <el-table-column prop="tags" label="标签" align="center"></el-table-column>
                        <el-table-column prop="pullCount" label="pullCount" align="center"></el-table-column>
                        <el-table-column prop="creationTime" label="创建时间" align="center">
                            <template #default="scope">
                                {{ formatTime(scope.row.creationTime) }}
                            </template>
                        </el-table-column>
                        <el-table-column prop="updateTime" label="更新时间" align="center">
                            <template #default="scope">
                                {{ formatTime(scope.row.updateTime) }}
                            </template>
                        </el-table-column>
                        <el-table-column prop="projectName" label="项目名称" align="center"></el-table-column>
                        <!-- 操作按钮 创建容器实例 -->
                        <el-table-column label="操作">
                            <template slot-scope="scope">
                                <el-button size="mini" type="danger" @click="createContainer">创建容器实例</el-button>
                                <el-button size="mini" type="danger" @click="pushImage(scope.$index, scope.row)" style="margin-top: 5px;">推送镜像</el-button>
                            </template>
                        </el-table-column>
                        <el-table-column type="selection" align="center" width="55"></el-table-column>
                    </el-table>
                    <br>

                    <!-- 分页条 -->
                    <el-pagination
                        background
                        layout="prev, pager, next, jumper"
                        :total="this.totalImageData"
                        @current-change="handleCurrentChange"
                        :current-page="currentPage"
                        :page-size="pageSize">
                    </el-pagination>
                </el-main>


            <!-- 容器实例信息页面 -->
                <el-main v-if="mainValue == 4">
                    <!-- 查询功能 -->
                    <el-form :inline="true" :model="containerSearchForm" align="center">
                        <el-form-item label="实例名称" style="margin-left: 30px;">
                            <el-input v-model="containerSearchForm.searchContainerName" placeholder="请输入内容"></el-input>
                        </el-form-item>
                        <el-form-item label="创建此实例的镜像名称" style="margin-left: 30px;">
                            <el-input v-model="containerSearchForm.searchCreatImageName" placeholder="请输入内容"></el-input>
                        </el-form-item>
                        <el-form-item>
                            <el-button type="primary" @click="searchContainer">查询</el-button>
                        </el-form-item>
                        <!-- 删除按钮 -->
                        <el-form-item style="margin-left: 50px">
                            <el-button type="danger">删除</el-button>
                        </el-form-item>
                    </el-form>
                    <!-- 内容表格 -->
                    <el-table :data="containerInstanceData" border @selection-change="containerSelectionChange" key="containerInstanceData" ref="containerInstanceData">
                        <el-table-column prop="containerName" label="实例名称"></el-table-column>
                        <el-table-column prop="startTime" label="启动时间"></el-table-column>
                        <el-table-column prop="runningTime" label="运行时间"></el-table-column>
                        <el-table-column prop="imageName" label="镜像名称"></el-table-column>
                        <el-table-column prop="createUser" label="创建用户"></el-table-column>
                        <el-table-column prop="tanent" label="租户"></el-table-column>
                        <el-table-column prop="logUrl" label="日志url"></el-table-column>
                        <el-table-column prop="softwareRunningUrl" label="软件运行url"></el-table-column>
                        <el-table-column type="selection" align="center" width="55"></el-table-column>
                    </el-table>
                    <br>

                    <!-- 分页条 -->
                    <el-pagination
                        background
                        layout="prev, pager, next, jumper"
                        :total="1000">
                    </el-pagination>
                </el-main>

            <!-- 软件运行态log主页面 -->
            <el-main v-if="mainValue == 5">
                <!-- 查询功能 -->
                <el-form :inline="true" :model="softwareLogSearchForm" align="center" ref="softwareLogSearchForm" :rules="rules">
                    <el-form-item label="公司名称" prop="searchCompanyName" style="margin-left: 30px;">
                        <el-input v-model="softwareLogSearchForm.searchCompanyName" placeholder="请输入内容"></el-input>
                    </el-form-item>
                    <el-form-item label="用户名" prop="searchUsername" style="margin-left: 30px;">
                        <el-input v-model="softwareLogSearchForm.searchUsername" placeholder="请输入内容"></el-input>
                    </el-form-item>
                    <el-form-item label="容器名称" prop="searchContainerName" style="margin-left: 30px;">
                        <el-input v-model="softwareLogSearchForm.searchContainerName" placeholder="请输入内容"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="searchSoftwareLog">查询</el-button>
                        <el-button type="danger" @click="cancelSearchSoftwareLog">取消</el-button>
                    </el-form-item>
                </el-form>
                <!-- 内容表格 -->
                <el-table :data="softwareLogData" border>
                    <el-table-column prop="companyName" label="公司名称" align="center"></el-table-column>
                    <el-table-column prop="username" label="用户名" align="center"></el-table-column>
                    <el-table-column prop="containerName" label="容器名称" align="center"></el-table-column>
                    <el-table-column prop="date" label="日期" align="center"></el-table-column>
                    <el-table-column prop="fileName" label="文件名" align="center"></el-table-column>
                    <el-table-column prop="url" label="url" align="center">
                        <template slot-scope="scope">
                            <el-link href="scope.row.url" target="_blank">查看log</el-link>
                        </template>
                    </el-table-column>
                </el-table>
                <br>

                <!-- 分页条 -->
                <el-pagination
                    background
                    layout="prev, pager, next, jumper"
                    :total="this.totalLogData"
                    @current-change="handleCurrentChange"
                    :current-page="currentPage"
                    :page-size="pageSize">
                </el-pagination>
            </el-main>
            
        </el-container>
        </el-container>
    </div>
</template>



<script>
import axios from "axios";

export default{
    data () {
        return {
            softwareLogData: [], // 软件运行态log数据
            imageData: [], // 镜像管理数据: [], // 镜像管理数据
            containerInstanceData: [], // 容器实例数据
            userLogData: [], // 用户日志数据
            selectedImageList: [], // 选中的镜像列表
            selectedContainerList: [], // 选中的容器实例列表
            totalLogData: 0, // 软件运行态log数据总条数
            pageSize: 7, // 每页显示的数据条数
            mainValue: 0, // 控制主页面切换
            currentPage: 1, // 当前页面
            avatarPath: require("@/test/testAvatar.jpeg"),

            // 用户数据
            userData: {  
                "username": "user1",
                "name": "张三",
                "phone": "1504566654",
                "companyName": "公司1",
            },
            


            // 镜像信息搜索功能中的值
            imageSearchForm: {  
                searchImageName: "",  // 镜像名称
            },

            // 容器实例信息搜索功能中的值
            containerSearchForm: {  
                searchContainerName: "",  // 容器实例名称
                searchCreatImageName: "",  // 创建该实例的镜像名称
            },

            // 软件运行态log管理搜索功能中的值
            softwareLogSearchForm: {
                searchCompanyName: "",
                searchUsername: "",
                searchContainerName: "",
            },

            rules: {
                searchCompanyName: [{ required: false, trigger:"blur"},],
                searchUsername: [{ required: false, trigger:"blur"},],
                searchContainerName: [{ required: false, trigger:"blur"},],
            },


        }
    },
    methods:{
        // 个人信息界面
        changeMainTo1:function(){
            this.mainValue = 1;
        },
        // 个人日志界面
        changeMainTo2:function(){
            this.mainValue = 2;
        },
        // 镜像信息页面
        changeMainTo3:function(){
            this.mainValue = 3;
            this.currentPage = 1;
            // 获得所有镜像信息
            axios({
                method: 'post',
                url: 'api/image/list?' + "page=" + this.currentPage + "&size=" + this.pageSize,
                headers: {
                    'content-Type' : "application/json",
                    "Authorization": `${sessionStorage.getItem('userToken')}`
                },
                data: {
                    "name": "",
                    "companyId": "",
                    "status": "",
                }
            }).then((result) => {
                console.log(result)
                this.imageData = result.data.data.records
                this.totalImageData = result.data.data.total // 获取总条数
            }).catch(error => {
                this.handleError(error)
            });
        },
        // 容器实例信息界面
        changeMainTo4:function(){
            this.mainValue = 4;
        },
        // 软件运行log信息页面
        changeMainTo5:function(){
            this.mainValue = 5;
            this.currentPage = 1;
            // 获得软件log信息
            axios({
                method: 'post',
                url: 'api/log/getList?' + "page=" + this.currentPage + "&size=" + this.pageSize,
                headers: {
                    'content-Type' : "application/json",
                    "Authorization": `${sessionStorage.getItem('userToken')}`
                },
                data: {
                    // "companyName": "",
                    // "username": "",
                    // "containerName": "",
                }
            }).then((result) => {
                console.log(result)
                this.softwareLogData = result.data.data.records
                this.totalLogData = result.data.data.total // 获取总条数
            }).catch(error => {
                this.handleError(error)
            });
        },

        // 创建镜像
        createImage:function(){

        },

        // 推送镜像
        pushImage:function(index, row){
            // 获取当前行的三个参数
            const projectName = row.projectName;
            const imageName = row.name;
            const tag = row.tags;
            // 调用image/push接口推送镜像
            axios({
                method: 'post',
                url: 'api/image/push',
                headers: {
                    'content-Type' : "application/json",
                    "Authorization": `${sessionStorage.getItem('userToken')}`
                },
                data: {
                    "projectName": projectName,
                    "imageName": imageName,
                    "tag": tag,
                }
            }).then((result) => {
                console.log(result)
                this.$message.success("镜像推送成功！")
                // 推送后，获得所有镜像信息
                this.currentPage = 1;
                axios({
                    method: 'post',
                    url: 'api/image/list?' + "page=" + this.currentPage + "&size=" + this.pageSize,
                    headers: {
                        'content-Type' : "application/json",
                        "Authorization": `${sessionStorage.getItem('userToken')}`
                    },
                    data: {
                        "name": "",
                        "companyId": "",
                        "status": "",
                    }
                }).then((result) => {
                    console.log(result)
                    this.imageData = result.data.data.records
                    this.totalImageData = result.data.data.total // 获取总条数
                }).catch(error => {
                    this.handleError(error)
                });
            }).catch(error => {
                this.handleError(error)
            });
        },

        // 创建容器实例
        createContainer:function(){

        },

        // 查询镜像
        searchImage:function(){
        this.currentPage = 1;   
        axios({
            method: 'post',
            url: 'api/image/list?' + "page=" + this.currentPage + "&size=" + this.pageSize,
            headers: {
                'content-Type' : "application/json",
                "Authorization": `${sessionStorage.getItem('userToken')}`
            },
            data: {
                "name": this.imageSearchForm.searchImageName,
                // "companyId": this.imageSearchForm.searchCompanyId,
                // "status": this.imageSearchForm.searchStatus,
            }
        }).then((result) => {
            console.log(result)
            console.log(this.imageSearchForm)
            this.imageData = result.data.data.records
            this.totalImageData = result.data.data.total // 获取总条数
        }).catch(error => {
            this.handleError(error)
        });

        },
        // 取消查询，显示所有镜像数据
        cancelSearchImage:function(){
            this.currentPage = 1;
            this.resetForm('imageSearchForm');
            axios({
                method: 'post',
                url: 'api/image/list?' + "page=" + this.currentPage + "&size=" + this.pageSize,
                headers: {
                    'content-Type' : "application/json",
                    "Authorization": `${sessionStorage.getItem('userToken')}`
                },
                data: {
                    "name": "",
                }
            }).then((result) => {
                console.log(result)
                this.imageData = result.data.data.records
                this.totalImageData = result.data.data.total // 获取总条数
            }).catch(error => {
                this.handleError(error)
            });

        },

        // 删除镜像
        deleteImage:function(){
            console.log(this.selectedImageList)
            // 调用delete接口删除
            axios({
                method: 'post',
                url: 'api/image/delete',
                headers: {
                    "Authorization": `${sessionStorage.getItem('userToken')}`
                },
                data: this.selectedImageList, 
            }).then((result) => {
                console.log(result);
                this.$message.success("删除成功！");
                // 删除后，显示所有镜像信息
                this.currentPage = 1;
                axios({
                    method: 'post',
                    url: 'api/image/list?' + "page=" + this.currentPage + "&size=" + this.pageSize,
                    headers: {
                        'content-Type' : "application/json",
                        "Authorization": `${sessionStorage.getItem('userToken')}`
                    },
                    data: {
                        "name": "",
                    }
                }).then((result) => {
                    this.imageData = result.data.data.records
                    this.totalImageData = result.data.data.total // 获取总条数
                }).catch(error => {
                    this.handleError(error)
                });
            }).catch(error => {
                this.handleError(error)
            });
        },

        // 获取镜像管理中的选中项
        imageSelectionChange(val) {
            this.selectedImageList = val.map(row => ({
                projectName: row.projectName,
                imageName: row.name,
                tag: row.tags,
                reference: row.reference,
            }));
        },

        //查询容器实例
        searchContainer:function(){

        },
        // 取消查询，显示所有容器实例数据
        cancelSearchContainer:function(){

        },

        // 查询软件运行态log
        searchSoftwareLog:function(){
            axios({
                method: 'post',
                url: 'api/log/getList?' + "page=" + this.currentPage + "&size=" + this.pageSize,
                headers: {
                    'content-Type' : "application/json",
                    "Authorization": `${sessionStorage.getItem('userToken')}`
                },
                data: {
                    "companyName": this.softwareLogSearchForm.searchCompanyName,
                    "username": this.softwareLogSearchForm.searchUsername,
                    "containerName": this.softwareLogSearchForm.searchContainerName,
                }
            }).then((result) => {
                console.log(result)
                this.softwareLogData = result.data.data.records
                this.totalLogData = result.data.data.total // 获取总条数
            }).catch(error => {
                this.handleError(error)
            });
        },
        // 取消查询，显示所有软件运行态log
        cancelSearchSoftwareLog:function(){
            this.resetForm("softwareLogSearchForm");
            this.currentPage = 1;
            axios({
                method: 'post',
                url: 'api/log/getList?' + "page=" + this.currentPage + "&size=" + this.pageSize,
                headers: {
                    'content-Type' : "application/json",
                    "Authorization": `${sessionStorage.getItem('userToken')}`
                },
                data: {
                    // "companyName": this.softwareLogSearchForm.searchCompanyName,
                    // "username": this.softwareLogSearchForm.searchUsername,
                    // "containerName": this.softwareLogSearchForm.searchContainerName,
                }
            }).then((result) => {
                console.log(result)
                this.softwareLogData = result.data.data.records
                this.totalLogData = result.data.data.total // 获取总条数
            }).catch(error => {
                this.handleError(error)
            });
        },

        // 获取镜像管理中的选中项
        imageSelectionChange(val) {
            this.selectedImageList = val.map(row => ({
            
            }));
        },

        // 获取容器实例管理中的选中项
        containerSelectionChange(val) {
            this.selectedContainerList = val.map(row => ({
                
            }));
        },

        // 重置表单数据
        resetForm(formName) {
            this.$refs[formName].resetFields();
        },

        // 错误处理
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

        //点击按钮切换页面
        handleCurrentChange(currentPage) {
            this.currentPage = currentPage; //每次点击分页按钮，当前页发生变化
            // 如果当前页面是软件log管理页面
            if(this.mainValue == 6) {
                axios({
                    method: 'post',
                    url: 'api/log/getList?' + "page=" + this.currentPage + "&size=" + this.pageSize,
                    headers: {
                        'content-Type' : "application/json",
                        "Authorization": `${sessionStorage.getItem('userToken')}`
                    },
                    data: {
                        "companyName": this.softwareLogSearchForm.searchCompanyName,
                        "username": this.softwareLogSearchForm.searchUsername,
                        "containerName": this.softwareLogSearchForm.searchContainerName,
                    }
                }).then((result) => {
                    console.log(result)
                    this.companyData = result.data.records
                    this.totalCompanyData = result.data.total // 获取总条数
                }).catch(error => {
                    this.handleError(error)
                });
            }
        },

        // 将时间中间的T换成空格
        formatTime(timeStr) {
            if (timeStr === null) {
                return 'NULL'; 
            }
            return timeStr.replace('T', '\n');
        },



    },
}
</script>



<style scoped>

.el-menu-item:hover {
  color: rgb(199, 0, 25); /* 鼠标悬停时 显示红色 */
}

/* 活动菜单样式 */
.el-menu-item.is-active {
      background-color: #C70019 !important;
      color: #fff;
      span {
        color: #fff !important;
      }
}

</style>
