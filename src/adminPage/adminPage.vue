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
                            <!-- <el-menu-item index="1-1" @click="changeMainTo1">用户审批</el-menu-item> -->
                            <el-menu-item index="1-2" @click="changeMainTo2">镜像审批</el-menu-item>
                        </el-menu-item-group>
                    </el-submenu>
                    <el-submenu index="2">
                        <template slot="title"><i class="el-icon-s-order"></i>信息管理</template>
                        <el-menu-item-group>
                            <el-menu-item index="2-1" @click="changeMainTo3">用户管理</el-menu-item>
                            <el-menu-item index="2-2" @click="changeMainTo4">组织机构管理</el-menu-item>
                            <el-menu-item index="2-3" @click="changeMainTo5">镜像管理</el-menu-item>
                            <el-menu-item index="2-4" @click="changeMainTo6">容器实例管理</el-menu-item>
                            <el-menu-item index="2-5" @click="changeMainTo7">历史日志管理</el-menu-item>
                            <!-- <el-menu-item index="2-5" @click="changeMainTo7">软件运行态log管理</el-menu-item> -->
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
                    <el-table-column prop="companyName" label="组织机构" align="center"></el-table-column>
                    <el-table-column prop="status" label="状态" align="center" :formatter="formatUserStatus"></el-table-column>
                    <el-table-column type="selection" align="center" width="55"></el-table-column>
                </el-table>
                <!-- 通过 & 不通过 按钮 -->
                    <el-row style="margin-left: 1050px; margin-top: 20px">
                    <el-button type="danger" @click="rejectUser">不通过</el-button>
                    <el-button type="primary" @click="approveUser" style="margin-left: 15px;">通过</el-button>
                </el-row>
                <!-- 分页条 -->
                <el-pagination
                    background
                    align="center"
                    :hide-on-single-page = true
                    layout="prev, pager, next, jumper"
                    :total="this.totalVerifyUserData"
                    @current-change="handleCurrentChange"
                    :current-page="currentPage"
                    :page-size="pageSize">
                </el-pagination>
                
            </el-main>

            <!-- 镜像审批主页面 -->
            <el-main v-if="mainValue == 2">
                    <!-- 待审批用户表格内容 -->
                    <el-table :data="verifyImageList" border @selection-change="imageVerifySelectionChange" key="verifyImageTable" ref="verifyImageList" style="width: 1200px; margin-left: 30px">
                        <el-table-column prop="name" label="镜像名称" align="center"></el-table-column>
                        <el-table-column prop="companyName" label="组织机构" align="center"></el-table-column>
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
                    <!-- 分页条 -->
                    <el-pagination
                        background
                        align="center"
                        :hide-on-single-page = true
                        layout="prev, pager, next, jumper"
                        :total="this.totalVerifyImageData"
                        @current-change="handleCurrentChange"
                        :current-page="currentPage"
                        :page-size="pageSize">
                    </el-pagination>

            </el-main>
            
            <!-- 用户管理主页面 -->
            <el-main v-if="mainValue == 3">
                <!-- 查询功能 -->
                <el-form :inline="true" :model="userSearchForm" align="center" ref="userSearchForm" :rules="userRules">
                    <!-- <el-form-item label="姓名">
                        <el-input v-model="userSearchForm.searchName" placeholder="姓名"></el-input>
                    </el-form-item> -->
                    <el-form-item label="组织机构" style="margin-left: 30px;" prop="searchCompanyName">
                        <el-select v-model="userSearchForm.searchCompanyName" placeholder="组织机构">
                            <el-option
                            v-for="item in companyOptions"
                            :key="item.id"
                            :label="item.name"
                            :value="item.name">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="状态" style="margin-left: 30px;" prop="searchStatus">
                        <el-select v-model="userSearchForm.searchStatus" placeholder="状态">
                            <el-option label="正常" value="0"></el-option>
                            <el-option label="已删除" value="1"></el-option>
                            <el-option label="异常" value="2"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="searchUser">查询</el-button>
                        <el-button type="danger" @click="cancleSearchUser">取消</el-button>
                        <el-button type="primary" @click="openCreateUserDia" style="margin-left: 40px">创建用户</el-button>
                        <!-- <el-button @click="controlPasswordColumn">{{ passwordTag }}</el-button> -->
                    </el-form-item>
                </el-form>
                <!-- 内容表格 -->
                <el-table :data="userData" border key="userDataTable" ref="userDataTable">
                    <el-table-column prop="username" label="用户名" align="center"></el-table-column>
                    <el-table-column label="密码" v-if="showPasswordColumn" align="center" ></el-table-column>
                    <el-table-column prop="phone" label="电话" align="center"></el-table-column>
                    <el-table-column prop="companyName" label="组织机构" align="center"></el-table-column>
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
                    <el-table-column prop="status" label="状态" :formatter="formatUserStatus" align="center"></el-table-column>
                    <!-- 操作按钮 修改用户密码 -->
                    <el-table-column label="操作" align="center">
                        <template slot-scope="scope">
                            <el-button type="danger" size="mini" @click="openChangeUserPasswordDia(scope.row)">修改密码</el-button>
                        </template>
                    </el-table-column>
                </el-table>
                <br>

                <!-- 创建用户dialog -->
                    <el-dialog title="创建用户" :visible.sync="createUserDiaVisible" width="400px">
                    <el-form
                        :model="createUserInfo"
                        status-icon
                        :rules="createUserRules"
                        ref="createUserInfo"
                        label-position="left"
                        label-width="80px"
                    >
                        <el-form-item label="用户名" prop="username">
                            <el-input v-model="createUserInfo.username"></el-input> 
                        </el-form-item>
                        <el-form-item label="密码" prop="password">
                            <el-input v-model="createUserInfo.password" type="password" @input="checkPasswordStrength" show-password autocomplete="off"></el-input>
                            <span>密码强度：<span :class="tipsColor">{{ strength }}</span></span>
                            <!-- <el-button @click="randomPassword" style="margin-left: 20px;">随机生成</el-button> -->
                        </el-form-item>
                        <el-form-item label="确认密码" prop="passConfirm">
                            <el-input v-model="createUserInfo.passConfirm" type="password" show-password autocomplete="off"></el-input>
                        </el-form-item>
                        <el-form-item label="手机号" prop="phone">
                            <el-input v-model="createUserInfo.phone" maxlength="11" show-word-limit></el-input>
                        </el-form-item>
                        <el-form-item label="组织机构" prop="companyId">
                            <el-select v-model="createUserInfo.companyId" placeholder="请选择" style="width: 280px">
                                <el-option
                                    v-for="item in companyOptions"
                                    :key="item.id"
                                    :label="item.name"
                                    :value="item.id">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-form>
                    <div slot="footer">
                        <el-button @click="createUserDiaVisible = false">取消</el-button>
                        <el-button type="primary" @click="createUser">确定</el-button>
                    </div>
                    </el-dialog>

                    <!-- 用户密码修改dialog -->
                    <el-dialog title="修改密码" :visible.sync="userPasswordChangeDiaVisible" width="400px">
                        <el-form :model="editUserPasswordForm" ref="editUserPasswordForm" :rules="changeUserPasswordRules" label-width="80px">
                            <el-form-item label="新密码" prop="password">
                                <el-input v-model="editUserPasswordForm.password" type="password" show-password @input="checkPasswordStrength" autocomplete="off"></el-input>
                                <span>密码强度：<span :class="tipsColor">{{ strength }}</span></span>
                            </el-form-item>
                            <el-form-item label="确认密码" prop="passConfirm">
                                <el-input v-model="editUserPasswordForm.passConfirm" type="password" show-password autocomplete="off"></el-input>
                            </el-form-item>
                        </el-form>
                        <div slot="footer">
                            <el-button @click="userPasswordChangeDiaVisible = false">取 消</el-button>
                            <el-button type="primary" @click="changeUserPassword">确 定</el-button>
                        </div>
                    </el-dialog>

                <!-- 用户信息修改dialog
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
                </el-dialog> -->

                <!-- 分页条 -->
                <el-pagination
                    background
                    align="center"
                    :hide-on-single-page = true
                    layout="prev, pager, next, jumper"
                    :total="this.totalUserData"
                    @current-change="handleCurrentChange"
                    :current-page="currentPage"
                    :page-size="pageSize">
                </el-pagination>
            </el-main>
                
            <!-- 组织机构管理主页面 -->
            <el-main v-if="mainValue == 4">
                <!-- 查询功能 -->
                <el-form :inline="true" :model="companySearchForm" align="center" ref="companySearchForm" :rules="companyRules">
                    <el-form-item label="组织机构名称" style="margin-left: 30px;" prop="searchCompanyName">
                        <el-input v-model="companySearchForm.searchCompanyName"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="searchTenant">查询</el-button>
                        <el-button type="danger" @click="cancelSearchTenant">取消</el-button>
                    </el-form-item>
                    <!-- 创建组织机构 -->
                    <el-form-item style="margin-left: 50px">
                        <el-button type="primary" @click="createCompanyData.name = ''; createCompanyData.cpu=''; createCompanyData.memory=''; createCompanyDiaVisible = true;">创建组织机构</el-button>
                    </el-form-item>
                </el-form>
                <!-- 内容表格 -->
                <el-table :data="companyData" border key="companyDataTable">
                    <el-table-column prop="name" label="组织机构" align="center"></el-table-column>
                    <el-table-column prop="cpu" label="cpu/个" align="center"></el-table-column>
                    <el-table-column prop="memory" label="内存/MB" align="center"></el-table-column>
                    <!-- 操作按钮 编辑&删除 -->
                    <!-- <el-table-column label="操作" align="center">
                        <template slot-scope="scope">
                            <el-button size="mini" @click="editCompanyData(scope.$index, scope.row)">编辑</el-button>
                            <el-button size="mini" type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
                        </template>
                    </el-table-column> -->
                </el-table>
                <br>

                <!-- 创建组织机构dialog -->
                <el-dialog title="待创建组织机构信息" :visible.sync="createCompanyDiaVisible" width="500px">
                    <el-form :model="createCompanyData" style="margin-left: -60px;">
                        <el-form-item label="组织机构" :label-width='"150px"'>
                            <el-input v-model="createCompanyData.name" autocomplete="off"></el-input>
                        </el-form-item>
                        <el-form-item label="cpu（个）" :label-width='"150px"'>
                            <el-input v-model="createCompanyData.cpu" autocomplete="off"></el-input>
                        </el-form-item>
                        <el-form-item label="内存（MB）" :label-width='"150px"'>
                            <el-input v-model="createCompanyData.memory" autocomplete="off"></el-input>
                        </el-form-item>
                    </el-form>
                    <div slot="footer" class="dialog-footer">
                        <el-button @click="createCompanyDiaVisible = false">取 消</el-button>
                        <el-button type="primary" @click="createCompany">确 定</el-button>
                    </div>
                </el-dialog>

                <!-- 组织机构信息修改dialog -->
                <el-dialog title="编辑组织机构信息" :visible.sync="companyDataChangeDiaVisible">
                    <el-form :model="editCompanyDataForm">
                        <el-form-item label="组织机构" :label-width='"150px"'>
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
                    align="center"
                    :hide-on-single-page = true
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
                    <el-form-item label="镜像名称" prop="searchImageName">
                        <el-input v-model="imageSearchForm.searchImageName" placeholder="请输入内容"></el-input>
                    </el-form-item>
                    <el-form-item label="组织机构" prop="searchCompanyId">
                        <el-select v-model="imageSearchForm.searchCompanyId" placeholder="组织机构">
                            <el-option
                            v-for="item in companyOptions"
                            :key="item.id"
                            :label="item.name"
                            :value="item.id">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="镜像状态" prop="searchStatus">
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
                        <el-button type="danger" @click="deleteImage">删除</el-button>
                        <el-button type="primary" @click="openHarbor">Harbor</el-button>
                        <el-button type="primary" @click="openImageSettingDia" icon="el-icon-s-tools" circle></el-button>
                    </el-form-item>
                </el-form>
                <!-- 内容表格 -->
                <el-table :data="imageData" border @selection-change="imageSelectionChange" key="imageDataTable">
                    <el-table-column prop="name" label="镜像名称" align="center"></el-table-column>
                    <el-table-column prop="companyName" label="组织机构" align="center"></el-table-column>
                    <el-table-column prop="username" label="用户名称" align="center"></el-table-column>
                    <el-table-column prop="tags" label="标签" align="center"></el-table-column>
                    <el-table-column prop="pullCount" label="使用次数" align="center"></el-table-column>
                    <el-table-column prop="size" label="镜像大小（MiB）" align="center" width="140px"></el-table-column>
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
                    <el-table-column label="文件操作" width="200px" align="center">
                        <template slot-scope="scope">
                            <el-button size="mini" type="danger" @click="openImageFileDia(scope.row)">镜像文件</el-button>
                            <el-button size="mini" type="danger" @click="openConfigDia(scope.row)">配置文件</el-button>
                        </template>
                    </el-table-column>
                    <el-table-column type="selection" align="center" width="55"></el-table-column>
                </el-table>
                <br>

                <!-- 镜像设置dialog （设置镜像的MaxSize） -->
                <el-dialog title="镜像设置" :visible.sync="imageSettingDiaVisible" v-if="imageSettingDiaVisible" width="400px">
                    <el-descriptions>
                        <el-descriptions-item label="镜像大小限制">{{ currentMaxImageSize }} MiB</el-descriptions-item>
                    </el-descriptions>
                    <el-form :model="imageSettingForm">
                        <el-form-item label="修改值（MiB）" :label-width='"120px"'>
                            <el-input v-model="imageSettingForm.maxImageSize" autocomplete="off"></el-input>
                        </el-form-item>
                    </el-form>
                    <div slot="footer">
                        <el-button @click="imageSettingDiaVisible = false">取 消</el-button>
                        <el-button type="primary" @click="confirmImageSetting">确 定</el-button>
                    </div>
                </el-dialog>


                <!-- 配置文件 dialog -->
                <el-dialog title="配置文件" :visible.sync="configDiaVisible" v-if="configDiaVisible" width="800px">
                    <el-table :data="configFileData" key="configFileData" @selection-change="configFilesSelectionChange">
                        <el-table-column label="文件名称" prop="fileName" align="center"></el-table-column>
                        <!-- 操作按钮 查看&下载 -->
                        <el-table-column label="查看内容" align="center" width="150px">
                            <template slot-scope="scope">
                                <el-button size="mini" type="success" @click="viewConfigFile(scope.row)">查看</el-button>
                                <el-button size="mini" type="primary" @click="downloadConfigFile(scope.row)">下载</el-button>
                            </template>
                        </el-table-column>
                        <el-table-column type="selection" align="center" width="55"></el-table-column>
                    </el-table>
                    <span>
                        <el-button type="danger" size="mini" @click="deleteConfigFile" style="margin-left: 700px; margin-top: 20px;">删除</el-button>
                    </span>
                    <!-- 分页条 -->
                    <el-pagination
                        background
                        align="center"
                        :hide-on-single-page = true
                        style="margin-top: 20px"
                        layout="prev, pager, next, jumper"
                        :total="this.totalConfigFileData"
                        @current-change="handleCurrentChange"
                        :current-page="currentPage"
                        :page-size="pageSize">
                    </el-pagination>
                </el-dialog>

                <!-- 镜像文件 dialog -->
                <el-dialog title="镜像文件" :visible.sync="imageFileDiaVisible" v-if="imageFileDiaVisible" width="500px">
                    <el-table :data="imageFiles" key="imageFiles" @selection-change="imageFilesSelectionChange" align="center">
                        <el-table-column prop="fileName" label="文件名" align="center"></el-table-column>
                        <el-table-column type="selection" align="center" width="55"></el-table-column>
                    </el-table>
                    <span>
                        <el-button type="danger" size="mini" @click="deleteImageFiles" style="margin-left: 400px; margin-top: 20px;">删除</el-button>
                    </span>
                    <!-- 分页条 -->
                    <el-pagination
                        background
                        align="center"
                        :hide-on-single-page = true
                        style="margin-top: 20px"
                        layout="prev, pager, next, jumper"
                        :total="this.totalImageFiles"
                        @current-change="handleCurrentChange"
                        :current-page="currentPage"
                        :page-size="pageSize">
                    </el-pagination>
                </el-dialog>

                <!-- 分页条 -->
                <el-pagination
                    background
                    align="center"
                    :hide-on-single-page = true
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
                <el-form :inline="true" :model="containerSearchForm" align="center" ref="containerSearchForm" :rules="containerRules">
                    <el-form-item label="组织机构" style="margin-left: 30px;" prop="namespace">
                        <el-select v-model="containerSearchForm.namespace" placeholder="组织机构">
                            <el-option
                            v-for="item in companyOptions"
                            :key="item.namespace"
                            :label="item.name"
                            :value="item.namespace">
                            </el-option>
                        </el-select>
                    </el-form-item>
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
                <el-table :data="containerData" border @expand-change="expandPod" @selection-change="podSelectionChange">
                        <el-table-column type="expand">
                            <template slot-scope="props">
                                <el-table :data="props.row.container_imageList" border>
                                    <el-table-column prop="containerName" label="容器实例名称" align="center"></el-table-column>
                                    <el-table-column prop="image" label="镜像名称" align="center"></el-table-column>
                                </el-table>
                            </template>
                        </el-table-column>
                        <el-table-column prop="podName" label="Pod名称" align="center"></el-table-column>
                        <el-table-column prop="username" label="用户名" align="center"></el-table-column>
                        <el-table-column prop="companyName" label="组织机构" align="center"></el-table-column>
                        <el-table-column prop="createTime" label="创建时间" align="center">
                            <template #default="scope">
                                {{ formatTime(scope.row.createTime) }}
                            </template>
                        </el-table-column>
                        <!-- Log相关按钮 包括软件log和容器log的查看与下载 -->
                        <el-table-column label="日志" align="center" width="200px">
                            <template slot-scope="scope">
                                <el-button size="mini" type="danger" @click="openSoftwareLogDia(scope.row)">软件日志</el-button>
                                <el-button size="mini" type="danger" @click="openContainerLogDia(scope.row)">容器日志</el-button>
                            </template>
                        </el-table-column>
                        <el-table-column type="selection" align="center" width="55"></el-table-column>
                    </el-table>





                <!-- <el-table :data="containerData" border key="containerDataTable" @selection-change="podSelectionChange">
                    <el-table-column prop="containerName" label="容器实例名称" align="center" width="120px"></el-table-column>
                    <el-table-column prop="imageName" label="镜像名称" align="center"></el-table-column>
                    <el-table-column prop="podName" label="pod名称" align="center"></el-table-column>
                    <el-table-column prop="username" label="用户名" align="center" width="120px"></el-table-column>
                    <el-table-column prop="companyName" label="组织机构" align="center"></el-table-column>
                    <el-table-column prop="createTime" label="创建时间" align="center">
                        <template #default="scope">
                            {{ formatTime(scope.row.createTime) }}
                        </template>
                    </el-table-column>
                    Log相关按钮 包括软件log和容器log的查看与下载
                    <el-table-column label="日志" align="center" width="200px">
                        <template slot-scope="scope">
                            <el-button size="mini" type="danger" @click="openSoftwareLogDia(scope.row)">软件日志</el-button>
                            <el-button size="mini" type="danger" @click="openContainerLogDia(scope.row)">容器日志</el-button>
                        </template>
                    </el-table-column>
                    <el-table-column type="selection" align="center" width="55"></el-table-column>
                </el-table>
                <br> -->

                <!-- 软件log dialog -->
                <el-dialog title="软件运行态日志" :visible.sync="softwareLogDiavisible" v-if="softwareLogDiavisible">
                    <el-table :data="softwareLogData" key="softwareLogDataTable">
                        <el-table-column label="日志名称" prop="fileName" align="center"></el-table-column>
                        <el-table-column label="更新时间" prop="updateTime" align="center">
                            <template #default="scope">
                                {{ formatTime(scope.row.updateTime) }}
                            </template>
                        </el-table-column>
                        <el-table-column label="服务器" prop="server" align="center"></el-table-column>
                        <!-- 操作按钮 查看&下载 -->
                        <el-table-column label="操作" align="center">
                            <template slot-scope="scope">
                                <el-button size="mini" type="success" @click="viewSoftwareLog(scope.row)">查看</el-button>
                                <el-button size="mini" type="primary" @click="downloadSoftwareLog(scope.row)">下载</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                    <!-- 分页条 -->
                    <el-pagination
                        background
                        align="center"
                        :hide-on-single-page = true
                        style="margin-top: 20px"
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
                    <el-button type="success" @click="viewContainerLog" style="width: 120px; margin: 0 10px; border-radius: 5px; margin-top: 30px; margin-left: 50px">查看日志</el-button>
                    <el-button type="primary" @click="downloadContainerLog" style="width: 120px; margin: 0 10px; border-radius: 5px; ">下载日志</el-button>
                </el-dialog>

                <!-- 分页条 -->
                <el-pagination
                    background
                    align="center"
                    style="margin-top: 20px;"
                    :hide-on-single-page = true
                    layout="prev, pager, next, jumper"
                    :total="this.totalContainerData"
                    @current-change="handleCurrentChange"
                    :current-page="currentPage"
                    :page-size="pageSize">
                </el-pagination>
            </el-main>

            <!-- 日志管理主页面 -->
            <el-main v-if="mainValue == 7">
                <!-- 查询功能 -->
                <el-form :inline="true" :model="historyContainerSearchForm" align="center" ref="historyContainerSearchForm" :rules="historyContainerRules">
                    <el-form-item label="组织机构" style="margin-left: 30px;" prop="namespace">
                        <el-select v-model="historyContainerSearchForm.namespace" placeholder="组织机构">
                            <el-option
                            v-for="item in companyOptions"
                            :key="item.namespace"
                            :label="item.name"
                            :value="item.namespace">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="用户名" style="margin-left: 30px;" prop="username">
                        <el-input v-model="historyContainerSearchForm.username" placeholder="请输入内容"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="searchHistoryContainer">查询</el-button>
                        <el-button type="danger" @click="cancelSearchHistoryContainer">取消</el-button>
                    </el-form-item>
                </el-form>

                <!-- 内容表格 -->
                <el-table :data="historyContainerData" border @expand-change="expandHistoryPod">
                    <el-table-column type="expand">
                        <template slot-scope="props">
                            <el-table :data="props.row.container_imageList" border>
                                <el-table-column prop="containerName" label="容器实例名称" align="center"></el-table-column>
                                <el-table-column prop="image" label="镜像名称" align="center"></el-table-column>
                            </el-table>
                        </template>
                    </el-table-column>
                    <el-table-column prop="podName" label="Pod名称" align="center"></el-table-column>
                    <el-table-column prop="username" label="用户名" align="center"></el-table-column>
                    <el-table-column prop="companyName" label="组织机构" align="center"></el-table-column>
                    <el-table-column prop="createTime" label="创建时间" align="center">
                        <template #default="scope">
                            {{ formatTime(scope.row.createTime) }}
                        </template>
                    </el-table-column>
                    <!-- Log相关按钮 包括软件log和容器log的查看与下载 -->
                    <el-table-column label="软件Log" align="center">
                        <template slot-scope="scope">
                            <el-button size="mini" type="danger" @click="openHistorySoftwareLogDia(scope.row)">查看软件日志</el-button>
                        </template>
                    </el-table-column>
                </el-table>




                <!-- <el-table :data="historyContainerData" border key="historyContainerData">
                    <el-table-column prop="containerName" label="容器实例名称" align="center" width="120px"></el-table-column>
                    <el-table-column prop="imageName" label="镜像名称" align="center"></el-table-column>
                    <el-table-column prop="podName" label="pod名称" align="center"></el-table-column>
                    <el-table-column prop="username" label="用户名" align="center" width="120px"></el-table-column>
                    <el-table-column prop="companyName" label="组织机构" align="center"></el-table-column>
                    <el-table-column prop="createTime" label="创建时间" align="center">
                        <template #default="scope">
                            {{ formatTime(scope.row.createTime) }}
                        </template>
                    </el-table-column>
                    Log相关按钮 包括软件log和容器log的查看、下载和删除
                    <el-table-column label="软件Log" align="center">
                        <template slot-scope="scope">
                            <el-button size="mini" type="danger" @click="openHistorySoftwareLogDia(scope.row)">查看软件日志</el-button>
                        </template>
                    </el-table-column>
                </el-table>
                <br> -->

                <!-- 历史容器实例界面 软件log dialog -->
                <el-dialog title="软件运行态日志" :visible.sync="historSoftwareLogDiavisible" v-if="historSoftwareLogDiavisible">
                    <el-table :data="historySoftwareLogData" key="historySoftwareLogData" @selection-change="historySoftwareLogSelectionChange">
                        <el-table-column label="日志名称" prop="fileName" align="center"></el-table-column>
                        <el-table-column label="更新时间" prop="updateTime" align="center" width="200px">
                            <template #default="scope">
                                {{ formatTime(scope.row.updateTime) }}
                            </template>
                        </el-table-column>
                        <el-table-column label="服务器" prop="server" align="center"></el-table-column>
                        <!-- 操作按钮 查看&下载&删除 -->
                        <el-table-column label="查看内容" align="center" width="150px">
                            <template slot-scope="scope">
                                <el-button size="mini" type="success" @click="viewSoftwareLog(scope.row)">查看</el-button>
                                <el-button size="mini" type="primary" @click="downloadSoftwareLog(scope.row)">下载</el-button>
                            </template>
                        </el-table-column>
                        <el-table-column type="selection" align="center" width="55"></el-table-column>
                    </el-table>
                    <span>
                        <el-button type="danger" size="mini" @click="deleteHistorySoftwareLog" style="margin-left: 670px; margin-top:20px">删除</el-button>
                    </span>
                    <!-- 分页条 -->
                    <el-pagination
                        background
                        align="center"
                        :hide-on-single-page = true
                        style="margin-top: 20px"
                        layout="prev, pager, next, jumper"
                        :total="this.totalHistorySoftwareLogData"
                        @current-change="handleCurrentChange"
                        :current-page="currentPage"
                        :page-size="pageSize">
                    </el-pagination>
                </el-dialog>

                <!-- 分页条 -->
                <el-pagination
                    background
                    align="center"
                    style="margin-top: 20px;"
                    :hide-on-single-page = true
                    layout="prev, pager, next, jumper"
                    :total="this.totalHistoryContainerData"
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
import CryptoJS from 'crypto-js';

