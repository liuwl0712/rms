<!--
 * @Descripttion: 
 * @version: 
 * @Author: liuwl
 * @Date: 2021-06-30 15:40:34
 * @LastEditTime: 2021-07-22 16:58:08
-->
<template>
  <div>
    <com-breadcrumb
      :title1="'酬金指标'"
      :title2="'折算系数管理'"
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
        label="系数类型"
        prop="coefficientType"
      >
        <el-select
          v-model="formInline.coefficientType"
          placeholder="请选择系数类型"
        >
          <el-option
            v-for="item in coefficientTypeOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item
        label="系数名称"
        prop="itemName"
      >
        <el-input
          v-model="formInline.itemName"
          placeholder="请输入系数名称"
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
        label="新增系数"
        perms='newCoefficient'
        :loading="tableLoading"
        @click="editorCoefficient('新增折算系数',null)"
      ></kt-button>
      <el-popconfirm
        title="确定删除所选的系数信息吗？"
        @confirm="delCoefficient"
      >
        <kt-button
          slot="reference"
          type="danger"
          icon="el-icon-delete"
          label="删除系数"
          perms='deletionCoefficient'
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
        prop="coefficientId"
        label="系数编号"
        align="center"
        min-width="160"
        show-overflow-tooltip
      >
      </el-table-column>
      <el-table-column
        prop="itemName"
        label="系数名称"
        align="center"
        min-width="180"
        show-overflow-tooltip
      >
      </el-table-column>
      <el-table-column
        prop="coefficientName"
        label="系数类型"
        align="center"
        min-width="130"
        show-overflow-tooltip
      >
      </el-table-column>
      <el-table-column
        prop="packageName"
        label="包类型"
        align="center"
        min-width="160"
        show-overflow-tooltip
      >
      </el-table-column>
      <el-table-column
        prop="itemDesc"
        label="系数描述"
        align="center"
        min-width="300"
        show-overflow-tooltip
      >
      </el-table-column>
      <el-table-column
        prop="modeName"
        label="取值模式"
        align="center"
        min-width="140"
        show-overflow-tooltip
      >
      </el-table-column>
      <el-table-column
        prop="itemValue"
        label="取 值"
        align="center"
        min-width="280"
      >
        <template slot-scope="scope">
          <el-popover
            v-if="scope.row.itemValue.length > 5"
            placement="top"
            trigger="hover"
            :content="scope.row.itemValue"
          >
            <div
              slot="reference"
              style="overflow: hidden;text-overflow: ellipsis;white-space: nowrap;"
            >{{scope.row.itemValue}}</div>
          </el-popover>
          <span v-else>{{scope.row.itemValue}}</span>
        </template>
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
        min-width="120"
        show-overflow-tooltip
      >
      </el-table-column>
      <el-table-column
        label="操 作"
        min-width="100"
        align="center"
        fixed="right"
      >
        <template slot-scope="scope">
          <kt-link
            icon="el-icon-edit"
            label="编辑"
            @click="editorCoefficient('修改系数',scope.row)"
            perms='editCoefficient'
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
      <editor-coefficient
        v-if="dialogShow"
        ref="coefficientChildren"
        :newForm="newForm"
        :passItem="passItem"
        @submitForm="submitForm"
      ></editor-coefficient>
    </el-dialog>
  </div>
</template>
<script>
import editorCoefficient from "./components/editorCoefficient.vue";
//引入常用的方法封装
import untils from "@/untils/index";
export default {
  name: "coefficient",
  components: {
    "editor-coefficient": editorCoefficient,
  },
  data() {
    return {
      // 查询表单
      formInline: {
        packageType: "",
        coefficientType: "",
        itemName: "",
        packageId: "",
      },
      // 包类型选择数据
      packageTypeOptions: [],
      // 系数类型选择数据
      coefficientTypeOptions: [],
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
    this.getStaticDataByCodeType("PACKAGE_TYPE");
    this.getStaticDataByCodeType("COEFFICIENT_TYPE");
    this.queryForm();
  },
  mounted() {},
  methods: {
    /**
     * 查询静态数据 --系数类型
     * item：静态数据的codeType
     */
    getStaticDataByCodeType(item) {
      this.$contract.getStaticDataByCodeType(item).then((res) => {
        if (res.returnCode === "0") {
          switch (item) {
            case "COEFFICIENT_TYPE":
              this.coefficientTypeOptions = res.object.map((item) => {
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
            "获取指标类型失败，失败原因：" + res.returnMessage,
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
    editorCoefficient(title, row) {
      this.dialogTitle = title + (row === null ? "" : " —— " + row.itemName);
      this.passItem = row;
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
        this.newForm = this.$refs.coefficientChildren.ruleForm;
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
     * 当选中节点变化时触发
     * 选中节点的值
     */
    handleChange(value) {
      let item = this.$refs["refPackage"].getCheckedNodes()[0].data;
      this.formInline.packageType = item.packageType;
      this.formInline.packageId = item.packageId;
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
        packageId: this.formInline.packageId,
        packageType: this.formInline.packageType,
        coefficientType: this.formInline.coefficientType,
        itemName: this.formInline.itemName,
        pageNum: this.page,
        pageSize: this.sizeVal,
      };
      this.getCoefficientListByPage(params);
    },
    /**
     * 指标管理查询接口
     * params：查询入参
     */
    getCoefficientListByPage(params) {
      this.tableLoading = true;
      this.$contract.getCoefficientListByPage(params).then((res) => {
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
      return row.coefficientId;
    },
    /**
     * 删除按钮触发事件
     */
    delCoefficient() {
      if (untils.isArrayEmpty(this.multipleSelection)) {
        let params = [];
        for (let i in this.multipleSelection) {
          params.push(this.multipleSelection[i].coefficientId);
        }
        this.deleteCoefficient(params);
      } else {
        this.$messageCom("warning", "请选择至少一条信息进行删除", "1000");
      }
    },
    /**
     * 删除指标调用接口
     * params：所选数据的userId
     */
    deleteCoefficient(params) {
      this.tableLoading = true;
      this.$contract.deleteCoefficient(params).then((res) => {
        if (res.returnCode == "0") {
          this.$messageCom("success", "折算系数删除成功", "1000");
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