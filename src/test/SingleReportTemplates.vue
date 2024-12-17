<template>
  <div>
    <!-- <el-input v-input.float="2" v-model="price" placeholder="请输入默认价格" style="width: 30%" ></el-input> -->
    <el-table :data="singleReports" style="width: 100%" row-key="id" :expand-row-keys="expands">
      <!-- <el-table-column type="expand">
        <template slot-scope="scope">
          <el-table :data="scope.row.experimentHistoryTemplateDtoList" style="width: 100%">
            <el-table-column prop="id" label="历史报告模板" width="200"> </el-table-column>
            <el-table-column prop="createdBy.name" label="创建人" width="200"> </el-table-column>
            <el-table-column prop="deletedBy.name" label="删除人" width="200"> </el-table-column>
            <el-table-column prop="createdTime" label="创建时间" width="200"> </el-table-column>
            <el-table-column prop="deletedTime" label="删除时间" width="200"> </el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button type="text" @click="fileDownload(scope.row, 0)">下载文件</el-button>
                <el-button type="text" @click="reuse(scope.row)">设为有效单项报告模板</el-button>
              </template>
</el-table-column>
</el-table>
</template>
</el-table-column> -->
      <el-table-column prop="name" label="单项报告类型名" width="180">
      </el-table-column>
      <el-table-column prop="price" label="实验类型价格" width="180">
      </el-table-column>
      <el-table-column prop="nowExperiment.createdBy.name" label="创建人" width="180">
      </el-table-column>
      <el-table-column prop="nowExperiment.created" label="创建时间" width="300">
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button type="text" @click="checkFile">上传新模板</el-button>
          <input id="fileInput" type="file" style="display: none;" @change="updateFile($event, scope.row)" />&nbsp;
          <el-button type="text" @click="fileDownload(scope.row, 'IN_USE')">下载文件</el-button>
          <el-button type="text" @click="editExperimentTemplate(scope.row)">编辑实验模板</el-button>
          <el-dialog title="编辑模板" :visible.sync="taskDialogVisible" append-to-body width="80%">
            <schema-edit ref="experimentSchema"></schema-edit>
            编辑实验类型价格：<el-input v-input.float="2"   v-model="price" placeholder="请输入默认价格" style="width: 30%"></el-input>
            <span slot="footer" class="dialog-footer">
              <el-button @click="taskDialogVisible = false">取 消</el-button>
              <el-button @click="editExperimentFinish">确 定</el-button>
            </span>
          </el-dialog> &nbsp;
          <el-button type="text" @click="viewHistoryTemplates(scope.row)">查看历史模板</el-button>
          <el-dialog title="查看历史模板" :visible.sync="historyDialogVisible" append-to-body width="80%">
            <el-table :data="historyTemplateList" style="width: 100%">
              <el-table-column prop="id" label="历史报告模板" width="200"> </el-table-column>
              <el-table-column prop="createdBy.name" label="创建人" width="200"> </el-table-column>
              <el-table-column prop="deleteBy.name" label="删除人" width="200"> </el-table-column>
              <el-table-column prop="created" label="创建时间" width="200"> </el-table-column>
              <el-table-column prop="deleteAt" label="删除时间" width="200"> </el-table-column>
              <el-table-column label="操作">
                <template slot-scope="scope">
                  <el-button type="text" @click="fileDownload(scope.row, 'HISTORY')">下载文件</el-button>
                  <el-button type="text" @click="reuse(scope.row)">设为有效单项报告模板</el-button>
                </template>
              </el-table-column>
            </el-table>
            <div class="block">
              <span class="demonstration"></span>
              <el-pagination @current-change="handleCurrentChange1" :current-page="currentPage1" :page-size="10"
                layout="total, prev, pager, next, jumper" :total="totalElements1">
              </el-pagination>
            </div>
          </el-dialog>&nbsp;
        </template>
      </el-table-column>
      <el-table-column type="expand" width="1">
        <el-form label-position="left" class="demo-table-expand" v-loading="experimentSchemaLoading">
          <h3>编辑实验信息</h3>
          <el-form-item>
            <schema-edit ref="experimentSchema"></schema-edit>
            编辑实验类型价格：
            <!-- <el-input-number v-model="price"  :min="1" :max="65535" ></el-input-number> -->
            <el-input v-model="price" placeholder="请输入默认价格"  style="width: 30%" @input="change($event)"></el-input>
            &nbsp;
            <el-button @click="editExperimentFinish">完成编辑</el-button>
          </el-form-item>
        </el-form>
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
import SchemaEdit from "../schemas/SchemaEdit.vue";

