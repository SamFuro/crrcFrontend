<template>
    <div>
        <el-container style="height: 700px; border: 1px solid #eee">
        <el-header style="font-size: 37px; background-color: rgb(199, 0, 25); color: white;">用户系统</el-header>
        <el-container>
            <el-aside width="200px" style="background-color: rgb(238, 241, 246)">
                <el-menu :default-openeds="['1', '1-2']">
                    <el-submenu index="1">
                        <template slot="title"><i class="el-icon-message"></i>信息管理</template>
                        <el-menu-item index="1-1" @click="changeMainTo1">个人信息</el-menu-item>
                        <el-submenu index="1-2">
                            <template slot="title">镜像信息</template>
                            <el-menu-item index="1-2-1" @click="changeMainTo2">创建镜像</el-menu-item>
                            <el-menu-item index="1-2-2" @click="changeMainTo3">查看信息</el-menu-item>
                        </el-submenu>
                        <el-menu-item index="1-3" @click="changeMainTo4">容器实例信息</el-menu-item>
                        <el-menu-item index="1-4" @click="changeMainTo5">历史日志信息</el-menu-item>
                    </el-submenu>
                </el-menu>
            </el-aside>

            <!-- 个人信息页面 -->
            <el-main v-if="mainValue == 1">
            <el-descriptions title="个人信息" border column="1" style="width: 500px; margin-left: 350px; margin-top: 50px;">
                <!-- <el-descriptions-item label="头像">
                    <el-avatar :src="avatarPath"></el-avatar>
                </el-descriptions-item> -->
                <el-descriptions-item :contentStyle="{'text-align': 'center'}" :labelStyle="{'text-align': 'center'}">
                    <template slot="label">
                        <i class="el-icon-user-solid"></i>
                        用户名
                    </template>
                    {{ userData.username }}
                </el-descriptions-item>
                <el-descriptions-item :contentStyle="{'text-align': 'center'}" :labelStyle="{'text-align': 'center'}">
                    <template slot="label">
                        <i class="el-icon-phone"></i>
                            手机号
                        </template>
                    {{  userData.phone }}
                </el-descriptions-item>
                <el-descriptions-item :contentStyle="{'text-align': 'center'}" :labelStyle="{'text-align': 'center'}">
                    <template slot="label">
                        <i class="el-icon-s-home"></i>
                            组织机构
                        </template>
                    {{ userData.companyName }}
                </el-descriptions-item>
            </el-descriptions>
            <span>
                <el-button type="primary"  style="margin-left: 620px; margin-top: 20px;" @click="userDataChangeDiaVisible = true; editUserDataForm.phone='';">修改个人信息</el-button>
                <el-button type="danger" @click="userPasswordChangeDiaVisible = true; $nextTick(() => {resetForm('editUserDataForm')}); strength='';">修改密码</el-button>
            </span>

            <!-- 用户信息修改dialog -->
            <el-dialog title="编辑用户信息" :visible.sync="userDataChangeDiaVisible" width="400px">
                <el-form :model="editUserDataForm">
                    <!-- <el-form-item label="姓名" :label-width='"100px"'>
                        <el-input v-model="editUserDataForm.name" autocomplete="off" width="200px"></el-input>
                    </el-form-item> -->
                    <el-form-item label="手机号" :label-width='"100px"'>
                        <el-input v-model="editUserDataForm.phone" autocomplete="off" maxlength="11" show-word-limit></el-input>
                    </el-form-item>
                </el-form>
                <div slot="footer">
                    <el-button @click="userDataChangeDiaVisible = false">取 消</el-button>
                    <el-button type="primary" @click="changeUserData">确 定</el-button>
                </div>
            </el-dialog>

            <!-- 用户密码修改dialog -->
            <el-dialog title="修改密码" :visible.sync="userPasswordChangeDiaVisible" width="400px">
                <el-form :model="editUserDataForm" ref="editUserDataForm" :rules="changeUserPasswordRules" label-width="80px">
                    <el-form-item label="新密码" prop="password">
                        <el-input v-model="editUserDataForm.password" type="password" show-password @input="checkPasswordStrength" autocomplete="off"></el-input>
                        <span>密码强度：<span :class="tipsColor">{{ strength }}</span></span>
                    </el-form-item>
                    <el-form-item label="确认密码" prop="passConfirm">
                        <el-input v-model="editUserDataForm.passConfirm" type="password" show-password autocomplete="off"></el-input>
                    </el-form-item>
                </el-form>
                <div slot="footer">
                    <el-button @click="userPasswordChangeDiaVisible = false">取 消</el-button>
                    <el-button type="primary" @click="changeUserPassword">确 定</el-button>
                </div>
            </el-dialog>


            </el-main>
            
            <!-- 镜像信息上传页面 -->
                <el-main v-if="mainValue == 2">
                    <!-- 页面上方按钮 -->
                    <el-form :inline="true" align="center">
                        <el-form-item>
                            <el-button type="primary" @click="openUploadImageDia2">创建镜像</el-button>
                            <el-button type="success" @click="checkFile" :disabled="!imageButtonEnabled">上传文件</el-button>
                                <input id="uploadImage" type="file" style="display: none;"  ref="uploadImage" @change="uploadImage($event)" multiple />
                            <el-button type="danger" style="margin-left: 10px;" @click="deleteImageFiles" :disabled="!imageButtonEnabled">删除文件</el-button>
                            <el-button type="success" @click="buildImage" :disabled="!imageButtonEnabled">打包推送镜像</el-button>
                        </el-form-item>
                    </el-form>

                    <!-- 内容表格（文件名） -->
                    <el-table :data="imageFiles" key="imageFiles" @selection-change="imageFilesSelectionChange" align="center">
                        <el-table-column prop="fileName" label="文件名" align="center" width="600px"></el-table-column>
                        <el-table-column type="selection" align="center" width="55"></el-table-column>
                    </el-table>
                    

                    <!-- 创建镜像表单 -->
                    <el-dialog title="创建镜像" :visible.sync="uploadImageDia2Visible" v-if="uploadImageDia2Visible">
                        <el-table :data="imageData" key="imageDataForCreate">
                            <el-table-column prop="name" label="镜像名称" align="center"></el-table-column>
                            <el-table-column prop="tags" label="标签" align="center"></el-table-column>
                            <el-table-column label="操作" align="center">
                                <template slot-scope="scope">
                                    <el-button size="mini" type="primary" @click="selectCurrentImage(scope.row)">选择</el-button>
                                </template>
                            </el-table-column>
                        </el-table>
                        <el-button type="danger" size="mini" style="margin-top: 20px; margin-left: 620px;" @click="uploadImageDia2Visible = false; $nextTick(() => {resetForm('newImage')}); writeImageInfoDiaVisible = true">创建新的镜像</el-button>
                        <!-- 分页条 -->
                        <el-pagination
                            background
                            align="center"
                            :hide-on-single-page = true
                            style="margin-top: 20px;"
                            layout="prev, pager, next, jumper"
                            :total="this.totalImageData"
                            @current-change="handleCurrentChange"
                            :current-page="currentPage"
                            :page-size="pageSize">
                        </el-pagination>
                    </el-dialog>

                    <!-- 填写imageName和tag表单 -->
                    <el-dialog title="填写镜像信息" :visible.sync="writeImageInfoDiaVisible" width="400px">
                        <el-form :model="newImage" :rules="newImageRules" ref="newImage" label-position="left" label-width="80px">
                            <el-form-item label="镜像名称" prop="imageName">
                                <el-input v-model="newImage.imageName"></el-input>
                            </el-form-item>
                            <el-form-item label="标签名称" prop="tags">
                                <el-input v-model="newImage.tags"></el-input>
                            </el-form-item>
                            <el-form-item>
                                <el-popover
                                    placement="bottom"
                                    title="命名规则"
                                    trigger="hover">
                                        <div>
                                            1、只能使用小写字母（a - z）、数字（0 - 9）、连字符（-）、点号（.）和下划线（_）。<br/>
                                            2、只能以数字或小写字母开头或结尾。<br/>
                                            3、不能连续出现多个特殊字符（例如 “..”  “--”  “.-”  “-_”等）。<br/>
                                        </div>
                                    <el-button slot="reference" type="info" plain>查看命名规则</el-button>
                                </el-popover>
                            </el-form-item>
                        </el-form>
                        <div slot="footer">
                            <el-button @click="writeImageInfoDiaVisible = false; resetForm('newImage')">取 消</el-button>
                            <el-button type="primary" @click="createNewImage">确 定</el-button>
                        </div>
                    </el-dialog>

                    <!-- 分页条 -->
                    <el-pagination
                        background
                        align="center"
                        :hide-on-single-page = true
                        style="margin-top: 20px;"
                        layout="prev, pager, next, jumper"
                        :total="this.totalImageFiles"
                        @current-change="handleCurrentChange"
                        :current-page="currentPage"
                        :page-size="pageSize">
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
                            <!-- <el-button type="primary" @click="openUploadImageDia" disabled>上传</el-button> -->
                            <el-button type="danger" @click="deleteImage">删除</el-button>
                            <el-button type="primary" @click="openCreateCommunicatePodDia" style="margin-left: 80px;">创建通信容器实例</el-button>
                        </el-form-item>
                    </el-form>

                    <!-- 用户填写pod名称dialog -->
                    <el-dialog title="填写Pod名称" :visible.sync="writePodNameDiaVisible" width="400px" >
                        <el-form>
                            <el-form-item label="Pod名称" :label-width='"100px"'>
                                <el-input v-model="podNameUserWrite" autocomplete="off"></el-input>
                            </el-form-item>
                            <el-form-item>
                                <el-popover
                                    placement="bottom"
                                    title="命名规则"
                                    style="margin-left: 30px;"
                                    trigger="hover">
                                        <div>
                                            1、必须以小写字母或数字开头。<br/>
                                            2、中间可以包含连字符（-）与小写字母、数字的组合，且连字符两侧至少要有一个小写字母或数字。<br/>
                                            3、可以包含多个由点号（.）分隔的部分，每个部分同样要遵循规则1和规则2。<br/>
                                            符合要求的命名如：“abc”、“abc-123”、“abc.xyz”、“abc-123.xyz-456”、“a1.b2.c3”等。
                                        </div>
                                    <el-button slot="reference" type="info" plain>查看命名规则</el-button>
                                </el-popover>
                            </el-form-item>
                        </el-form>
                        <div slot="footer">
                            <el-button @click="writePodNameDiaVisible = false">取 消</el-button>
                            <el-button type="primary" @click="createPodForCommunicate">确 定</el-button>
                        </div>
                    </el-dialog>

                    <!-- 上传镜像dialog 
                    <el-dialog title="上传镜像" :visible.sync="uploadImageDiaVisible">
                        <el-form>
                            <el-form-item label="tar包名称">
                                <el-input v-model="uploadImageName" autocomplete="off"></el-input>
                            </el-form-item>
                            <el-form-item>
                                <el-button icon="el-icon-document-copy" type="primary" @click="checkFile2">上传镜像</el-button>
                                    <input id="fileInput" type="file" style="display: none;"  ref="uploadRef" @change="uploadImage($event)" />
                            </el-form-item>
                        </el-form>
                    </el-dialog>-->

                     <!-- 内容表格 -->
                    <el-table :data="imageData" border @selection-change="imageSelectionChange" key="imageDataTable" ref="imageData">
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
                        <!-- <el-table-column prop="projectName" label="项目名称" align="center" width="200px"></el-table-column> -->
                        <!-- 操作按钮 创建容器实例 -->
                        <el-table-column label="操作" align="center" width="250px">
                            <template slot-scope="scope">
                                <el-button size="mini" type="primary" @click="createContainer(scope.row)">创建容器实例</el-button>
                                <el-button size="mini" type="danger" @click="openConfigDia(scope.row)">配置文件</el-button>
                            </template>
                        </el-table-column>
                        <el-table-column type="selection" align="center" width="55"></el-table-column>
                    </el-table>
                    <br>

                    <!-- 创建容器实例 dialog -->
                    <!-- <el-dialog title="创建容器实例" :visible.sync="createContainerDiavisible" v-if="createContainerDiavisible">
                        <el-table :data="pvcData" key="pvcData">
                            <el-table-column label="镜像名称" prop="imageName" align="center"></el-table-column>
                            <el-table-column label="创建时间" prop="createTime" align="center">
                                <template #default="scope">
                                    {{ formatTime(scope.row.createTime) }}
                                </template>
                            </el-table-column>
                            操作按钮 查看&下载
                            <el-table-column label="操作" align="center">
                                <template slot-scope="scope">
                                    <el-button size="mini" type="primary" @click="createContainer(scope.row)">使用</el-button>
                                </template>
                            </el-table-column>
                        </el-table>
                        <el-button type="danger" size="mini" @click="createContainerWithNewPvc" style="margin-top: 20px; margin-left: 460px">使用新的pvc创建容器实例</el-button>

                        分页条
                        <el-pagination
                            background
                            align="center"
                            :hide-on-single-page = true
                            style="margin-top: 20px; margin-right: 20px"
                            layout="prev, pager, next, jumper"
                            :total="this.totalPvcData"
                            @current-change="handleCurrentChange"
                            :current-page="currentPage"
                            :page-size="pageSize">
                        </el-pagination>
                    </el-dialog> -->

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
                            <el-button type="primary" size="mini" @click="checkConfigFile" style="margin-left: 580px; margin-top:20px">上传文件</el-button>
                                <input id="uploadConfig" type="file" style="display: none;"  ref="uploadConfig" @change="uploadConfig($event)" multiple />
                            <el-button type="danger" size="mini" @click="deleteConfigFile" style="margin-left: 10px;">删除</el-button>
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


            <!-- 容器实例页面 -->
                <el-main v-if="mainValue == 4">
                    <!-- 查询功能 -->
                    <el-form :inline="true" :model="containerSearchForm" align="center" ref="containerSearchForm" :rules="containerRules">
                        <el-form-item label="用户名" style="margin-left: 30px;" prop="username">
                            <el-input v-model="containerSearchForm.username" placeholder="请输入内容"></el-input>
                        </el-form-item>
                        <el-form-item>
                            <el-button type="primary" @click="searchContainer" >查询</el-button>
                            <el-button type="danger" @click="cancelSearchContainer" >取消</el-button>
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



 
                    <!-- <el-table :data="containerData" border @selection-change="podSelectionChange" key="containerData">
                        <el-table-column prop="containerName" label="容器实例名称" align="center"></el-table-column>
                        <el-table-column prop="imageName" label="镜像名称" align="center"></el-table-column>
                        <el-table-column prop="podName" label="pod名称" align="center"></el-table-column>
                        <el-table-column prop="username" label="用户名" align="center"></el-table-column>
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
                        <el-table :data="softwareLogData2" key="softwareLogDataTable">
                            <el-table-column label="日志名称" prop="fileName" align="center"></el-table-column>
                            <el-table-column label="更新时间" prop="updateTime" align="center">
                                <template #default="scope">
                                    {{ formatTime(scope.row.updateTime) }}
                                </template>
                            </el-table-column>
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
                            style="margin-top: 20px;"
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

            <!-- 历史日志主页面 -->
            <el-main v-if="mainValue == 5">
                <!-- 查询功能 -->
                <el-form :inline="true" :model="historyContainerSearchForm" align="center" ref="historyContainerSearchForm" :rules="historyContainerRules">
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


                <!-- 历史容器实例界面 软件log dialog -->
                <el-dialog title="软件运行态日志" :visible.sync="historSoftwareLogDiavisible" v-if="historSoftwareLogDiavisible">
                    <el-table :data="historySoftwareLogData" key="historySoftwareLogData">
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
                        <!-- <el-table-column type="selection" align="center" width="55"></el-table-column> -->
                    </el-table>
                    <!-- <span>
                        <el-button type="danger" size="mini" @click="deleteHistorySoftwareLog" style="margin-left: 670px; margin-top:20px">删除</el-button>
                    </span> -->
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
import { Loading } from 'element-ui';

