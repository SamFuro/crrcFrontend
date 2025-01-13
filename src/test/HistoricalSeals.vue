<template>
    <div>
        <h4>历史公章</h4>
        <el-table :data="historicalSeals" style="width: 100%">
            <el-table-column prop="name" label="公章名称" width="100"></el-table-column>
            <el-table-column prop="created" label="上传时间" width="100"></el-table-column>
            <el-table-column prop="deleteAt" label="删除时间" width="100"></el-table-column>
            <el-table-column prop="createdBy.name" label="上传者" width="100"></el-table-column>
            <el-table-column prop="deleteBy.name" label="删除者" width="100"></el-table-column>
            <el-table-column label="公章" width="250">
                <template slot-scope="scope">
                    <img :src="scope.row.picture" alt="" width="50" height="50">
                </template>
            </el-table-column>
            <el-table-column label="操作">
                <template slot-scope="scope">
                    <el-button type="info" @click="download(scope.row)" size="small">下载</el-button>
                    <el-button type="success" size="small" @click="useThis(scope.row)"
                        style="margin-left: 15px;">使用此公章</el-button>
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
            stamp_id: '',
            historicalSeals: [
                {
                    id: 0,
                    name: "string",
                    type: "string",
                    created: "2024-10-11T09:54:31.037Z",
                    createdBy: {
                        id: 0,
                        employeeNumber: "string",
                        name: "string"
                    },
                    deleteAt: "2024-10-11T09:54:31.037Z",
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
        }
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
                method: 'get',
                url: '/resource/' + `${this.stamp_id}` + '/history',
                params: {
                    page: pageNum - 1,
                    size: 10
                }
            }).then((result) => {
                console.log(result)
                this.historicalSeals = result.content;
                for (var i = 0; i < this.historicalSeals.length; i++) {
                    this.historicalSeals[i]['picture'] = 'api/resource/image/' + `${this.historicalSeals[i].id}` + '/status/HISTORY'  // 根据历史任务书id获取任务书文件url
                }
                this.totalElements = result.totalElements;
            }).catch(error => {
                this.handleError(error)
            })
        },
        useThis(data) {
            service({
                method: 'post',
                url: '/stamp-template/' + `${this.stamp_id}` + '/reuse/' + `${data.id}`,
            }).then((result) => {
                console.log(result);
                this.$message({
                    message: '使用成功',
                    type: 'success'
                });
                this.$emit('transmit')
            }).catch(error => {
                this.handleError(error)
            })
        },
        download(data) {
            var a = document.createElement('a');
            a.download = data.name;  //设置下载文件的名称
            a.href = data.picture;  //下载文件的url
            a.click();
        }
    }
}
</script>

<style></style>
