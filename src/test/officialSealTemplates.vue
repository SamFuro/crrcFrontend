<template>
    <div>
        <h4>使用中的公章</h4>
        <el-table :data="seals" style="width: 100%" :key="keyValue">
            <el-table-column prop="nowStampFile.name" label="公章名称" width="100"></el-table-column>
            <el-table-column prop="nowStampFile.lastUpdated" label="上传时间" width="100"></el-table-column>
            <el-table-column prop="nowStampFile.lastUpdatedBy.name" label="上传者" width="100"></el-table-column>
            <el-table-column label="公章" width="250">
                <template slot-scope="scope">
                    <img :src="scope.row.picture" alt="" width="50" height="50">
                </template>
            </el-table-column>
            <el-table-column label="操作">
                <template slot-scope="scope">
                    <el-button type="info" @click="download(scope.row)" size="small">下载</el-button>
                    <el-button icon="el-icon-document-copy" type="primary" size="small" style="margin-left: 15px;"
                        @click="checkFile">上传新公章</el-button>
                    <input id="fileInput" type="file" style="display: none;" @change="update($event, scope.row)" />
                    <el-button type="primary" size="small" @click="checkHistoricalSeals(scope.row)"
                        style="margin-left: 15px;">查看历史公章</el-button>
                    <el-dialog title="历史公章列表" :visible.sync="dialogVisible" width="80%">
                        <historical-seals ref="HistoricalSeals" @transmit="reload()"></historical-seals>
                        <span slot="footer" class="dialog-footer">
                            <el-button @click="dialogVisible = false">取 消</el-button>
                        </span>
                    </el-dialog>&nbsp;
                </template>
            </el-table-column>
        </el-table>
        <div class="block">
            <span class="demonstration"></span>
            <el-pagination @current-change="handleCurrentChange" :current-page="currentPage" :page-size="10"
                layout="total, prev, pager, next, jumper" :total="totalElements">
            </el-pagination>
        </div>
    </div>
</template>

<script>
import HistoricalSeals from "./HistoricalSeals.vue";
import service from "@/utils/service";
export default {
    inject: ['reloadAll'],
    components: { HistoricalSeals },
    data() {
        return {
            keyValue: 0,

            dialogVisible: false,

            seals: [
                {
                    name: "string",
                    nowStampFile: {
                        created: "2024-10-11T09:41:37.498Z",
                        id: 0,
                        name: "string",
                        type: "string",
                        lastUpdated: "2024-10-11T09:41:37.498Z",
                        createdBy: {
                            id: 0,
                            employeeNumber: "string",
                            name: "string"
                        },
                        lastUpdatedBy: {
                            id: 0,
                            employeeNumber: "string",
                            name: "string"
                        }
                    }
                }
            ],

            currentPage: null,
            totalElements: 20,
        };
    },
    methods: {
        refresh() {
            this.reloadAll()
        },
        handleCurrentChange(val) {
            console.log(`当前页: ${val}`);
            this.getTab(val)
        },
        handleError(error) {
            if (error.response) {
                // error.response包含了服务器响应的详细信息
                const statusCode = error.response.status;
                const errorMessage = error.response.data.message;
                // 根据不同的错误代码，显示不同的错误消息
                this.$notify.error(`${statusCode}: ${errorMessage}`);
            } else {
                // 其他错误（例如网络问题）
                this.$notify.error(`${error}`);
            }
        },
        getTab(pageNum) {
            service({
                method: "get",
                url: "/stamp-template/list",
                params: {
                    page: pageNum - 1,
                    size: 10,
                },
            })
                .then((result) => {
                    this.seals = result.content;
                    for (var i = 0; i < this.seals.length; i++) {
                        this.seals[i]['picture'] = 'api/resource/image/' + `${this.seals[i].nowStampFile.id}` + '/status/IN_USE'  //根据公章id获取公章图片
                    }
                    this.totalElements = result.totalElements;
                })
                .catch((error) => {
                    this.handleError(error);
                });
        },
        checkFile() {
            document.querySelector('#fileInput').click()
        },
        checkHistoricalSeals(data) {
            // service({
            //     method: 'get',
            //     url: '/resource/' + `${data.nowStampFile.id}`+'/history',   //接口待定义
            //     params: {
            //         pageNum: 0,
            //         pageSize: 10
            //     }
            // }).then((result) => {
            //     this.$refs.HistoricalSeals.stamp_id = data.nowStampFile.id
            //     this.$refs.HistoricalSeals.historicalSeals = result.content;
            //     // 根据历史公章id获取历史公章图片
            //     for(var i = 0; i < this.$refs.HistoricalSeals.historicalSeals.length; i++){
            //         this.$refs.HistoricalSeals.historicalSeals[i]['picture'] = 'api/resource/image/' + `${this.$refs.HistoricalSeals.historicalSeals[i].id}` 
            //         + '/status/HISTORY'
            //     }

            // }).catch(error => {
            //     this.handleError(error)
            // })
            this.dialogVisible = true;
            this.$nextTick(() => {
                this.$refs.HistoricalSeals.stamp_id = data.nowStampFile.id
                this.$refs.HistoricalSeals.getTab(1)
            })
        },
        update(e, data) {
            let file = e.target.files[0]
            let formData = new FormData()
            formData.append('file', file)
            formData.append('id', data.nowStampFile.id)
            service({
                method: 'post',
                url: '/stamp-template/upload',
                headers: { 'Content-Type': 'multipart/form-data' },
                data: formData
            }).then((result) => {
                console.log(result)
                if (result.code) {
                    this.$message({
                        message: '上传失败',
                        type: 'error'
                    });
                }
                else {
                    this.$message({
                        message: '上传成功',
                        type: 'success'
                    });
                }
                this.getTab(this.currentPage)
                this.keyValue++
            }).catch(error => {
                this.handleError(error)
            })
        },
        download(data) {
            var a = document.createElement('a');
            a.download = data.nowStampFile.name;  //设置下载文件的名称
            a.href = data.picture;  //下载文件的url
            a.click();

        },
        reload() {
            this.getTab(this.currentPage)
            this.keyValue++
            this.dialogVisible = false
        },
    },
    mounted() {
        //第一次请求
        this.currentPage = 1;
        this.getTab(this.currentPage);
    },
};
</script>


<style></style>