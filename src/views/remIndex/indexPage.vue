<!--
 * @Descripttion: 
 * @version: 
 * @Author: liuwl
 * @Date: 2021-06-30 15:44:18
 * @LastEditTime: 2021-07-27 10:36:15
-->
<template>
  <div>
    <com-breadcrumb
      :title1="'酬金指标'"
      :title2="'指标管理'"
    ></com-breadcrumb>
    <el-form
      :inline="true"
      :model="formInline"
      ref="formInline"
      class="my-form-dom1"
    >
      <el-form-item
        label="包类型"
        prop="packageType"
      >
        <el-select
          v-model="formInline.packageType"
          placeholder="请选择包类型"
          clearable
        >
          <el-option
            v-for="item in packageTypeOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item
        label="指标类型"
        prop="kpiKind"
      >
        <el-select
          v-model="formInline.kpiKind"
          placeholder="请选择指标类型"
          clearable
        >
          <el-option
            v-for="item in kpiKindOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select>
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
    <div class="my-operation-btn">
      <kt-button
        type="primary"
        icon="el-icon-plus"
        label="新增指标"
        perms='newIndex'
        :loading="tableLoading"
        @click="editorIndex('新增指标',null)"
      ></kt-button>
      <el-popconfirm
        title="确定删除所选的指标信息吗？"
        @confirm="deleteIndex"
      >
        <kt-button
          slot="reference"
          type="danger"
          icon="el-icon-delete"
          label="删除指标"
          perms='deleteIndex'
          :loading="tableLoading"
        ></kt-button>
      </el-popconfirm>
    </div>
    <el-table
      :data="tableData"
      border
      :header-cell-style="{background:'#f5f7fa'}"
      tooltip-effect="light"
      v-loading="tableLoading"
      @selection-change="handleSelectionChange"
      :row-key="rowKey"
      ref="multipleTable"
    >
      <el-table-column
        type="selection"
        width="50"
        align="center"
        :reserve-selection="true"
      >
      </el-table-column>
      <el-table-column
        prop="kpiId"
        label="指标编号"
        align="center"
        min-width="220"
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
      <!-- <el-table-column
        prop="kpiCode"
        label="指标编码"
        align="center"
        min-width="120"
        show-overflow-tooltip
      >
      </el-table-column> -->
      <el-table-column
        prop="kpiKind"
        label="指标类型"
        align="center"
        min-width="120"
        show-overflow-tooltip
      >
      </el-table-column>
      <el-table-column
        prop="packageType"
        label="包类型"
        align="center"
        min-width="120"
        show-overflow-tooltip
      >
      </el-table-column>
      <el-table-column
        prop="kpiDesc"
        label="指标描述"
        align="center"
        min-width="300"
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
      <el-table-column
        label="操 作"
        min-width="140"
        align="center"
        fixed="right"
      >
        <template slot-scope="scope">
          <kt-link
            icon="el-icon-edit"
            label="编辑"
            perms='editIndex'
            @click="editorIndex('修改指标',scope.row)"
          ></kt-link>
          <kt-link
            icon="el-icon-copy-document"
            label="复制"
            perms='copyIndex'
            @click="editorIndex('新增指标',scope.row)"
          ></kt-link>
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
      width="4.55rem"
      append-to-body
      :close-on-click-modal="false"
      :before-close="handleClose"
    >
      <editor-index
        v-if="dialogShow"
        ref="indexChildren"
        :newForm="newForm"
        :passItem="passItem"
        @submitForm="submitForm"
      ></editor-index>
    </el-dialog>
  </div>
