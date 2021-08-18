<!--
 * @Descripttion: 
 * @version: 
 * @Author: liuwl
 * @Date: 2021-07-16 11:13:44
 * @LastEditTime: 2021-07-16 14:53:39
-->
<template>
  <div>
    <kt-button
      icon="el-icon-download"
      type="primary"
      :label="downloadLable"
      :perms='downloadPerms'
      class="download-btn-calculation"
      @click="download"
    ></kt-button>
    <el-tabs
      v-model="activeName"
      @tab-click="handleClick"
    >
      <el-tab-pane
        label="结果明细"
        name="detailed"
      >
        <el-table
          :data="detailedTableData"
          border
          :header-cell-style="{background:'#f5f7fa'}"
          tooltip-effect="light"
          v-loading="detailedTableLoading"
          max-height="550"
        >
          <el-table-column
            type="index"
            width="50"
            align="center"
          >
          </el-table-column>
          <el-table-column
            prop="kfCode"
            label="会员编号"
            align="center"
            min-width="140"
            show-overflow-tooltip
          >
          </el-table-column>
          <el-table-column
            prop="startTime"
            label="结算开始时间"
            align="center"
            min-width="200"
            show-overflow-tooltip
          >
          </el-table-column>
          <el-table-column
            prop="endTime"
            label="结算结束时间"
            align="center"
            min-width="200"
            show-overflow-tooltip
          >
          </el-table-column>
          <el-table-column
            prop="weight"
            label="指标权重"
            align="center"
            min-width="120"
            show-overflow-tooltip
          >
          </el-table-column>
          <el-table-column
            prop="packageTypeName"
            label="包类别"
            align="center"
            min-width="160"
            show-overflow-tooltip
          >
          </el-table-column>
          <el-table-column
            prop="kpiName"
            label="指标名称"
            align="center"
            min-width="180"
            show-overflow-tooltip
          >
          </el-table-column>
          <el-table-column
            prop="calculateResult"
            label="系数"
            align="center"
            min-width="100"
            show-overflow-tooltip
          >
          </el-table-column>
          <el-table-column
            prop="preValue"
            label="原指标"
            align="center"
            min-width="100"
            show-overflow-tooltip
          >
          </el-table-column>
          <el-table-column
            prop="calculateCondition"
            label="系数公式"
            align="center"
            min-width="300"
            show-overflow-tooltip
          >
          </el-table-column>
          <el-table-column
            prop="createTime"
            label="执行时间"
            align="center"
            min-width="200"
            show-overflow-tooltip
          >
          </el-table-column>
        </el-table>
        <el-pagination
          :current-page="detailedPage"
          :page-sizes="[10, 20, 50]"
          :page-size="detailedSizeVal"
          layout="total, sizes, prev, pager, next, jumper"
          :total="detailedTotal"
          @size-change="detailedHandleSizeChange"
          @current-change="detailedPageChange"
        >
        </el-pagination>
      </el-tab-pane>
      <el-tab-pane
        label="结果汇总"
        name="summary"
      >
        <el-table
          :data="summaryTableData"
          border
          :header-cell-style="{background:'#f5f7fa'}"
          tooltip-effect="light"
          v-loading="summaryTableLoading"
          max-height="550"
        >
          <el-table-column
            type="index"
            width="50"
            align="center"
          >
          </el-table-column>
          <el-table-column
            prop="kfCode"
            label="会员编号"
            align="center"
            min-width="140"
            show-overflow-tooltip
          >
          </el-table-column>
          <el-table-column
            prop="startTime"
            label="结算开始时间"
            align="center"
            min-width="200"
            show-overflow-tooltip
          >
          </el-table-column>
          <el-table-column
            prop="endTime"
            label="结算结束时间"
            align="center"
            min-width="200"
            show-overflow-tooltip
          >
          </el-table-column>
          <el-table-column
            prop="khCoefficient"
            label="考核系数"
            align="center"
            min-width="100"
            show-overflow-tooltip
          >
          </el-table-column>
          <el-table-column
            prop="nxCoefficient"
            label="年限系数"
            align="center"
            min-width="100"
            show-overflow-tooltip
          >
          </el-table-column>
          <el-table-column
            prop="jnCoefficient"
            label="技能系数"
            align="center"
            min-width="100"
            show-overflow-tooltip
          >
          </el-table-column>
          <el-table-column
            prop="bwCoefficient"
            label="班务系数"
            align="center"
            min-width="100"
            show-overflow-tooltip
          >
          </el-table-column>
          <el-table-column
            prop="runEndtime"
            label="执行结束时间"
            align="center"
            min-width="200"
            show-overflow-tooltip
          >
          </el-table-column>
        </el-table>
        <el-pagination
          :current-page="summaryPage"
          :page-sizes="[10, 20, 50]"
          :page-size="summarySizeVal"
          layout="total, sizes, prev, pager, next, jumper"
          :total="summaryTotal"
          @size-change="summaryHandleSizeChange"
          @current-change="summaryPageChange"
        >
        </el-pagination>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
