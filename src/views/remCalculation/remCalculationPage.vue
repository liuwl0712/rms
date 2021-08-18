<!--
 * @Descripttion: 
 * @version: 
 * @Author: liuwl
 * @Date: 2021-07-16 10:43:35
 * @LastEditTime: 2021-07-16 11:34:33
-->
<template>
  <div>
    <com-breadcrumb
      :title1="'酬金计算'"
      :title2="'酬金计算'"
    ></com-breadcrumb>
    <el-form
      :inline="true"
      :model="formInline"
      ref="formInline"
      class="my-form-dom1"
    >
      <el-form-item
        label="指标模板月份"
        prop="yearMonth"
      >
        <el-date-picker
          v-model="formInline.yearMonth"
          type="month"
          placeholder="选择指标模板月份"
          value-format="yyyyMM"
        >
        </el-date-picker>
      </el-form-item>
      <el-form-item
        label="指标模板名称"
        prop="templateName"
      >
        <el-input
          v-model="formInline.templateName"
          placeholder="请输入指标模板名称"
          clearable
        ></el-input>
      </el-form-item>
      <el-form-item class="form-item-btn">
        <el-button
          type="primary"
          icon="el-icon-search"
          :disabled="tableLoading"
          @click="queryForm"
        >查询</el-button>
        <el-button
          @click="resetForm('formInline')"
          icon="el-icon-refresh"
          :disabled="tableLoading"
        >重置</el-button>
      </el-form-item>
    </el-form>
    <el-table
      :data="tableData"
      border
      :header-cell-style="{background:'#f5f7fa'}"
      tooltip-effect="light"
      v-loading="tableLoading"
    >
      <el-table-column
        type="index"
        width="50"
        align="center"
      >
      </el-table-column>
      <el-table-column
        prop="calculateId"
        label="计算编号"
        align="center"
        min-width="200"
        show-overflow-tooltip
      >
      </el-table-column>
      <el-table-column
        prop="yearMonth"
        label="模板月份"
        align="center"
        min-width="100"
        show-overflow-tooltip
      >
      </el-table-column>
      <el-table-column
        prop="templateName"
        label="模板名称"
        align="center"
        min-width="300"
        show-overflow-tooltip
      >
      </el-table-column>
      <el-table-column
        prop="state"
        label="状态"
        align="center"
        min-width="140"
        show-overflow-tooltip
      >
        <template slot-scope="scope">
          <div v-if="scope.row.state==='0'">
            <div class="zt-radius zt"></div><span>初始化</span>
          </div>
          <div v-if="scope.row.state==='1'">
            <div class="zt-radius dd"></div><span>计算中</span>
          </div>
          <div v-if="scope.row.state==='2'">
            <div class="zt-radius zc"></div><span>计算成功</span>
          </div>
          <div v-if="scope.row.state==='3'">
            <div class="zt-radius cw"></div><span>计算失败</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column
        prop="执行开始时间"
        label="执行开始时间"
        align="center"
        min-width="220"
        show-overflow-tooltip
      >
      </el-table-column>
      <el-table-column
        prop="执行结束时间"
        label="执行结束时间"
        align="center"
        min-width="220"
        show-overflow-tooltip
      >
      </el-table-column>
      <el-table-column
        prop="opCode"
        label="操作人"
        align="center"
        min-width="100"
        show-overflow-tooltip
      >
      </el-table-column>
      <el-table-column
        label="操 作"
        min-width="240"
        align="center"
        fixed="right"
      >
        <template slot-scope="scope">
          <el-link
            icon="el-icon-tickets"
            @click="openDialog('detailed',scope.row)"
          >结果明细</el-link>
          <el-link @click="openDialog('summary',scope.row)">结果汇总<i class="el-icon-document-checked el-icon--right"></i></el-link>
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
      :title="dialogTitle"
      :visible.sync="dialogVisible"
      width="7.5rem"
      append-to-body
      :close-on-click-modal="false"
      custom-class="dialog-min-height-500"
    >
      <editor-calculation
        :passItem="passItem"
        v-if="dialogShow"
      >
      </editor-calculation>
    </el-dialog>
  </div>
</template>
<script>
import editorCalculation from "./components/editorCalculation.vue";
export default {
  name: "remCalculation",
  components: {
    "editor-calculation": editorCalculation,
  },
  props: {},
  data() {
    return {
      // 查询表单
      formInline: {
        yearMonth: "",
        templateName: "",
      },
      // 表格数据
      tableData: [],
      // 表格加载状态
      tableLoading: false,
      //数据列表条数
      total: null,
      //查询每页个数
      sizeVal: 10,
      //查询页码
      page: 1,
      //模态框标题
      dialogTitle: "",
      //模态框是否打开
      dialogVisible: false,
      dialogShow: false,
      //传递模态框里的值
      passItem: {
        type: null,
        row: null,
      },
    };
  },
  watch: {},
  computed: {},
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
     * 查询接口参数封装
     */
    queryParams() {
      let params = {
        yearMonth: this.formInline.yearMonth,
        templateName: this.formInline.templateName,
        current: this.page,
        size: this.sizeVal,
      };
      this.qryBsTemplateCalculateByPage(params);
    },
    /**
     * 查询接口
     * params：查询入参
     */
    qryBsTemplateCalculateByPage(params) {
      this.tableLoading = true;
      this.$contract.qryBsTemplateCalculateByPage(params).then((res) => {
        if (res.returnCode === "0") {
          this.tableData = res.beans;
          this.total = res.totalCount;
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
     * 表格操作按钮，打开模态框
     * type：操作类型、row：当前行的数据
     */
    openDialog(type, row) {
      this.dialogTitle = row.templateName;
      this.passItem.type = type;
      this.passItem.row = row;
      this.dialogVisible = true;
      this.dialogShow = false;
      this.$nextTick(() => {
        this.dialogShow = true;
      });
    },
    /**
     * 重置按钮触发方法
     */
    resetForm(form) {
      this.$refs[form].resetFields();
      this.sizeVal = 10;
      this.queryForm();
    },
  },
  created() {
    this.queryForm();
  },
  mounted() {},
};
</script>