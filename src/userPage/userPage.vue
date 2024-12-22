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
                        <!-- <el-menu-item index="1-5" @click="changeMainTo5">软件运行态log信息</el-menu-item> -->
                    </el-submenu>
                </el-menu>
            </el-aside>

            <!-- 个人信息页面 -->
            <el-main v-if="mainValue == 1">
            <el-descriptions title="个人信息" border column="1" style="width: 500px; margin-left: 350px; margin-top: 50px;">
                <!-- <el-descriptions-item label="头像">
                    <el-avatar :src="avatarPath"></el-avatar>
                </el-descriptions-item> -->
                <el-descriptions-item label="用户名">{{ userData.username }}</el-descriptions-item>
                <el-descriptions-item label="姓名">{{ userData.name }}</el-descriptions-item>
                <el-descriptions-item label="手机号">{{  userData.phone }}</el-descriptions-item>
                <el-descriptions-item label="公司">{{ userData.companyName }}</el-descriptions-item>
            </el-descriptions>
            <span>
                <el-button type="primary"  style="margin-left: 620px; margin-top: 20px;" @click="userDataChangeDiaVisible = true">修改个人信息</el-button>
                <el-button type="danger" @click="userPasswordChangeDiaVisible = true">修改密码</el-button>
            </span>

            <!-- 用户信息修改dialog -->
            <el-dialog title="编辑用户信息" :visible.sync="userDataChangeDiaVisible">
                <el-form :model="editUserDataForm">
                    <el-form-item label="姓名" :label-width='"100px"'>
                        <el-input v-model="editUserDataForm.name" autocomplete="off" width="200px"></el-input>
                    </el-form-item>
                    <el-form-item label="电话" :label-width='"100px"'>
                        <el-input v-model="editUserDataForm.phone" autocomplete="off" width="200px"></el-input>
                    </el-form-item>
                </el-form>
                <div slot="footer">
                    <el-button @click="userDataChangeDiaVisible = false">取 消</el-button>
                    <el-button type="primary" @click="changeUserData">确 定</el-button>
                </div>
            </el-dialog>

            <!-- 用户密码修改dialog -->
            <el-dialog title="修改密码" :visible.sync="userPasswordChangeDiaVisible">
                <el-form :model="editUserDataForm">
                    <el-form-item label="新的密码" :label-width='"150px"'>
                        <el-input v-model="editUserDataForm.password" autocomplete="off"></el-input>
                    </el-form-item>
                </el-form>
                <div slot="footer">
                    <el-button @click="userPasswordChangeDiaVisible = false">取 消</el-button>
                    <el-button type="primary" @click="changeUserPassword">确 定</el-button>
                </div>
            </el-dialog>


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
                    <el-form :inline="true" :model="imageSearchForm" align="center" ref="imageSearchForm" :rules="imageRules">
                        <el-form-item label="镜像名称" style="margin-left: 30px;" prop="searchImageName">
                            <el-input v-model="imageSearchForm.searchImageName" placeholder="请输入内容"></el-input>
                        </el-form-item>
                        <el-form-item>
                            <el-button type="primary" @click="searchImage">查询</el-button>
                            <el-button type="danger" @click="cancelSearchImage">取消</el-button>
                        </el-form-item>
                        <!-- 创建镜像和删除镜像 -->
                        <el-form-item style="margin-left: 20px;">
                            <el-button type="primary" @click="openUploadImageDia">上传</el-button>
                            <el-button type="danger" @click="deleteImage">删除</el-button>
                        </el-form-item>
                    </el-form>

                    <!-- 上传镜像表单 -->
                    <el-dialog title="上传镜像" :visible.sync="uploadImageDiaVisible">
                        <el-form>
                            <el-form-item label="tar包名称">
                            <el-input v-model="uploadImageName" autocomplete="off"></el-input>
                            </el-form-item>
                            <el-form-item>
                            <el-button icon="el-icon-document-copy" type="primary" @click="checkFile">上传镜像</el-button>
                                        <input id="fileInput" type="file" style="display: none;"  ref="uploadRef" @change="uploadImage($event)" />
                            </el-form-item>
                        </el-form>
                        <div slot="footer" class="dialog-footer">
                            <el-button @click="uploadImageDiaVisible = false">取 消</el-button>
                            <el-button type="primary" @click="uploadImageDiaVisible = false">确 定</el-button>
                        </div>
                    </el-dialog>

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
                                <el-button size="mini" type="danger" @click="openCreateContainerDia(scope.row)">创建容器实例</el-button>
                            </template>
                        </el-table-column>
                        <el-table-column type="selection" align="center" width="55"></el-table-column>
                    </el-table>
                    <br>

                    <!-- 创建容器实例 dialog -->
                    <el-dialog title="创建容器实例" :visible.sync="createContainerDiavisible" v-if="createContainerDiavisible">
                        <el-table :data="pvcData" key="pvcData">
                            <el-table-column label="镜像名称" prop="imageName" align="center"></el-table-column>
                            <el-table-column label="创建时间" prop="createTime" align="center">
                                <template #default="scope">
                                    {{ formatTime(scope.row.createTime) }}
                                </template>
                            </el-table-column>
                            <!-- 操作按钮 查看&下载 -->
                            <el-table-column label="操作" align="center">
                                <template slot-scope="scope">
                                    <el-button size="mini" type="primary" @click="createContainer(scope.row)">使用</el-button>
                                </template>
                            </el-table-column>
                        </el-table>
                        <el-button type="danger" size="mini" @click="createContainerWithNewPvc" style="margin-top: 20px; margin-left: 460px">使用新的pvc创建容器实例</el-button>

                        <!-- 分页条 -->
                        <el-pagination
                            background
                            align="center"
                            style="margin-top: 20px; margin-right: 20px"
                            layout="prev, pager, next, jumper"
                            :total="this.totalPvcData"
                            @current-change="handleCurrentChange"
                            :current-page="currentPage"
                            :page-size="pageSize">
                        </el-pagination>
                    </el-dialog>


                    <!-- 分页条 -->
                    <el-pagination
                        background
                        align="center"
                        layout="prev, pager, next, jumper"
                        :total="this.totalImageData"
                        @current-change="handleCurrentChange"
                        :current-page="currentPage"
                        :page-size="pageSize">
                    </el-pagination>
                </el-main>


            <!-- 容器实例页面 -->
                <el-main v-if="mainValue == 4">
                    <!-- 查询功能 -->
                    <el-form :inline="true" :model="containerSearchForm" align="center" ref="containerSearchForm" :rules="containerRules">
                        <el-form-item label="用户名" style="margin-left: 30px;" prop="username">
                            <el-input v-model="containerSearchForm.username" placeholder="请输入内容"></el-input>
                        </el-form-item>
                        <el-form-item>
                            <el-button type="primary" @click="searchContainer">查询</el-button>
                            <el-button type="danger" @click="cancelSearchContainer">取消</el-button>
                        </el-form-item>
                        <!-- 删除按钮 -->
                        <el-form-item style="margin-left: 50px">
                            <el-button type="danger" @click="deleteContainer">删除</el-button>
                        </el-form-item>
                    </el-form>
                    <!-- 内容表格 -->
                    <el-table :data="containerData" border @selection-change="containerSelectionChange" key="containerData">
                        <el-table-column prop="podName" label="pod名称" align="center"></el-table-column>
                        <el-table-column prop="username" label="用户名" align="center" width="120px"></el-table-column>
                        <el-table-column prop="namespace" label="命名空间" align="center"></el-table-column>
                        <el-table-column prop="containerName" label="容器实例名称" align="center" width="120px"></el-table-column>
                        <el-table-column prop="imageName" label="镜像名称" align="center"></el-table-column>
                        <el-table-column prop="createTime" label="创建时间" align="center">
                            <template #default="scope">
                                {{ formatTime(scope.row.createTime) }}
                            </template>
                        </el-table-column>
                        <!-- Log相关按钮 包括软件log和容器log的查看与下载 -->
                        <el-table-column label="Log" align="center">
                            <template slot-scope="scope">
                                <el-button size="mini" type="danger" @click="openSoftwareLogDia(scope.row)">软件log</el-button>
                                <el-button size="mini" type="danger" @click="openContainerLogDia(scope.row)">容器log</el-button>
                            </template>
                        </el-table-column>
                        <el-table-column type="selection" align="center" width="55"></el-table-column>
                    </el-table>
                    <br>

                    <!-- 软件log dialog -->
                    <el-dialog title="软件运行态日志" :visible.sync="softwareLogDiavisible" v-if="softwareLogDiavisible">
                        <el-table :data="softwareLogData2" key="softwareLogDataTable">
                            <el-table-column label="日志名称" prop="fileName" align="center"></el-table-column>
                            <!-- 操作按钮 查看&下载 -->
                            <el-table-column label="操作" align="center">
                                <template slot-scope="scope">
                                    <el-button size="mini" type="success" @click="viewSoftwareLog(scope.row)">查看</el-button>
                                    <el-button size="mini" type="danger" @click="downloadSoftwareLog(scope.row)">下载</el-button>
                                </template>
                            </el-table-column>
                        </el-table>
                        <!-- 分页条 -->
                        <el-pagination
                            background
                            align="center"
                            layout="prev, pager, next, jumper"
                            :total="this.totalSoftwareLogData"
                            @current-change="handleCurrentChange"
                            :current-page="currentPage"
                            :page-size="pageSize">
                        </el-pagination>
                    </el-dialog>

                    <!-- 容器实例log dialog -->
                    <el-dialog title="容器实例日志" :visible.sync="containerLogDiavisible" width="400px" v-if="containerLogDiavisible">
                        <div style="padding: 20px; text-align: center;">
                        <p style="font-size: 17px; color: #666; margin-bottom: 20px;">请选择要进行的操作</p>
                        </div>
                        <el-button type="primary" @click="viewContainerLog" style="width: 120px; margin: 0 10px; border-radius: 5px; margin-top: 30px; margin-left: 50px">查看日志</el-button>
                        <el-button type="success" @click="downloadContainerLog" style="width: 120px; margin: 0 10px; border-radius: 5px; ">下载日志</el-button>
                    </el-dialog>

                    <!-- 分页条 -->
                    <el-pagination
                        background
                        align="center"
                        layout="prev, pager, next, jumper"
                        :total="this.totalContainerData"
                        @current-change="handleCurrentChange"
                        :current-page="currentPage"
                        :page-size="pageSize">
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
                    align="center"
                    layout="prev, pager, next, jumper"
                    :total="this.totalSoftwareLogData2"
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
            originSoftwareLogData: [], // 初始软件运行态log数据（纯数组形式）
            softwareLogData: [], // 软件运行态log数据（暂时没用）
            softwareLogData2: [], // 软件log数据（如log.txt testlog.txt等）
            imageData: [], // 镜像管理数据
            containerData: [], // 容器实例数据
            userLogData: [], // 用户日志数据
            pvcData: [], // 创建容器实例时，展示的pvc列表数据
            selectedImageList: [], // 选中的镜像列表
            selectedContainerList: [], // 选中的容器实例列表
            totalImageData: 0, // 镜像数据总条数
            totalContainerData: 0, // 容器实例数据总条数
            totalSoftwareLogData: 0, // 软件运行态log数据总条数
            totalSoftwareLogData2: 0, // 软件运行态log数据总条数（测试页面）
            totalPvcData: 0, // pvc数据总条数
            pageSize: 7, // 每页显示的数据条数
            mainValue: 0, // 控制主页面切换
            currentPage: 1, // 当前页面
            uploadImageName: "", // 上传的镜像包的名称
            uploadImageDiaVisible: false, // 上传镜像文件表单显示与否
            softwareLogDiavisible: false, // 软件log表单显示与否
            containerLogDiavisible: false, // 容器log表单显示与否
            createContainerDiavisible: false, // 创建容器实例的表单显示与否
            userDataChangeDiaVisible: false, // 用户修改个人信息表单显示与否
            userPasswordChangeDiaVisible: false, // 用户修改密码表单显示与否
            imageAndTags: "", // 存放imagename:tags的标签，目的是用于pvc的翻页
            avatarPath: require("@/test/testAvatar.jpeg"),

            // 用户数据
            userData: {  
                "username": "",
                "name": "",
                "phone": "",
                "companyName": "",
                "companyId": "",
            },
            
            // 打开两类log的dialog后，临时存放当前的容器实例的podName和namespace
            tempContainerData:{
                "podName": "",
                "namespace": "",
            },

            // 镜像信息搜索功能中的值
            imageSearchForm: {  
                searchImageName: "",  // 镜像名称
            },

            // 容器实例信息搜索功能中的值
            containerSearchForm: {
                username: "",
            },

            // 软件运行态log管理搜索功能中的值
            softwareLogSearchForm: {
                searchCompanyName: "",
                searchUsername: "",
                searchContainerName: "",
            },

            // 更改用户信息时，选中的用户的值
            editUserDataForm:{
                name: "",
                phone: "",
                password: "",
            },


            rules: {
                searchCompanyName: [{ required: false, trigger:"blur"},],
                searchUsername: [{ required: false, trigger:"blur"},],
                searchContainerName: [{ required: false, trigger:"blur"},],
            },
            // 镜像信息table rules
            imageRules:{
                searchImageName: [{ required: false, trigger:"change"}],    
            },
            // 容器实例table tules
            containerRules:{
                username: [{ required: false, trigger:"change"}],
            },


        }
    },
    mounted(){
        // 调用接口，目的是获取namespace
        axios({
            method: 'get',
            url: 'api/main/userInfo',
            headers: {
                'content-Type' : "application/json",
                "Authorization": `${sessionStorage.getItem('userToken')}`
            },
        }).then((result) => {
            this.userData.username = result.data.data.username
            this.userData.name = result.data.data.name
            this.userData.phone = result.data.data.phone
            this.userData.companyName = result.data.data.companyName
            this.userData.companyId = result.data.data.CompanyId
            console.log("companyId:", result.data.data.CompanyId)
            console.log(this.userData)
        }).catch(error => {
            this.handleError(error)
        });
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
            this.currentPage = 1;
            // 获取所有容器实例信息
            axios({
                method: 'post',
                url: 'api/container/list?' + "page=" + this.currentPage + "&size=" + this.pageSize,
                headers: {
                    'content-Type' : "application/json",
                    "Authorization": `${sessionStorage.getItem('userToken')}`
                },
                data: {
                    "namespace": this.userData.companyId,
                    "username": ""
                }
            }).then((result) => {
                console.log(result)
                this.containerData = result.data.data.records
                this.totalContainerData = result.data.data.total // 获取总条数
            }).catch(error => {
                this.handleError(error)
            });
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
                this.totalSoftwareLogData2 = result.data.data.total // 获取总条数
            }).catch(error => {
                this.handleError(error)
            });
        },

        // 更改用户数据
        changeUserData:function(){
            if(this.editUserDataForm.name == ''){
                this.$message.error("姓名为空！")
            }
            else if(this.editUserDataForm.phone == ''){
                this.$message.error("电话为空！")
            }
            else {
                axios({
                    method: 'post',
                    url: 'api/main/update',
                    headers: {
                        'content-Type' : "application/json",
                        "Authorization": `${sessionStorage.getItem('userToken')}`
                    },
                    data: {
                        "name": this.editUserDataForm.name,
                        "phone": this.editUserDataForm.phone,
                    }
                }).then((result) => {
                    console.log(result)
                    this.$message.success("个人信息修改成功！")
                    // 获取新的用户信息
                    axios({
                        method: 'get',
                        url: 'api/main/userInfo',
                        headers: {
                            'content-Type' : "application/json",
                            "Authorization": `${sessionStorage.getItem('userToken')}`
                        },
                    }).then((result) => {
                        this.userData.username = result.data.data.username
                        this.userData.name = result.data.data.name
                        this.userData.phone = result.data.data.phone
                        this.userData.companyName = result.data.data.companyName
                        this.userData.companyId = result.data.data.CompanyId
                        console.log("companyId:", result.data.data.CompanyId)
                        console.log(this.userData)
                    }).catch(error => {
                        this.handleError(error)
                    });

                }).catch(error => {
                    this.handleError(error)
                });
                this.editUserDataForm.name = ''
                this.editUserDataForm.phone = ''
                this.userDataChangeDiaVisible = false
            }
        },

        // 更改用户密码
        changeUserPassword:function(){
            if(this.editUserDataForm.password == ''){
                this.$message.error("新密码为空！")
            }
            else {
                // 调用接口更改密码
                axios({
                    method: 'post',
                    url: 'api/main/updatePassword',
                    headers: {
                        'content-Type' : "application/json",
                        "Authorization": `${sessionStorage.getItem('userToken')}`
                    },
                    data: {
                        "password": this.editUserDataForm.password
                    }
                }).then((result) => {
                    console.log(result)
                    this.$message.success("密码修改成功！")
                    this.userPasswordChangeDiaVisible = false
                    this.editUserDataForm.password = ''
                }).catch(error => {
                    this.handleError(error)
                });
            }
        },

        // 使用现有pvc路径创建容器实例
        createContainer:function(row){
            // 调用接口创建容器实例
            axios({
                method: 'post',
                url: 'api/container/create',
                headers: {
                    "Authorization": `${sessionStorage.getItem('userToken')}`
                },
                data: {
                    "image": this.imageAndTags,
                    "pvcName": row.pvcName,
                },
            }).then((result) => {
                console.log(result)
                this.$message.success("容器实例创建成功！")
                this.createContainerDiavisible = false
            }).catch(error => {
                this.handleError(error)
            });
        },

        // 使用新的pvc路径创建容器实例
        createContainerWithNewPvc:function(){
            // 调用接口创建容器实例
            axios({
                method: 'post',
                url: 'api/container/create',
                headers: {
                    "Authorization": `${sessionStorage.getItem('userToken')}`
                },
                data: {
                    "image": this.imageAndTags,
                    // "pvcName": ""
                },
            }).then((result) => {
                console.log(result)
                this.$message.success("使用新的pvc创建容器实例成功！")
                this.createContainerDiavisible = false
            }).catch(error => {
                this.handleError(error)
            });
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
            if(this.selectedImageList == ""){
                this.$message("未选择任何镜像！")
            }
            else {
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
            }
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

        // 查询容器实例
        searchContainer:function(){
            this.currentPage = 1;
            // 调用接口 通过namespace查询容器实例
            axios({
                method: 'post',
                url: 'api/container/list?' + "page=" + this.currentPage + "&size=" + this.pageSize,
                headers: {
                    'content-Type' : "application/json",
                    "Authorization": `${sessionStorage.getItem('userToken')}`
                },
                data: {
                    "username": this.containerSearchForm.username,
                    "namespace": this.userData.companyId
                }
            }).then((result) => {
                console.log(result)
                this.containerData = result.data.data.records
                this.totalContainerData = result.data.data.total // 获取总条数
            }).catch(error => {
                this.handleError(error)
            });
        },

        // 取消查询，显示所有容器实例数据
        cancelSearchContainer:function(){
            this.currentPage = 1;
            this.resetForm('containerSearchForm');
            axios({
                method: 'post',
                url: 'api/container/list?' + "page=" + this.currentPage + "&size=" + this.pageSize,
                headers: {
                    'content-Type' : "application/json",
                    "Authorization": `${sessionStorage.getItem('userToken')}`
                },
                data: {
                    "namespace": this.userData.companyId,
                    "username": ""
                }
            }).then((result) => {
                console.log(result)
                this.containerData = result.data.data.records
                this.totalContainerData = result.data.data.total // 获取总条数
            }).catch(error => {
                this.handleError(error)
            });
        },

        // 删除容器实例
        deleteContainer:function(){
            console.log(this.selectedContainerList)
            if (this.selectedContainerList == '') {
                this.$message("未选择任何容器实例！")
            }
            else {
                axios({
                    method: 'post',
                    url: 'api/container/delete',
                    headers: {
                        'content-Type' : "application/json",
                        "Authorization": `${sessionStorage.getItem('userToken')}`
                    },
                    data: this.selectedContainerList,
                }).then((result) => {
                    console.log(result)
                    this.$message.success("删除成功！")
                    this.selectedContainerList == ''
                    // 显示删除后的所有容器实例数据
                    this.currentPage = 1;
                    axios({
                        method: 'post',
                        url: 'api/container/list?' + "page=" + this.currentPage + "&size=" + this.pageSize,
                        headers: {
                            'content-Type' : "application/json",
                            "Authorization": `${sessionStorage.getItem('userToken')}`
                        },
                        data: {
                            "namespace": this.userData.companyId,
                            "username": ""
                        }
                    }).then((result) => {
                        console.log(result)
                        this.containerData = result.data.data.records
                        this.totalContainerData = result.data.data.total // 获取总条数
                    }).catch(error => {
                        this.handleError(error)
                    });
                })
            }
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
                this.totalSoftwareLogData2 = result.data.data.total // 获取总条数
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
                this.totalSoftwareLogData2 = result.data.data.total // 获取总条数
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

        // 获取容器实例管理中的选中项
        containerSelectionChange(val) {
            this.selectedContainerList = val.map(row => ({
                namespace: row.namespace,
                name: row.podName,
            }));
        },

        // 重置表单数据
        resetForm(formName) {
            this.$refs[formName].resetFields();
        },

        // 打开软件运行态log的对话框
        openSoftwareLogDia(row){
            this.softwareLogDiavisible = true
            // 将该容器实例的podName和namespace暂时保存下来
            this.tempContainerData.podName = row.podName
            this.tempContainerData.namespace = row.namespace
            // 调用接口获取软件日志列表
            this.currentPage = 0
            axios({
                    method: 'get',
                    url: 'api/file/getSoftwareLogs?' + "podName=" + this.tempContainerData.podName + "&namespace=" + this.tempContainerData.namespace + "&page=" + this.currentPage + "&size=" + this.pageSize,
                    headers: {
                        "Authorization": `${sessionStorage.getItem('userToken')}`
                    },
                }).then((result) => {
                    console.log(result)
                    if(result.data.data.content != null){
                        this.originSoftwareLogData = result.data.data.content
                        // 转换格式 方便在el-table中显示
                        this.softwareLogData2 = this.originSoftwareLogData.map(item => {
                            return {
                                fileName: item
                            };
                        });
                    }
                    this.totalSoftwareLogData = result.data.data.totalElements // 获得总条数
                }).catch(error => {
                    this.handleError(error)
                });
        },

        // 打开容器实例log的对话框
        openContainerLogDia(row){
            this.containerLogDiavisible = true
            // 将该容器实例的podName和namespace暂时保存下来
            this.tempContainerData.podName = row.podName
            this.tempContainerData.namespace = row.namespace
        },

        // 查看软件log
        viewSoftwareLog(row){
            let logData = ""
            // 调用接口查看软件log
            axios({
                method: 'get',
                url: 'api/file/download?' + "podName=" + this.tempContainerData.podName + "&namespace=" + this.tempContainerData.namespace + "&fileName=" + row.fileName + "&option=1",
                headers: {
                    "Authorization": `${sessionStorage.getItem('userToken')}`
                },
            }).then((result) => {
                console.log(result)
                logData = result.data
                logData = logData.replace(/\n/g, "<br>");
                // 打开新页面展示log
                const newWindow = window.open('', '_blank');
                newWindow.document.write(logData);
            }).catch(error => {
                this.handleError(error)
            });
        },

        // 下载软件log
        downloadSoftwareLog(row){
            axios({
                method: 'GET',
                url: 'http://localhost:7000/api/file/download?' + "podName=" + this.tempContainerData.podName + "&namespace=" + this.tempContainerData.namespace + "&fileName=" + row.fileName + "&option=0",
                responseType: 'blob',  // 指定响应类型为blob用于文件下载
                headers: {
                    "Authorization": `${sessionStorage.getItem('userToken')}`
                }
            }).then((response) => {
                const blob = new Blob([response.data], { type: 'application/octet-stream' });
                const a = document.createElement('a');
                a.download = row.fileName;
                a.href = URL.createObjectURL(blob);
                a.click();
                URL.revokeObjectURL(a.href);
            }).catch((error) => {
                console.error(error);
            });
        },

        // 查看容器log
        viewContainerLog(){
            let logData = ""
            // 调用接口查看容器log
            axios({
                method: 'get',
                url: 'api/container/getPodLog?' + "namespace=" + this.tempContainerData.namespace + "&podName=" + this.tempContainerData.podName + "&option=1",
                headers: {
                    "Authorization": `${sessionStorage.getItem('userToken')}`
                },
            }).then((result) => {
                console.log(result)
                logData = result.data
                logData = logData.replace(/\n/g, "<br>");
                // 打开新页面展示log
                const newWindow = window.open('', '_blank');
                newWindow.document.write(logData);
            }).catch(error => {
                this.handleError(error)
            });
        },

        // 下载容器log
        downloadContainerLog(){
            axios({
                method: 'GET',
                url: "http://localhost:7000/api/container/getPodLog?" + "namespace=" + this.tempContainerData.namespace + "&podName=" + this.tempContainerData.podName + "&option=0",
                responseType: 'blob',  // 指定响应类型为blob用于文件下载
                headers: {
                    "Authorization": `${sessionStorage.getItem('userToken')}`
                }
            }).then((response) => {
                const blob = new Blob([response.data], { type: 'application/octet-stream' });
                const a = document.createElement('a');
                a.download = "containerLog.txt";
                a.href = URL.createObjectURL(blob);
                a.click();
                URL.revokeObjectURL(a.href);
            }).catch((error) => {
                console.error(error);
            });
        }, 

        // 打开上传镜像的表单
        openUploadImageDia(){
            this.uploadImageName = ""
            this.uploadImageDiaVisible = true
        },

        // 打开创建容器实例的表单
        openCreateContainerDia(row){
            this.createContainerDiavisible = true
            const name = row.name
            const tag = row.tags
            const image = name + ":" + tag
            this.imageAndTags = image
            // 调用接口获取pvc列表
            axios({
                method: 'get',
                url: 'api/container/getPvc?' + "namespace=" + this.userData.companyId + "&image=" + this.imageAndTags,
                headers: {
                    "Authorization": `${sessionStorage.getItem('userToken')}`
                },
            }).then((result) => {
                console.log(result)
                this.pvcData = result.data.data.records
                this.totalPvcData = result.data.data.total
            }).catch(error => {
                this.handleError(error)
            });
        },


        // 错误处理
        handleError(error) {
            if (error.response) {
                // error.response包含了服务器响应的详细信息
                const statusCode = error.response.status;
                const errorMessage = error.response.data.error;
                // 根据不同的错误代码，显示不同的错误消息
                // switch (statusCode) {
                //     case 400:
                //         alert(`400: ${errorMessage}`);
                //         break;
                //     case 404:
                //         alert(`404: ${errorMessage}`);
                //         break;
                //     case 500:
                //         alert(`服务器错误，请稍后重试。`);
                //         break;
                //     default:
                //         alert(`未知错误: ${errorMessage}`);
                //     }

                this.$message.error(`${statusCode}: ${errorMessage}`);
                } else {
                    // 其他错误（例如网络问题）
                    this.$message.error(`${error}`);
                }
        },

        //点击按钮切换页面
        handleCurrentChange(currentPage) {
            this.currentPage = currentPage; //每次点击分页按钮，当前页发生变化

            // 如果当前页面是镜像页面且没有打开创建容器实例的dig
            if(this.mainValue == 3 && this.createContainerDiavisible == false) {
                axios({
                    method: 'post',
                    url: 'api/image/list?' + "page=" + this.currentPage + "&size=" + this.pageSize,
                    headers: {
                        'content-Type' : "application/json",
                        "Authorization": `${sessionStorage.getItem('userToken')}`
                    },
                    data: {
                        "name": this.imageSearchForm.searchImageName,
                    }
                }).then((result) => {
                    console.log(result)
                    this.imageData = result.data.data.records
                    this.totalImageData = result.data.data.total // 获取总条数
                }).catch(error => {
                    this.handleError(error)
                });
            }
            // 如果当前页面是镜像页面且打开了创建容器实例的dig
            if(this.mainValue == 3 && this.createContainerDiavisible == true) {
                axios({
                    method: 'get',
                    url: 'api/container/getPvc?' + "namespace=" + this.userData.companyId + "&image=" + this.imageAndTags,
                    headers: {
                        "Authorization": `${sessionStorage.getItem('userToken')}`
                    },
                }).then((result) => {
                    console.log(result)
                    this.pvcData = result.data.data.records
                    this.totalPvcData = result.data.data.total
                }).catch(error => {
                    this.handleError(error)
                });
            }
            // 如果当前页面是容器实例管理页面且没有打开软件log的dialog
            if(this.mainValue == 4 && this.softwareLogDiavisible == false) {
                axios({
                    method: 'post',
                    url: 'api/container/list?' + "page=" + this.currentPage + "&size=" + this.pageSize,
                    headers: {
                        'content-Type' : "application/json",
                        "Authorization": `${sessionStorage.getItem('userToken')}`
                    },
                    data: {
                        "namespace": this.userData.companyId,
                        "username": this.containerSearchForm.username
                    }
                }).then((result) => {
                    console.log(result)
                    this.containerData = result.data.data.records
                    this.totalLogData = result.data.data.total // 获取总条数
                }).catch(error => {
                    this.handleError(error)
                });
            }
            // 如果当前页面是容器实例页面且打开了软件log的dialog
            if(this.mainValue == 4 && this.softwareLogDiavisible == true) {
                axios({
                    method: 'get',
                    url: 'api/file/getSoftwareLogs?' + "podName=" + this.tempContainerData.podName + "&namespace=" + this.tempContainerData.namespace + "&page=" + this.currentPage + "&size=" + this.pageSize,
                    headers: {
                        "Authorization": `${sessionStorage.getItem('userToken')}`
                    },
                }).then((result) => {
                    console.log(result)
                    if(result.data.data.content != null){
                        this.originSoftwareLogData = result.data.data.content
                        // 转换格式 方便在el-table中显示
                        this.softwareLogData2 = this.originSoftwareLogData.map(item => {
                            return {
                                fileName: item
                            };
                        });
                    }
                    this.totalSoftwareLogData = result.data.data.totalElements // 获得总条数
                }).catch(error => {
                    this.handleError(error)
                });
            }
            // 如果当前页面是软件log管理页面
            if(this.mainValue == 5) {
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

        // 触发点击上传文件事件
        checkFile() {
            document.querySelector('#fileInput').click()
        },
      

        // 调用接口 上传文件
        uploadImage(e) {
            let file = e.target.files[0]
            let formData = new FormData()
            formData.append('file', file)
            console.log("file:", file)
            console.log("formData:", formData)
            // 调用接口 上传文件
            axios({
                    method: 'post',
                    url: 'api/image/upload',
                    headers: {
                        "Authorization": `${sessionStorage.getItem('userToken')}`,
                    },
                    data: formData
                }).then((result) => {
                    console.log(result)
                    this.uploadImageName = result.data.data
                    // 创建镜像接口
                    axios({
                        method: 'post',
                        url: 'api/image/create?' + 'filename=' + this.uploadImageName,
                        headers: {
                            'content-Type' : "multipart/form-data",
                            "Authorization": `${sessionStorage.getItem('userToken')}`
                        },
                    }).then((result) => {
                        console.log(result)
                        this.$message.success("镜像上传成功，请等待管理员审批！")
                    }).catch(error => {
                        this.handleError(error)
                    });
           
                }).catch(error => {
                    this.handleError(error)
                });
            // // 清空上传文件列表
            const fileInput = this.$refs.uploadRef;
            // 重置files属性
            fileInput.value = null;
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
