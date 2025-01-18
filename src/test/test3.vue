<template>
    <div>
        <el-container style="height: 700px; border: 1px solid #eee ">
        <el-header style="font-size: 37px; background-color: rgb(0, 0, 255); color: white;">测试测试测试测试test</el-header>
        <el-container>
            <el-aside width="200px" style="background-color: rgb(238, 241, 246)">
                <el-menu :default-openeds="['1']">
                    <el-submenu index="1">
                        <template slot="title"><i class="el-icon-message"></i>测试</template>
                        <el-menu-item-group>
                            <el-menu-item index="1-1" @click="changeMainTo1">测试页面（表格嵌套）</el-menu-item>
                            <el-menu-item index="1-2" @click="changeMainTo2">测试页面（翻页不取消selection）</el-menu-item>
                            <el-menu-item index="1-3" @click="changeMainTo3">测试页面（按钮）</el-menu-item>
                            <!--<el-menu-item index="1-4" @click="changeMainTo4">镜像管理</el-menu-item>
                            <el-menu-item index="1-5" @click="changeMainTo5">容器实例管理</el-menu-item>
                            <el-menu-item index="1-6" @click="changeMainTo6">软件运行态log管理</el-menu-item> -->
                        </el-menu-item-group>
                    </el-submenu>
                    <!-- <el-submenu index="2">
                        <template slot="title"><i class="el-icon-s-order"></i>管理</template>
                        <el-menu-item-group>
                            
                        </el-menu-item-group>
                    </el-submenu> -->
                </el-menu>
            </el-aside>
            <!-- 测试页面 -->
                <el-main v-if="mainValue == 1">
                    <el-table :data="podList" border row-key="id" @expand-change="handleExpandChange">
                        <el-table-column type="expand">
                            <template slot-scope="props">
                                <el-table :data="props.row.containerInstances" border>
                                    <el-table-column prop="containerName" label="容器实例名称" ></el-table-column>
                                    <el-table-column prop="createTime" label="创建时间"></el-table-column>
                                    <!-- 根据容器实例实际包含的属性添加更多列 -->
                                </el-table>
                            </template>
                        </el-table-column>
                        <el-table-column prop="podName" label="Pod名称"></el-table-column>
                        <el-table-column prop="createTime" label="创建时间"></el-table-column>
                        <!-- 可以添加更多展示Pod信息的列 -->
                    </el-table>
                </el-main>



                <el-main v-if="mainValue == 2">
                    <!-- 待审批用户表格内容 -->
                    <el-table :data="verifyUserList" border @selection-change="userVerifySelectionChange" key="verifyUserTable" ref="verifyUserList" style="width: 1200px; margin-left: 30px">
                        <el-table-column prop="username" label="用户名" align="center"></el-table-column>
                        <el-table-column prop="name" label="姓名" align="center"></el-table-column>
                        <el-table-column prop="phone" label="电话" align="center"></el-table-column>
                        <el-table-column type="selection" align="center" width="55"></el-table-column>
                    </el-table>
                    <!-- 通过 & 不通过 按钮 -->
                    <el-row style="margin-left: 1050px; margin-top: 20px">
                        <el-button type="primary" @click="show" style="margin-left: 15px;">显示选中的数据</el-button>
                    </el-row>
                    <!-- 分页条 -->
                    <el-pagination
                        background
                        align="center"
                        layout="prev, pager, next, jumper"
                        :total=6
                        @current-change="handleCurrentChange"
                        :current-page.sync="currentPage"
                        :page-size="pageSize">
                    </el-pagination>
                </el-main>

                <el-main v-if="mainValue == 3">
                    <el-input v-model="testNumber"></el-input>
                    <el-button type="primary" @click="testPositiveNumber">测试是否为正数</el-button>
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
            mainValue: 0,
            currentPage: 1,
            pageSize: 3,
            testNumber: "",
            selectedUserList: [],
            verifyUserList: [
                {
                    username: "user1",
                    name:"张三",
                    phone:"111"
                },
                {
                    username: "user2",
                    name:"张三",
                    phone:"222"
                },
                {
                    username: "user3",
                    name:"张三",
                    phone:"333"
                },
                {
                    username: "user4",
                    name:"张三",
                    phone:"444"
                },
                {
                    username: "user5",
                    name:"张三",
                    phone:"555"
                },
                {
                    username: "user6",
                    name:"张三",
                    phone:"666"
                }
            ],
            podList: [
                {
                    id: 1,
                    podName: "Pod 1",
                    createTime: "2025-01-01",
                    containerInstances: [
                        {
                            containerName: "容器实例1",
                            createTime: "2025-01-02"
                        },
                        {
                            containerName: "容器实例2",
                            createTime: "2025-01-03"
                        }
                    ]
                },
                {
                    id: 2,
                    podName: "Pod 2",
                    createTime: "2025-01-04",
                    containerInstances: [
                        {
                            containerName: "容器实例3",
                            createTime: "2025-01-05"
                        }
                    ]
                }
            ]
        }
    },
    methods:{
        changeMainTo1() {
            this.mainValue = 1
        },
        changeMainTo2() {
            this.mainValue = 2
        },
        changeMainTo3() {
            this.mainValue = 3
        },

        testPositiveNumber() {
            if (isNaN(Number(this.testNumber)) || Number(this.testNumber) <= 0) {
                this.$message.error("不是正数！")
            }
            else {
                this.$message.success("是正数！")
            }
        },

        // 获取用户审批中的选中项
        userVerifySelectionChange(val) {
            this.selectedUserList = val.map(row => ({
                username: row.username,
                name:row.name,
                phone: row.phone
            }));
        },

        show() {
            console.log(this.selectedUserList)
        },

        handleExpandChange(row, expanded) {
            // 这里可以添加当行展开或收起时需要执行的逻辑，目前可以为空
        },

        handleCurrentChange(currentPage) {
            this,currentPage = currentPage
            console.log(this.currentPage)
            if(this.currentPage == 2) {
                this.verifyUserList = [
                {
                    username: "user7",
                    name:"李四",
                    phone:"111"
                },
                {
                    username: "user8",
                    name:"李四",
                    phone:"222"
                },
                {
                    username: "user9",
                    name:"李四",
                    phone:"333"
                },
                {
                    username: "user10",
                    name:"李四",
                    phone:"444"
                },
                {
                    username: "user11",
                    name:"李四",
                    phone:"555"
                },
                {
                    username: "user12",
                    name:"李四",
                    phone:"666"
                }
            ]
        }
            else {
                this.verifyUserList= [
                {
                    username: "user1",
                    name:"张三",
                    phone:"111"
                },
                {
                    username: "user2",
                    name:"张三",
                    phone:"222"
                },
                {
                    username: "user3",
                    name:"张三",
                    phone:"333"
                },
                {
                    username: "user4",
                    name:"张三",
                    phone:"444"
                },
                {
                    username: "user5",
                    name:"张三",
                    phone:"555"
                },
                {
                    username: "user6",
                    name:"张三",
                    phone:"666"
                }
            ]
            }

            const currentPageData = this.verifyUserList.slice((currentPage - 1) * this.pageSize, currentPage * this.pageSize);
            currentPageData.forEach(item => {
                if (this.selectedUserList.includes(item.username)) {
                    this.$refs.verifyUserList.toggleRowSelection(item, true);
                }
            });
        }


    },

}
</script>



<style scoped>


</style>