</template>
<script>
//引入常用的方法封装
import untils from "@/untils/index";
import editorIndex from "./components/editorIndex.vue";
export default {
  name: "index",
  components: {
    "editor-index": editorIndex,
  },
  data() {
    return {
      // 查询表单
      formInline: {
        packageType: "",
        kpiKind: "",
        kpiName: "",
      },
      // 包类型选择数据
      packageTypeOptions: [],
      // 指标类型选择数据
      kpiKindOptions: [],
      // 表格数据
      tableData: [],
      // 表格加载状态
      tableLoading: false,
      //表格复选框选择的数据
      multipleSelection: [],
      //数据列表条数
      total: null,
      //查询每页个数
      sizeVal: 10,
      //查询页码
      page: 1,
      //模态框标题
      dialogTitle: "",
      //模态框状态
      dialogVisible: false,
      dialogShow: false,
      //传入模态框的数据
      passItem: null,
      //新增数据时，没有点击保存，关闭模态框前取得数据
      newForm: null,
    };
  },
  created() {
    this.getStaticDataByCodeType("KPI_KIND");
    this.getStaticDataByCodeType("PACKAGE_TYPE");
    this.queryForm();
  },
  methods: {
    /**
     * 查询静态数据
     * item：静态数据的codeType
     */
    getStaticDataByCodeType(item) {
      this.$contract.getStaticDataByCodeType(item).then((res) => {
        if (res.returnCode === "0") {
          switch (item) {
            case "KPI_KIND":
              this.kpiKindOptions = res.object.map((item) => {
                return { value: item.codeValue, label: item.codeName };
              });
              break;
            case "PACKAGE_TYPE":
              this.packageTypeOptions = res.object.map((item) => {
                return { value: item.codeValue, label: item.codeName };
              });
              break;
          }
        } else {
          this.$messageCom(
            "error",
            "获取数据失败，失败原因：" + res.returnMessage,
            "1500"
          );
        }
      });
    },
    /**
     * 新增，修改折算系数模态框
     * title：新增折算系数/修改折算系数
     * row：当前行数据
     */
    editorIndex(title, row) {
      if (title != "新增指标") {
        this.dialogTitle = title + (row === null ? "" : " —— " + row.kpiName);
      } else {
        this.dialogTitle = title;
      }
      this.passItem = row;
      if (this.passItem != null) {
        this.passItem.titleType = title;
      }
      this.dialogVisible = true;
      this.dialogShow = false;
      this.$nextTick(() => {
        this.dialogShow = true;
      });
    },
    /**
     * 模态框关闭前的回调，会暂停 Dialog 的关闭
     * function(done)，done 用于关闭 Dialog
     * 用于保存新增数据没有提交
     */
    handleClose(done) {
      if (this.passItem === null) {
        this.newForm = this.$refs.indexChildren.ruleForm;
      }
      done();
    },
    /**
     * 用户新增成功返回
     */
    submitForm() {
      this.dialogVisible = false;
      this.queryParams();
    },
    /**
     * 查询按钮
     */
    queryForm() {
      this.page = 1;
      this.queryParams();
      try {
        // 用于多选表格，清空用户的选择
        this.$refs.multipleTable.clearSelection();
      } catch (error) {}
      this.multipleSelection = [];
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
        kpiKind: this.formInline.kpiKind,
        kpiName: this.formInline.kpiName,
        packageType: this.formInline.packageType,
        current: this.page,
        size: this.sizeVal,
      };
      this.qryBsKpiByPage(params);
    },
    /**
     * 指标管理查询接口
     * params：查询入参
     */
    qryBsKpiByPage(params) {
      this.tableLoading = true;
      this.$contract.qryBsKpiByPage(params).then((res) => {
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
     * 表格选中项切换的事件
     * @selection-change
     */
    handleSelectionChange(value) {
      this.multipleSelection = value;
    },
    /**
     * 行数据，用来优化 Table 的渲染
     * 分页记忆选中，分页切换 页面打勾不丢失
     */
    rowKey(row) {
      return row.kpiId;
    },
    /**
     * 删除按钮触发事件
     */
    deleteIndex() {
      if (untils.isArrayEmpty(this.multipleSelection)) {
        let params = [];
        for (let i in this.multipleSelection) {
          params.push(this.multipleSelection[i].kpiId);
        }
        this.delBsKpi(params);
      } else {
        this.$messageCom("warning", "请选择至少一条信息进行删除", "1000");
      }
    },
    /**
     * 删除指标调用接口
     * params：所选数据的userId
     */
    delBsKpi(params) {
      this.tableLoading = true;
      this.$contract.delBsKpi(params).then((res) => {
        if (res.returnCode == "0") {
          this.$messageCom("success", "指标删除成功", "1000");
          this.queryForm();
        } else {
          this.$messageCom(
            "error",
            "删除失败，失败原因：" + res.returnMessage,
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