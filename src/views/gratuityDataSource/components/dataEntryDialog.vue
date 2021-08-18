<!--
 * @Descripttion: 
 * @version: 
 * @Author: liuwl
 * @Date: 2021-06-23 14:37:58
 * @LastEditTime: 2021-08-09 16:26:14
-->
<template>
  <div
    v-loading="loading"
    element-loading-text="文件信息正在上传，请稍等......"
  >
    <el-tabs
      v-model="activeName"
      @tab-click="handleClick"
    >
      <el-tab-pane
        label="查看"
        name="toView"
      >
        <div style="margin-bottom: 0.1rem;">
          <el-input
            v-model="month"
            placeholder="请输入月份,例如:202106"
            clearable
            style="width:1.2rem;margin-right:0.1rem"
          ></el-input>
          <el-button
            type="primary"
            icon="el-icon-search"
            @click="queryViewForm"
            :loading="viewTableLoading"
          >查询</el-button>
          <el-button
            icon="el-icon-refresh"
            @click="resetViewForm"
            :loading="viewTableLoading"
          >重置</el-button>
          <kt-button
            type="primary"
            icon="el-icon-download"
            label="下载"
            perms='downloadView'
            :loading="viewTableLoading"
            @click="downLoadDataList"
          ></kt-button>
        </div>
        <kt-table
          :totalData="propsSelectData.totalData"
          :multiSelectData="propsSelectData.multiSelectData"
          v-loading="viewTableLoading"
        ></kt-table>
        <el-pagination
          :current-page="viewPage"
          :page-sizes="[10, 20, 50]"
          :page-size="viewSizeVal"
          layout="total, sizes, prev, pager, next, jumper"
          :total="viewTotal"
          @size-change="viewHandleSizeChange"
          @current-change="viewPageChange"
        >
        </el-pagination>
      </el-tab-pane>
      <el-tab-pane
        label="上传"
        name="upload"
      >
        <el-upload
          class="upload-demo"
          ref="upload"
          drag
          action="string"
          :headers="{ 'Authorization': token }"
          :http-request="Import"
          :limit="1"
          :on-exceed="handleExceed"
          :before-upload="beforeAvatarUpload"
          :auto-upload="false"
        >
          <i class="el-icon-upload"></i>
          <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
        </el-upload>
        <div class="upload-dom-btn">
          <el-button
            type="primary"
            @click="downloadTemplate"
            :loading="btnLoading"
          >下载上传模板</el-button>
          <kt-button
            type="success"
            label="上传到服务器"
            perms='fileUpload'
            :loading="btnLoading"
            @click="submitUpload"
          ></kt-button>
        </div>
      </el-tab-pane>
      <el-tab-pane
        label="日志"
        name="theLog"
      >
        <el-table
          :data="logTableData.slice((logPage-1)*logSizeVal,logPage*logSizeVal)"
          border
          tooltip-effect="light"
          :header-cell-style="{background:'#f5f7fa'}"
          v-loading="logTableLoading"
          max-height="550"
        >
          <el-table-column
            type="index"
            width="50"
            align="center"
          >
          </el-table-column>
          <el-table-column
            prop="opCode"
            label="操作人"
            align="center"
            min-width="120"
            show-overflow-tooltip
          >
          </el-table-column>
          <el-table-column
            prop="fileName"
            label="文件名称"
            align="center"
            min-width="160"
            show-overflow-tooltip
          >
          </el-table-column>
          <el-table-column
            prop="startTime"
            label="上传时间"
            align="center"
            min-width="210"
            show-overflow-tooltip
          >
          </el-table-column>
          <el-table-column
            prop="endTime"
            label="完成时间"
            align="center"
            min-width="210"
            show-overflow-tooltip
          >
          </el-table-column>
          <el-table-column
            prop="state"
            label="状态"
            align="center"
            min-width="100"
            show-overflow-tooltip
          >
            <template slot-scope="scope">
              <div v-if="scope.row.state==='1'">
                <div class="zt-radius zc"></div><span>成功</span>
              </div>
              <el-tooltip
                v-else-if="scope.row.state==='2'"
                :content=scope.row.failReason
                placement="bottom"
                effect="light"
              >
                <div>
                  <div class="zt-radius cw"></div><span style="border-bottom: 1px solid;font-style: oblique;">失败</span>
                </div>
              </el-tooltip>
            </template>
          </el-table-column>
          <el-table-column
            prop="dataCount"
            label="数据量"
            align="center"
            min-width="100"
            show-overflow-tooltip
          >
          </el-table-column>
          <el-table-column
            prop="fieType"
            label="类型"
            align="center"
            min-width="120"
            show-overflow-tooltip
          >
            <template slot-scope="scope">
              <span
                class=""
                v-if="scope.row.fieType === '1'"
              >文件上传</span>
              <span v-else-if="scope.row.fieType === '2'">文件替换</span>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
          :current-page="logPage"
          :page-sizes="[10, 20, 50]"
          :page-size="logSizeVal"
          layout="total, sizes, prev, pager, next, jumper"
          :total="logTotal"
          @size-change="logHandleSizeChange"
          @current-change="logPageChange"
        >
        </el-pagination>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