export default{
    data () {
        const equalToPassword = (rule, value, callback) => {
            if (this.createUserInfo.passConfirm !== this.createUserInfo.password) {
                callback(new Error("两次输入的密码不一致"));
            } else {
                callback();
            }
        };
        return {
            strength: "", // 密码弱中强的显示
            tempUsername: "", // 临时存放用户名（用于修改用户密码）
            imageAndTags: "", // 临时存放镜像名（用于配置文件的查看和下载操作）
            imageCompanyId: "", // 临时存放镜像的companyId（用于配置文件的查看和下载操作）
            currentMaxImageSize: "", // 当前镜像限制大小的值
            userData: [],  // 用户数据
            companyData: [], // 组织机构数据
            imageData: [], // 镜像管理数据
            imageList: [], // 用于存放容器实例信息页面点击软件日志后的imageList，用于软件日志的翻页
            imageFiles: [], // 用于创建镜像的文件
            containerData: [], // 容器实例数据
            historyContainerData: [], // 历史的容器实例数据（running = 0）
            verifyUserList: [], // 待审批用户列表
            verifyImageList: [], // 待审批镜像列表
            selectedUserList: [], // 选中的用户列表
            selectedImageList: [], // 选中的镜像列表
            selectedConfigFiles: [], // 选中的配置文件列表
            selectedContainerList: [], // 选中的容器实例列表
            selectedImageFilesList: [], // 选中的用于创建镜像的文件列表
            selectedHistorySoftwareLog: [], // 选中的历史容器实例软件log列表
            originSoftwareLogData: [], // 初始软件运行态log数据（纯数组形式）
            softwareLogData: [], // 处理后软件log数据（如log.txt testlog.txt等）
            configFileData: [], // 配置文件列表
            historyOriginSoftwareLogData: [], // （历史容器实例）初始软件运行态log数据（纯数组形式）
            historySoftwareLogData: [], // （历史容器实例）处理后软件log数据（如log.txt testlog.txt等）
            companyOptions: [], // 组织机构列表，供下拉选择
            totalUserData: 0, // 用户数据总条数
            totalVerifyUserData: 0, // 待审批用户数据总条数
            totalCompanyData: 0, // 组织机构数据总条数
            totalContainerData: 0, // 容器实例数据总条数
            totalHistoryContainerData: 0, // 历史容器实例数据总条数
            totalConfigFileData: 0, // 配置文件总条数
            totalImageData: 0, // 镜像数据总条数
            totalVerifyImageData: 0, // 待审批镜像数据总条数
            totalSoftwareLogData: 0, // 软件运行态log数据总条数
            totalHistorySoftwareLogData: 0, // （历史容器实例）软件运行态log数据总条数
            totalPvcData: 0, // pvc数据总条数
            totalImageFiles: 0, // 用于打包镜像的文件总数
            mainValue: 0, // 控制主页面切换
            currentPage: 1, // 当前页 刷新后默认显示第一页
            pageSize: 7, // 每一页显示的数据量
            passwordTag: "显示密码", // 显示密码or取消显示
            createUserDiaVisible: false, // 创建用户表单显示与否
            userDataChangeDiaVisible: false, // 修改用户信息表单显示与否
            createCompanyDiaVisible: false, // 创建组织机构信息表单显示与否
            companyDataChangeDiaVisible: false, // 修改组织机构信息表单显示与否
            softwareLogDiavisible: false, // 软件log表单显示与否
            containerLogDiavisible: false, // 容器log表单显示与否
            historSoftwareLogDiavisible: false, // 历史容器实例的软件log表单显示与否
            showPasswordColumn: false, // 用户界面的密码列显示与否
            userPasswordChangeDiaVisible: false, // 修改用户密码表单显示与否
            configDiaVisible: false, // 配置文件表单显示与否
            imageFileDiaVisible: false, // 镜像文件表单显示与否
            imageSettingDiaVisible: false, // 镜像设置对话框显示与否

            //设置秘钥和秘钥偏移量
            SECRET_KEY: CryptoJS.enc.Utf8.parse("ul29s9b5l1x8sqo7"),
            SECRET_IV: CryptoJS.enc.Utf8.parse("d8g65df9vc6s23df"),

            // 个人信息
            personalInfo: {  
                "username": "",
                "name": "",
                "phone": "",
                "companyName": "",
                "companyId": "",
            },

            // 创建用户时的用户信息
            createUserInfo: {
                username: "",
                password: "",
                passConfirm: "",
                phone: "",
                companyId: "",
            },

            // 修改用户密码时的信息
            editUserPasswordForm: {
                password: "",
                passConfirm: "",
            },

            // 打开两类log的dialog后，临时存放当前的容器实例的podName和namespace
            tempPodData:{
                podName: "",
                namespace: "",
            },
        
            // 用户搜索功能中的值
            userSearchForm: {  
                searchCompanyName: "",
                searchStatus: "",
            },

            // 组织机构搜索功能中的值
            companySearchForm: {  
                searchCompanyName: "",
            },

            // 镜像管理搜索功能中的值
            imageSearchForm: {  
                searchImageName: "",  // 镜像名称
                searchCompanyId: "",  // 组织机构ID
                searchStatus: "", // 镜像状态
            },

            // 容器实例管理搜索功能中的值
            containerSearchForm: {  
                namespace: "", // 命名空间
                username: "", // 用户名
            },

            // 历史容器实例管理搜索功能中的值
            historyContainerSearchForm: {
                namespace: "", // 命名空间
                username: "", // 用户名
            },

            // 更改用户信息时，选中的用户的值
            editUserDataForm:{
                username: "",
                name: "",
                phone: "",
            },

            // 镜像设置
            imageSettingForm: {
                maxImageSize: "",
            },

            // 创建组织机构时，填入的值
            createCompanyData:{
                name: "",
                cpu: "",
                memory: "", 
            },

            // 更改组织机构信息时，选中的组织机构的值
            editCompanyDataForm:{
                companyName: "",
                cpu: "",
                memory: "",
            },

            // 创建用户rules
            createUserRules: {
                username: [{ required: true, message: "用户名不能为空！", trigger: "blur" }],
                password: [
                    { required: true, message: "新密码不能为空", trigger: "blur" },
                    {
                        min: 8,
                        max: 18,
                        message: "长度在 8 到 18 个字符",
                        trigger: "blur",
                    },
                ],
                passConfirm: [
                    { required: true, message: "确认密码不能为空", trigger: "blur" },
                    { required: true, validator: equalToPassword, trigger: "blur" },
                ],
                phone: [{ required: true, message: "手机号码不能为空！", trigger: "blur" }],
                companyId: [{required: true, message: "请选择组织机构！", trigger: "change" }],
            },

            // 用户修改密码rules
            changeUserPasswordRules:{
                // phone: [{ required: false, trigger:"change"}],
                password: [
                    { required: true, message: "新密码不能为空", trigger: "blur" },
                    {
                        min: 8,
                        max: 18,
                        message: "长度在 8 到 18 个字符",
                        trigger: "blur",
                    },
                ],
                passConfirm: [
                    { required: true, message: "确认密码不能为空", trigger: "blur" },
                    { required: true, validator: equalToPassword, trigger: "blur" },
                ],
            },

            // 用户信息table rules
            userRules: {
                searchStatus: [{ required: false, trigger:"change"}],
                searchCompanyName: [{ required: false, trigger:"change"}],
            },
            // 组织机构信息table rules
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
            },
            // 容器实例table tules
            containerRules:{
                namespace: [{ required: false, trigger:"change"}],
                username: [{ required: false, trigger:"change"}],
            },
            // 历史容器实例table tules
            historyContainerRules:{
                namespace: [{ required: false, trigger:"change"}],
                username: [{ required: false, trigger:"change"}],
            },
        }
    },
    computed: {
        // 计算两个周期值
        tipsColor: function () {
            let str = this.strength;
            if(str == "弱"){
                return 'color-ruo'
            }else if(str == "中"){
                return 'color-zhong'
            }else if(str == "强"){
                return 'color-qiang'
            }else{
                return ''
            }
        },
    },
    mounted(){
        // 获取组织机构列表
        axios({
            method: 'post',
            url: 'api/company/list?size=100',
            headers: {
                "Authorization": `${sessionStorage.getItem('adminToken')}`
            },
            data: {
                "status": "",
                "name": "",
            }
        }).then((result) => {
            console.log(result.data)
            this.companyOptions = result.data.data.records
            console.log(this.companyOptions)
        }).catch(error => {
            this.handleError(error)
        })
    },
    methods:{

        // 打开镜像设置的对话框
        openImageSettingDia() {
            // 调用接口 获取当前MaxImageSize
            axios({
                method: 'get',
                url: 'api/config/getMaxImageSize',
                headers: {
                    "Authorization": `${sessionStorage.getItem('adminToken')}`
                },
            }).then((result) => {
                console.log(result.data)
                this.currentMaxImageSize = result.data.data
                this.imageSettingDiaVisible = true
            }).catch(error => {
                this.handleError(error)
            })
        },

        // 确定修改镜像设置
        confirmImageSetting() {
            if(this.imageSettingForm.maxImageSize == "") {
                this.message({
                    message: "镜像大小限制为空！",
                    type: "error",
                    showClose: true,
                    duration: 8000
                })
            }
            else if(isNaN(Number(this.imageSettingForm.maxImageSize)) || Number(this.imageSettingForm.maxImageSize) <= 0) {
                this.message({
                    message: "镜像大小限制必须为数字！",
                    type: "error",
                    showClose: true,
                    duration: 8000
                })
            }
            else {
                // 调用接口修改镜像MaxSize
                axios({
                    method: 'post',
                    url: 'api/config/updateMaxImageSize?maxImageSize=' + this.imageSettingForm.maxImageSize,
                    headers: {
                        "Authorization": `${sessionStorage.getItem('adminToken')}`
                    },
                }).then((result) => {
                    console.log(result.data)
                    this.$message({
                        message: "修改成功！",
                        type: "success",
                        showClose: true,
                        duration: 8000,
                    })
                    this.imageSettingDiaVisible = false
                    this.imageSettingForm.maxImageSize = ""
                }).catch(error => {
                    this.handleError(error)
                })
            }
        },

        // 删除用于创建镜像的文件
        deleteImageFiles() {
            console.log(this.selectedImageFilesList)
            if(this.selectedImageFilesList == "") {
                this.$message({
                    message:"未选择任何文件！",
                    showClose: true,
                    duration: 8000,
                })
            } else {
                // 调用接口删除文件
                axios({
                    method: 'post',
                    url: 'api/image/deleteResourcesForBuild?' + "namespace=" + this.imageCompanyId + "&image=" + this.imageAndTags + "&fileNameList=" + this.selectedImageFilesList,
                    headers: {
                        "Authorization": `${sessionStorage.getItem('adminToken')}`
                    },
                }).then((result) => {
                    console.log(result)
                    this.$message({
                        type: "success",
                        showClose: true,
                        duration: 8000,
                        message:"文件删除成功！"
                    })
                    // 调用接口获取该镜像对应的所有文件
                    axios({
                        method: 'get',
                        url: 'api/image/getResourcesForBuild?' + 'namespace=' + this.imageCompanyId + '&image=' + this.imageAndTags + '&page=' + this.currentPage + '&size=' + this.pageSize,
                        headers: {
                                "Authorization": `${sessionStorage.getItem('adminToken')}`,
                            },
                        }).then((result) => {
                            console.log(result.data)
                            this.totalImageFiles = result.data.data.totalElements
                            if(result.data.data.content != null) {
                                this.imageFiles = result.data.data.content
                                // 转换格式 方便在el-table中显示
                                this.imageFiles = this.imageFiles.map(item => {
                                    return {
                                        fileName: item
                                    };
                                });
                            }
                        }).catch(error => {
                            this.handleError(error)
                        })
                }).catch(error => {
                    this.handleError(error)
                });
            }
        },

        // 打开镜像文件管理的dialog
        openImageFileDia(row) {
            this.imageFileDiaVisible = true
            this.imageAndTags = row.name + ":" + row.tags
            this.imageCompanyId = row.projectName
            this.selectedImageFilesList = []
            // 调用接口获取该镜像对应的所有文件
            axios({
                method: 'get',
                url: 'api/image/getResourcesForBuild?' + 'namespace=' + this.imageCompanyId + '&image=' + this.imageAndTags + '&page=' + this.currentPage + '&size=' + this.pageSize,
                headers: {
                        "Authorization": `${sessionStorage.getItem('adminToken')}`,
                },
            }).then((result) => {
                console.log(result.data)
                this.totalImageFiles = result.data.data.totalElements
                if(result.data.data.content != null) {
                    this.imageFiles = result.data.data.content
                    // 转换格式 方便在el-table中显示
                    this.imageFiles = this.imageFiles.map(item => {
                        return {
                            fileName: item
                        };
                    });
                }
            }).catch(error => {
                this.handleError(error)
            })
        },

        // 删除配置文件
        deleteConfigFile() {
            if(this.selectedConfigFiles == "") {
                this.$message({
                    message: "未选择任何配置文件！",
                    showClose: true,
                    duration: 8000,
                })
            }
            else {
                // 调用接口删除配置文件
                axios({
                method: 'post',
                url: 'api/container/deleteConfigFile?' + '&image=' + this.imageAndTags + "&namespace=" + this.imageCompanyId + "&fileNameList=" + this.selectedConfigFiles,
                headers: {
                        "Authorization": `${sessionStorage.getItem('adminToken')}`,
                    },
                }).then((result) => {
                    console.log(result.data)
                    this.$message({
                        message: "配置文件删除成功！",
                        type: "success",
                        showClose: true,
                        duration: 8000,
                    })
                    this.currentPage = 1
                    // 调用接口获取所有配置文件
                    axios({
                        method: 'get',
                        url: 'api/container/getConfigList?' + 'namespace=' + this.imageCompanyId + "&image=" + this.imageAndTags + "&page=" + this.currentPage + "&size=" + this.pageSize,
                        headers: {
                                "Authorization": `${sessionStorage.getItem('adminToken')}`,
                        },
                    }).then((result) => {
                        console.log(result.data)
                        if(result.data.data.content != null) {
                            this.configFileData = result.data.data.content
                            // 转换格式 方便在el-table中显示
                            this.configFileData = this.configFileData.map(item => {
                                return {
                                    fileName: item
                                };
                            });
                        }
                        this.totalConfigFileData = result.data.data.totalElements // 获取总条数
                    }).catch(error => {
                        this.handleError(error)
                    })
                }).catch(error => {
                    this.handleError(error)
                })
            }
        },

        // 打开配置文件的对话框
        openConfigDia(row) {
            // 清空选中项
            this.selectedConfigFiles = []
            this.currentPage = 1
            this.imageAndTags = row.name + ':' + row.tags
            this.imageCompanyId = row.projectName
            console.log(this.imageCompanyId)
            // 调用接口 获取所有config文件列表
            axios({
                method: 'get',
                url: 'api/container/getConfigList?' + 'namespace=' + row.projectName + "&image=" + this.imageAndTags + "&page=" + this.currentPage + "&size=" + this.pageSize,
                headers: {
                        "Authorization": `${sessionStorage.getItem('adminToken')}`,
                    },
            }).then((result) => {
                console.log(result.data)
                if(result.data.data.content != null) {
                    this.configFileData = result.data.data.content
                    // 转换格式 方便在el-table中显示
                    this.configFileData = this.configFileData.map(item => {
                        return {
                            fileName: item
                        };
                    });
                }
                this.totalConfigFileData = result.data.data.totalElements // 获取总条数
                this.configDiaVisible = true;
            }).catch(error => {
                this.handleError(error)
            })
        },

        // 展开Pod
        expandPod() {

        },

        // 展开历史pod触发事件
        expandHistoryPod() {

        },

        // 重置表单数据
        resetForm(formName) {
            this.$refs[formName].resetFields();
        },

        // 打开创建用户的dialog
        openCreateUserDia() {
            this.createUserDiaVisible = true
            this.$nextTick(() => {
                this.resetForm('createUserInfo')
            })
            this.strength = ""
        },

        // 打开修改用户密码的dialog
        openChangeUserPasswordDia(row) {
            this.userPasswordChangeDiaVisible = true
            this.$nextTick(() => {
                this.resetForm('editUserPasswordForm')
            })
            this.tempUsername = row.username
            this.strength = ""
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

        // 管理员创建用户时，随机生成密码
        randomPassword() {
            const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+-=[];\,/<>?';
            let password = '';
            for (let i = 0; i < 8; i++) {
                const randomIndex = Math.floor(Math.random() * characters.length);
                password += characters[randomIndex];
            }
            this.createUserInfo.password = password;
        },

        // 更改用户密码
        changeUserPassword:function(){
            if(this.editUserPasswordForm.password == '') {
                this.$message({
                        message: "请输入新密码！",
                        type: "error",
                        showClose: true,
                        duration: 8000,
                    })
            }
            else if(this.editUserPasswordForm.passConfirm == '') {
                this.$message({
                        message: "请再次输入新密码！",
                        type: "error",
                        showClose: true,
                        duration: 8000,
                    })
            }
            else if(this.editUserPasswordForm.passConfirm != this.editUserPasswordForm.password) {
                this.$message({
                        message: "两次输入的密码不一致！",
                        type: "error",
                        showClose: true,
                        duration: 8000,
                    })
            }
            else if (this.editUserPasswordForm.password.length < 8 || this.editUserPasswordForm.password.length > 18) {
                this.$message({
                        message: "密码长度为8-18位！",
                        type: "error",
                        showClose: true,
                        duration: 8000,
                    })
            }
            else if(this.strength != "强") {
                this.$message({
                        message: "密码中要同时包含数字、字母和特殊字符！",
                        type: "error",
                        showClose: true,
                        duration: 8000,
                    })
            }
            else {
                // 调用接口更改密码
                axios({
                    method: 'post',
                    url: 'api/main/updatePassword',
                    headers: {
                        'content-Type' : "application/json",
                        "Authorization": `${sessionStorage.getItem('adminToken')}`
                    },
                    data: {
                        "password": this.editUserPasswordForm.password,
                        "username": this.tempUsername,
                    }
                }).then((result) => {
                    console.log(result)
                    this.$message({
                        message: "密码修改成功！",
                        type: "success",
                        showClose: true,
                        duration: 8000,
                    })
                    this.userPasswordChangeDiaVisible = false
                    this.editUserPasswordForm.password = ''
                }).catch(error => {
                    this.handleError(error)
                });
            }
        },

        // 检查密码强度
        checkPasswordStrength() {
            let hasLetter = false;
            let hasNumber = false;
            let hasSymbol = false;

            if(this.createUserDiaVisible == true) {
                for (let char of this.createUserInfo.password) {
                    if (/[a-zA-Z]/.test(char)) {
                    hasLetter = true;
                    } else if (/\d/.test(char)) {
                    hasNumber = true;
                    } else {
                    hasSymbol = true;
                    }
                }
                if(this.createUserInfo.password.length < 8) {
                    this.strength = "弱";
                } else if (hasLetter + hasNumber + hasSymbol === 1) {
                    this.strength = "弱";
                } else if (hasLetter + hasNumber + hasSymbol === 2) {
                    this.strength = "中";
                } else if (hasLetter + hasNumber + hasSymbol >= 3) {
                    this.strength = "强";
                } else {
                    this.strength = "";
                }
            }
            else if(this.userPasswordChangeDiaVisible == true) {
                for (let char of this.editUserPasswordForm.password) {
                    if (/[a-zA-Z]/.test(char)) {
                    hasLetter = true;
                    } else if (/\d/.test(char)) {
                    hasNumber = true;
                    } else {
                    hasSymbol = true;
                    }
                }
                if(this.editUserPasswordForm.password.length < 8) {
                    this.strength = "弱";
                } else if (hasLetter + hasNumber + hasSymbol === 1) {
                    this.strength = "弱";
                } else if (hasLetter + hasNumber + hasSymbol === 2) {
                    this.strength = "中";
                } else if (hasLetter + hasNumber + hasSymbol >= 3) {
                    this.strength = "强";
                } else {
                    this.strength = "";
                }
            }
            

            
            // if (hasLetter + hasNumber + hasSymbol === 1) {
            //     this.strength = "弱";
            // } else if (hasLetter + hasNumber + hasSymbol === 2) {
            //     this.strength = "中";
            // } else if (hasLetter + hasNumber + hasSymbol >= 3) {
            //     this.strength = "强";
            // } else {
            //     this.strength = "";
            // }
        },


        // 控制密码显示与否
        controlPasswordColumn() {
            // console.log(this.showPasswordColumn)
            if(this.showPasswordColumn == false) { 
                this.showPasswordColumn = true;
                this.$nextTick(() => {
                    this.$refs['userDataTable'].doLayout();
                })
                this.passwordTag = "取消显示"
            } else if(this.showPasswordColumn == true) { 
                this.showPasswordColumn = false;
                this.passwordTag = "显示密码"
                
            }
        },

        // 创建用户
        createUser() {
            if(this.createUserInfo.username == '') {
                this.$message({
                        message: "用户名不能为空！",
                        type: "error",
                        showClose: true,
                        duration: 8000,
                    })
            }
            else if(this.createUserInfo.phone == '') {
                this.$message({
                        message: "手机号不能为空！",
                        type: "error",
                        showClose: true,
                        duration: 8000,
                    })
            }
            else if(this.createUserInfo.password == '') {
                this.$message({
                        message: "请输入新密码！",
                        type: "error",
                        showClose: true,
                        duration: 8000,
                    })
            }
            else if(this.createUserInfo.passConfirm == '') {
                this.$message({
                        message: "请再次输入新密码！",
                        type: "error",
                        showClose: true,
                        duration: 8000,
                    })
            }
            else if (isNaN(Number(this.createUserInfo.phone)) || Number(this.createUserInfo.phone) <= 0) {
                this.$message({
                        message: "手机号必须为数字！",
                        type: "error",
                        showClose: true,
                        duration: 8000,
                    })
            }
            else if(this.createUserInfo.phone.length != 11) {
                this.$message({
                    message: "手机号必须为11位！",
                    type: "error",
                    showClose: true,
                    duration: 8000,
                })
            }
            else if(this.createUserInfo.passConfirm != this.createUserInfo.password) {
                this.$message({
                        message: "两次输入的密码不一致！",
                        type: "error",
                        showClose: true,
                        duration: 8000,
                    })
            }
            else if (this.createUserInfo.password.length < 8 || this.createUserInfo.password.length > 18) {
                this.$message({
                        message: "密码长度为8-18位！",
                        type: "error",
                        showClose: true,
                        duration: 8000,
                    })
            }
            else if(this.strength != "强") {
                this.$message({
                        message: "密码中要同时包含数字、字母和特殊字符！",
                        type: "error",
                        showClose: true,
                        duration: 8000,
                    })
            }
            else {
                axios({
                    method: 'post',
                    url: 'api/main/register/' + this.createUserInfo.companyId,
                    data: {
                        username: this.createUserInfo.username,
                        password: this.encrypt(this.createUserInfo.password),
                        phone: this.createUserInfo.phone,
                    }
                }).then((result) => {
                    console.log(result)
                    this.$message({
                        message: "创建用户成功！",
                        type: "success",
                        showClose: true,
                        duration: 8000,
                    })
                    this.createUserDiaVisible = false
                    this.changeMainTo3()
                }).catch(error => {
                    // 特殊情况处理
                    if (this.createUserInfo.companyId == "" || this.createUserInfo.password == "" || this.createUserInfo.phone == "" || this.createUserInfo.username == "") {
                        this.$message({
                            message: "有必填项为空，请检查！",
                            type: "error",
                            showClose: true,
                            duration: 8000,
                        })
                    }
                    else {
                        this.handleError(error)
                    }
                })
            }
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
                        this.userData = result.data.data.records
                        this.totalUserData = result.data.data.total // 获取总条数
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
                        this.userData = result.data.data.records
                        this.totalUserData = result.data.data.total // 获取总条数
                    }).catch(error => {
                        this.handleError(error)
                    });
            }

        },

        // 取消查询，显示所有用户数据
        cancleSearchUser:function(){
            this.currentPage = 1;
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
                this.userData = result.data.data.records
                this.totalUserData = result.data.data.total // 获取总条数
                this.$nextTick(() => {
                    this.resetForm('userSearchForm');
                })
            }).catch(error => {
                this.handleError(error)
            });
        },

        // 查询组织机构
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
                this.companyData = result.data.data.records
                this.totalCompanyData = result.data.data.total // 获取总条数
            }).catch(error => {
                this.handleError(error)
            });
        },

        // 取消查询，显示所有组织机构数据
        cancelSearchTenant:function(){
            this.currentPage = 1;
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
                this.companyData = result.data.data.records
                this.totalCompanyData = result.data.data.total // 获取总条数
                this.$nextTick(() => {
                    this.resetForm('companySearchForm');
                })
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
                    "companyId": this.imageSearchForm.searchCompanyId,
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
                this.$nextTick(() => {
                    this.resetForm('imageSearchForm');
                })
            }).catch(error => {
                this.handleError(error)
            });

        },

        // 查询容器实例
        searchContainer:function(){
            this.currentPage = 1;
            // 调用接口 通过namespace查询容器实例
            axios({
                method: 'post',
                url: 'api/container/list?' + "namespace=" + "page=" + this.currentPage + "&size=" + this.pageSize,
                headers: {
                    'content-Type' : "application/json",
                    "Authorization": `${sessionStorage.getItem('adminToken')}`
                },
                data: {
                    "namespace": this.containerSearchForm.namespace,
                    "username": this.containerSearchForm.username,
                    "running": "1"
                },
            }).then((result) => {
                console.log(result)
                this.containerData = result.data.data.content
                this.totalContainerData = result.data.data.totalElements // 获取总条数
            }).catch(error => {
                this.handleError(error)
            });
        },

        // 取消查询，显示所有容器实例数据
        cancelSearchContainer:function(){
            this.currentPage = 1;
            axios({
                method: 'post',
                url: 'api/container/list?' + "page=" + this.currentPage + "&size=" + this.pageSize,
                headers: {
                    'content-Type' : "application/json",
                    "Authorization": `${sessionStorage.getItem('adminToken')}`
                },
                data: {
                    "namespace": "",
                    "username": "",
                    "running": "1"
                },
            }).then((result) => {
                console.log(result)
                this.containerData = result.data.data.content
                this.totalContainerData = result.data.data.totalElements // 获取总条数
                this.$nextTick(() => {
                    this.resetForm('containerSearchForm');
                })
            }).catch(error => {
                this.handleError(error)
            });
        },

        // 删除容器实例
        deleteContainer:function(){
            console.log(this.selectedContainerList)
            if (this.selectedContainerList == '') {
                this.$message({
                    message: "未选择任何容器实例！",
                    showClose: true,
                    duration: 8000,
                })
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
                    this.$message({
                        message: "删除成功！",
                        type: "success",
                        showClose: true,
                        duration: 8000,
                    })
                    this.selectedContainerList == ''
                    // 显示删除后的所有容器实例数据
                    this.currentPage = 1;
                    axios({
                        method: 'post',
                        url: 'api/container/list?' + "page=" + this.currentPage + "&size=" + this.pageSize,
                        headers: {
                            'content-Type' : "application/json",
                            "Authorization": `${sessionStorage.getItem('adminToken')}`
                        },
                        data: {
                            "namespace": "",
                            "username": "",
                            "running": "1"
                        }
                    }).then((result) => {
                        console.log(result)
                        this.containerData = result.data.data.content
                        this.totalContainerData = result.data.data.totalElements // 获取总条数
                    }).catch(error => {
                        this.handleError(error)
                    });
                }).catch(error => {
                    this.handleError(error)
                });
            }
        },

        // 查询历史容器实例
        searchHistoryContainer:function(){
            this.currentPage = 1;
            // 调用接口查询
            axios({
                method: 'post',
                url: 'api/container/list?' + "page=" + this.currentPage + "&size=" + this.pageSize,
                headers: {
                    'content-Type' : "application/json",
                    "Authorization": `${sessionStorage.getItem('adminToken')}`
                },
                data: {
                    "namespace": this.historyContainerSearchForm.namespace,
                    "username": this.historyContainerSearchForm.username,
                    "running": "0"
                },
            }).then((result) => {
                console.log(result)
                this.historyContainerData = result.data.data.content
                this.totalHistoryContainerData = result.data.data.totalElements // 获取总条数
            }).catch(error => {
                this.handleError(error)
            });
        },

        // 取消查询，显示所有历史容器实例数据
        cancelSearchHistoryContainer:function(){
            this.currentPage = 1;
            // 获取所有容器实例信息
            axios({
                method: 'post',
                url: 'api/container/list?' + "page=" + this.currentPage + "&size=" + this.pageSize,
                headers: {
                    'content-Type' : "application/json",
                    "Authorization": `${sessionStorage.getItem('adminToken')}`
                },
                data: {
                    "namespace": "",
                    "username": "", 
                    "running": "0",
                }
            }).then((result) => {
                console.log(result)
                this.historyContainerData = result.data.data.content
                this.totalHistoryContainerData = result.data.data.totalElements // 获取总条数
                this.$nextTick(() => {
                    this.resetForm('historyContainerSearchForm');
                })
            }).catch(error => {
                this.handleError(error)
            });
        },

        // // 查询软件运行态log
        // searchSoftwareLog:function(){
        //     axios({
        //         method: 'post',
        //         url: 'api/log/getList?' + "page=" + this.currentPage + "&size=" + this.pageSize,
        //         headers: {
        //             'content-Type' : "application/json",
        //             "Authorization": `${sessionStorage.getItem('adminToken')}`
        //         },
        //         data: {
        //             "companyName": this.softwareLogSearchForm.searchCompanyName,
        //             "username": this.softwareLogSearchForm.searchUsername,
        //             "containerName": this.softwareLogSearchForm.searchContainerName,
        //         }
        //     }).then((result) => {
        //         console.log(result)
        //         this.softwareLogData = result.data.data.records
        //         this.totalLogData = result.data.data.total // 获取总条数
        //     }).catch(error => {
        //         this.handleError(error)
        //     });
        // },
        // // 取消查询，显示所有软件运行态log
        // cancelSearchSoftwareLog:function(){
        //     this.currentPage = 1;
        //     this.resetForm("softwareLogSearchForm");
        //     axios({
        //         method: 'post',
        //         url: 'api/log/getList?' + "page=" + this.currentPage + "&size=" + this.pageSize,
        //         headers: {
        //             'content-Type' : "application/json",
        //             "Authorization": `${sessionStorage.getItem('adminToken')}`
        //         },
        //         data: {
        //             // "companyName": this.softwareLogSearchForm.searchCompanyName,
        //             // "username": this.softwareLogSearchForm.searchUsername,
        //             // "containerName": this.softwareLogSearchForm.searchContainerName,
        //         }
        //     }).then((result) => {
        //         console.log(result)
        //         this.softwareLogData = result.data.data.records
        //         this.totalLogData = result.data.data.total // 获取总条数
        //     }).catch(error => {
        //         this.handleError(error)
        //     });
        // },

        // // 编辑用户数据
        // editUserData:function(index, row){  
        //     console.log(index, row);
        //     this.userDataChangeDiaVisible = true; // 显示表单
        //     this.editUserDataForm.username = row.username;
        //     this.editUserDataForm.name = row.name;
        //     this.editUserDataForm.phone = row.phone;
        // },
        // // 更改用户数据
        // changeUserData:function(){
        //     if (this.editUserDataForm.name == '' || this.editUserDataForm.phone == '' || this.editUserDataForm.username == '') {
        //         this.$message.error("存在空白项，请检查！");
        //     }
        //     else {
        //         this.userDataChangeDiaVisible = false;
        //         this.$message.success("编辑成功！");
        //     }

        //     // axios({
        //     //     method: 'post',
        //     //     url: 'api/main/update',
        //     //     headers: {
        //     //         'content-Type' : "application/json",
        //     //         "Authorization": `${sessionStorage.getItem('adminToken')}`
        //     //     },
        //     //     data: {
        //     //         "username": this.editUserDataForm.username,
        //     //         "name": this.editUserDataForm.name,
        //     //         "phone": this.editUserDataForm.phone,
        //     //     }
        //     // }).then((result) => {
        //     //     console.log(result)
        //     // }).catch(error => {
        //     //     this.handleError(error)
        //     // });

        // },
        // 编辑组织机构数据
        editCompanyData:function(index, row){
            console.log(index, row);
            this.companyDataChangeDiaVisible = true; // 显示表单
            this.editCompanyDataForm.companyName = row.name;
            this.editCompanyDataForm.cpu = row.cpu;
            this.editCompanyDataForm.memory = row.memory;
        },
        // 更改组织机构数据
        changeCompanyData:function(){
            if (this.editCompanyDataForm.companyName == '' || this.editCompanyDataForm.cpu == '' || this.editCompanyDataForm.memory == '') {
                this.$message({
                    message: "存在空白项，请检查！",
                    type: "error",
                    showClose: true,
                    duration: 8000,
                })
            }
            else {
                this.companyDataChangeDiaVisible = false;
                this.$message({
                    message: "编辑成功！",
                    type: "success",
                    showClose: true,
                    duration: 8000,
                })
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
            if(this.selectedImageList == ""){
                this.$message({
                    message: "未选择任何镜像！",
                    showClose: true,
                    duration: 8000,
                })
            }
            else {
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
                    this.$message({
                        message: "删除成功！",
                        type: "success",
                        showClose: true,
                        duration: 8000,
                    })
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
                            "companyId": "",
                            "status": "",
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

        // 获取配置文件选中项
        configFilesSelectionChange(val) {
            // 数组形式
            this.selectedConfigFiles = val.map(row => row.fileName);
        },

        // 获取用于创建镜像的文件选中项
        imageFilesSelectionChange(val) {
            // 数组形式
            this.selectedImageFilesList = val.map(row => row.fileName);
        },

        // 获取容器实例管理中的pod选中项
        podSelectionChange(val) {
            this.selectedContainerList = val.map(row => ({
                namespace: row.namespace,
                podName: row.podName,
            }));
        },

        // 获取历史容器实例页面中软件log选中项
        historySoftwareLogSelectionChange(val) {
            this.selectedHistorySoftwareLog = val.map(row => ({
                fileName: row.fileName,
                namespace: this.tempPodData.namespace,
                image: row.image,
            }));
        },

        // 用户审批页面
        changeMainTo1:function(){
            this.mainValue = 1;
            this.currentPage = 1;
            // 获取所有待审批用户信息
            axios({
                method: 'post',
                url: 'api/main/list?' + "page=" + this.currentPage + "&size=" + this.pageSize,
                headers: {
                    'content-Type' : "application/json",
                    "Authorization": `${sessionStorage.getItem('adminToken')}`
                },
                data: {
                    "status": "0",
                }
            }).then((result) => {
                console.log(result)
                this.verifyUserList = result.data.data.records
                this.totalVerifyUserData = result.data.data.total // 获得总条数
            }).catch(error => {
                this.handleError(error)
            });
        },

        // 镜像审批页面
        changeMainTo2:function(){
            this.mainValue = 2;
            this.currentPage = 1;
            this.selectedImageList = []
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
                this.totalVerifyImageData = result.data.data.total
            }).catch(error => {
                this.handleError(error)
            });
        },

        // 用户管理页面
        changeMainTo3:function(){
            this.mainValue = 3;
            this.currentPage = 1;
            this.showPasswordColumn = false;
            this.userSearchForm.searchCompanyName = ""
            this.userSearchForm.searchStatus = ""
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
                this.userData = result.data.data.records
                this.totalUserData = result.data.data.total // 获取总条数
            }).catch(error => {
                this.handleError(error)
            });
        },

        // 组织机构管理页面
        changeMainTo4:function(){
            this.mainValue = 4;
            this.currentPage = 1;
            this.companySearchForm.searchCompanyName = "";
            // 获得所有组织机构信息
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
                this.companyData = result.data.data.records
                this.totalCompanyData = result.data.data.total // 获取总条数
            }).catch(error => {
                this.handleError(error)
            });
        },

        // 镜像管理页面
        changeMainTo5:function(){
            this.mainValue = 5;
            this.currentPage = 1;
            this.imageSearchForm.searchCompanyId = "";
            this.imageSearchForm.searchImageName = "";
            this.imageSearchForm.searchStatus = "";
            this.selectedImageList = []
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
            this.containerSearchForm.namespace = ""
            this.containerSearchForm.username = ""
            this.selectedContainerList = []
            // 获取所有容器实例信息
            axios({
                method: 'post',
                url: 'api/container/list?' + "page=" + this.currentPage + "&size=" + this.pageSize,
                headers: {
                    'content-Type' : "application/json",
                    "Authorization": `${sessionStorage.getItem('adminToken')}`
                },
                data: {
                    "namespace": "",
                    "username": "",
                    "running": "1",
                }
            }).then((result) => {
                console.log(result)
                this.containerData = result.data.data.content
                this.totalContainerData = result.data.data.totalElements // 获取总条数
            }).catch(error => {
                this.handleError(error)
            });
        },

        // 日志管理页面
        changeMainTo7:function() {
            this.mainValue = 7
            this.currentPage = 1
            this.historyContainerSearchForm.namespace = ""
            this.historyContainerSearchForm.username = ""
            // 获取所有历史容器实例信息
            axios({
                method: 'post',
                url: 'api/container/list?' + "page=" + this.currentPage + "&size=" + this.pageSize,
                headers: {
                    'content-Type' : "application/json",
                    "Authorization": `${sessionStorage.getItem('adminToken')}`
                },
                data: {
                    "namespace": "",
                    "username": "", 
                    "running": "0",
                }
            }).then((result) => {
                console.log(result)
                this.historyContainerData = result.data.data.content
                this.totalHistoryContainerData = result.data.data.totalElements // 获取总条数
            }).catch(error => {
                this.handleError(error)
            });
        },


        // 创建组织机构
        createCompany:function(){
            if (this.createCompanyData.cpu == '' || this.createCompanyData.memory == '' || this.createCompanyData.name == '') {
                this.$message({
                        message: "存在空白项，请检查！",
                        type: "error",
                        showClose: true,
                        duration: 8000,
                    })
            }
            else if (isNaN(Number(this.createCompanyData.cpu)) || Number(this.createCompanyData.cpu) <= 0) {
                this.$message({
                        message: "CPU字段必须为数字！",
                        type: "error",
                        showClose: true,
                        duration: 8000,
                    })
            }
            else if (isNaN(Number(this.createCompanyData.memory)) || Number(this.createCompanyData.memory) <= 0) {
                this.$message({
                        message: "内存字段必须为数字！",
                        type: "error",
                        showClose: true,
                        duration: 8000,
                    })
            }
            else {
                // 调用接口创建组织机构
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
                    // 关闭窗口
                    this.createCompanyDiaVisible = false;
                    // 弹出提示信息
                    this.$message({
                        message: "创建成功！",
                        type: "success",
                        showClose: true,
                        duration: 8000,
                    })
                    // 调用接口 获取组织机构信息
                    this.currentPage = 1
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
                        this.companyData = result.data.data.records
                        this.totalCompanyData = result.data.data.total // 获取总条数
                    }).catch(error => {
                        this.handleError(error)
                    });
                    // 调用接口 获取组织机构列表
                    axios({
                        method: 'post',
                        url: 'api/company/list?size=100',
                        headers: {
                            "Authorization": `${sessionStorage.getItem('adminToken')}`
                        },
                        data: {
                            "status": "",
                            "name": "",
                        }
                    }).then((result) => {
                        console.log(result.data)
                        this.companyOptions = result.data.data.records
                        console.log(this.companyOptions)
                    }).catch(error => {
                        this.handleError(error)
                    })
                }).catch(error => {
                    this.handleError(error)
                });

            }
        },

        // 查看配置文件
        viewConfigFile(row){
            let configData = ""
            // 调用接口查看容器log
            axios({
                method: 'post',
                url: 'api/container/getConfigFile?' + "namespace=" + this.imageCompanyId + "&image=" + this.imageAndTags + "&fileName=" + row.fileName + "&option=1",
                headers: {
                    "Authorization": `${sessionStorage.getItem('adminToken')}`
                },
            }).then((result) => {
                console.log(result)
                configData = result.data
                configData = configData.toString().replace(/\n/g, "<br>");
                // 打开新页面展示log
                const newWindow = window.open('', '_blank');
                newWindow.document.write(configData);
            }).catch(error => {
                this.handleError(error)
            });
        },

        // 下载配置文件
        downloadConfigFile(row){
            axios({
                method: 'post',
                url: "http://localhost:7000/api/container/getConfigFile?" + "namespace=" + this.imageCompanyId + "&image=" + this.imageAndTags + "&fileName=" + row.fileName + "&option=0",
                responseType: 'blob',  // 指定响应类型为blob用于文件下载
                headers: {
                    "Authorization": `${sessionStorage.getItem('adminToken')}`
                }
            }).then((response) => {
                const blob = new Blob([response.data], { type: 'application/octet-stream' });
                const a = document.createElement('a');
                a.download = `${row.fileName}`;
                a.href = URL.createObjectURL(blob);
                a.click();
                URL.revokeObjectURL(a.href);
            }).catch((error) => {
                console.error(error);
            });
        },

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
                        "pvcName": "",
                    },
                }).then((result) => {
                    console.log(result)
                    this.$message({
                        message: "容器实例创建成功！",
                        type: "success",
                        showClose: true,
                        duration: 8000,
                    })
                }).catch(error => {
                    this.handleError(error)
                });
        },

        // 用户审批通过
        approveUser:function(){
            if (this.selectedUserList == '') {
                this.$message({
                    message: "未选择用户！",
                    showClose: true,
                    duration: 8000,
                })
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
                    // 弹窗提示
                    this.$message({
                        message: "审批成功！",
                        type: "success",
                        showClose: true,
                        duration: 8000,
                    })
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
                        this.verifyUserList = result.data.data.records
                        this.totalVerifyUserData = result.data.data.total // 获得总条数
                    }).catch(error => {
                        this.handleError(error)
                    });
                }).catch(error => {
                    this.handleError(error)
                });
            }
        },

        // 用户审批不通过
        rejectUser:function(){
            if (this.selectedUserList == '') {
                this.$message({
                    message: "未选择用户！",
                    type: "",
                    showClose: true,
                    duration: 8000,
                })
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
                    // 弹窗提示
                    this.$message({
                        message: "审批成功！",
                        type: "success",
                        showClose: true,
                        duration: 8000,
                    })
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
                        this.verifyUserList = result.data.data.records
                        this.totalVerifyUserData = result.data.data.total // 获得总条数
                    }).catch(error => {
                        this.handleError(error)
                    });
                }).catch(error => {
                    this.handleError(error)
                });
            }
        },

        // 镜像审批通过
        approveImage:function(){
            if (this.selectedImageList == '') {
                this.$message({
                    message: "未选择镜像！",
                    showClose: true,
                    duration: 8000,
                })
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
                    // 弹窗提示
                    this.$message({
                        message: "审批成功！",
                        type: "success",
                        showClose: true,
                        duration: 8000,
                    })
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
                        this.totalVerifyImageData = result.data.data.total // 获得总条数
                    }).catch(error => {
                        this.handleError(error)
                    });
                }).catch(error => {
                    this.handleError(error)
                });
                
                
            }
        },

        // 镜像审批不通过
        rejectImage:function(){
            if (this.selectedImageList == '') {
                this.$message({
                    message: "未选择镜像！",
                    showClose: true,
                    duration: 8000,
                })
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
                    // 弹窗提示
                    this.$message({
                        message: "审批成功！",
                        type: "success",
                        showClose: true,
                        duration: 8000,
                    })
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
                        this.totalVerifyImageData = result.data.data.total // 获得总条数
                    }).catch(error => {
                        this.handleError(error)
                    });
                }).catch(error => {
                    this.handleError(error)
                });
                
                
            }
        },

        // 打开历史容器实例页面软件运行态log的对话框
        openHistorySoftwareLogDia(row) {
            // 清空选中项
            this.selectedHistorySoftwareLog = []
            // 将该容器实例的podName和namespace暂时保存下来
            this.tempPodData.podName = row.podName
            this.tempPodData.namespace = row.namespace
            this.imageList = row.container_imageList.map(img_info => img_info.image);
            console.log(this.tempPodData)
            // 调用接口获取软件日志列表
            this.currentPage = 1
            axios({
                method: 'get',
                url: 'api/file/getSoftwareLogs?' + "podName=" + this.tempPodData.podName + "&namespace=" + this.tempPodData.namespace + "&imageList=" + this.imageList + "&page=" + this.currentPage + "&size=" + this.pageSize,
                headers: {
                    "Authorization": `${sessionStorage.getItem('adminToken')}`
                },
            }).then((result) => {
                console.log(result)
                if(result.data.data.content != null) {
                    this.historySoftwareLogData = result.data.data.content
                    // 转换格式 方便在el-table中显示
                    // this.historySoftwareLogData = this.historyOriginSoftwareLogData.map(item => {
                    //     return {
                    //         fileName: item
                    //     };
                    // });
                }
                this.totalHistorySoftwareLogData = result.data.data.totalElements // 获得总条数
                this.historSoftwareLogDiavisible = true
                this.changeMainTo7()
            }).catch(error => {
                this.handleError(error)
            });
        },

        // 删除历史容器实例的软件日志
        deleteHistorySoftwareLog() {
            console.log(this.selectedHistorySoftwareLog)
            if(this.selectedHistorySoftwareLog == "") {
                this.$message({
                    message: "未选择任何日志！",
                    type: "",
                    showClose: true,
                    duration: 8000,
                })
            }
            else {
                // 调用接口删除日志
                axios({
                    method: 'post',
                    url: 'api/file/deleteLogs',
                    headers: {
                        "Authorization": `${sessionStorage.getItem('adminToken')}`
                    },
                    data: this.selectedHistorySoftwareLog
                }).then((result) => {
                    console.log(result)
                    this.$message({
                        message: "日志删除成功！",
                        type: "success",
                        showClose: true,
                        duration: 8000,
                    })
                    // 调用接口获取删除后的日志列表
                    this.currentPage = 0
                    axios({
                        method: 'get',
                        url: 'api/file/getSoftwareLogs?' + "podName=" + this.tempPodData.podName + "&namespace=" + this.tempPodData.namespace + "&imageList=" + this.imageList + "&page=" + this.currentPage + "&size=" + this.pageSize,
                        headers: {
                            "Authorization": `${sessionStorage.getItem('adminToken')}`
                        },
                    }).then((result) => {
                        console.log(result)
                        if(result.data.data.content != null) {
                            this.historySoftwareLogData = result.data.data.content
                        }
                        this.totalHistorySoftwareLogData = result.data.data.totalElements // 获得总条数
                        this.historSoftwareLogDiavisible = true
                    }).catch(error => {
                        this.handleError(error)
                    });
                }).catch(error => {
                    this.handleError(error)
                });
            }
        },

        // 打开软件运行态log的对话框
        openSoftwareLogDia(row){
            // 将该容器实例的podName和namespace暂时保存下来
            this.tempPodData.podName = row.podName
            this.tempPodData.namespace = row.namespace
            this.imageList = row.container_imageList.map(img_info => img_info.image);
            console.log(this.tempPodData)
            // 调用接口获取软件日志列表
            this.currentPage = 0
            axios({
                    method: 'get',
                    url: 'api/file/getSoftwareLogs?' + "podName=" + this.tempPodData.podName + "&namespace=" + this.tempPodData.namespace + "&imageList=" + this.imageList + "&page=" + this.currentPage + "&size=" + this.pageSize,
                    headers: {
                        "Authorization": `${sessionStorage.getItem('adminToken')}`
                    },
                }).then((result) => {
                    console.log(result)
                    if(result.data.data.content != null) {
                        this.softwareLogData = result.data.data.content
                        // // 转换格式 方便在el-table中显示
                        // this.softwareLogData = this.originSoftwareLogData.map(item => {
                        //     return {
                        //         fileName: item
                        //     };
                        // });
                    }
                    this.totalSoftwareLogData = result.data.data.totalElements // 获得总条数
                    this.softwareLogDiavisible = true
                }).catch(error => {
                    this.handleError(error)
                });
            
        },

        // 打开容器实例log的对话框
        openContainerLogDia(row){
            this.containerLogDiavisible = true
            // 将该容器实例的podName和namespace暂时保存下来
            this.tempPodData.podName = row.podName
            this.tempPodData.namespace = row.namespace
        },

        // 查看软件log
        viewSoftwareLog(row){
            let logData = ""
            
            // 调用接口查看软件log
            axios({
                method: 'get',
                url: 'api/file/download?' + "image=" + row.image + "&namespace=" + this.tempPodData.namespace + "&fileName=" + row.fileName + "&option=1",
                headers: {
                    "Authorization": `${sessionStorage.getItem('adminToken')}`
                },
            }).then((result) => {
                console.log(result)
                logData = result.data
                logData = logData.toString().replace(/\n/g, "<br>")
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
                url: 'http://localhost:7000/api/file/download?' + "image=" + row.image + "&namespace=" + this.tempPodData.namespace + "&fileName=" + row.fileName + "&option=0",
                responseType: 'blob',  // 指定响应类型为blob用于文件下载
                headers: {
                    "Authorization": `${sessionStorage.getItem('adminToken')}`
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
                url: 'api/container/getPodLog?' + "namespace=" + this.tempPodData.namespace + "&podName=" + this.tempPodData.podName + "&option=1",
                headers: {
                    "Authorization": `${sessionStorage.getItem('adminToken')}`
                },
            }).then((result) => {
                console.log(result)
                logData = result.data
                logData = logData.toString().replace(/\n/g, "<br>")
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
                url: "http://localhost:7000/api/container/getPodLog?" + "namespace=" + this.tempPodData.namespace + "&podName=" + this.tempPodData.podName + "&option=0",
                responseType: 'blob',  // 指定响应类型为blob用于文件下载
                headers: {
                    "Authorization": `${sessionStorage.getItem('adminToken')}`
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

        // 点击按钮切换页面
        handleCurrentChange(currentPage) {
            this.currentPage = currentPage; //每次点击分页按钮，当前页发生变化
            // 如果当前页面是用户审批页面
            if(this.mainValue == 1) {
                axios({
                    method: 'post',
                    url: 'api/main/list?' + "page=" + this.currentPage + "&size=" + this.pageSize,
                    headers: {
                        'content-Type' : "application/json",
                        "Authorization": `${sessionStorage.getItem('adminToken')}`
                    },
                    data: {
                        "status": "0",
                    }
                }).then((result) => {
                    console.log(result)
                    this.verifyUserList = result.data.data.records
                    this.totalVerifyUserData = result.data.data.total // 获得总条数
                }).catch(error => {
                    this.handleError(error)
                });
            }
            // 如果当前页面是镜像审批页面
            if(this.mainValue == 2) {
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
                    this.totalVerifyImageData = result.data.data.total
                }).catch(error => {
                    this.handleError(error)
                });
            }
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
                            this.userData = result.data.data.records
                            this.totalUserData = result.data.data.total // 获取总条数
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
                            this.userData = result.data.data.records
                            this.totalUserData = result.data.data.total // 获取总条数
                        }).catch(error => {
                            this.handleError(error)
                        });
                }
            }
            // 如果当前页面是组织机构管理页面
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
                    this.companyData = result.data.data.records
                    this.totalCompanyData = result.data.data.total // 获取总条数
                }).catch(error => {
                    this.handleError(error)
                });
            }
            // 如果当前页面是镜像信息页面且没有打开配置文件的对话框也没有打开镜像文件的对话框
            if(this.mainValue == 5 && this.configDiaVisible == false && this.imageFileDiaVisible == false) {
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

            // 如果当前页面是镜像信息页面且打开了配置文件的对黄框
            if(this.mainValue == 5 && this.configDiaVisible == true && this.imageFileDiaVisible == false) {
                // 调用接口 获取所有config文件列表
                axios({
                    method: 'get',
                    url: 'api/container/getConfigList?' + 'namespace=' + this.imageCompanyId + "&image=" + this.imageAndTags + "&page=" + this.currentPage + "&size=" + this.pageSize,
                    headers: {
                            "Authorization": `${sessionStorage.getItem('adminToken')}`,
                    },
                }).then((result) => {
                    console.log(result.data)
                    if(result.data.data.content != null) {
                        this.configFileData = result.data.data.content
                        // 转换格式 方便在el-table中显示
                        this.configFileData = this.configFileData.map(item => {
                            return {
                                fileName: item
                            };
                        });
                    }
                    this.totalConfigFileData = result.data.data.totalElements // 获取总条数
                }).catch(error => {
                    this.handleError(error)
                })
            }
            // 如果当前页面是镜像信息页面且打开了镜像文件的对黄框
            if(this.mainValue == 5 && this.configDiaVisible == false && this.imageFileDiaVisible == true) {
                // 调用接口获取该镜像对应的所有文件
                axios({
                    method: 'get',
                    url: 'api/image/getResourcesForBuild?' + 'namespace=' + this.imageCompanyId + '&image=' + this.imageAndTags + '&page=' + this.currentPage + '&size=' + this.pageSize,
                    headers: {
                            "Authorization": `${sessionStorage.getItem('adminToken')}`,
                    },
                }).then((result) => {
                    console.log(result.data)
                    this.totalImageFiles = result.data.data.totalElements
                    if(result.data.data.content != null) {
                        this.imageFiles = result.data.data.content
                        // 转换格式 方便在el-table中显示
                        this.imageFiles = this.imageFiles.map(item => {
                            return {
                                fileName: item
                            };
                        });
                    }
                }).catch(error => {
                    this.handleError(error)
                })
            }

            // 如果当前页面是容器实例管理页面且没有打开软件log的dialog
            if(this.mainValue == 6 && this.softwareLogDiavisible == false) {
                axios({
                    method: 'post',
                    url: 'api/container/list?' + "page=" + this.currentPage + "&size=" + this.pageSize,
                    headers: {
                        'content-Type' : "application/json",
                        "Authorization": `${sessionStorage.getItem('adminToken')}`
                    },
                    data: {
                        "namespace": this.containerSearchForm.namespace,
                        "username": this.containerSearchForm.username,
                        "running": "1"
                    }
                }).then((result) => {
                    console.log(result)
                    this.containerData = result.data.data.content
                    this.totalLogData = result.data.data.totalElements // 获取总条数
                }).catch(error => {
                    this.handleError(error)
                });
            }

            // 如果当前页面是容器实例页面且打开了软件log的dialog
            if(this.mainValue == 6 && this.softwareLogDiavisible == true) {
                // 调用接口获取软件日志列表
                axios({
                    method: 'get',
                    url: 'api/file/getSoftwareLogs?' + "podName=" + this.tempPodData.podName + "&namespace=" + this.tempPodData.namespace + "&imageList=" + this.imageList + "&page=" + this.currentPage + "&size=" + this.pageSize,
                    headers: {
                        "Authorization": `${sessionStorage.getItem('adminToken')}`
                    },
                }).then((result) => {
                    console.log(result)
                    if(result.data.data.content != null) {
                        this.softwareLogData = result.data.data.content
                        // 转换格式 方便在el-table中显示
                        // this.softwareLogData = this.originSoftwareLogData.map(item => {
                        //     return {
                        //         fileName: item
                        //     };
                        // });
                    }
                    this.totalSoftwareLogData = result.data.data.totalElements // 获得总条数
                }).catch(error => {
                    this.handleError(error)
                });
            }

            // 如果当前页面是日志管理页面且没有打开软件log的dialog
            if(this.mainValue == 7 && this.historSoftwareLogDiavisible == false) {
                // 获取所有容器实例信息
                axios({
                    method: 'post',
                    url: 'api/container/list?' + "page=" + this.currentPage + "&size=" + this.pageSize,
                    headers: {
                        'content-Type' : "application/json",
                        "Authorization": `${sessionStorage.getItem('adminToken')}`
                    },
                    data: {
                        "namespace": this.historyContainerSearchForm.namespace,
                        "username": this.historyContainerSearchForm.username, 
                        "running": "0",
                    }
                }).then((result) => {
                    console.log(result)
                    this.historyContainerData = result.data.data.content
                    this.totalHistoryContainerData = result.data.data.totalElements // 获取总条数
                }).catch(error => {
                    this.handleError(error)
                });
            }

            // 如果当前页面是日志管理页面且打开了软件log的dialog
            if(this.mainValue == 7 && this.historSoftwareLogDiavisible == true) {
                // 调用接口获取软件日志列表
                axios({
                    method: 'get',
                    url: 'api/file/getSoftwareLogs?' + "podName=" + this.tempPodData.podName + "&namespace=" + this.tempPodData.namespace + "&imageList=" + this.imageList + "&page=" + this.currentPage + "&size=" + this.pageSize,
                    headers: {
                        "Authorization": `${sessionStorage.getItem('adminToken')}`
                    },
                }).then((result) => {
                    console.log(result)
                    if(result.data.data.content != null){
                        this.historySoftwareLogData = result.data.data.content
                        // 转换格式 方便在el-table中显示
                        // this.historySoftwareLogData = this.historyOriginSoftwareLogData.map(item => {
                        //     return {
                        //         fileName: item
                        //     };
                        // });
                    }
                    this.totalHistorySoftwareLogData = result.data.data.totalElements // 获得总条数
                }).catch(error => {
                    this.handleError(error)
                });
            }
        },

        // 格式化用户状态
        formatUserStatus(row, column, cellValue, index) {
            switch (cellValue) {
                case 0:
                    return '正常';
                case 1:
                    return '已删除';
                case 2:
                    return '异常';
                default:
                    return '未知状态';  
            }
        },

        // 打开Harbor页面
        openHarbor() {
            window.open('https://192.168.5.130:1119/');
        },

        // 将时间中间的T换成空格
        formatTime(timeStr) {
            if (timeStr === null) {
                return '-'; 
            }
            return timeStr.replace('T', '\n');
        },

        // 错误处理
        handleError(error) {
            if (error.response) {
                // error.response包含了服务器响应的详细信息
                const statusCode = error.response.status;
                const errorMessage = error.response.data.msg;
                // 错误提示
                this.$message({
                    message: `${statusCode}: ${errorMessage}`,
                    type: "error",
                    showClose: true,
                    duration: 8000,
                })
                } else {
                    // 其他错误（例如网络问题）
                    this.$message({
                        message: `${error}`,
                        type: "error",
                        showClose: true,
                        duration: 8000,
                    })
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

/* 密码弱中强字体颜色 */
.color-ruo{
  color: #f56c6c;
}
.color-zhong{
  color: #e6a23c;
}
.color-qiang{
  color: #67c23a;
}

</style>
