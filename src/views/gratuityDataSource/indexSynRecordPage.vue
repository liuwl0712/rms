<!--
 * @Descripttion: 
 * @version: 
 * @Author: liuwl
 * @Date: 2021-06-22 17:02:51
 * @LastEditTime: 2021-07-01 17:46:08
-->
<template>
  <div>
    <div class="Breadcrumb_title">酬金数据源&nbsp;&nbsp;&nbsp;&nbsp;>&nbsp;&nbsp;&nbsp;&nbsp;指标同步记录</div>
    <div>
      <el-form
        :inline="true"
        :model="formInline"
        ref="formInline"
        class="my-form-dom1"
      >
        <el-form-item
          label="任务名称"
          prop="taskName"
        >
          <el-input
            v-model="formInline.taskName"
            placeholder="请输入任务名称"
            clearable
          ></el-input>
        </el-form-item>
        <el-form-item
          label="任务周期"
          prop="period"
        >
          <el-input
            v-model="formInline.period"
            placeholder="请输入任务周期"
            clearable
          ></el-input>
        </el-form-item>
        <el-form-item class="form-item-btn">
          <el-button
            type="primary"
            icon="el-icon-search"
            @click="queryForm"
          >查询</el-button>
          <el-button
            @click="resetForm('formInline')"
            icon="el-icon-refresh"
          >重置</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="table-message"><i class="el-icon-info"></i>双击一行查看历史数据明细</div>
    <el-table
      :data="tableData"
      border
      tooltip-effect="light"
      :header-cell-style="{background:'#f5f7fa'}"
      @row-dblclick="rowDblclick"
      v-loading="tableLoading"
    >
      <el-table-column
        type="index"
        width="50"
        align="center"
      >
      </el-table-column>
      <el-table-column
        prop="taskName"
        label="任务名称"
        align="center"
        min-width="160"
        show-overflow-tooltip
      >
      </el-table-column>
      <el-table-column
        prop="period"
        label="任务周期"
        align="center"
        min-width="100"
        show-overflow-tooltip
      >
      </el-table-column>
      <el-table-column
        prop="opTime"
        label="同步时间"
        align="center"
        min-width="180"
        show-overflow-tooltip
      >
      </el-table-column>
      <el-table-column
        prop="totalNum"
        label="总条数"
        align="center"
        min-width="160"
        show-overflow-tooltip
      >
      </el-table-column>
      <el-table-column
        prop="sucessNum"
        label="成功数"
        align="center"
        min-width="160"
        show-overflow-tooltip
      >
      </el-table-column>
      <el-table-column
        prop="failNum"
        label="失败数"
        align="center"
        min-width="160"
        show-overflow-tooltip
      >
      </el-table-column>
      <el-table-column
        prop="state"
        label="状态"
        align="center"
        min-width="100"
      >
        <template slot-scope="scope">
          <div v-if="scope.row.state==='0'">
            <div class="zt-radius dd"></div><span>导入中</span>
          </div>
          <div v-else-if="scope.row.state==='1'">
            <div class="zt-radius zc"></div><span>导入成功</span>
          </div>
          <div v-else-if="scope.row.state==='2'">
            <div class="zt-radius cw"></div><span>导入失败</span>
          </div>
          <div v-else-if="scope.row.state==='3'">
            <div class="zt-radius dd"></div><span>同步中</span>
          </div>
          <div v-else-if="scope.row.state==='4'">
            <div class="zt-radius zc"></div><span>同步成功</span>
          </div>
          <div v-else-if="scope.row.state==='5'">
            <div class="zt-radius cw"></div><span>同步失败</span>
          </div>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      :current-page="page"
      :page-sizes="[10, 20, 50]"
      :page-size="sizeVal"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
      @size-change="handleSizeChange"
      @current-change="pageChange"
    >
    </el-pagination>
    <el-dialog
      :title="dialogTitle+' —— 历史数据明细'"
      :visible.sync="dialogVisible"
      width="6.2rem"
      append-to-body
      :close-on-click-modal="false"
    >
      <index-history
        v-if="dialogShow"
        :item="passItem"
      ></index-history>
    </el-dialog>
  </div>
</template>
<script>
import indexHistory from "./components/indexHistoryDialog.vue";
export default {
  name: "indexSynchronizationRecord",
  components: {
    "index-history": indexHistory,
  },
  data() {
    return {
      //查询表单数据
      formInline: {
        taskName: "",
        period: "",
      },
      //数据列表
      tableData: [],
      //表格Loading
      tableLoading: false,
      //数据列表条数
      total: null,
      //查询每页个数
      sizeVal: 10,
      //查询页码
      page: 1,
      //模态框标题
      dialogTitle: null,
      //模态框是否打开
      dialogVisible: false,
      dialogShow: false,
      //模态框传递数据
      passItem: null,
    };
  },
  created() {
    this.queryForm();
  },
  methods: {
    /**
     * 查询按钮
     */
    queryForm() {
      this.page = 1;
      this.queryParams();
    },
    /**
     * 分页数量改变触发方法
     */
    handleSizeChange(val) {
      this.sizeVal = val;
      this.page = 1;
      this.queryParams();
    },
    /**
     * 分页页码改变触发方法
     */
    pageChange(val) {
      this.page = val;
      this.queryParams();
    },
    /**
     * 分页展示指标同步任务记录参数处理
     */
    queryParams() {
      let params = {
        taskName: this.formInline.taskName,
        period: this.formInline.period,
        current: this.page,
        size: this.sizeVal,
      };
      this.getRecordList(params);
    },
    /**
     * 分页展示指标同步任务记录调用接口
     * params：查询参数
     */
    getRecordList(params) {
      this.tableLoading = true;
      this.$contract.getRecordList(params).then((res) => {
        if (res.returnCode === "0") {
          this.total = res.totalCount;
          this.tableData = res.beans;
        } else {
          this.$messageCom(
            "error",
            "获取数据失败，失败原因：" + res.returnMessage,
            "1500"
          );
        }
        this.tableLoading = false;
      });
    },
    /**
     * 表单重置
     */
    resetForm(form) {
      this.$refs[form].resetFields();
      this.sizeVal = 10;
      this.queryForm();
    },
    /**
     * 当某一行被双击时会触发该事件
     * row：当前行数据
     */
    rowDblclick(row) {
      this.dialogTitle = row.taskName;
      this.passItem = row;
      this.dialogShow = false;
      this.$nextTick(() => {
        this.dialogShow = true;
      });
      this.dialogVisible = true;
    },
  },
};
</script>
<style lang="scss" scoped>
.table-message {
  color: #909399;
}
</style>