<!--
 * @Descripttion: 
 * @version: 
 * @Author: liuwl
 * @Date: 2021-07-15 10:23:23
 * @LastEditTime: 2021-07-15 10:43:09
-->
<template>
  <div>
    <el-table
      :data="tableData"
      border
      :header-cell-style="{background:'#f5f7fa'}"
      tooltip-effect="light"
      v-loading="tableLoading"
      max-height="550"
    >
      <el-table-column
        type="index"
        width="50"
        align="center"
      >
      </el-table-column>
      <el-table-column
        prop="ruleId"
        label="规则编号"
        align="center"
        min-width="240"
        show-overflow-tooltip
      >
      </el-table-column>
      <el-table-column
        prop="ruleName"
        label="规则名称"
        align="center"
        min-width="180"
        show-overflow-tooltip
      >
      </el-table-column>
      <el-table-column
        prop="ruleType"
        label="规则类型"
        align="center"
        min-width="120"
        show-overflow-tooltip
      >
      </el-table-column>
      <el-table-column
        prop="ruleDesc"
        label="规则描述"
        align="center"
        min-width="240"
        show-overflow-tooltip
      >
      </el-table-column>
      <el-table-column
        prop="ruleExp"
        label="规则表达式"
        align="center"
        min-width="500"
      >
        <template slot-scope="scope">
          <el-popover
            placement="top"
            trigger="hover"
            :content="scope.row.ruleExp"
          >
            <div
              slot="reference"
              style="overflow: hidden;text-overflow: ellipsis;white-space: nowrap;"
            >{{scope.row.ruleExp}}</div>
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column
        prop="ruleVersion"
        label="版本号"
        align="center"
        min-width="120"
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
        label="操作人"
        align="center"
        min-width="100"
        show-overflow-tooltip
      >
      </el-table-column>
    </el-table>
  </div>
</template>
<script>
export default {
  components: {},
  props: ["passItem"],
  data() {
    return {
      // 表格数据
      tableData: [],
      // 表格加载状态
      tableLoading: false,
    };
  },
  watch: {},
  computed: {},
  methods: {
    /**
     * 查询历史规则
     */
    getHistoryRule() {
      this.tableLoading = true;
      let params = {
        ruleId: this.passItem.ruleId,
      };
      this.$contract.getHistoryRule(params).then((res) => {
        if (res.returnCode === "0") {
          this.tableData = res.object;
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
  created() {
    this.getHistoryRule();
  },
  mounted() {},
};
</script>