export default {
  components: {},
  props: ["passItem"],
  data() {
    return {
      // 导出按钮名称
      downloadLable: "导出结果明细",
      // 导出按钮权限名称
      downloadPerms: "exportResultDetails",
      //激活标签页名称
      activeName: "detailed",
      // 结果明细表格数据
      detailedTableData: [],
      // 结果明细表格状态
      detailedTableLoading: false,
      // 结果明细列表条数
      detailedTotal: null,
      // 结果明细每页个数
      detailedSizeVal: 10,
      // 结果明细页码
      detailedPage: 1,
      // 结果汇总表格数据
      summaryTableData: [],
      // 结果汇总表格状态
      summaryTableLoading: false,
      // 结果汇总列表条数
      summaryTotal: null,
      // 结果汇总每页个数
      summarySizeVal: 10,
      // 结果汇总页码
      summaryPage: 1,
    };
  },
  watch: {},
  computed: {},
  methods: {
    /**
     * 导出数据
     */
    download() {
      switch (this.downloadPerms) {
        case "exportResultDetails":
          this.exportBsStaffCalculateDetail();
          break;
        case "exportResultSummary":
          this.exportBsStaffCalculateCollect();
          break;
      }
    },
    /**
     * 计算结果明细导出
     */
    exportBsStaffCalculateDetail() {
      this.$contract
        .exportBsStaffCalculateDetail(this.passItem.row.calculateId)
        .then((res) => {
          const blob = new Blob([res]); //处理文档流
          const fileName =
            this.passItem.row.templateName + "_计算结果明细.xlsx";
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
    exportBsStaffCalculateCollect() {
      this.$contract
        .exportBsStaffCalculateCollect(this.passItem.row.calculateId)
        .then((res) => {
          const blob = new Blob([res]); //处理文档流
          const fileName =
            this.passItem.row.templateName + "_计算结果汇总.xlsx";
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
     * 计算结果汇总导出
     */
    /**
     * tab 被选中时触发
     * 被选中的标签 tab 实例
     */
    handleClick(tab, event) {
      switch (tab.name) {
        case "detailed":
          this.downloadLable = "导出结果明细";
          this.downloadPerms = "exportResultDetails";
          this.detailedQueryParams();
          break;
        case "summary":
          this.downloadLable = "导出结果汇总";
          this.downloadPerms = "exportResultSummary";
          this.summaryQueryParams();
          break;
      }
    },
    /**
     * 结果明细分页数量改变触发方法
     */
    detailedHandleSizeChange(val) {
      this.detailedSizeVal = val;
      this.detailedPage = 1;
      this.detailedQueryParams();
    },
    /**
     * 结果明细分页页码改变触发方法
     */
    detailedPageChange(val) {
      this.detailedPage = val;
      this.detailedQueryParams();
    },
    /**
     * 结果明细查询接口参数封装
     */
    detailedQueryParams() {
      let params = {
        calculateId: this.passItem.row.calculateId,
        current: this.detailedPage,
        size: this.detailedSizeVal,
      };
      this.qryBsTemplateCalculateDetailByPage(params);
    },
    /**
     * 结果明细查询接口
     * params：查询入参
     */
    qryBsTemplateCalculateDetailByPage(params) {
      this.detailedTableLoading = true;
      this.$contract.qryBsTemplateCalculateDetailByPage(params).then((res) => {
        if (res.returnCode === "0") {
          this.detailedTableData = res.beans;
          this.detailedTotal = res.totalCount;
        } else {
          this.$messageCom(
            "error",
            "获取数据失败，失败原因：" + res.returnMessage,
            "1500"
          );
        }
        this.detailedTableLoading = false;
      });
    },
    /**
     * 结果汇总分页数量改变触发方法
     */
    summaryHandleSizeChange(val) {
      this.summarySizeVal = val;
      this.summaryPage = 1;
      this.summaryQueryParams();
    },
    /**
     * 结果汇总分页页码改变触发方法
     */
    summaryPageChange(val) {
      this.summaryPage = val;
      this.summaryQueryParams();
    },
    /**
     * 结果汇总查询接口参数封装
     */
    summaryQueryParams() {
      let params = {
        calculateId: this.passItem.row.calculateId,
        current: this.summaryPage,
        size: this.summarySizeVal,
      };
      this.qrybsStaffCalculateCollectByPage(params);
    },
    /**
     * 结果汇总查询接口
     * params：查询入参
     */
    qrybsStaffCalculateCollectByPage(params) {
      this.summaryTableLoading = true;
      this.$contract.qrybsStaffCalculateCollectByPage(params).then((res) => {
        if (res.returnCode === "0") {
          this.summaryTableData = res.beans;
          this.summaryTotal = res.totalCount;
        } else {
          this.$messageCom(
            "error",
            "获取数据失败，失败原因：" + res.returnMessage,
            "1500"
          );
        }
        this.summaryTableLoading = false;
      });
    },
  },
  created() {
    this.activeName = this.passItem.type;
    switch (this.passItem.type) {
      case "detailed":
        this.downloadLable = "导出结果明细";
        this.downloadPerms = "exportResultDetails";
        this.detailedQueryParams();
        break;
      case "summary":
        this.downloadLable = "导出结果汇总";
        this.downloadPerms = "exportResultSummary";
        this.summaryQueryParams();
        break;
    }
  },
  mounted() {},
};
</script>
<style lang="scss">
.download-btn-calculation {
  position: absolute;
  right: 30px;
  z-index: 20;
}
</style>