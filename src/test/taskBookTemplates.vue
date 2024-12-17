<template>
    <div>
        <div>
            <el-descriptions class="margin-top" title="使用中任务书" :column="3">
                <template slot="extra">
                    <el-button type="primary" size="small" @click="downloadThis()">下载</el-button>
                    <el-button icon="el-icon-document-copy" type="primary" size="small" style="margin-left: 15px;"
                        @click="checkFile">上传新任务书模板</el-button>
                    <input id="fileInput" type="file" style="display: none;" @change="upload($event)" />
                </template>
                <el-descriptions-item label="任务书名">{{ inUse.nowTaskBookTemplate.name }}</el-descriptions-item>
                <el-descriptions-item label="创建时间">{{ inUse.nowTaskBookTemplate.created }}</el-descriptions-item>
                <el-descriptions-item label="创建者" v-if="inUse.nowTaskBookTemplate.createdBy">{{
                    inUse.nowTaskBookTemplate.createdBy.name
                }}</el-descriptions-item>
                <el-descriptions-item label="上传时间">{{ inUse.nowTaskBookTemplate.lastUpdated }}</el-descriptions-item>
                <el-descriptions-item label="上传者" v-if="inUse.nowTaskBookTemplate.lastUpdatedBy">{{
                    inUse.nowTaskBookTemplate.lastUpdatedBy.name }}</el-descriptions-item>
            </el-descriptions>
        </div>
        <hr>
        <hr>
        <h4>历史任务书</h4>
        <el-table :data="taskBooks" style="width: 100%">
            <el-table-column prop="created" label="上传时间" width="200">
            </el-table-column>
            <el-table-column prop="deleteAt" label="删除时间" width="200">
            </el-table-column>
            <el-table-column prop="createdBy.name" label="上传者" width="200"></el-table-column>
            <el-table-column prop="deleteBy.name" label="删除者" width="200"></el-table-column>
            <el-table-column label="任务书下载连接" width="250">
                <template slot-scope="scope">
                    <el-button type="info" @click="download(scope.row)">下载</el-button>
                </template>
            </el-table-column>
            <el-table-column label="操作">
                <template slot-scope="scope">
                    <el-button type="success" @click="useThis(scope.row)">使用此任务书</el-button>
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
import service from "@/utils/service";
export default {
    data() {
        return {
            inUse: {
                name: "string",
                taskBook: '',
                nowTaskBookTemplate: {
                    created: "2024-10-11T09:11:43.285Z",
                    id: 0,
                    name: "string",
                    type: "string",
                    lastUpdated: "2024-10-11T09:11:43.285Z",
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
                },
            },
            taskBooks: [
                {
                    id: 0,
                    name: "string",
                    type: "string",
                    created: "2024-10-11T09:30:58.127Z",
                    createdBy: {
                        id: 0,
                        employeeNumber: "string",
                        name: "string"
                    },
                    deleteAt: "2024-10-11T09:30:58.127Z",
                    deleteBy: {
                        id: 0,
                        employeeNumber: "string",
                        name: "string"
                    },
                    resourceId: 0
                }
            ],
            currentPage: 1,
            totalElements: null,
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
            console.log(this.inUse.nowTaskBookTemplate.id)
            service({
                method: "get",
                url: '/resource/' + `${this.inUse.nowTaskBookTemplate.id}` + '/history',
                params: {
                    page: pageNum - 1,
                    size: 10,
                },
            }).then((result) => {
                this.taskBooks = result.content;
                for (var i = 0; i < this.taskBooks.length; i++) {
                    this.taskBooks[i]['taskBook'] = 'api/resource/file/' + `${this.taskBooks[i].id}` + '/status/HISTORY'  //根据任务书id获取任务书文件url
                }
                this.totalElements = result.totalElements;
            }).catch((error) => {
                this.handleError(error);
            });
        },
        checkFile() {
            document.querySelector('#fileInput').click()
        },
        upload(e) {
            let file = e.target.files[0]
            let formData = new FormData()
            formData.append('file', file)
            service({
                method: 'post',
                url: '/taskBook-template/upload',
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
                    this.getTab(this.currentPage)
                }

            }).catch(error => {
                this.handleError(error)
            })
        },
        // 历史任务书的下载
        download(data) {
            var a = document.createElement('a');
            a.download = data.name  //设置下载文件的名称
            a.href = data.taskBook;  //下载文件的url
            console.log(data.taskBook);
            a.click();
        },
        // 正在使用的任务书的下载
        downloadThis() {
            var a = document.createElement('a');
            a.download = this.inUse.nowTaskBookTemplate.name  //设置下载文件的名称
            a.href = this.inUse.taskBook  //下载文件的url
            console.log(this.inUse.taskBook);
            a.click();
        },
        // 重新使用历史任务书
        useThis(data) {
            service({
                method: 'post',
                url: '/taskBook-template/reuse/' + `${data.id}`,
            }).then((result) => {
                console.log(result)
                this.$message({
                    message: '使用成功',
                    type: 'success'
                });
            }).catch(error => {
                this.handleError(error)
            })
        }
    },
    mounted() {
        // 正在使用的任务书的请求
        service({
            method: 'get',
            url: '/taskBook-template/list'
        }).then((result) => {
            this.inUse = result.data
            this.inUse['taskBook'] = 'api/resource/file/' + `${this.inUse.nowTaskBookTemplate.id}` + '/status/IN_USE'
            // 第一次请求历史任务书
            this.currentPage = 1;
            this.getTab(this.currentPage);
        }).catch(error => {
            this.handleError(error)
        })

    },
};
</script>

<style></style>
