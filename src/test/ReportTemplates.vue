<template>
    <div>
        <el-collapse>
            <el-collapse-item v-for="(Report) in ReportList" :key="Report.type + Report.edition + Report.language">
                <template slot="title">
                    <h1>{{ Report.type }} {{ Report.edition }} {{ Report.language }}</h1> <i
                        class="header-icon el-icon-info"></i>
                </template>
                <!-- 默认周期:<span>{{ Report.defaultWorkDuration }}</span> -->
                <span style="font-family: '黑体'; font-size: medium;">默认工作周期:</span>
                <el-tag style="margin-left: 5px;">{{ Report.defaultWorkDuration }}</el-tag>
                <el-table :data="Report.optionalWorkCycles">
                        <el-table-column prop="workDuration" label="工作周期" width="180">
                        </el-table-column>
                        <el-table-column prop="price" label="价格" width="180">
                        </el-table-column>
                        <el-table-column label="操作">
                            <template slot="header">
                                <el-button type="success" size="small" icon="el-icon-upload" @click="updata(Report)">保存</el-button>
                            </template>
                            <template slot-scope="scope">
                                <el-button type="success" plain size="small" @click="setDefault(Report, scope.row)">设为默认工作周期</el-button>
                                <el-button type="danger" size="small" style="margin-left: 15px;" @click="Delete(Report, scope.$index)">删除</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                    <el-button type="primary" size="small" :disabled="DivVisible" @click="DivVisible = true">新添</el-button>
                    <!-- <el-button type="info" size="small" @click="updata(Report)">保存</el-button> -->
                    <div v-show="DivVisible" >
                        <h3>添加工作周期</h3>
                        <el-form label-width="120px">
                            <el-form-item label="工作周期(小时)">
                                <el-input-number v-model="hours" :min="1" :max="65535">
                                </el-input-number>
                            </el-form-item>
                            <el-form-item label="价格">
                                <el-input-number v-model="price" :min="1" :max="65535"></el-input-number>
                            </el-form-item>
                        </el-form>
                        <span slot="footer" style="margin-left: 100px;">
                            <el-button size="small" @click="DivVisible = false">取 消</el-button>
                            <el-button size="small" @click="submit(Report)">确定</el-button>
                        </span>
                    </div>
                    <!-- <el-dialog title="添加工作周期" :visible.sync="DivVisible" append-to-body width="80%">
                        <el-form label-width="120px">
                            <el-form-item label="工作周期(小时)">
                                <el-input-number v-model="hours" :min="1" :max="65535">
                                </el-input-number>
                            </el-form-item>
                            <el-form-item label="价格">
                                <el-input-number v-model="price" :min="1" :max="65535"></el-input-number>
                            </el-form-item>
                        </el-form>
                        <span slot="footer" class="dialog-footer">
                            <el-button @click="submit(Report)">确定</el-button>
                            <el-button @click="DivVisible = false">取 消</el-button>
                        </span>
                    </el-dialog> -->
                <div v-for="(item) in Report.nowReport" :key="item.name">
                    <!-- <el-divider></el-divider> -->
                    <el-descriptions class="margin-top" :column="3">
                        <template slot="title">
                            <h3>
                                <el-breadcrumb>
                                    <el-breadcrumb-item>{{ item.name }}</el-breadcrumb-item>
                                    <el-breadcrumb-item>正在使用模板</el-breadcrumb-item>
                                </el-breadcrumb>
                            </h3>
                        </template>
                        <template slot="extra">
                            <span>
                                <el-button type="text" @click="fileDownload(item, 'IN_USE')">下载当前模板</el-button>&nbsp;
                                <!-- <el-button type="text" @click="updateFile(item, Report.id)">更新该模板</el-button> -->
                                <el-button type="text" @click="viewHistoryTemplates(item)">查看历史模板</el-button>
                                <el-button icon="el-icon-document-copy" type="primary" size="small"
                                    style="margin-left: 15px;" @click="checkFile(item, Report.id)">更新该模板</el-button>
                                <input id="fileInput" type="file" style="display: none;"
                                    @change="updateFile($event, item, Report.id)" />
                                <el-dialog title="查看历史模板" :visible.sync="historyDialogVisible" append-to-body
                                    width="80%">
                                    <el-table :data="historyReportList" style="width: 100%">
                                        <el-table-column prop="id" label="历史模板Id号" width="200"> </el-table-column>
                                        <el-table-column prop="name" label="历史模板文件名" width="200"> </el-table-column>
                                        <el-table-column prop="deleteAt" label="删除时间" width="300"> </el-table-column>
                                        <el-table-column label="操作">
                                            <template slot-scope="scope">
                                                <el-button type="text"
                                                    @click="reuse(scope.row, Report.id)">设为有效模板</el-button>
                                                <el-button type="text"
                                                    @click="fileDownload(scope.row, 'HISTORY')">下载</el-button>
                                            </template>
                                        </el-table-column>
                                    </el-table>
                                    <div class="block">
                                        <span class="demonstration"></span>
                                        <el-pagination @current-change="handleCurrentChange1"
                                            :current-page="currentPage1" :page-size="10"
                                            layout="total, prev, pager, next, jumper" :total="totalElements1">
                                        </el-pagination>
                                    </div>
                                    <span slot="footer" class="dialog-footer">
                                        <el-button @click="historyDialogVisible = false">取 消</el-button>
                                        <!-- <el-button @click="reuse">确 定</el-button> -->
                                    </span>
                                </el-dialog>&nbsp;&nbsp;
                            </span>
                        </template>
                        <el-descriptions-item label="名称">{{ item.id }}</el-descriptions-item>
                        <el-descriptions-item label="创建时间">{{ item.created }}</el-descriptions-item>
                        <el-descriptions-item label="更新时间">{{ item.lastUpdated }}</el-descriptions-item>
                        <el-descriptions-item label="类型">
                            <el-tag size="small">{{ item.type }}</el-tag>
                        </el-descriptions-item>
                        <el-descriptions-item label="创建人" v-if="item.createdBy">{{ item.createdBy.name
                            }}</el-descriptions-item>
                        <el-descriptions-item label="修改人" v-if="item.lastUpdatedBy">{{ item.lastUpdatedBy.name
                            }}</el-descriptions-item>
                        <!-- <el-descriptions-item label="默认工作周期" v-if="item">{{ item.defaultWorkDuration }}</el-descriptions-item> -->
                        <!-- <el-descriptions-item label="默认价格" v-if="item.defaultWorkCycle">{{ item.defaultWorkCycle.price }}</el-descriptions-item> -->
                    </el-descriptions>

                    <!-- <h3>
                        <el-breadcrumb>
                            <el-breadcrumb-item>{{ item.name }}</el-breadcrumb-item>
                            <el-breadcrumb-item>历史模板</el-breadcrumb-item>
                        </el-breadcrumb>
                    </h3>
                    <el-table :data="item.history" style="width: 100%">
                        <el-table-column prop="id" label="历史模板Id号" width="200"> </el-table-column>
                        <el-table-column prop="name" label="历史模板文件名" width="200"> </el-table-column>
                        <el-table-column prop="deleteAt" label="删除时间" width="300"> </el-table-column>
                        <el-table-column label="操作">
                            <template slot-scope="scope">
                                <el-button type="text" @click="reuse(scope.row, Report.id)">设为有效模板</el-button>
                                <el-button type="text" @click="fileDownload(scope.row, 0)">下 载</el-button>
                            </template>
                        </el-table-column>
                    </el-table><br> -->
                </div>
            </el-collapse-item>
        </el-collapse>
        <div class="block">
            <span class="demonstration"></span>
            <el-pagination @current-change="handleCurrentChange" :current-page="currentPage" :page-size="10"
                layout="total, prev, pager, next, jumper" :total="totalElements">
            </el-pagination>
        </div>
    </div>
