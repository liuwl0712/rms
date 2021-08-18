<!--
 * @Descripttion: 
 * @version: 
 * @Author: liuwl
 * @Date: 2021-06-23 16:33:25
 * @LastEditTime: 2021-07-01 17:46:57
-->
<template>
  <div>
    <el-table
      :data="tableData"
      border
      tooltip-effect="light"
      :header-cell-style="{background:'#f5f7fa'}"
      v-loading="tableLoading"
    >
      <el-table-column
        type="index"
        width="50"
        align="center"
      >
      </el-table-column>
      <el-table-column
        prop="period"
        label="周期"
        align="center"
        min-width="120"
        show-overflow-tooltip
      >
      </el-table-column>
      <el-table-column
        prop="opTime"
        label="同步时间"
        align="center"
        min-width="220"
        show-overflow-tooltip
      >
      </el-table-column>
      <el-table-column
        prop="kfCode"
        label="会员编号"
        align="center"
        min-width="120"
        show-overflow-tooltip
      >
      </el-table-column>
      <el-table-column
        prop="factorCode"
        label="因素编号"
        align="center"
        min-width="120"
        show-overflow-tooltip
      >
      </el-table-column>
      <el-table-column
        prop="factorName"
        label="因素名称"
        align="center"
        min-width="140"
        show-overflow-tooltip
      >
      </el-table-column>
      <el-table-column
        prop="factorValue"
        label="因素值"
        align="center"
        min-width="100"
        show-overflow-tooltip
      >
      </el-table-column>
      <el-table-column
        prop="beginDate"
        label="统计开始时间"
        align="center"
        min-width="140"
        show-overflow-tooltip
      >
      </el-table-column>
      <el-table-column
        prop="endDate"
        label="统计结束时间"
        align="center"
        min-width="140"
        show-overflow-tooltip
      >
      </el-table-column>
      <el-table-column
        prop="createTime"
        label="创建时间"
        align="center"
        min-width="220"
        show-overflow-tooltip
      >
      </el-table-column>
      <el-table-column
        prop="opCode"
        label="操作员"
        align="center"
        min-width="100"
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
  name: "indexHistoryDialog",
  components: {},
  props: ["item"],
  data() {
    return {
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
    };
  },
  computed: {},
  watch: {},
  created() {
    this.getRecordHistoryList();
  },
  mounted() {},
  methods: {
    /**
     * 分页数量改变触发方法
     */
    handleSizeChange(val) {
      this.sizeVal = val;
      this.page = 1;
      this.getRecordHistoryList();
    },
    /**
     * 分页页码改变触发方法
     */
    pageChange(val) {
      this.page = val;
      this.getRecordHistoryList();
    },
    /**
     * 分页展示指标同步历史明细
     */
    getRecordHistoryList() {
      let params = {
        factorCode: this.item.factorCode,
        current: this.page,
        pageSize: this.sizeVal,
      };
      this.tableLoading = true;
      this.$contract.getRecordHistoryList(params).then((res) => {
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
  },
};
</script>

