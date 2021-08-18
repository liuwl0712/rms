<!--
 * @Descripttion: 
 * @version: 
 * @Author: liuwl
 * @Date: 2021-06-30 15:46:11
 * @LastEditTime: 2021-07-22 10:13:34
-->
<template>
  <div>
    <com-breadcrumb
      :title1="'酬金指标'"
      :title2="'指标规则关系管理'"
    ></com-breadcrumb>
    <el-form
      :inline="true"
      :model="formInline"
      ref="formInline"
      class="my-form-dom1"
    >
      <el-form-item
        label="规则名称"
        prop="ruleName"
      >
        <el-input
          v-model="formInline.ruleName"
          placeholder="请输入规则名称"
          clearable
        ></el-input>
      </el-form-item>
      <el-form-item
        label="指标名称"
        prop="kpiName"
      >
        <el-input
          v-model="formInline.kpiName"
          placeholder="请输入指标名称"
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
      ref="multipleTable"
    >
      <el-table-column
        type="index"
        width="50"
        align="center"
      >
      </el-table-column>
      <el-table-column
        prop="kpiId"
        label="指标编号"
        align="center"
        min-width="200"
        show-overflow-tooltip
      >
      </el-table-column>
      <el-table-column
        prop="kpiName"
        label="指标名称"
        align="center"
        min-width="140"
        show-overflow-tooltip
      >
      </el-table-column>
      <el-table-column
        prop="ruleId"
        label="规则编号"
        align="center"
        min-width="200"
        show-overflow-tooltip
      >
      </el-table-column>
      <el-table-column
        prop="ruleName"
        label="规则名称"
        align="center"
        min-width="160"
        show-overflow-tooltip
      >
      </el-table-column>
      <el-table-column
        prop="ruleVersion"
        label="规则版本"
        align="center"
        min-width="100"
        show-overflow-tooltip
      >
      </el-table-column>
      <el-table-column
        prop="createTime"
        label="创建时间"
        align="center"
        min-width="180"
        show-overflow-tooltip
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
  </div>
</template>
<script>
export default {
  name: "rule",
  data() {
    return {
      // 查询表单
      formInline: {
        ruleName: "",
        kpiName: "",
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
     * 指标管理查询接口参数封装
     */
    queryParams() {
      let params = {
        ruleName: this.formInline.ruleName,
        kpiName: this.formInline.kpiName,
        pageNum: this.page,
        pageSize: this.sizeVal,
      };
      this.getIndexRule(params);
    },
    /**
     * 指标管理查询接口
     * params：查询入参
     */
    getIndexRule(params) {
      this.tableLoading = true;
      this.$contract.getIndexRule(params).then((res) => {
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
     * 重置按钮触发方法
     */
    resetForm(form) {
      this.$refs[form].resetFields();
      this.sizeVal = 10;
      this.queryForm();
    },
  },
};
</script>