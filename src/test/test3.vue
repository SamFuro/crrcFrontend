<template>
    <div>
        <el-container style="height: 700px; border: 1px solid #eee ">
        <el-header style="font-size: 37px; background-color: rgb(199, 0, 25); color: white;">管理员管理系统</el-header>
        <el-container>
            <el-aside width="200px" style="background-color: rgb(238, 241, 246)">
                <el-menu :default-openeds="['1','2']">
                    <el-submenu index="1">
                        <template slot="title"><i class="el-icon-message"></i>信息管理</template>
                        <el-menu-item-group>
                            <el-menu-item index="1-1" @click="changeMainTo1">用户审批</el-menu-item>
                            <el-menu-item index="1-2" @click="changeMainTo2">用户管理</el-menu-item>
                            <el-menu-item index="1-3" @click="changeMainTo3">租户管理</el-menu-item>
                            <el-menu-item index="1-4" @click="changeMainTo4">镜像管理</el-menu-item>
                            <el-menu-item index="1-5" @click="changeMainTo5">容器实例管理</el-menu-item>
                            <el-menu-item index="1-6" @click="changeMainTo6">软件运行态log管理</el-menu-item>
                        </el-menu-item-group>
                    </el-submenu>
                    <!-- <el-submenu index="2">
                        <template slot="title"><i class="el-icon-s-order"></i>管理</template>
                        <el-menu-item-group>
                            
                        </el-menu-item-group>
                    </el-submenu> -->
                </el-menu>
            </el-aside>
            <!-- 用户审批主页面 -->
                <el-main v-if="mainValue == 1">
                    <!-- 待审批用户表格内容 -->
                    <el-table :data="verifyUserList" border @selection-change="handleSelectionChange" ref="verifyUserList" key="verifyTable" style="width: 1200px; margin-left: 30px">
                        <el-table-column prop="username" label="用户名" align="center"></el-table-column>
                        <el-table-column prop="name" label="姓名" align="center"></el-table-column>
                        <el-table-column prop="phone" label="电话" align="center"></el-table-column>
                        <el-table-column prop="companyName" label="公司" align="center"></el-table-column>
                        <el-table-column prop="status" label="状态" align="center" :formatter="formatUserStatus"></el-table-column>
                        <el-table-column type="selection" align="center" width="55"></el-table-column>
                    </el-table>
                    <!-- 通过 & 不通过 按钮 -->
                     <el-row style="margin-left: 1050px; margin-top: 20px">
                        <el-button type="danger" @click="rejectUser">不通过</el-button>
                        <el-button type="primary" @click="approveUser" style="margin-left: 15px;">通过</el-button>
                    </el-row>

                </el-main>
            
            <!-- 用户管理主页面 -->
                <el-main v-if="mainValue == 2">
                    <!-- 查询功能 -->
                    <el-form :inline="true" :model="userSearchForm" align="center" ref="userSearchForm" :rules="userRules">
                        <!-- <el-form-item label="姓名">
                            <el-input v-model="userSearchForm.searchName" placeholder="姓名"></el-input>
                        </el-form-item> -->
                        <el-form-item label="公司" style="margin-left: 30px;" prop="searchCompanyName">
                            <el-select v-model="userSearchForm.searchCompanyName" placeholder="公司">
                                <el-option label="这个公司叫啥公司" value="这个公司叫啥公司"></el-option>
                                <el-option label="公司1" value="公司1"></el-option>
                                <el-option label="公司2" value="公司2"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="状态" style="margin-left: 30px;" prop="searchStatus">
                            <el-select v-model="userSearchForm.searchStatus" placeholder="状态">
                                <el-option label="待审批" value="0"></el-option>
                                <el-option label="审批通过" value="1"></el-option>
                                <el-option label="审批不通过" value="2"></el-option>
                                <el-option label="已删除" value="3"></el-option>
                                <el-option label="异常" value="4"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item>
                            <el-button type="primary" @click="searchUser">查询</el-button>
                            <el-button type="danger" @click="cancleSearchUser">取消</el-button>
                        </el-form-item>
                    </el-form>
                    <!-- 内容表格 -->
                    <el-table :data="userData" border key="userDataTable">
                        <el-table-column prop="username" label="用户名" align="center"></el-table-column>
                        <el-table-column prop="name" label="姓名" align="center"></el-table-column>
                        <el-table-column prop="phone" label="电话" align="center"></el-table-column>
                        <el-table-column prop="companyName" label="公司" align="center"></el-table-column>
                        <el-table-column prop="createTime" label="创建时间" align="center"></el-table-column>
                        <el-table-column prop="deleteTime" label="删除时间" align="center"></el-table-column>
                        <el-table-column prop="status" label="状态" :formatter="formatUserStatus" align="center"></el-table-column>
                        <!-- 操作按钮 编辑&删除 -->
                        <el-table-column label="操作">
                            <template slot-scope="scope">
                                <el-button size="mini" @click="editUserData(scope.$index, scope.row)">编辑</el-button>
                                <el-button size="mini" type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                    <br>

                    <!-- 用户信息修改dialog -->
                    <el-dialog title="编辑用户信息" :visible.sync="userDataChangeDiaVisible">
                        <el-form :model="editUserDataForm">
                            <el-form-item label="用户名" :label-width='"150px"'>
                                <el-input v-model="editUserDataForm.username" autocomplete="off"></el-input>
                            </el-form-item>
                            <el-form-item label="姓名" :label-width='"150px"'>
                                <el-input v-model="editUserDataForm.name" autocomplete="off"></el-input>
                            </el-form-item>
                            <el-form-item label="电话" :label-width='"150px"'>
                                <el-input v-model="editUserDataForm.phone" autocomplete="off"></el-input>
                            </el-form-item>
                        </el-form>
                        <div slot="footer" class="dialog-footer">
                            <el-button @click="userDataChangeDiaVisible = false">取 消</el-button>
                            <el-button type="primary" @click="changeUserData">确 定</el-button>
                        </div>
                    </el-dialog>

                    <!-- 分页条 -->
                    <el-pagination
                        background
                        layout="prev, pager, next, jumper"
                        :total="this.totalUserData"
                        @current-change="handleCurrentChange"
                        :current-page="currentPage"
                        :page-size="pageSize">
                    </el-pagination>
                </el-main>
                
            <!-- 租户管理主页面 -->
                <el-main v-if="mainValue == 3">
                    <!-- 查询功能 -->
                    <el-form :inline="true" :model="companySearchForm" align="center" ref="companySearchForm" :rules="companyRules">
                        <el-form-item label="公司名称" prop="searchCompanyName" style="margin-left: 30px;">
                            <el-input v-model="companySearchForm.searchCompanyName"></el-input>
                        </el-form-item>
                        <el-form-item>
                            <el-button type="primary" @click="searchTenant">查询</el-button>
                            <el-button type="danger" @click="cancelSearchTenant">取消</el-button>
                        </el-form-item>
                        <!-- 创建租户 -->
                        <el-form-item style="margin-left: 50px">
                            <el-button type="primary" @click="createCompanyDiaVisible = true">创建租户</el-button>
                        </el-form-item>
                    </el-form>
                    <!-- 内容表格 -->
                    <el-table :data="companyData" border key="companyDataTable">
                        <el-table-column prop="name" label="公司名称" align="center"></el-table-column>
                        <el-table-column prop="cpu" label="cpu" align="center"></el-table-column>
                        <el-table-column prop="memory" label="内存" align="center"></el-table-column>
                        <!-- 操作按钮 编辑&删除 -->
                        <el-table-column label="操作" align="center">
                            <template slot-scope="scope">
                                <el-button size="mini" @click="editCompanyData(scope.$index, scope.row)">编辑</el-button>
                                <el-button size="mini" type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                    <br>

                    <!-- 创建租户dialog -->
                    <el-dialog title="待创建租户信息" :visible.sync="createCompanyDiaVisible">
                        <el-form :model="createCompanyData">
                            <el-form-item label="公司名称" :label-width='"150px"'>
                                <el-input v-model="createCompanyData.name" autocomplete="off"></el-input>
                            </el-form-item>
                            <el-form-item label="cpu" :label-width='"150px"'>
                                <el-input v-model="createCompanyData.cpu" autocomplete="off"></el-input>
                            </el-form-item>
                            <el-form-item label="内存" :label-width='"150px"'>
                                <el-input v-model="createCompanyData.memory" autocomplete="off"></el-input>
                            </el-form-item>
                        </el-form>
                        <div slot="footer" class="dialog-footer">
                            <el-button @click="createCompanyDiaVisible = false">取 消</el-button>
                            <el-button type="primary" @click="createCompany">确 定</el-button>
                        </div>
                    </el-dialog>

                    <!-- 租户信息修改dialog -->
                    <el-dialog title="编辑租户信息" :visible.sync="companyDataChangeDiaVisible">
                        <el-form :model="editCompanyDataForm">
                            <el-form-item label="公司名称" :label-width='"150px"'>
                                <el-input v-model="editCompanyDataForm.companyName" autocomplete="off"></el-input>
                            </el-form-item>
                            <el-form-item label="cpu" :label-width='"150px"'>
                                <el-input v-model="editCompanyDataForm.cpu" autocomplete="off"></el-input>
                            </el-form-item>
                            <el-form-item label="内存" :label-width='"150px"'>
                                <el-input v-model="editCompanyDataForm.memory" autocomplete="off"></el-input>
                            </el-form-item>
                        </el-form>
                        <div slot="footer" class="dialog-footer">
                            <el-button @click="companyDataChangeDiaVisible = false">取 消</el-button>
                            <el-button type="primary" @click="changeCompanyData">确 定</el-button>
                        </div>
                    </el-dialog>

                    <!-- 分页条 -->
                    <el-pagination
                        background
                        layout="prev, pager, next, jumper"
                        :total="this.totalCompanyData"
                        @current-change="handleCurrentChange"
                        :current-page="currentPage"
                        :page-size="pageSize">
                    </el-pagination>
                </el-main>

            <!-- 镜像管理主页面 -->
            <el-main v-if="mainValue == 4">
                <!-- 查询功能 -->
                <el-form :inline="true" :model="imageSearchForm" align="center">
                    <el-form-item label="镜像名称" style="margin-left: 30px;">
                        <el-input v-model="imageSearchForm.searchImageName" placeholder="请输入内容"></el-input>
                    </el-form-item>
                    <el-form-item label="创建人" style="margin-left: 30px;">
                        <el-input v-model="imageSearchForm.searchCreatImageUser" placeholder="请输入内容"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="searchImage">查询</el-button>
                    </el-form-item>
                    <!-- 创建镜像 -->
                    <el-form-item style="margin-left: 50px">
                        <el-button type="primary" @click="createImage">创建镜像</el-button>
                    </el-form-item>
                </el-form>
                <!-- 内容表格 -->
                <el-table :data="imageManagementData" border key="imageDataTable">
                    <el-table-column prop="imageName" label="镜像名称"></el-table-column>
                    <el-table-column prop="fileSize" label="文件大小"></el-table-column>
                    <el-table-column prop="numInUsing" label="正在使用的数量"></el-table-column>
                    <el-table-column prop="createTime" label="创建时间"></el-table-column>
                    <el-table-column prop="createUser" label="创建用户"></el-table-column>
                    <el-table-column prop="tanent" label="租户"></el-table-column>
                    <!-- 操作按钮 编辑&删除 -->
                    <el-table-column label="操作">
                        <template slot-scope="scope">
                            <el-button size="mini" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
                            <el-button size="mini" type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
                        </template>
                    </el-table-column>
                </el-table>
                <br>

                <!-- 分页条 -->
                <el-pagination
                    background
                    layout="prev, pager, next, jumper"
                    :total="1000">
                </el-pagination>
            </el-main>

            <!-- 容器实例管理主页面 -->
            <el-main v-if="mainValue == 5">
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
                    <!-- 创建容器实例 -->
                    <el-form-item style="margin-left: 50px">
                        <el-button type="primary" @click="createContainer">创建容器实例</el-button>
                    </el-form-item>
                </el-form>
                <!-- 内容表格 -->
                <el-table :data="containerInstanceData" border key="containerDataTable">
                    <el-table-column prop="containerName" label="实例名称"></el-table-column>
                    <el-table-column prop="startTime" label="启动时间"></el-table-column>
                    <el-table-column prop="runningTime" label="运行时间"></el-table-column>
                    <el-table-column prop="imageName" label="镜像名称"></el-table-column>
                    <el-table-column prop="createUser" label="创建用户"></el-table-column>
                    <el-table-column prop="tanent" label="租户"></el-table-column>
                    <el-table-column prop="logUrl" label="日志url"></el-table-column>
                    <el-table-column prop="softwareRunningUrl" label="软件运行url"></el-table-column>
                    <!-- 操作按钮 编辑&删除 -->
                    <el-table-column label="操作">
                        <template slot-scope="scope">
                            <el-button size="mini" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
                            <el-button size="mini" type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
                        </template>
                    </el-table-column>
                </el-table>
                <br>

                <!-- 分页条 -->
                <el-pagination
                    background
                    layout="prev, pager, next, jumper"
                    :total="1000">
                </el-pagination>
            </el-main>

            <!-- 软件运行态log管理主页面 -->
            <el-main v-if="mainValue == 6">
                <!-- 查询功能 -->
                <el-form :inline="true" :model="softwareLogSearchForm" align="center" ref="softwareLogSearchForm" :rules="logRules">
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
                <el-table :data="softwareLogData" border ref="softwareLogData" key="softwareLogDataTable">
                    <el-table-column prop="companyName" label="公司名称" align="center"></el-table-column>
                    <el-table-column prop="username" label="用户名" align="center"></el-table-column>
                    <el-table-column prop="containerName" label="容器名称" align="center"></el-table-column>
                    <el-table-column prop="date" label="日期" align="center"></el-table-column>
                    <el-table-column prop="fileName" label="文件名" align="center"></el-table-column>
                    <el-table-column prop="url" label="url" align="center">
                        <template slot-scope="scope">
                            <el-link href="www.baidu.com" target="_blank">查看log</el-link>
                        </template>
                    </el-table-column>
                    <!-- 操作按钮 编辑&删除
                    <el-table-column label="操作">
                        <template slot-scope="scope">
                            <el-button size="mini" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
                            <el-button size="mini" type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
                        </template>
                    </el-table-column> -->
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
            userData: [],  // 用户数据
            companyData: [], // 租户数据
            imageManagementData: [], // 镜像管理数据
            containerInstanceData: [], // 容器实例数据
            softwareLogData: [], // 软件运行态log数据
            verifyUserList: [], // 待审批用户列表
            selectedUserList: [], // 选中的用户列表
            mainValue: 0, // 控制主页面切换
            currentPage: 1, // 当前页 刷新后默认显示第一页
            pageSize: 7, // 每一页显示的数据量
            totalUserData: 0, // 用户数据总条数
            totalCompanyData: 0, // 租户数据总条数
            totalLogData: 0, // 软件log数据总条数
            userDataChangeDiaVisible: false, // 修改用户信息表单显示与否
            createCompanyDiaVisible: false, // 创建租户信息表单显示与否
            companyDataChangeDiaVisible: false, // 修改租户信息表单显示与否

            // 用户搜索功能中的值
            userSearchForm: {  
                searchCompanyName: "",
                searchStatus: "",
            },

            // 租户搜索功能中的值
            companySearchForm: {  
                searchCompanyName: "",
            },

            // 镜像管理搜索功能中的值
            imageSearchForm: {  
                searchImageName: "",  // 镜像名称
                searchCreatImageUser: "",  // 创建该镜像的用户
            },

            // 容器实例管理搜索功能中的值
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

            // 更改用户信息时，选中的用户的值
            editUserDataForm:{
                username: "",
                name: "",
                phone: "",
            },

            // 创建租户时，填入的值
            createCompanyData:{
                name: "",
                cpu: "",
                memory: "",
            },

            // 更改租户信息时，选中的租户的值
            editCompanyDataForm:{
                companyName: "",
                cpu: "",
                memory: "",
            },

            userRules: {
                searchStatus: [{ required: false, trigger:"change"}],
                searchCompanyName: [{ required: false, trigger:"change"}],
            },
            companyRules: {
                searchCompanyName: [{ required: false, trigger:"change"}],
            },
            logRules: {
                searchCompanyName: [{ required: false, trigger:"change"}],
                searchUsername: [{ required: false, trigger:"change"}],
                searchContainerName: [{ required: false, trigger:"change"}],
            },
        }
    },
    methods:{
        // 重置表单数据
        resetForm(formName) {
            this.$refs[formName].resetFields();
        },

        // 查询用户数据
        searchUser:function(){
            this.currentPage = 1;
            if (this.userSearchForm.searchCompanyName == "") {
                    axios({
                        method: 'post',
                        url: 'api/main/list?' + "page=" + this.currentPage + "&size=" + this.pageSize,
                        headers: {
                            'content-Type' : "application/json",
                            "Authorization": `${sessionStorage.getItem('token')}`
                        },
                        data: {
                            "status": this.userSearchForm.searchStatus,
                            // "companyName": this.userSearchForm.searchCompanyName,
                        }
                    }).then((result) => {
                        console.log(result)
                        this.userData = result.data.records
                        this.totalUserData = result.data.total // 获取总条数
                    }).catch(error => {
                        this.handleError(error)
                    });
            }
            else {
                axios({
                        method: 'post',
                        url: 'api/main/list?' + "page=" + this.currentPage + "&size=" + this.pageSize,
                        headers: {
                            'content-Type' : "application/json",
                            "Authorization": `${sessionStorage.getItem('token')}`
                        },
                        data: {
                            "status": this.userSearchForm.searchStatus,
                            "companyName": this.userSearchForm.searchCompanyName,
                        }
                    }).then((result) => {
                        console.log(result)
                        this.userData = result.data.records
                        this.totalUserData = result.data.total // 获取总条数
                    }).catch(error => {
                        this.handleError(error)
                    });
            }

        },

        // 取消查询，显示所有用户数据
        cancleSearchUser:function(){
            this.currentPage = 1;
            this.resetForm('userSearchForm');
            console.log(this.userSearchForm);
            axios({
                method: 'post',
                url: 'api/main/list?' + "page=" + this.currentPage + "&size=" + this.pageSize,
                headers: {
                    'content-Type' : "application/json",
                    "Authorization": `${sessionStorage.getItem('token')}`
                },
                data: {
                    "status": "",
                }
            }).then((result) => {
                console.log(result)
                this.userData = result.data.records
                this.totalUserData = result.data.total // 获取总条数
            }).catch(error => {
                this.handleError(error)
            });
        },

        // 查询租户
        searchTenant:function(){
            axios({
                method: 'post',
                url: 'api/company/list?' + "page=" + this.currentPage + "&size=" + this.pageSize,
                headers: {
                    'content-Type' : "application/json",
                    "Authorization": `${sessionStorage.getItem('token')}`
                },
                data: {
                    "name": this.companySearchForm.searchCompanyName,
                }
            }).then((result) => {
                console.log(result)
                this.companyData = result.data.records
                this.totalCompanyData = result.data.total // 获取总条数
            }).catch(error => {
                this.handleError(error)
            });
        },
        // 取消查询，显示所有租户数据
        cancelSearchTenant:function(){
            this.currentPage = 1;
            this.resetForm('companySearchForm');
            axios({
                method: 'post',
                url: 'api/company/list?' + "page=" + this.currentPage + "&size=" + this.pageSize,
                headers: {
                    'content-Type' : "application/json",
                    "Authorization": `${sessionStorage.getItem('token')}`
                },
                data: {
                    "status": "",
                }
            }).then((result) => {
                console.log(result)
                this.companyData = result.data.records
                this.totalCompanyData = result.data.total // 获取总条数
            }).catch(error => {
                this.handleError(error)
            });
        },
        // 查询镜像
        searchImage:function(){

        },
        // 取消查询，显示所有镜像数据
        cancelSearchImage:function(){

        },
        // 查询容器实例
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
                    "Authorization": `${sessionStorage.getItem('token')}`
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
            this.currentPage = 1;
            this.resetForm("softwareLogSearchForm");
            axios({
                method: 'post',
                url: 'api/log/getList?' + "page=" + this.currentPage + "&size=" + this.pageSize,
                headers: {
                    'content-Type' : "application/json",
                    "Authorization": `${sessionStorage.getItem('token')}`
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

        // 编辑用户数据
        editUserData:function(index, row){  
            console.log(index, row);
            this.userDataChangeDiaVisible = true; // 显示表单
            this.editUserDataForm.username = row.username;
            this.editUserDataForm.name = row.name;
            this.editUserDataForm.phone = row.phone;
        },
        // 更改用户数据
        changeUserData:function(){
            this.userDataChangeDiaVisible = false;
            this.$message.success("编辑成功！");
            // axios({
            //     method: 'post',
            //     url: 'api/main/update',
            //     headers: {
            //         'content-Type' : "application/json",
            //         "Authorization": `${sessionStorage.getItem('token')}`
            //     },
            //     data: {
            //         "username": this.editUserDataForm.username,
            //         "name": this.editUserDataForm.name,
            //         "phone": this.editUserDataForm.phone,
            //     }
            // }).then((result) => {
            //     console.log(result)
            // }).catch(error => {
            //     this.handleError(error)
            // });

        },
        // 编辑租户数据
        editCompanyData:function(index, row){
            console.log(index, row);
            this.companyDataChangeDiaVisible = true; // 显示表单
            this.editCompanyDataForm.companyName = row.name;
            this.editCompanyDataForm.cpu = row.cpu;
            this.editCompanyDataForm.memory = row.memory;
        },
        // 更改租户数据
        changeCompanyData:function(){
            this.companyDataChangeDiaVisible = false;
            this.$message.success("编辑成功！");
        },
        // 编辑数据
        handleEdit:function(index, row){  
            console.log(index, row)
            
        },
        // 删除数据
        handleDelete:function(index, row){ 
            console.log(index, row)
        },
        //获取选中项
        handleSelectionChange(val) {
            this.selectedUserList = val.map(row => ({
            username: row.username,
            }));
        },

        // 用户审批页面
        changeMainTo1:function(){
            this.mainValue = 1;
            this.currentPage = 1;
            // 获取待审批用户信息
            axios({
                method: 'post',
                url: 'api/main/list',
                headers: {
                    'content-Type' : "application/json",
                    "Authorization": `${sessionStorage.getItem('token')}`
                },
                data: {
                    "status": 0,
                }
            }).then((result) => {
                console.log(result)
                this.verifyUserList = result.data.records
            }).catch(error => {
                this.handleError(error)
            });
        },

        // 用户管理页面
        changeMainTo2:function(){
            this.mainValue = 2;
            this.currentPage = 1;
            // 获得所有用户信息
            axios({
                method: 'post',
                url: 'api/main/list?' + "page=" + this.currentPage + "&size=" + this.pageSize,
                headers: {
                    'content-Type' : "application/json",
                    "Authorization": `${sessionStorage.getItem('token')}`
                },
                data: {
                    "status": "",
                }
            }).then((result) => {
                console.log(result)
                this.userData = result.data.records
                this.totalUserData = result.data.total // 获取总条数
            }).catch(error => {
                this.handleError(error)
            });
        },
        // 租户管理页面
        changeMainTo3:function(){
            this.mainValue = 3;
            this.currentPage = 1;
            // 获得所有租户信息
            axios({
                method: 'post',
                url: 'api/company/list?' + "page=" + this.currentPage + "&size=" + this.pageSize,
                headers: {
                    'content-Type' : "application/json",
                    "Authorization": `${sessionStorage.getItem('token')}`
                },
                data: {
                    "status": "",
                }
            }).then((result) => {
                console.log(result)
                this.companyData = result.data.records
                this.totalCompanyData = result.data.total // 获取总条数
            }).catch(error => {
                this.handleError(error)
            });
        },
        // 镜像管理页面
        changeMainTo4:function(){
            this.mainValue = 4;
        },
        // 容器实例管理页面
        changeMainTo5:function(){
            this.mainValue = 5;
        },
        // 软件运行态log页面
        changeMainTo6:function(){
            this.mainValue = 6;
            this.currentPage = 1;
            // 获得软件log信息
            axios({
                method: 'post',
                url: 'api/log/getList?' + "page=" + this.currentPage + "&size=" + this.pageSize,
                headers: {
                    'content-Type' : "application/json",
                    "Authorization": `${sessionStorage.getItem('token')}`
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

        // 创建租户
        createCompany:function(){
            if (this.createCompanyData.cpu == '' || this.createCompanyData.memory == '' || this.createCompanyData.name == '') {
                this.$message.error("存在空白项，请检查！");
            }
            else {
                // 调用接口创建租户
                axios({
                    method: 'post',
                    url: 'api/company/create',
                    headers: {
                        'content-Type' : "application/json",
                        "Authorization": `${sessionStorage.getItem('token')}`
                    },
                    data: {
                        "name": this.createCompanyData.name,
                        "cpu": this.createCompanyData.cpu,
                        "memory": this.createCompanyData.memory,
                    }
                }).then((result) => {
                    console.log(result)
                }).catch(error => {
                    this.handleError(error)
                });
                // 关闭窗口
                this.createCompanyDiaVisible = false;
                // 弹出提示信息
                this.$message.success("创建成功！");
            }
        },

        // 创建镜像
        createImage:function(){

        },

        // 创建容器实例
        createContainer:function(){

        },

        // 用户审批通过
        approveUser:function(){
            if (this.selectedUserList == '') {
                this.$message("未选择用户！");
            }
            else {
                // 通过
                axios({
                    method: 'post',
                    url: 'api/main/review?opt=1',
                    headers: {
                        "Authorization": `${sessionStorage.getItem('token')}`
                    },
                    data: this.selectedUserList,
                }).then((result) => {
                    console.log(result)
                }).catch(error => {
                    this.handleError(error)
                });
                // 获取待审批用户信息
                axios({
                    method: 'post',
                    url: 'api/main/list',
                    headers: {
                        'content-Type' : "application/json",
                        "Authorization": `${sessionStorage.getItem('token')}`
                    },
                    data: {
                        "status": 0,
                    }
                }).then((result) => {
                    console.log(result)
                    this.verifyUserList = result.data.records
                }).catch(error => {
                    this.handleError(error)
                });
                // 弹窗提示
                this.$message.success("审批成功！");
            }
        },

        // 用户审批不通过
        rejectUser:function(){
            if (this.selectedUserList == '') {
                this.$message("未选择用户！");
            }
            else {
                // 不通过
                axios({
                    method: 'post',
                    url: 'api/main/review?opt=0',
                    headers: {
                        "Authorization": `${sessionStorage.getItem('token')}`
                    },
                    data: this.selectedUserList,
                }).then((result) => {
                    console.log(result)
                }).catch(error => {
                    this.handleError(error)
                });
                // 获取待审批用户信息
                axios({
                    method: 'post',
                    url: 'api/main/list',
                    headers: {
                        'content-Type' : "application/json",
                        "Authorization": `${sessionStorage.getItem('token')}`
                    },
                    data: {
                        "status": 0,
                    }
                }).then((result) => {
                    console.log(result)
                    this.verifyUserList = result.data.records
                }).catch(error => {
                    this.handleError(error)
                });
                // 弹窗提示
                this.$message.success("审批成功！");
            }
        },

        //点击按钮切换页面
        handleCurrentChange(currentPage) {
            this.currentPage = currentPage; //每次点击分页按钮，当前页发生变化
            // 如果当前页面是用户管理页面
            if(this.mainValue == 2) {
                if (this.userSearchForm.searchCompanyName == "") {
                    axios({
                            method: 'post',
                            url: 'api/main/list?' + "page=" + this.currentPage + "&size=" + this.pageSize,
                            headers: {
                                'content-Type' : "application/json",
                                "Authorization": `${sessionStorage.getItem('token')}`
                            },
                            data: {
                                "status": this.userSearchForm.searchStatus,
                                // "companyName": this.userSearchForm.searchCompanyName,
                            }
                        }).then((result) => {
                            console.log(result)
                            this.userData = result.data.records
                            this.totalUserData = result.data.total // 获取总条数
                        }).catch(error => {
                            this.handleError(error)
                        });
                }
                else {
                    axios({
                            method: 'post',
                            url: 'api/main/list?' + "page=" + this.currentPage + "&size=" + this.pageSize,
                            headers: {
                                'content-Type' : "application/json",
                                "Authorization": `${sessionStorage.getItem('token')}`
                            },
                            data: {
                                "status": this.userSearchForm.searchStatus,
                                "companyName": this.userSearchForm.searchCompanyName,
                            }
                        }).then((result) => {
                            console.log(result)
                            this.userData = result.data.records
                            this.totalUserData = result.data.total // 获取总条数
                        }).catch(error => {
                            this.handleError(error)
                        });
                }
            }
            // 如果当前页面是租户管理页面
            if(this.mainValue == 3) {
                axios({
                    method: 'post',
                    url: 'api/company/list?' + "page=" + this.currentPage + "&size=" + this.pageSize,
                    headers: {
                        'content-Type' : "application/json",
                        "Authorization": `${sessionStorage.getItem('token')}`
                    },
                    data: {
                        "name": this.companySearchForm.searchCompanyName,
                    }
                }).then((result) => {
                    console.log(result)
                    this.companyData = result.data.records
                    this.totalCompanyData = result.data.total // 获取总条数
                }).catch(error => {
                    this.handleError(error)
                });
            }
            // 如果当前页面是软件log管理页面
            if(this.mainValue == 6) {
                axios({
                    method: 'post',
                    url: 'api/log/getList?' + "page=" + this.currentPage + "&size=" + this.pageSize,
                    headers: {
                        'content-Type' : "application/json",
                        "Authorization": `${sessionStorage.getItem('token')}`
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

        // 格式化用户状态
        formatUserStatus(row, column, cellValue) {
            switch (cellValue) {
                case 0:
                    return '待审批';
                case 1:
                    return '审批通过';
                case 2:
                    return '审批不通过';
                case 3:
                    return '已删除';
                case 4:
                    return '异常';
                default:
                    return '未知状态';  
            }
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