</template>
<script>
import service from '@/utils/service';
import moment from 'moment';
export default {
    inject: ['reloadAll'],
    data() {
        return {
            DivVisible: false,
            hours: 0,
            price: 0,
            // defaultWorkCycle: {
            //     workDuration: null,
            //     price: null
            // },
            tempIndex1: null,
            tempIndex2: null,
            currentPage: 1,
            totalElements: null,
            currentPage1: 1,
            totalElements1: null,
            nowTemplateId: 0,
            reportTypeId: 0,
            activeName: '1',
            historyDialogVisible: false,
            ReportList: [
                {
                    id: 0,
                    type: "string",
                    edition: "string",
                    language: "string",
                    nowReport: [{
                        created: "2024-10-11T11:39:09.289Z",
                        id: 0,
                        name: "string",
                        type: "string",
                        lastUpdated: "2024-10-11T11:39:09.290Z",
                        createdBy: {
                            id: 0,
                            employeeNumber: "string",
                            name: "string"
                        },
                        lastUpdatedBy: {
                            id: 0,
                            employeeNumber: "string",
                            name: "string"
                        },
                    }],
                    defaultWorkDuration: '',
                    defaultWorkCycle: '',
                    optionalWorkCycles: [
                        {
                            workCycle: {
                                second: 0,
                                nano: 0,
                                negative: true,
                                zero: true,
                            },
                            price: 100,
                            workDuration: '1',
                            // tempHours: 0,
                            // tempPrice: 0,
                            // defaultWorkCycle: {
                            //     workDuration: '1',
                            //     price: 1
                            // }
                        }
                    ]
                }
            ],
            historyReportList: [
                {
                    id: 0,
                    name: "string",
                    type: "string",
                    created: "2024-10-11T12:18:13.077Z",
                    createdBy: {
                        id: 0,
                        employeeNumber: "string",
                        name: "string"
                    },
                    deleteAt: "2024-10-11T12:18:13.077Z",
                    deleteBy: {
                        id: 0,
                        employeeNumber: "string",
                        name: "string"
                    },
                    resourceId: 0
                }
            ],
        };
    },
    methods: {
        refresh() {
            this.reloadAll()
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
                url: "/report-type/templates/page",
                params: {
                    page: pageNum - 1,
                    size: 10,
                },
            }).then((result) => {
                console.log(result);
                this.totalElements = result.totalElements;
                this.ReportList = result.content;
                for (var i = 0; i < this.ReportList.length; i++) {
                    // this.ReportList[i]['optionalWorkCycles'] = []
                    if (this.ReportList[i].optionalWorkCycles == null) {
                        this.ReportList[i]['optionalWorkCycles'] = []
                    }
                    if (this.ReportList[i].defaultWorkCycle == null)
                        this.ReportList[i]['defaultWorkDuration'] = null
                    else
                        this.ReportList[i]['defaultWorkDuration'] = this.transDuration(this.ReportList[i].defaultWorkCycle)
                    for (var j = 0; j < this.ReportList[i].optionalWorkCycles.length; j++) {
                        this.ReportList[i].optionalWorkCycles[j]['workDuration'] = this.transDuration(this.ReportList[i].optionalWorkCycles[j].workCycle)
                    }
                    // for(var j = 0; j < this.ReportList[i].nowReport.length; j++) {
                    //     if(this.ReportList[i].nowReport[j].optionalWorkCycles.length == null) {
                    //         this.ReportList[i].nowReport[j]['optionalWorkCycles'] = []
                    //     }
                    //     if(this.ReportList[i].nowReport[j].defaultWorkCycle == null)
                    //         this.ReportList[i].nowReport[j]['defaultWorkDuration'] = null
                    //     else
                    //         this.ReportList[i].nowReport[j]['defaultWorkDuration'] = this.transDuration(this.ReportList[i].nowReport[j].defaultWorkCycle)
                    //     for(var k = 0; k < this.ReportList[i].nowReport[j].optionalWorkCycles.length; k++) {
                    //         this.ReportList[i].nowReport[j].optionalWorkCycles[k]['workDuration'] = this.transDuration(this.ReportList[i].nowReport[j].optionalWorkCycles[k].workCycle)
                    //     }
                    // }
                }
            }).catch((error) => {
                this.handleError(error);
            });
        },
        submit(Report) {
            console.log(Report)
            let workCycle = moment.duration(this.hours, 'hours').toISOString()
            let duration = this.transDuration(workCycle)
            Report.optionalWorkCycles.push({
                workDuration: duration,
                price: this.price,
                workCycle: workCycle
            })
            console.log(this.ReportList);
            this.DivVisible = false
        },
        Delete(Report, index) {
            if (Report.optionalWorkCycles[index].workCycle == Report.defaultWorkCycle) {
                Report.defaultWorkCycle = ''
                Report.defaultWorkDuration = ''
            }
            Report.optionalWorkCycles.splice(index, 1)
        },
        updata(data) {
            // 接口待定义
            console.log(data.id)
            if (data.defaultWorkCycle == '') {
                this.$message({
                    message: '请设置默认工作周期',
                    type: 'warning'
                });
                return
            }
            let obj = {
                id: data.id,
                optionalWorkCycles: data.optionalWorkCycles,
                defaultWorkCycle: data.defaultWorkCycle
            }
            service({
                method: "post",
                url: '/report-type/' + `${data.id}` + '/updateWorkCyclePrice',
                headers: { 'Content-Type': 'application/json' },
                data: JSON.stringify(obj)
            }).then((result) => {
                console.log(result)
                this.$message({
                    message: '保存成功',
                    type: 'success'
                });
            }).catch(error => {
                this.handleError(error)
            })
        },
        setDefault(Report, row) {
            Report.defaultWorkCycle = row.workCycle
            Report.defaultWorkDuration = row.workDuration
            this.$forceUpdate()
            this.$message({
                message: '设置成功',
                type: 'success'
            });
        },
        getHistoryTab(id, pageNum) {
            service({
                method: "get",
                url: "/resource/" + `${id}` + "/history",
                params: {
                    page: pageNum - 1,
                    size: 10,
                },
            })
                .then((result) => {
                    console.log(result);
                    this.totalElements1 = result.totalElements;
                    this.historyReportList = result.content;
                })
                .catch((error) => {
                    this.handleError(error);
                });
        },
        handleCurrentChange(val) {
            console.log(`当前页: ${val}`);
            this.currentPage = val
            this.getTab(val);
        },
        handleCurrentChange1(val) {
            console.log(`当前页: ${val}`);
            this.currentPage1 = val
            this.getHistoryTab(this.nowTemplateId, val);
        },
        fileDownload(data, status) {
            console.log(data, status)
            var a = document.createElement('a');
            a.download = data.id + ".doc"; //设置下载文件的名称
            a.href = "api/resource/file/" + `${data.id}` + "/status/" + `${status}`;
            // a.href = "https://dldir1v6.qq.com/weixin/Windows/WeChatSetup.exe"; //下载文件的url
            a.click();
        },
        reuse(rowData, Report_id) {
            console.log(rowData)
            service({
                method: "post",
                url: "/report-type/template/reuse/" + `${Report_id}` + "/" + `${rowData.id}`,
                headers: { 'Content-Type': 'application/json' },
                data: null
            }).then((result) => {
                console.log(result);
                this.$message({
                    type: 'success',
                    message: '设置成功!'
                })
                this.historyDialogVisible = false
                this.getTab(this.currentPage);
            }).catch((error) => {
                this.handleError(error);
            });
        },
        checkFile(item, report_type_id) {
            console.log(item)
            console.log(report_type_id)
            this.nowTemplateId = item.id
            this.reportTypeId = report_type_id
            document.querySelector('#fileInput').click()
        },
        updateFile(e, item, report_type_id) {
            console.log("123!!" + this.currentPage)
            console.log(item)
            console.log(report_type_id)
            console.log(document.querySelector('#fileInput').files[0])
            console.log(e.target.files[0])
            let file = e.target.files[0]
            let params = new FormData();
            params.append("report-type-id", this.reportTypeId);
            params.append("template-id", this.nowTemplateId);
            params.append("file", file);
            console.log(params.get("file"));
            let config = {
                headers: { "Content-Type": "multipart/form-data" },
            }; //添加请求头
            service.post("//report-type/template/upload/", params, config).then((result) => {
                console.log(result);
                if (result.code) {
                    this.$message({
                        type: 'error',
                        message: '上传失败!'
                    })
                } else {
                    this.$message({
                        type: 'success',
                        message: '成功上传!'
                    })
                }
                this.getTab(this.currentPage);
            }).catch((error) => {
                this.handleError(error);
            });
        },
        viewHistoryTemplates(data) {
            console.log(data)
            this.historyDialogVisible = true;
            this.$nextTick(() => {
                this.nowTemplateId = data.id
                this.getHistoryTab(data.id, 1)
            })
        },
        transDuration(ISOString) {
            let s = moment.duration(ISOString).seconds()
            let m = moment.duration(ISOString).minutes()
            let h = moment.duration(ISOString).hours()
            let d = moment.duration(ISOString).days()
            let M = moment.duration(ISOString).months()
            let y = moment.duration(ISOString).years()
            let str = ""
            if (y != 0) str += y + "年"
            if (M != 0) str += M + "月"
            if (d != 0) str += d + "日"
            if (h != 0) str += h + "小时"
            if (m != 0) str += m + "分钟"
            if (s != 0) str += s + "秒"
            return str
        }
    },
    mounted() {
        // this.currentPage = 1;
        this.getTab(this.currentPage);
    },
}
</script>
