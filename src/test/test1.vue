<template>
    <div>
        <div>
            <span>{{ taskId }}</span>
        </div>
        
        <div>
            <span>456</span>
        </div>
        
    </div>
</template>

<script>
import axios from 'axios';
export default {
    name: 'Test1',

    data() {
        return {
            taskId: "123",
        }
    },

    mounted: function () {
        this.indexStart();
    },

    methods: {
        async indexStart() {
            console.log(this.taskId)
            axios({
                method: 'get',
                url: 'api/employee/page',
                params: {
                    power: this.requestType,
                    pageNum: page - 1,
                    pageSize: 10
                }
            }).then((result) => {
                console.log(result)
                this.tableData = result.data
            }).catch(error => {
                this.handleError(error)
            })
            axios({
                method: 'post',
                url: 'api/report/',
                headers: { 'Content-Type': 'application/json' },
                data: JSON.stringify(obj)
            }).then((result) => {
                console.log(result.data)
                this.dialogVisible = result.data
                this.workCycle = null
                this.recommendedExperimentTypeCategoryIds = []
            }).catch(error => {
                this.handleError(error)
            });
        },
        handleError(error) {
            if (error.response) {
                // error.response包含了服务器响应的详细信息
                const statusCode = error.response.status;
                const errorMessage = error.response.data.message;
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

<style scoped></style>