export default {
  components: { SchemaEdit },
  inject: ['reloadAll'],
  data() {
    return {
      // 要展开的行，数值的元素是row的key值
      price: 1000,
      expands: [],
      experimentSchemaLoading: false,
      taskDialogVisible: false,
      historyDialogVisible: false,
      singleReports: [
        {
          id: 0,
          name: "string",
          resultTemplate: [
            {
              type: "string",
              name: "string",
              label: "string",
              content: "string",
              standardName: "string"
            }
          ],
          price: 0,
          nowExperiment: {
            created: "2024-10-11T12:01:45.718Z",
            id: 0,
            name: "string",
            type: "string",
            lastUpdated: "2024-10-11T12:01:45.718Z",
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
      historyTemplateList: [
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
      currentPage: 1,
      totalElements: null,
      currentPage1: 1,
      totalElements1: null,
      nowExperimentId: 0,
      experimentTypeId: 0,
    };
  },
  methods: {
    refresh() {
      this.reloadAll()
    },
    change (e) {
      console.log(e);
      this.$forceUpdate()
    },
    fileDownload(data, status) {
      console.log(data, status)
      let id = (status == "IN_USE" ? data.nowExperiment.id : data.id)
      var a = document.createElement('a');
      a.download = id + ".doc"; //设置下载文件的名称
      a.href = "api/resource/file/" + `${id}` + "/status/" + `${status}`;
      // a.href = "https://dldir1v6.qq.com/weixin/Windows/WeChatSetup.exe"; //下载文件的url
      a.click();
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
    editExperimentTemplate(data) {
      // console.log(data);
      // this.taskDialogVisible = true;
      // this.$nextTick(() => {
      //   this.price = data.price
      //   this.$refs.experimentSchema.id = data.id
      //   this.$refs.experimentSchema.schemaData = data.resultTemplate
      //   this.experimentTypeId = data.id

      // })
      if (this.expands.includes(data.id)) {
        this.expands = [];
      } else {
        this.expands = [];
        this.expands.push(data.id);
        this.$nextTick(() => {
          this.experimentSchemaLoading = true;
          this.price = data.price
          this.$refs.experimentSchema.id = data.id
          this.$refs.experimentSchema.schemaData = data.resultTemplate
          this.experimentTypeId = data.id
          this.experimentSchemaLoading = false;
        })
      }

    },
    viewHistoryTemplates(data) {
      console.log(data)
      this.historyDialogVisible = true;
      this.$nextTick(() => {
        this.nowExperimentId = data.nowExperiment.id
        this.experimentTypeId = data.id
        this.getHistoryTab(data.nowExperiment.id, 1)
      })
    },
    getTab(pageNum) {
      service({
        method: "get",
        url: "/experiment-type/list/detail",
        params: {
          page: pageNum - 1,
          size: 10,
        },
      })
        .then((result) => {
          console.log(result);
          this.totalElements = result.totalElements;
          this.singleReports = result.content;
        })
        .catch((error) => {
          this.handleError(error);
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
          this.historyTemplateList = result.content;
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
      this.getHistoryTab(this.nowExperimentId, val);
    },
    editExperimentFinish() {
      this.taskDialogVisible = false
      let obj = {
        resultTemplate: this.$refs.experimentSchema.schemaData,
        price: this.price
      }
      //发请求给更新模板
      service({
        method: "post",
        url: "/experiment-type/" + `${this.experimentTypeId}` + "/update",
        headers: { 'content-type': 'application/json' },
        data: JSON.stringify(obj)
      })
        .then((result) => {
          console.log(result);
          this.taskDialogVisible = false
          this.$message({
            type: 'success',
            message: '完成编辑!'
          })
          this.refresh()
          // this.currentPage = 2
          // this.getTab(2);
        })
        .catch((error) => {
          this.handleError(error);
        });
    },
    checkFile() {
      document.querySelector('#fileInput').click()
    },
    updateFile(e, data) {
      console.log(document.querySelector('#fileInput').files[0])
      console.log(e.target.files[0])
      console.log(data)
      let file = e.target.files[0]
      let params = new FormData();
      params.append("experiment-type-id", data.id);
      params.append("file", file);
      console.log(params.get("file"));
      let config = {
        headers: { "Content-Type": "multipart/form-data" },
      }; //添加请求头
      service.post("//experiment-type/upload", params, config).then((result) => {
        console.log(result);
        if (result.code) {
          this.$message({
            type: 'error',
            message: '上传失败'
          })
        }
        else {
          this.$message({
            type: 'success',
            message: '成功上传!'
          })
          this.getTab(this.currentPage);
        }
        // this.refresh()  // 还是当前页会变成 1
        this.getTab(this.currentPage);
      }).catch((error) => {
        this.handleError(error);
      });

    },
    reuse(rowData) {
      console.log(rowData)
      service({
        method: "post",
        url: "/experiment-type/reuse/" + `${this.experimentTypeId}` + "/" + `${rowData.id}`,
        headers: { 'Content-Type': 'application/json' },
        data: null
      }).then((result) => {
        console.log(result);
        this.$message({
          type: 'success',
          message: '设置成功!'
        })
        this.getTab(this.currentPage);
        this.historyDialogVisible = false
      }).catch((error) => {
        this.handleError(error);
      });
    },
    clickRowHandle(row) {
      if (this.expands.includes(row.id)) {
        this.expands = this.expands.filter(val => val !== row.id);
      } else {
        this.expands.push(row.id);
      }
    },
  },
  mounted() {
    // this.currentPage = 1;
    this.getTab(this.currentPage);
  },
};
</script>

<style></style>