export default{
    // components: {
    //     test2
    // },
    data () {
        const equalToPassword = (rule, value, callback) => {
            if (this.editUserDataForm.passConfirm !== this.editUserDataForm.password) {
                callback(new Error("两次输入的密码不一致"));
            } else {
                callback();
            }
        };
        return {
            originSoftwareLogData: [], // 初始软件运行态log数据（纯数组形式）
            softwareLogData: [], // 软件运行态log数据（暂时没用）
            softwareLogData2: [], // 软件log数据（如log.txt testlog.txt等）
            imageData: [], // 镜像数据
            imageFiles: [], // 用于创建镜像的文件
            imageList: [], // 用于存放容器实例信息页面点击软件日志后的imageList，用于软件日志的翻页
            containerData: [], // 容器实例数据
            historyContainerData: [], // 历史的容器实例数据（running = 0）
            // userLogData: [], // 用户日志数据
            pvcData: [], // 创建容器实例时，展示的pvc列表数据
            selectedImageList: [], // 选中的镜像列表
            selectedContainerList: [], // 选中的容器实例列表
            selectedImageFilesList: [], // 选中的用于创建镜像的文件列表
            selectedConfigFiles: [], // 选中的配置文件列表
            historySoftwareLogData: [], // （历史容器实例）处理后软件log数据（如log.txt testlog.txt等）
            selectedHistorySoftwareLog: [], // 选中的历史容器实例软件log列表
            configFileData: [], // 配置文件列表
            totalImageData: 0, // 镜像数据总条数
            totalContainerData: 0, // 容器实例数据总条数
            totalHistoryContainerData: 0, // 历史容器实例数据总条数
            totalSoftwareLogData: 0, // 软件运行态log数据总条数
            totalSoftwareLogData2: 0, // 软件运行态log数据总条数（测试页面）
            totalHistorySoftwareLogData: 0, // （历史容器实例）软件运行态log数据总条数
            totalPvcData: 0, // pvc数据总条数
            totalImageFiles: 0, // 用于打包镜像的文件总数
            totalConfigFileData: 0, // 配置文件总条数
            pageSize: 7, // 每页显示的数据条数
            mainValue: 0, // 控制主页面切换
            currentPage: 1, // 当前页面
            uploadImageName: "", // 上传的镜像包的名称
            uploadImageDiaVisible: false, // 上传镜像文件对话框显示与否
            uploadImageDia2Visible: false, // 上传镜像文件对话框显示与否（待修改）
            softwareLogDiavisible: false, // 软件log对话框显示与否
            containerLogDiavisible: false, // 容器log对话框显示与否
            // createContainerDiavisible: false, // 创建容器实例的对话框显示与否
            userDataChangeDiaVisible: false, // 用户修改个人信息对话框显示与否
            userPasswordChangeDiaVisible: false, // 用户修改密码对话框显示与否
            writeImageInfoDiaVisible: false, // 用户填写镜像名称和标签对话框显示与否
            imageButtonEnabled: false, // 镜像相关按钮能否点击
            writePodNameDiaVisible: false, // 用户填写Pod名称对话框显示与否
            historSoftwareLogDiavisible: false, // 历史容器实例的软件log对话框显示与否
            configDiaVisible: false, // config文件对话框显示与否
            imageAndTags: "", // 存放imagename:tags的标签，目的是用于pvc的翻页
            podNameUserWrite: "", // 用户填写的pod名称，用于创建通信的pod
            strength: "", // 密码强度（弱，中，强）
            // avatarPath: require("@/test/testAvatar.jpeg"),

            // 用户数据
            userData: {  
                "username": "",
                "name": "",
                "phone": "",
                "companyName": "",
                "companyId": "",
                "namespace": "",
            },

            // 创建新镜像的数据
            newImage: {
                "imageName": "",
                "tags": "",
            },

            // 用于存储当前待上传文件的镜像
            currentNewImage: {
                "imageName": "",
                "tags": "",
            },
            
            // 打开两类log的dialog后，临时存放当前的Pod的podName和namespace
            tempPodData:{
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

            // 历史容器实例管理搜索功能中的值
            historyContainerSearchForm: {
                username: "", // 用户名
            },

            // 软件运行态log管理搜索功能中的值
            softwareLogSearchForm: {
                searchCompanyName: "",
                searchUsername: "",
                searchContainerName: "",
            },

            // 更改用户信息时，选中的用户的值
            editUserDataForm:{
                phone: "",
                password: "",
                passConfirm: "",
            },

            // 软件运行态log table rules（测试）
            rules: {
                searchCompanyName: [{ required: false, trigger:"blur"},],
                searchUsername: [{ required: false, trigger:"blur"},],
                searchContainerName: [{ required: false, trigger:"blur"},],
            },
            // 镜像信息table rules
            imageRules:{
                searchImageName: [{ required: false, trigger:"change"}],    
            },
            // 容器实例table rules
            containerRules:{
                username: [{ required: false, trigger:"change"}],
            },
            // 历史容器实例table rules
            historyContainerRules:{
                username: [{ required: false, trigger:"change"}],
            },
            // 创建新镜像时填写imageName和tags的rules
            newImageRules:{
                imageName: [{ required: true, message: "镜像名不能为空", trigger:"blur"}],
                tags: [{ required: true, message: "标签名不能为空", trigger:"blur"}],
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

        }
    },
    computed: {
        // 计算两个周期值
        tipsColor: function () {
            let str = this.strength;
            if(str == "弱") {
                return 'color-ruo'
            } else if(str == "中") {
                return 'color-zhong'
            } else if(str == "强") {
                return 'color-qiang'
            } else{
                return ''
            }
        },
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
            console.log(result)
            this.userData.username = result.data.data.username
            this.userData.name = result.data.data.name
            this.userData.phone = result.data.data.phone
            this.userData.companyName = result.data.data.companyName
            this.userData.namespace = result.data.data.CompanyId
            this.userData.namespace = result.data.data.namespace
            console.log(this.userData)
        }).catch(error => {
            this.handleError(error)
        });
    },

    methods:{
        // 展开pod触发事件
        expandPod() {

        },

        // 展开历史pod触发事件
        expandHistoryPod() {

        },

        // 打开配置文件的对话框
        openConfigDia(row) {
            // 清空选中项
            this.selectedConfigFiles = []
            this.currentPage = 1
            this.imageAndTags = row.name + ':' + row.tags
            // 调用接口 获取所有config文件列表
            axios({
                method: 'get',
                url: 'api/container/getConfigList?' + 'namespace=' + this.userData.namespace + "&image=" + this.imageAndTags + "&page=" + this.currentPage + "&size=" + this.pageSize,
                headers: {
                        "Authorization": `${sessionStorage.getItem('userToken')}`,
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


        // 创建用于通信的Pod
        createPodForCommunicate() {
            const regExp = /^[a-z0-9]([-a-z0-9]*[a-z0-9])?(\.[a-z0-9]([-a-z0-9]*[a-z0-9])?)*$/;
            if(this.podNameUserWrite == "") {
                this.$message({
                    message: "Pod名称为空！",
                    type: "error",
                    showClose: true,
                    duration: 8000,
                })
            }
            else if(!regExp.test(this.podNameUserWrite)) {
                this.$message({
                    message: "Pod名称格式不正确！",
                    type: "error",
                    showClose: true,
                    duration: 8000,
                })
            }
            else {
                const imageList = this.selectedImageList.map(item => `${item.imageName}:${item.tag}`);
                // console.log(imageList)
                // console.log(regExp.test(this.podNameUserWrite))
                // 调用接口创建pod
                axios({
                    method: 'post',
                    url: 'api/container/createPodForCommunicate?' + 'namespace=' + this.userData.namespace + "&podName=" + this.podNameUserWrite + "&imageList=" + imageList,
                    headers: {
                            "Authorization": `${sessionStorage.getItem('userToken')}`,
                        },
                    }).then((result) => {
                        console.log(result.data)
                        this.$message({
                            message: "通信pod创建成功！",
                            type: "success",
                            showClose: true,
                            duration: 8000,
                        })
                        this.writePodNameDiaVisible = false;
                    }).catch(error => {
                        this.handleError(error)
                    })
                }
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
                url: 'api/container/deleteConfigFile?' + '&image=' + this.imageAndTags + "&namespace=" + this.userData.namespace + "&fileNameList=" + this.selectedConfigFiles,
                headers: {
                        "Authorization": `${sessionStorage.getItem('userToken')}`,
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
                        url: 'api/container/getConfigList?' + 'namespace=' + this.userData.namespace + "&image=" + this.imageAndTags + "&page=" + this.currentPage + "&size=" + this.pageSize,
                        headers: {
                                "Authorization": `${sessionStorage.getItem('userToken')}`,
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


        // 删除用于创建镜像的文件
        deleteImageFiles() {
            console.log(this.selectedImageFilesList)
            let image = this.currentNewImage.imageName + ":" + this.currentNewImage.tags
            if(this.selectedImageFilesList == "") {
                this.$message({
                    message: "未选择任何文件！",
                    showClose: true,
                    duration: 8000,
                })
            } else {
                // 调用接口删除文件
                axios({
                    method: 'post',
                    url: 'api/image/deleteResourcesForBuild?' + "namespace=" + this.userData.namespace + "&image=" + image + "&fileNameList=" + this.selectedImageFilesList,
                    headers: {
                        "Authorization": `${sessionStorage.getItem('userToken')}`
                    },
                }).then((result) => {
                    console.log(result)
                    this.$message({
                        message: "文件删除成功！",
                        type: "success",
                        showClose: true,
                        duration: 8000,
                    })
                    // 调用接口获取该镜像对应的所有文件
                    axios({
                        method: 'get',
                        url: 'api/image/getResourcesForBuild?' + 'namespace=' + this.userData.namespace + '&image=' + image + '&page=' + this.currentPage + '&size=' + this.pageSize,
                        headers: {
                                "Authorization": `${sessionStorage.getItem('userToken')}`,
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
                            // 关闭窗口
                            this.uploadImageDia2Visible = false
                        }).catch(error => {
                            this.handleError(error)
                        })
                }).catch(error => {
                    this.handleError(error)
                });
            }
        },

        // Build镜像
        buildImage() {
            let image = this.currentNewImage.imageName + ":" + this.currentNewImage.tags
            const loading = Loading.service({
                text: '正在打包推送镜像，请稍等',
                spinner: 'el-icon-loading',
                background: 'rgba(255, 255, 255, 0.7)'
            });
            // 调用接口获取该镜像对应的所有文件
            axios({
              method: 'post',
              url: 'api/image/buildImageWithResources?' + 'image=' + image,
              headers: {
                      "Authorization": `${sessionStorage.getItem('userToken')}`,
                  },
            }).then((result) => {
                console.log(result.data)
                this.changeMainTo2()
                loading.close()
                this.$message({
                    message: "镜像创建成功，请等待管理员审批！",
                    type: "success",
                    showClose: true,
                    duration: 8000,
                })
            }).catch(error => {
                loading.close()
                this.handleError(error)
            })
        },
        
        // 在创建镜像时，选择之前的镜像
        selectCurrentImage(row) {
            this.currentNewImage.imageName = row.name
            this.currentNewImage.tags = row.tags
            let image = this.currentNewImage.imageName + ":" + this.currentNewImage.tags
            this.currentPage = 1
            // 调用接口获取该镜像对应的所有文件
            axios({
              method: 'get',
              url: 'api/image/getResourcesForBuild?' + 'namespace=' + this.userData.namespace + '&image=' + image + '&page=' + this.currentPage + '&size=' + this.pageSize,
              headers: {
                      "Authorization": `${sessionStorage.getItem('userToken')}`,
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
                // 关闭窗口
                this.uploadImageDia2Visible = false
                this.imageButtonEnabled = true
            }).catch(error => {
                this.handleError(error)
            })
        },

        // 创建新的镜像
        createNewImage() {
            // 对镜像名和标签名进行判断
            const regExp = /^([a-z0-9]([a-z0-9._-]*[a-z0-9])?):([a-z0-9]([a-z0-9._-]*[a-z0-9])?)$/;
            const regExp2 = /[._-]{2,}/;
            let imageForVerify = this.newImage.imageName + ":" + this.newImage.tags
            // console.log(imageForVerify)
            // console.log("对imageName:tag的检测：", regExp.test(imageForVerify))
            // console.log("对连续两个字符的检测：", regExp2.test(imageForVerify))
            if(this.newImage.imageName == "") {
                this.$message({
                    message: "镜像名不能为空！",
                    type: "error",
                    showClose: true,
                    duration: 8000,
                })
            }
            else if(this.newImage.tags == "") {
                this.$message({
                    message: "标签名不能为空！",
                    type: "error",
                    showClose: true,
                    duration: 8000,
                })
            }
            else if(!regExp.test(imageForVerify)) {
                this.$message({
                    message: "命名格式不符合要求！",
                    type: "error",
                    showClose: true,
                    duration: 8000,
                })
            }
            else if(regExp2.test(imageForVerify)) {
                this.$message({
                    message: "命名格式不符合要求！",
                    type: "error",
                    showClose: true,
                    duration: 8000,
                })
            }
            else {
                const image = this.newImage.imageName + ":" + this.newImage.tags
                const loading = Loading.service({
                    text: '正在创建新镜像，请稍等',
                    spinner: 'el-icon-loading',
                    background: 'rgba(255, 255, 255, 0.7)'
                });
                // 调用接口为待创建镜像分配路径
                axios({
                    method: 'post',
                    url: 'api/image/createPathForImage?' + "image=" + image,
                    headers: {
                        "Authorization": `${sessionStorage.getItem('userToken')}`
                    },
                }).then((result) => {
                    console.log(result)
                    loading.close()
                    this.$message({
                        message: "新镜像路径创建成功！",
                        type: "success",
                        showClose: true,
                        duration: 8000,
                    })
                    // 关闭dialog
                    this.writeImageInfoDiaVisible = false
                    this.currentNewImage.imageName = this.newImage.imageName
                    this.currentNewImage.tags = this.newImage.tags
                    // 清空新镜像的名称和标签的值
                    this.$nextTick(() => {
                        this.resetForm('newImage')
                    });
                    this.imageButtonEnabled = true
                }).catch(error => {
                    loading.close()
                    this.handleError(error)
                });
            }
        },

        // 个人信息页面
        changeMainTo1:function(){
            this.mainValue = 1;
        },

        // 上传镜像页面
        changeMainTo2:function(){
            this.mainValue = 2;
            this.currentNewImage.imageName = ""
            this.currentNewImage.tags = ""
            this.imageFiles = [];
            this.totalImageFiles = 0;
            this.imageButtonEnabled = false
        },

        // 镜像信息查看页面
        changeMainTo3:function(){
            this.mainValue = 3;
            this.currentPage = 1;
            this.imageSearchForm.searchImageName = ""
            this.selectedImageList = [];
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
                    "companyId": this.userData.companyId,
                    "status": "1",
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
            this.containerSearchForm.username = ""
            this.selectedContainerList = []
            // 获取所有容器实例信息
            axios({
                method: 'post',
                url: 'api/container/list?' + "page=" + this.currentPage + "&size=" + this.pageSize,
                headers: {
                    "Authorization": `${sessionStorage.getItem('userToken')}`
                },
                data: {
                    "namespace": this.userData.namespace,
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
        },

        // 历史日志信息页面
        changeMainTo5:function(){
            this.mainValue = 5;
            this.currentPage = 1;
            this.historyContainerSearchForm.username = ""
            // 获取所有历史容器实例信息
            axios({
                method: 'post',
                url: 'api/container/list?' + "page=" + this.currentPage + "&size=" + this.pageSize,
                headers: {
                    'content-Type' : "application/json",
                    "Authorization": `${sessionStorage.getItem('userToken')}`
                },
                data: {
                    "namespace": this.userData.namespace,
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

        // 更改用户数据
        changeUserData:function(){
            if(this.editUserDataForm.phone == ''){
                this.$message({
                    message: "手机号为空！",
                    type: "error",
                    showClose: true,
                    duration: 8000,
                })
            }
            else if(isNaN(Number(this.editUserDataForm.phone)) || Number(this.editUserDataForm.phone) <= 0) {
                this.$message({
                    message: "手机号必须为数字！",
                    type: "error",
                    showClose: true,
                    duration: 8000,
                })
            }
            else if(this.editUserDataForm.phone.length != 11) {
                this.$message({
                    message: "手机号必须为11位！",
                    type: "error",
                    showClose: true,
                    duration: 8000,
                })
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
                    this.$message({
                        message: "个人信息修改成功！",
                        type: "success",
                        showClose: true,
                        duration: 8000,
                    })
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
                        this.userData.namespace = result.data.data.CompanyId
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
            if(this.editUserDataForm.password == '') {
                this.$message({
                    message: "请输入新密码！",
                    type: "error",
                    showClose: true,
                    duration: 8000,
                })
            }
            else if(this.editUserDataForm.passConfirm == '') {
                this.$message({
                    message: "请再次输入新密码！",
                    type: "error",
                    showClose: true,
                    duration: 8000,
                })
            }
            else if(this.editUserDataForm.passConfirm != this.editUserDataForm.password) {
                this.$message({
                    message: "两次输入的密码不一致！",
                    type: "error",
                    showClose: true,
                    duration: 8000,
                })
            }
            else if (this.editUserDataForm.password.length < 8 || this.editUserDataForm.password.length > 18) {
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
                        "Authorization": `${sessionStorage.getItem('userToken')}`
                    },
                    data: {
                        "password": this.editUserDataForm.password,
                        "username": this.userData.username,
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
                    this.editUserDataForm.password = ''
                }).catch(error => {
                    this.handleError(error)
                });
            }
        },

        // // 使用现有pvc路径创建容器实例
        // createContainer:function(row){
        //     // 调用接口创建容器实例
        //     axios({
        //         method: 'post',
        //         url: 'api/container/create',
        //         headers: {
        //             "Authorization": `${sessionStorage.getItem('userToken')}`
        //         },
        //         data: {
        //             "image": this.imageAndTags,
        //             "pvcName": row.pvcName,
        //         },
        //     }).then((result) => {
        //         console.log(result)
        //         this.$message.success("容器实例创建成功！")
        //     }).catch(error => {
        //         this.handleError(error)
        //     });
        // },

        // 创建容器实例
        createContainer:function(row){
            const name = row.name
            const tag = row.tags
            const image = name + ":" + tag
            this.imageAndTags = image
            // 调用接口创建容器实例
            axios({
                method: 'post',
                url: 'api/container/create',
                headers: {
                    "Authorization": `${sessionStorage.getItem('userToken')}`
                },
                data: {
                    "image": this.imageAndTags,
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
                    "companyId": this.userData.companyId,
                    "status": "1",
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
                    "Authorization": `${sessionStorage.getItem('userToken')}`
                },
                data: {
                    "name": "",
                    "companyId": this.userData.companyId,
                    "status": "1",
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
                        "Authorization": `${sessionStorage.getItem('userToken')}`
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
                            "Authorization": `${sessionStorage.getItem('userToken')}`
                        },
                        data: {
                            "name": "",
                            "companyId": this.userData.companyId,
                            "status": "1",
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

        // 获取用于创建镜像的文件选中项
        imageFilesSelectionChange(val) {
            // 数组形式
            this.selectedImageFilesList = val.map(row => row.fileName);
        },

        // 获取历史容器实例页面中软件log选中项
        historySoftwareLogSelectionChange(val) {
            this.selectedHistorySoftwareLog = val.map(row => ({
                fileName: row.fileName,
                namespace: this.tempPodData.namespace,
                podName: this.tempPodData.podName,
            }));
        },

        // 获取配置文件选中项
        configFilesSelectionChange(val) {
            // 数组形式
            this.selectedConfigFiles = val.map(row => row.fileName);
        },

        // 打开创建通信Pod的对话框（用户填写pod名称）
        openCreateCommunicatePodDia() {
            if(this.selectedImageList == "") {
                this.$message({
                    message: "未选择任何镜像！",
                    showClose: true,
                    duration: 8000,
                })
            }
            else {
                this.writePodNameDiaVisible = true;
                this.podNameUserWrite = '';
            }
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
                    "namespace": this.userData.namespace,
                    "running": "1"
                }
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
                    "Authorization": `${sessionStorage.getItem('userToken')}`
                },
                data: {
                    "namespace": this.userData.namespace,
                    "username": "",
                    "running": "1"
                }
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
            console.log("选中的容器实例列表：", this.selectedContainerList)
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
                        "Authorization": `${sessionStorage.getItem('userToken')}`
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
                            "Authorization": `${sessionStorage.getItem('userToken')}`
                        },
                        data: {
                            "namespace": this.userData.namespace,
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
                })
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
                    "Authorization": `${sessionStorage.getItem('userToken')}`
                },
                data: {
                    "namespace": this.userData.namespace,
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
                    "Authorization": `${sessionStorage.getItem('userToken')}`
                },
                data: {
                    "namespace": this.userData.namespace,
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

        // 打开历史容器实例页面软件运行态log的对话框
        openHistorySoftwareLogDia(row) {
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
                    "Authorization": `${sessionStorage.getItem('userToken')}`
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
            }).catch(error => {
                this.handleError(error)
            });
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
                this.$nextTick(() => {
                    this.resetForm('softwareLogSearchForm');
                })
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

        // 获取容器实例管理中的pod选中项
        podSelectionChange(val) {
            this.selectedContainerList = val.map(row => ({
                namespace: row.namespace,
                podName: row.podName,
            }));
        },

        // 重置表单数据
        resetForm(formName) {
            this.$refs[formName].resetFields();
        },

        // 打开软件运行态log的对话框
        openSoftwareLogDia(row){
            // 将该容器实例的podName和namespace暂时保存下来
            this.tempPodData.podName = row.podName
            this.tempPodData.namespace = row.namespace
            this.imageList = row.container_imageList.map(img_info => img_info.image);
            // console.log(imageList)
            // 调用接口获取软件日志列表
            this.currentPage = 1
            axios({
                    method: 'get',
                    url: 'api/file/getSoftwareLogs?' + "podName=" + this.tempPodData.podName + "&namespace=" + this.tempPodData.namespace + "&imageList=" + this.imageList + "&page=" + this.currentPage + "&size=" + this.pageSize,
                    headers: {
                        "Authorization": `${sessionStorage.getItem('userToken')}`
                    },
                }).then((result) => {
                    console.log(result)
                    if(result.data.data.content != null){
                        this.softwareLogData2 = result.data.data.content
                        // 转换格式 方便在el-table中显示
                        // this.softwareLogData2 = this.originSoftwareLogData.map(item => {
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

        // 删除历史容器实例的软件日志
        deleteHistorySoftwareLog() {
            console.log(this.selectedHistorySoftwareLog)
            if(this.selectedHistorySoftwareLog == "") {
                this.$message({
                    message: "未选择任何日志！",
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
                        "Authorization": `${sessionStorage.getItem('userToken')}`
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
                    this.currentPage = 1
                    axios({
                        method: 'get',
                        url: 'api/file/getSoftwareLogs?' + "podName=" + this.tempPodData.podName + "&namespace=" + this.tempPodData.namespace + "&imageList=" + this.imageList + "&page=" + this.currentPage + "&size=" + this.pageSize,
                        headers: {
                            "Authorization": `${sessionStorage.getItem('userToken')}`
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
                    "Authorization": `${sessionStorage.getItem('userToken')}`
                },
            }).then((result) => {
                console.log(result)
                logData = result.data
                logData = logData.toString().replace(/\n/g, "<br>");
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
                url: 'api/container/getPodLog?' + "namespace=" + this.tempPodData.namespace + "&podName=" + this.tempPodData.podName + "&option=1",
                headers: {
                    "Authorization": `${sessionStorage.getItem('userToken')}`
                },
            }).then((result) => {
                console.log(result)
                logData = result.data
                logData = logData.toString().replace(/\n/g, "<br>");
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

        // 查看配置文件
        viewConfigFile(row){
            let configData = ""
            // 调用接口查看容器log
            axios({
                method: 'post',
                url: 'api/container/getConfigFile?' + "namespace=" + this.userData.namespace + "&image=" + this.imageAndTags + "&fileName=" + row.fileName + "&option=1",
                headers: {
                    "Authorization": `${sessionStorage.getItem('userToken')}`
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
                url: "http://localhost:7000/api/container/getConfigFile?" + "namespace=" + this.userData.namespace + "&image=" + this.imageAndTags + "&fileName=" + row.fileName + "&option=0",
                responseType: 'blob',  // 指定响应类型为blob用于文件下载
                headers: {
                    "Authorization": `${sessionStorage.getItem('userToken')}`
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

        // 打开上传镜像的表单（原版）
        openUploadImageDia(){
            this.uploadImageName = ""
            this.uploadImageDiaVisible = true
        },

        // 打开创建镜像的表单（新版）
        openUploadImageDia2(){
            // 初始化
            this.currentPage = 1;
            this.imageFiles = [];
            this.totalImageFiles = 0;
            this.currentNewImage.imageName = ""
            this.currentNewImage.tags = ""
            this.imageButtonEnabled = false
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
                    "companyId": this.userData.companyId,
                    "status": "4",
                }
            }).then((result) => {
                console.log(result)
                this.imageData = result.data.data.records
                this.totalImageData = result.data.data.total // 获取总条数
                // 打开上传镜像表单
                this.$nextTick(() => {
                    this.uploadImageDia2Visible = true
                })
            }).catch(error => {
                this.handleError(error)
            });
        },

        // // 打开创建容器实例的表单
        // openCreateContainerDia(row){
        //     this.createContainerDiavisible = true
        //     const name = row.name
        //     const tag = row.tags
        //     const image = name + ":" + tag
        //     this.imageAndTags = image
        //     // 调用接口获取pvc列表
        //     axios({
        //         method: 'get',
        //         url: 'api/container/getPvc?' + "namespace=" + this.userData.namespace + "&image=" + this.imageAndTags,
        //         headers: {
        //             "Authorization": `${sessionStorage.getItem('userToken')}`
        //         },
        //     }).then((result) => {
        //         console.log(result)
        //         this.pvcData = result.data.data.records
        //         this.totalPvcData = result.data.data.total
        //     }).catch(error => {
        //         this.handleError(error)
        //     });
        // },


        // 错误处理
        handleError(error) {
            if (error.response) {
                // error.response包含了服务器响应的详细信息
                const statusCode = error.response.status;
                const errorMessage = error.response.data.error;
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

        // 点击按钮切换页面
        handleCurrentChange(currentPage) {
            this.currentPage = currentPage; //每次点击分页按钮，当前页发生变化

            // 如果当前页面是创建镜像页面且没有打开创建镜像的dig
            if(this.mainValue == 2 && this.uploadImageDia2Visible == false) {
                let image = this.currentNewImage.imageName + ":" + this.currentNewImage.tags
                // 调用接口获取该镜像对应的所有文件
                axios({
                method: 'get',
                url: 'api/image/getResourcesForBuild?' + 'namespace=' + this.userData.namespace + '&image=' + image + '&page=' + this.currentPage + '&size=' + this.pageSize,
                headers: {
                        "Authorization": `${sessionStorage.getItem('userToken')}`,
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

            // 如果当前页面是创建镜像页面且打开了创建镜像的dig
            if(this.mainValue == 2 && this.uploadImageDia2Visible == true) {
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
                        "companyId": this.userData.companyId,
                        "status": "4",
                    }
                }).then((result) => {
                    console.log(result)
                    this.imageData = result.data.data.records
                    this.totalImageData = result.data.data.total // 获取总条数
                }).catch(error => {
                    this.handleError(error)
                });
            }

            // 如果当前页面是镜像信息查看页面且没有打开配置文件的dig
            if(this.mainValue == 3 && this.configDiaVisible == false) {
                axios({
                    method: 'post',
                    url: 'api/image/list?' + "page=" + this.currentPage + "&size=" + this.pageSize,
                    headers: {
                        'content-Type' : "application/json",
                        "Authorization": `${sessionStorage.getItem('userToken')}`
                    },
                    data: {
                        "name": this.imageSearchForm.searchImageName,
                        "companyId": this.userData.companyId,
                    }
                }).then((result) => {
                    console.log(result)
                    this.imageData = result.data.data.records
                    this.totalImageData = result.data.data.total // 获取总条数
                }).catch(error => {
                    this.handleError(error)
                });
            }

            // 如果当前页面是镜像信息查看页面且打开了配置文件的dig
            if(this.mainValue == 3 && this.configDiaVisible == true) {
                // 调用接口 获取所有config文件列表
                axios({
                    method: 'get',
                    url: 'api/container/getConfigList?' + 'namespace=' + this.userData.namespace + "&image=" + this.imageAndTags + "&page=" + this.currentPage + "&size=" + this.pageSize,
                    headers: {
                            "Authorization": `${sessionStorage.getItem('userToken')}`,
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
                        "namespace": this.userData.namespace,
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
            if(this.mainValue == 4 && this.softwareLogDiavisible == true) {
                axios({
                    method: 'get',
                    url: 'api/file/getSoftwareLogs?' + "podName=" + this.tempPodData.podName + "&namespace=" + this.tempPodData.namespace + "&imageList=" + this.imageList + "&page=" + this.currentPage + "&size=" + this.pageSize,
                    headers: {
                        "Authorization": `${sessionStorage.getItem('userToken')}`
                    },
                }).then((result) => {
                    console.log(result)
                    if(result.data.data.content != null){
                        this.softwareLogData2 = result.data.data.content
                        // 转换格式 方便在el-table中显示
                        // this.softwareLogData2 = this.originSoftwareLogData.map(item => {
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
            if(this.mainValue == 5 && this.historSoftwareLogDiavisible == false) {
                // 获取所有容器实例信息
                axios({
                    method: 'post',
                    url: 'api/container/list?' + "page=" + this.currentPage + "&size=" + this.pageSize,
                    headers: {
                        'content-Type' : "application/json",
                        "Authorization": `${sessionStorage.getItem('userToken')}`
                    },
                    data: {
                        "namespace": this.userData.namespace,
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
            if(this.mainValue == 5 && this.historSoftwareLogDiavisible == true) {
                // 调用接口获取软件日志列表
                axios({
                    method: 'get',
                    url: 'api/file/getSoftwareLogs?' + "podName=" + this.tempPodData.podName + "&namespace=" + this.tempPodData.namespace + "&imageList=" + this.imageList + "&page=" + this.currentPage + "&size=" + this.pageSize,
                    headers: {
                        "Authorization": `${sessionStorage.getItem('userToken')}`
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

        // 触发点击上传文件事件（旧版）
        checkFile2() {
            document.querySelector('#fileInput').click()
        },

        // 触发点击上传镜像文件事件（新版）
        checkFile() {
            document.querySelector('#uploadImage').click()
        },

        // 
        checkConfigFile() {
            document.querySelector('#uploadConfig').click()
        },

        // 批量上传配置文件
        uploadConfig(e) {
            const loading = Loading.service({
                text: '正在上传配置文件，请稍等',
                spinner: 'el-icon-loading',
                background: 'rgba(255, 255, 255, 0.7)'
            });
            // 获取选择的多个文件
            let files = e.target.files
            let formData = new FormData()
            // 遍历每个文件进行处理
            for (let i = 0; i < files.length; i++) {
                let file = files[i];
                formData.append('fileList', file);
            }

            // 调用接口 批量上传配置文件
            axios({
                    method: 'post',
                    url: 'api/container/uploadConfig?' + 'image=' + this.imageAndTags,
                    headers: {
                        "Authorization": `${sessionStorage.getItem('userToken')}`,
                    },
                    data: formData
                }).then((result) => {
                    console.log(result)
                    // 上传成功，关闭加载提示，显示成功消息
                    loading.close();
                    this.$message({
                        message: "配置文件上传成功！",
                        type: "success",
                        showClose: true,
                        duration: 8000,
                    })
                    // 获取文件选择的input元素并重置其value属性，达到清空文件列表的目的
                    const uploadInput = document.getElementById('uploadConfig');
                    if (uploadInput) {
                        uploadInput.value = null;
                    }
                    // 调用接口 获取所有config文件列表
                    this.currentPage = 1
                    axios({
                        method: 'get',
                        url: 'api/container/getConfigList?' + 'namespace=' + this.userData.namespace + "&image=" + this.imageAndTags + "&page=" + this.currentPage + "&size=" + this.pageSize,
                        headers: {
                                "Authorization": `${sessionStorage.getItem('userToken')}`,
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
            }).catch(error => {
                loading.close();
                this.handleError(error)
            });
            // // 清空上传文件列表
            // const fileInput = this.$refs.uploadConfig;
            // // 重置files属性
            // fileInput.value = null;
        },

        // 批量上传镜像文件
        uploadImage(e) {
            const loading = Loading.service({
                text: '正在上传文件，请稍等',
                spinner: 'el-icon-loading',
                background: 'rgba(255, 255, 255, 0.7)'
            });
            // 获取选择的多个文件
            let files = e.target.files
            let formData = new FormData()
            // 遍历每个文件进行处理
            for (let i = 0; i < files.length; i++) {
                let file = files[i];
                formData.append('fileList', file);
            }

            let image = this.currentNewImage.imageName + ":" + this.currentNewImage.tags
            // 调用接口 上传文件
            axios({
                    method: 'post',
                    url: 'api/image/uploadResourcesForBuild?' + 'image=' + image,
                    headers: {
                        "Authorization": `${sessionStorage.getItem('userToken')}`,
                    },
                    data: formData
                }).then((result) => {
                    console.log(result)
                    // 上传成功，关闭加载提示，显示成功消息
                    loading.close();
                    this.$message({
                        message: "文件上传成功！",
                        type: "success",
                        showClose: true,
                        duration: 8000,
                    })
                    // 调用接口获取该镜像对应的所有文件
                    this.currentPage = 1
                    axios({
                        method: 'get',
                        url: 'api/image/getResourcesForBuild?' + 'namespace=' + this.userData.namespace + '&image=' + image + '&page=' + this.currentPage + '&size=' + this.pageSize,
                        headers: {
                                "Authorization": `${sessionStorage.getItem('userToken')}`,
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
                            // 关闭窗口
                            this.uploadImageDia2Visible = false
                        }).catch(error => {
                            this.handleError(error)
                        })
                }).catch(error => {
                    loading.close();
                    this.handleError(error)
                });
            // 清空上传文件列表
            const fileInput = this.$refs.uploadImage;
            // 重置files属性
            fileInput.value = null;
        },

        // 检查密码强度
        checkPasswordStrength() {
            let hasLetter = false;
            let hasNumber = false;
            let hasSymbol = false;

            for (let char of this.editUserDataForm.password) {
                if (/[a-zA-Z]/.test(char)) {
                hasLetter = true;
                } else if (/\d/.test(char)) {
                hasNumber = true;
                } else {
                hasSymbol = true;
                }
            }

            if (this.editUserDataForm.password.length < 8) {
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
        },

        // 将时间中间的T换成空格
        formatTime(timeStr) {
            if (timeStr === null) {
                return '-'; 
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


.el-table::before {
    height: 0;
}

</style>
