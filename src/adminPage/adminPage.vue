<template>
    <div>
        <el-container style="height: 700px; border: 1px solid #eee ">
        <el-header style="font-size: 37px; background-color: rgb(199, 0, 25); color: white;">管理员管理系统</el-header>
        <el-container>
            <el-aside width="200px" style="background-color: rgb(238, 241, 246)">
                <el-menu :default-openeds="['1','2']">
                    <el-submenu index="1">
                        <template slot="title"><i class="el-icon-thumb"></i>审批管理</template>
                        <el-menu-item-group>
                            <el-menu-item index="1-1" @click="changeMainTo1">用户审批</el-menu-item>
                            <el-menu-item index="1-2" @click="changeMainTo2">镜像审批</el-menu-item>
                        </el-menu-item-group>
                    </el-submenu>
                    <el-submenu index="2">
                        <template slot="title"><i class="el-icon-s-order"></i>信息管理</template>
                        <el-menu-item-group>
                            <el-menu-item index="2-1" @click="changeMainTo3">用户管理</el-menu-item>
                            <el-menu-item index="2-2" @click="changeMainTo4">租户管理</el-menu-item>
                            <el-menu-item index="2-3" @click="changeMainTo5">镜像管理</el-menu-item>
                            <el-menu-item index="2-4" @click="changeMainTo6">容器实例管理</el-menu-item>
                            <el-menu-item index="2-5" @click="changeMainTo7">软件运行态log管理</el-menu-item>
                        </el-menu-item-group>
                    </el-submenu>
                </el-menu>
            </el-aside>
            <!-- 用户审批主页面 -->
                <el-main v-if="mainValue == 1">
                    <!-- 待审批用户表格内容 -->
                    <el-table :data="verifyUserList" border @selection-change="userVerifySelectionChange" key="verifyUserTable" ref="verifyUserList" style="width: 1200px; margin-left: 30px">
                        <el-table-column prop="username" label="用户名" align="center"></el-table-column>
                        <el-table-column prop="name" label="姓名" align="center"></el-table-column>
                        <el-table-column prop="phone" label="电话" align="center"></el-table-column>
                        <el-table-column prop="companyName" label="公司" align="center"></el-table-column>
                        <el-table-column prop="status" label="状态" align="center" :formatter="formatStatus"></el-table-column>
                        <el-table-column type="selection" align="center" width="55"></el-table-column>
                    </el-table>
                    <!-- 通过 & 不通过 按钮 -->
                     <el-row style="margin-left: 1050px; margin-top: 20px">
                        <el-button type="danger" @click="rejectUser">不通过</el-button>
                        <el-button type="primary" @click="approveUser" style="margin-left: 15px;">通过</el-button>
                    </el-row>

                </el-main>

            <!-- 镜像审批主页面 -->
            <el-main v-if="mainValue == 2">
                    <!-- 待审批用户表格内容 -->
                    <el-table :data="verifyImageList" border @selection-change="imageVerifySelectionChange" key="verifyImageTable" ref="verifyImageList" style="width: 1200px; margin-left: 30px">
                        <el-table-column prop="name" label="镜像名称" align="center"></el-table-column>
                        <el-table-column prop="companyName" label="租户名称" align="center"></el-table-column>
                        <el-table-column prop="username" label="用户名称" align="center"></el-table-column>
                        <el-table-column prop="tags" label="标签" align="center"></el-table-column>
                        <el-table-column prop="creationTime" label="创建时间" align="center">
                            <template #default="scope">
                                {{ formatTime(scope.row.creationTime) }}
                            </template>
                        </el-table-column>
                        <el-table-column prop="projectName" label="项目名称" align="center"></el-table-column>
                        <el-table-column prop="status" label="状态" align="center">{{ "待审批" }}</el-table-column>
                        <el-table-column type="selection" align="center" width="55"></el-table-column>
                    </el-table>
                    <!-- 通过 & 不通过 按钮 -->
                     <el-row style="margin-left: 1050px; margin-top: 20px">
                        <el-button type="danger" @click="rejectImage">不通过</el-button>
                        <el-button type="primary" @click="approveImage" style="margin-left: 15px;">通过</el-button>
                    </el-row>

                </el-main>
            
            <!-- 用户管理主页面 -->
                <el-main v-if="mainValue == 3">
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
                        <el-table-column prop="createTime" label="创建时间" align="center">
                            <template #default="scope">
                                {{ formatTime(scope.row.createTime) }}
                            </template>
                        </el-table-column>
                        <el-table-column prop="deleteTime" label="删除时间" align="center">
                            <template #default="scope">
                                {{ formatTime(scope.row.deleteTime) }}
                            </template>
                        </el-table-column>
                        <el-table-column prop="status" label="状态" :formatter="formatStatus" align="center"></el-table-column>
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
                <el-main v-if="mainValue == 4">
                    <!-- 查询功能 -->
                    <el-form :inline="true" :model="companySearchForm" align="center" ref="companySearchForm" :rules="companyRules">
                        <el-form-item label="公司名称" style="margin-left: 30px;">
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
            <el-main v-if="mainValue == 5">
                <!-- 查询功能 -->
                <el-form :inline="true" :model="imageSearchForm" align="center" ref="imageSearchForm" :rules="imageRules">
                    <el-form-item label="镜像名称" style="margin-left: 30px;">
                        <el-input v-model="imageSearchForm.searchImageName" placeholder="请输入内容"></el-input>
                    </el-form-item>
                    <el-form-item label="公司Id" style="margin-left: 30px;">
                        <el-input v-model="imageSearchForm.searchCompanyId" placeholder="请输入内容"></el-input>
                    </el-form-item>
                    <el-form-item label="镜像状态" style="margin-left: 30px;">
                            <el-select v-model="imageSearchForm.searchStatus" placeholder="状态">
                                <el-option label="待审批" value="0"></el-option>
                                <el-option label="审批通过" value="1"></el-option>
                                <el-option label="审批不通过" value="2"></el-option>
                                <el-option label="已删除" value="3"></el-option>
                                <el-option label="异常" value="4"></el-option>
                            </el-select>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="searchImage">查询</el-button>
                        <el-button type="danger" @click="cancelSearchImage">取消</el-button>
                    </el-form-item>
                    <!-- 创建镜像和删除镜像 -->
                    <el-form-item style="margin-left: 20px;">
                        <!-- <el-button type="primary" @click="createImage">上传</el-button> -->
                        <el-button type="danger" @click="deleteImage">删除</el-button>
                    </el-form-item>
                </el-form>
                <!-- 内容表格 -->
                <el-table :data="imageData" border @selection-change="imageSelectionChange" key="imageDataTable">
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
                            <el-button size="mini" type="danger" @click="createContainer(scope.$index, scope.row)">创建容器实例</el-button>
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

            <!-- 容器实例管理主页面 -->
            <el-main v-if="mainValue == 6">
                <!-- 查询功能 -->
                <el-form :inline="true" :model="containerSearchForm" align="center">
                    <el-form-item label="命名空间" style="margin-left: 30px;">
                        <el-input v-model="containerSearchForm.namespace" placeholder="请输入内容"></el-input>
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
                <el-table :data="containerData" border key="containerDataTable" @selection-change="containerSelectionChange">
                    <el-table-column prop="podName" label="pod名称" align="center"></el-table-column>
                    <el-table-column prop="namespace" label="命名空间" align="center"></el-table-column>
                    <el-table-column prop="containerName" label="容器实例名称" align="center"></el-table-column>
                    <el-table-column prop="imageName" label="镜像名称" align="center"></el-table-column>
                    <el-table-column prop="createTime" label="创建时间" align="center">
                        <template #default="scope">
                            {{ formatTime(scope.row.createTime) }}
                        </template>
                    </el-table-column>
                    <el-table-column type="selection" align="center" width="55"></el-table-column>
                </el-table>
                <br>

                <!-- 分页条 -->
                <el-pagination
                    background
                    layout="prev, pager, next, jumper"
                    :total="this.totalContainerData"
                    @current-change="handleCurrentChange"
                    :current-page="currentPage"
                    :page-size="pageSize">
                </el-pagination>
            </el-main>

            <!-- 软件运行态log管理主页面 -->
            <el-main v-if="mainValue == 7">
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
            imageData: [], // 镜像管理数据
            containerData: [], // 容器实例数据
            softwareLogData: [], // 软件运行态log数据
            verifyUserList: [], // 待审批用户列表
            verifyImageList: [], // 待审批镜像列表
            selectedUserList: [], // 选中的用户列表
            selectedImageList: [], // 选中的镜像列表
            selectedContainerList: [], // 选中的容器实例列表
            totalUserData: 0, // 用户数据总条数
            totalCompanyData: 0, // 租户数据总条数
            totalContainerData: 0, // 容器实例数据总条数
            totalImageData: 0, // 镜像数据总条数
            totalLogData: 0, // 软件log数据总条数
            mainValue: 0, // 控制主页面切换
            currentPage: 1, // 当前页 刷新后默认显示第一页
            pageSize: 7, // 每一页显示的数据量
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
                searchCompanyId: "",  // 公司ID
                searchStatus: "", // 镜像状态
            },

            // 容器实例管理搜索功能中的值
            containerSearchForm: {  
                namespace: "", // 命名空间
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

            // 用户信息table rules
            userRules: {
                searchStatus: [{ required: false, trigger:"change"}],
                searchCompanyName: [{ required: false, trigger:"change"}],
            },
            // 租户信息table rules
            companyRules: {
                searchCompanyName: [{ required: false, trigger:"change"}],
            },
            // log信息table rules
            logRules: {
                searchCompanyName: [{ required: false, trigger:"change"}],
                searchUsername: [{ required: false, trigger:"change"}],
                searchContainerName: [{ required: false, trigger:"change"}],
            },
            // 镜像信息table rules
            imageRules:{
                searchImageName: [{ required: false, trigger:"change"}],
                searchCompanyId: [{ required: false, trigger:"change"}],
                searchStatus: [{ required: false, trigger:"change"}],
            }
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
                            "Authorization": `${sessionStorage.getItem('adminToken')}`
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
                            "Authorization": `${sessionStorage.getItem('adminToken')}`
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
                    "Authorization": `${sessionStorage.getItem('adminToken')}`
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
            this.currentPage = 1;
            axios({
                method: 'post',
                url: 'api/company/list?' + "page=" + this.currentPage + "&size=" + this.pageSize,
                headers: {
                    'content-Type' : "application/json",
                    "Authorization": `${sessionStorage.getItem('adminToken')}`
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
                    "Authorization": `${sessionStorage.getItem('adminToken')}`
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
            this.currentPage = 1;
            axios({
                method: 'post',
                url: 'api/image/list?' + "page=" + this.currentPage + "&size=" + this.pageSize,
                headers: {
                    'content-Type' : "application/json",
                    "Authorization": `${sessionStorage.getItem('adminToken')}`
                },
                data: {
                    "name": this.imageSearchForm.searchImageName,
                    // "companyId": this.imageSearchForm.searchCompanyId,
                    "status": this.imageSearchForm.searchStatus,
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
                    "Authorization": `${sessionStorage.getItem('adminToken')}`
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

        // 查询容器实例
        searchContainer:function(){
            this.currentPage = 1;
            // 调用接口 通过namespace查询容器实例
            axios({
                method: 'get',
                url: 'api/container/list?' + "namespace=" + this.containerSearchForm.namespace + "&page=" + this.currentPage + "&size=" + this.pageSize,
                headers: {
                    'content-Type' : "application/json",
                    "Authorization": `${sessionStorage.getItem('adminToken')}`
                },
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
            axios({
                method: 'get',
                url: 'api/container/list?' + "namespace=default" + "&page=" + this.currentPage + "&size=" + this.pageSize,
                headers: {
                    'content-Type' : "application/json",
                    "Authorization": `${sessionStorage.getItem('adminToken')}`
                },
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
                        "Authorization": `${sessionStorage.getItem('adminToken')}`
                    },
                    data: this.selectedContainerList,
                }).then((result) => {
                    console.log(result)
                    this.$message.success("删除成功！")
                    // 显示删除后的所有容器实例数据
                    this.currentPage = 1;
                    axios({
                        method: 'get',
                        url: 'api/container/list?' + "namespace=default" + "&page=" + this.currentPage + "&size=" + this.pageSize,
                        headers: {
                            'content-Type' : "application/json",
                            "Authorization": `${sessionStorage.getItem('adminToken')}`
                        },
                        // data: {

                        // }
                    }).then((result) => {
                        console.log(result)
                        this.containerData = result.data.data.records
                        this.totalContainerData = result.data.data.total // 获取总条数
                    }).catch(error => {
                        this.handleError(error)
                    });
                }).catch(error => {
                    this.handleError(error)
                });
            }
        },

        // 查询软件运行态log
        searchSoftwareLog:function(){
            axios({
                method: 'post',
                url: 'api/log/getList?' + "page=" + this.currentPage + "&size=" + this.pageSize,
                headers: {
                    'content-Type' : "application/json",
                    "Authorization": `${sessionStorage.getItem('adminToken')}`
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
                    "Authorization": `${sessionStorage.getItem('adminToken')}`
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
            if (this.editUserDataForm.name == '' || this.editUserDataForm.phone == '' || this.editUserDataForm.username == '') {
                this.$message.error("存在空白项，请检查！");
            }
            else {
                this.userDataChangeDiaVisible = false;
                this.$message.success("编辑成功！");
            }

            // axios({
            //     method: 'post',
            //     url: 'api/main/update',
            //     headers: {
            //         'content-Type' : "application/json",
            //         "Authorization": `${sessionStorage.getItem('adminToken')}`
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
            if (this.editCompanyDataForm.companyName == '' || this.editCompanyDataForm.cpu == '' || this.editCompanyDataForm.memory == '') {
                this.$message.error("存在空白项，请检查！");
            }
            else {
                this.companyDataChangeDiaVisible = false;
                this.$message.success("编辑成功！");
            }
            
        },
        // 编辑数据
        handleEdit:function(index, row){  
            console.log(index, row)
            
        },
        // 删除数据
        handleDelete:function(index, row){ 
            console.log(index, row)
        },

        // 删除镜像
        deleteImage:function(){
            console.log(this.selectedImageList)
            // 调用delete接口删除
            axios({
                method: 'post',
                url: 'api/image/delete',
                headers: {
                    "Authorization": `${sessionStorage.getItem('adminToken')}`
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
                        "Authorization": `${sessionStorage.getItem('adminToken')}`
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

        // // 推送镜像
        // pushImage:function(index, row){
        //     // 获取当前行的三个参数
        //     const projectName = row.projectName;
        //     const imageName = row.name;
        //     const tag = row.tags;
        //     // 调用image/push接口推送镜像
        //     axios({
        //         method: 'post',
        //         url: 'api/image/push',
        //         headers: {
        //             'content-Type' : "application/json",
        //             "Authorization": `${sessionStorage.getItem('adminToken')}`
        //         },
        //         data: {
        //             "projectName": projectName,
        //             "imageName": imageName,
        //             "tag": tag,
        //         }
        //     }).then((result) => {
        //         console.log(result)
        //         this.$message.success("镜像推送成功！")
        //         // 推送后，获得所有镜像信息
        //         this.currentPage = 1;
        //         axios({
        //             method: 'post',
        //             url: 'api/image/list?' + "page=" + this.currentPage + "&size=" + this.pageSize,
        //             headers: {
        //                 'content-Type' : "application/json",
        //                 "Authorization": `${sessionStorage.getItem('adminToken')}`
        //             },
        //             data: {
        //                 "name": "",
        //                 "companyId": "",
        //                 "status": "",
        //             }
        //         }).then((result) => {
        //             console.log(result)
        //             this.imageData = result.data.data.records
        //             this.totalImageData = result.data.data.total // 获取总条数
        //         }).catch(error => {
        //             this.handleError(error)
        //         });
        //     }).catch(error => {
        //         this.handleError(error)
        //     });
        // },

        // 获取用户审批中的选中项
        userVerifySelectionChange(val) {
            this.selectedUserList = val.map(row => ({
                username: row.username,
            }));
        },

        // 获取镜像审批中的选中项
        imageVerifySelectionChange(val) {
            this.selectedImageList = val.map(row => ({
                id: row.id,
                approve: 2
            }));
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

        // 用户审批页面
        changeMainTo1:function(){
            this.mainValue = 1;
            this.currentPage = 1;
            // 获取所有待审批用户信息
            axios({
                method: 'post',
                url: 'api/main/list',
                headers: {
                    'content-Type' : "application/json",
                    "Authorization": `${sessionStorage.getItem('adminToken')}`
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

        // 镜像审批页面
        changeMainTo2:function(){
            this.mainValue = 2;
            this.currentPage = 1;
            // 获得所有待审批镜像信息
            axios({
                method: 'post',
                url: 'api/image/list?' + "page=" + this.currentPage + "&size=" + this.pageSize,
                headers: {
                    'content-Type' : "application/json",
                    "Authorization": `${sessionStorage.getItem('adminToken')}`
                },
                data: {
                    "status": 0,
                }
            }).then((result) => {
                console.log(result)
                this.verifyImageList = result.data.data.records
            }).catch(error => {
                this.handleError(error)
            });
        },

        // 用户管理页面
        changeMainTo3:function(){
            this.mainValue = 3;
            this.currentPage = 1;
            // 获得所有用户信息
            axios({
                method: 'post',
                url: 'api/main/list?' + "page=" + this.currentPage + "&size=" + this.pageSize,
                headers: {
                    'content-Type' : "application/json",
                    "Authorization": `${sessionStorage.getItem('adminToken')}`
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
        changeMainTo4:function(){
            this.mainValue = 4;
            this.currentPage = 1;
            // 获得所有租户信息
            axios({
                method: 'post',
                url: 'api/company/list?' + "page=" + this.currentPage + "&size=" + this.pageSize,
                headers: {
                    'content-Type' : "application/json",
                    "Authorization": `${sessionStorage.getItem('adminToken')}`
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
        changeMainTo5:function(){
            this.mainValue = 5;
            this.currentPage = 1;
            // 获得所有镜像信息
            axios({
                method: 'post',
                url: 'api/image/list?' + "page=" + this.currentPage + "&size=" + this.pageSize,
                headers: {
                    'content-Type' : "application/json",
                    "Authorization": `${sessionStorage.getItem('adminToken')}`
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

        // 容器实例管理页面
        changeMainTo6:function(){
            this.mainValue = 6
            this.currentPage = 1
            // 获取所有容器实例信息
            axios({
                method: 'get',
                url: 'api/container/list?' + "namespace=default" + "&page=" + this.currentPage + "&size=" + this.pageSize,
                headers: {
                    'content-Type' : "application/json",
                    "Authorization": `${sessionStorage.getItem('adminToken')}`
                },
                // data: {

                // }
            }).then((result) => {
                console.log(result)
                this.containerData = result.data.data.records
                this.totalContainerData = result.data.data.total // 获取总条数
            }).catch(error => {
                this.handleError(error)
            });
        },

        // 软件运行态log页面
        changeMainTo7:function(){
            this.mainValue = 7;
            this.currentPage = 1;
            // 获得软件log信息
            axios({
                method: 'post',
                url: 'api/log/getList?' + "page=" + this.currentPage + "&size=" + this.pageSize,
                headers: {
                    'content-Type' : "application/json",
                    "Authorization": `${sessionStorage.getItem('adminToken')}`
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
                        "Authorization": `${sessionStorage.getItem('adminToken')}`
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

        // // 创建镜像
        // createImage:function(){

        // },

        // 创建容器实例
        createContainer:function(index, row){
            const name = row.name
            const tag = row.tags
            const image = name + ":" + tag
            // 调用接口创建容器实例
            axios({
                    method: 'post',
                    url: 'api/container/create',
                    headers: {
                        "Authorization": `${sessionStorage.getItem('adminToken')}`
                    },
                    data: {
                        "image": image,
                    },
                }).then((result) => {
                    console.log(result)
                    this.$message.success("容器实例创建成功！")
                }).catch(error => {
                    this.handleError(error)
                });
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
                        "Authorization": `${sessionStorage.getItem('adminToken')}`
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
                        "Authorization": `${sessionStorage.getItem('adminToken')}`
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
                        "Authorization": `${sessionStorage.getItem('adminToken')}`
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
                        "Authorization": `${sessionStorage.getItem('adminToken')}`
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

        // 镜像审批通过
        approveImage:function(){
            if (this.selectedImageList == '') {
                this.$message("未选择镜像！");
            }
            else {
                // 将approve赋值为1 表示通过
                this.selectedImageList.forEach(item => {
                    item.approve = 1;
                });
                // 通过
                axios({
                    method: 'post',
                    url: 'api/image/review',
                    headers: {
                        "Authorization": `${sessionStorage.getItem('adminToken')}`
                    },
                    data: this.selectedImageList,
                }).then((result) => {
                    console.log(result)
                }).catch(error => {
                    this.handleError(error)
                });
                // 获取待审批用户信息
                this.currentPage = 1
                axios({
                    method: 'post',
                    url: 'api/image/list?' + "page=" + this.currentPage + "&size=" + this.pageSize,
                    headers: {
                        'content-Type' : "application/json",
                        "Authorization": `${sessionStorage.getItem('adminToken')}`
                    },
                    data: {
                        "status": 0,
                    }
                }).then((result) => {
                    console.log(result)
                    this.verifyImageList = result.data.data.records
                }).catch(error => {
                    this.handleError(error)
                });
                // 弹窗提示
                this.$message.success("审批成功！");
            }
            
            console.log("选中的镜像：", this.selectedImageList)
        },

        // 镜像审批不通过
        rejectImage:function(){
            if (this.selectedImageList == '') {
                this.$message("未选择用户！");
            }
            else {
                // 将approve赋值为0 表示不通过
                this.selectedImageList.forEach(item => {
                    item.approve = 0;
                });
                // 不通过
                axios({
                    method: 'post',
                    url: 'api/image/review',
                    headers: {
                        "Authorization": `${sessionStorage.getItem('adminToken')}`
                    },
                    data: this.selectedImageList,
                }).then((result) => {
                    console.log(result)
                }).catch(error => {
                    this.handleError(error)
                });
                // 获取待审批用户信息
                this.currentPage = 1
                axios({
                    method: 'post',
                    url: 'api/image/list?' + "page=" + this.currentPage + "&size=" + this.pageSize,
                    headers: {
                        'content-Type' : "application/json",
                        "Authorization": `${sessionStorage.getItem('adminToken')}`
                    },
                    data: {
                        "status": 0,
                    }
                }).then((result) => {
                    console.log(result)
                    this.verifyImageList = result.data.data.records
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
            if(this.mainValue == 3) {
                if (this.userSearchForm.searchCompanyName == "") {
                    axios({
                            method: 'post',
                            url: 'api/main/list?' + "page=" + this.currentPage + "&size=" + this.pageSize,
                            headers: {
                                'content-Type' : "application/json",
                                "Authorization": `${sessionStorage.getItem('adminToken')}`
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
                                "Authorization": `${sessionStorage.getItem('adminToken')}`
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
            if(this.mainValue == 4) {
                axios({
                    method: 'post',
                    url: 'api/company/list?' + "page=" + this.currentPage + "&size=" + this.pageSize,
                    headers: {
                        'content-Type' : "application/json",
                        "Authorization": `${sessionStorage.getItem('adminToken')}`
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
            // 如果当前页面是镜像页面
            if(this.mainValue == 5) {
                axios({
                    method: 'post',
                    url: 'api/image/list?' + "page=" + this.currentPage + "&size=" + this.pageSize,
                    headers: {
                        'content-Type' : "application/json",
                        "Authorization": `${sessionStorage.getItem('adminToken')}`
                    },
                    data: {
                        "name": this.imageSearchForm.searchImageName,
                        "companyId": this.imageSearchForm.searchCompanyId,
                        "status": this.imageSearchForm.searchStatus,
                    }
                }).then((result) => {
                    console.log(result)
                    this.imageData = result.data.data.records
                    this.totalImageData = result.data.data.total // 获取总条数
                }).catch(error => {
                    this.handleError(error)
                });
            }
            // 如果当前页面是容器实例管理页面
            if(this.mainValue == 6) {
                axios({
                    method: 'get',
                    url: 'api/container/list?' + "namespace=default" + "&page=" + this.currentPage + "&size=" + this.pageSize,
                    headers: {
                        'content-Type' : "application/json",
                        "Authorization": `${sessionStorage.getItem('adminToken')}`
                    },
                    // data: {

                    // }
                }).then((result) => {
                    console.log(result)
                    this.containerData = result.data.data.records
                    this.totalLogData = result.data.data.total // 获取总条数
                }).catch(error => {
                    this.handleError(error)
                });
            }


            // 如果当前页面是软件log管理页面
            if(this.mainValue == 7) {
                axios({
                    method: 'post',
                    url: 'api/log/getList?' + "page=" + this.currentPage + "&size=" + this.pageSize,
                    headers: {
                        'content-Type' : "application/json",
                        "Authorization": `${sessionStorage.getItem('adminToken')}`
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
        formatStatus(cellValue) {
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

        // 将时间中间的T换成空格
        formatTime(timeStr) {
            if (timeStr === null) {
                return 'NULL'; 
            }
            return timeStr.replace('T', '\n');
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