import ktTable from "@/components/page/ktTable.vue";
export default {
  name: "",
  components: {
    "kt-table": ktTable,
  },
  props: ["item"],
  data() {
    return {
      //激活标签页名称
      activeName: "toView",
      //上传数据查询月份输入框
      month: "",
      //查看上传数据数据--表格封装需要的数据源
      propsSelectData: {
        multiSelectData: [{ name: "date", comment: "获取失败" }],
        totalData: [],
      },
      // 上传数据表格加载状态
      viewTableLoading: false,
      // 上传数据列表条数
      viewTotal: null,
      // 上传数据每页个数
      viewSizeVal: 10,
      // 上传数据页码
      viewPage: 1,
      // 文件下载上传按钮加载中状态
      btnLoading: false,
      // 文件上传token
      token: "",
      // 日志表格信息
      logTableData: [],
      // 日志表格加载状态
      logTableLoading: false,
      // 日志数据列表条数
      logTotal: null,
      // 日志查询每页个数
      logSizeVal: 10,
      // 日志查询页码
      logPage: 1,
      // 上传加载中
      loading: false,
    };
  },
  computed: {},
  watch: {},
  created() {
    this.token = JSON.parse(sessionStorage.getItem("userInfo")).token;
    this.activeName = this.item.type;
    switch (this.item.type) {
      case "toView":
        this.queryViewParams();
        break;
      case "theLog":
        this.getLogData();
        break;
    }
  },
  mounted() {},
  methods: {
    /**
     * tab 被选中时触发
     * 被选中的标签 tab 实例
     */
    handleClick(tab, event) {
      switch (tab.name) {
        case "toView":
          this.queryViewParams();
          break;
        case "theLog":
          this.getLogData();
          break;
      }
      this.$emit("widthChange", tab.name);
    },
    /**
     * 查看上传数据查询按钮事件
     */
    queryViewForm() {
      this.viewPage = 1;
      this.queryViewParams();
    },
    /**
     * 查看上传数据重置按钮事件
     */
    resetViewForm() {
      this.month = "";
      this.sizeVal = 10;
      this.queryViewForm();
    },
    /**
     * 下载上传数据按钮事件
     */
    downLoadDataList() {
      let params = {
        month: this.month,
        infoName: this.item.row.infoName,
        tabName: this.item.row.tabName,
      };
      this.$contract.downLoadDataList(params).then((res) => {
        const blob = new Blob([res]); //处理文档流
        const fileName = this.item.row.infoName + ".xlsx";
        const elink = document.createElement("a");
        elink.download = fileName;
        elink.style.display = "none";
        elink.href = URL.createObjectURL(blob);
        document.body.appendChild(elink);
        elink.click();
        URL.revokeObjectURL(elink.href); // 释放URL 对象
        document.body.removeChild(elink);
        this.btnLoading = false;
      });
    },
    /**
     * 查看上传数据分页数量改变触发方法
     */
    viewHandleSizeChange(val) {
      this.viewSizeVal = val;
      this.viewPage = 1;
      this.queryViewParams();
    },
    /**
     * 查看上传数据分页页码改变触发方法
     */
    viewPageChange(val) {
      this.viewPage = val;
      this.queryViewParams();
    },
    /**
     * 查看上传数据数据参数处理
     */
    queryViewParams() {
      let params = {
        current: this.viewPage,
        month: this.month,
        size: this.viewSizeVal,
        tabName: this.item.row.tabName,
      };
      this.getUploadDataList(params);
    },
    /**
     * 查看上传数据调用接口
     * params：入参
     */
    getUploadDataList(params) {
      this.viewTableLoading = true;
      this.$contract.getUploadDataList(params).then((res) => {
        if (res.code === 1) {
          this.propsSelectData.multiSelectData = res.data.name;
          this.propsSelectData.totalData = res.data.data.records;
          this.viewTotal = res.data.data.total;
        } else {
          this.$messageCom(
            "error",
            "获取数据失败，失败原因：" + res.returnMessage,
            "1500"
          );
        }
        this.viewTableLoading = false;
      });
    },
    /**
     * 下载上传模板
     * params：infoName，tabName
     */
    downloadTemplate() {
      this.btnLoading = true;
      let params = {
        infoName: this.item.row.infoName,
        tabName: this.item.row.tabName,
      };
      this.$contract.downLoadMould(params).then((res) => {
        const blob = new Blob([res]); //处理文档流
        const fileName = this.item.row.infoName + ".xlsx";
        const elink = document.createElement("a");
        elink.download = fileName;
        elink.style.display = "none";
        elink.href = URL.createObjectURL(blob);
        document.body.appendChild(elink);
        elink.click();
        URL.revokeObjectURL(elink.href); // 释放URL 对象
        document.body.removeChild(elink);
        this.btnLoading = false;
      });
    },
    /**
     * 文件超出个数限制时的钩子
     * function(files, fileList)
     */
    handleExceed(files, fileList) {
      this.$messageCom("warning", "只能选择一个文件进行上传", "1000");
    },
    /**
     * 上传文件之前的钩子，参数为上传的文件
     * 判断是否符合上传文件类型
     */
    beforeAvatarUpload(file) {
      const isXLS =
        file.type === "application/vnd.ms-excel" ||
        file.type ===
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
      if (!isXLS) {
        this.$messageCom(
          "error",
          "导入文件只能是 xls 或者 xlsx 格式！",
          "1000"
        );
      }
      return isXLS;
    },
    /**
     * 上传文件
     * 覆盖默认的上传行为，可以自定义上传的实现
     */
    Import(item) {
      let formDataFile = new FormData();
      formDataFile.append("file", item.file);
      formDataFile.append("group", "system");
      const fileName = item.file.name;
      const tabName = this.item.row.tabName;
      const userId = JSON.parse(sessionStorage.getItem("userInfo")).userId;
      const modeId = this.item.row.modeId;
      this.loading = true;
      this.$contract
        .importExcel(fileName, modeId, userId, tabName, formDataFile)
        .then((res) => {
          if (res.returnCode === "0") {
            this.$messageCom("success", "文件已上传至服务器", "1000");
            this.$refs.upload.clearFiles();
          } else {
            this.$messageCom(
              "error",
              "上传文件失败，失败原因：" + res.returnMessage,
              "1000"
            );
          }
          this.loading = false;
        });
    },
    /**
     * 文件上传到服务器
     */
    submitUpload() {
      this.$refs.upload.submit();
    },
    /**
     * 查看日志分页数量改变触发方法
     */
    logHandleSizeChange(val) {
      this.logSizeVal = val;
      this.logPage = 1;
    },
    /**
     * 查看日志分页页码改变触发方法
     */
    logPageChange(val) {
      this.logPage = val;
    },
    /**
     * 查看日志调用接口
     * params：入参
     */
    getLogData() {
      this.logTableLoading = true;
      this.$contract.getLogData(this.item.row.tabName).then((res) => {
        if (res.returnCode === "0") {
          this.logTotal = res.totalCount;
          this.logTableData = res.beans;
        } else {
          this.$messageCom(
            "error",
            "获取数据失败，失败原因：" + res.returnMessage,
            "1500"
          );
        }
        this.logTableLoading = false;
      });
    },
  },
};
</script>
<style lang="scss" scoped>
.upload-dom-btn {
  text-align: center;
  margin-top: 20px;
}
</style>

