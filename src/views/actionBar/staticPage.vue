<!--
 * @Descripttion: 
 * @version: 
 * @Author: liuwl
 * @Date: 2021-07-08 14:27:03
 * @LastEditTime: 2021-07-28 15:24:19
-->
<template>
  <div>
    <div class="Breadcrumb_title">静态资源管理</div>
    <el-form
      :inline="true"
      :model="formInline"
      ref="formInline"
      class="my-form-dom1"
    >
      <el-form-item
        label="编码类型"
        prop="codeType"
      >
        <el-input
          v-model="formInline.codeType"
          placeholder="请输入编码类型"
          clearable
        ></el-input>
      </el-form-item>
      <el-form-item
        label="编码值"
        prop="codeValue"
      >
        <el-input
          v-model="formInline.codeValue"
          placeholder="请输入编码值"
          clearable
        ></el-input>
      </el-form-item>
      <el-form-item
        label="编码名称"
        prop="codeName"
      >
        <el-input
          v-model="formInline.codeName"
          placeholder="请输入编码名称"
          clearable
        ></el-input>
      </el-form-item>
      <el-form-item
        label="编码状态"
        prop="state"
      >
        <el-select
          v-model="formInline.state"
          placeholder="请选择编码状态"
        >
          <el-option
            label="有效"
            value="E"
          ></el-option>
          <el-option
            label="无效"
            value="D"
          ></el-option>
        </el-select>
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
        label="新增静态数据"
        perms='addStaticData'
        :loading="tableLoading"
        @click="editorStaticData('新增静态数据',null)"
      ></kt-button>
      <kt-button
        type="danger"
        icon="el-icon-refresh"
        label="清理缓存"
        perms='cleanUpCache'
        :loading="tableLoading"
        @click="cleanUpCache"
      ></kt-button>
      <el-popconfirm
        title="确定删除所选的静态数据吗？"
        @confirm="deleteStatic"
      >
        <kt-button
          slot="reference"
          type="danger"
          icon="el-icon-delete"
          label="删除静态数据"
          perms='deleteStaticData'
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
        prop="codeType"
        label="编码类型"
        align="center"
        min-width="150"
        show-overflow-tooltip
      >
      </el-table-column>
      <el-table-column
        prop="codeValue"
        label="编码值"
        align="center"
        min-width="120"
        show-overflow-tooltip
      >
      </el-table-column>
      <el-table-column
        prop="codeName"
        label="编码名称"
        align="center"
        min-width="180"
        show-overflow-tooltip
      >
      </el-table-column>
      <el-table-column
        prop="codeDesc"
        label="编码描述"
        align="center"
        min-width="180"
        show-overflow-tooltip
      >
      </el-table-column>
      <el-table-column
        prop="state"
        label="编码状态"
        align="center"
        min-width="100"
        show-overflow-tooltip
      >
        <template slot-scope="scope">
          <div v-if="scope.row.state==='E'">
            <div class="zt-radius dd"></div><span>有效</span>
          </div>
          <div v-else>
            <div class="zt-radius zt"></div><span>无效</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column
        prop="crtTime"
        label="创建时间"
        align="center"
        min-width="200"
        show-overflow-tooltip
      >
      </el-table-column>
      <el-table-column
        prop="opTime"
        label="修改时间"
        align="center"
        min-width="200"
        show-overflow-tooltip
      >
      </el-table-column>
      <el-table-column
        label="操 作"
        min-width="120"
        align="center"
        fixed="right"
      >
        <template slot-scope="scope">
          <kt-link
            icon="el-icon-edit"
            label="编辑"
            perms='editStaticData'
            @click="editorStaticData('修改静态数据',scope.row)"
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
      <editor-static
        v-if="dialogShow"
        ref="staticChildren"
        :newForm="newForm"
        :passItem="passItem"
        @submitForm="submitForm"
      ></editor-static>
    </el-dialog>
  </div>
</template>
<script>
//引入常用的方法封装
import untils from "@/untils/index";
import editorStatic from "./components/editorStatic.vue";
export default {
  name: "staticPage",
  components: {
    "editor-static": editorStatic,
  },
  props: {},
  data() {
    return {
      // 查询表单
      formInline: {
        codeType: "",
        codeValue: "",
        codeName: "",
        state: "E",
      },
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
  watch: {},
  computed: {},
  methods: {
    /**
     * 新增，修改静态数据模态框
     * title：新增静态数据/修改静态数据
     * row：当前行数据
     */
    editorStaticData(title, row) {
      this.dialogTitle = title + (row === null ? "" : " —— " + row.codeName);
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
        this.newForm = this.$refs.staticChildren.ruleForm;
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
     * 静态资源查询接口参数封装
     */
    queryParams() {
      let params = {
        codeType: this.formInline.codeType,
        codeValue: this.formInline.codeValue,
        codeName: this.formInline.codeName,
        state: this.formInline.state,
        current: this.page,
        size: this.sizeVal,
      };
      this.qryBsStaticData(params);
    },
    /**
     * 静态资源查询接口
     * params：查询入参
     */
    qryBsStaticData(params) {
      this.tableLoading = true;
      this.$contract.qryBsStaticData(params).then((res) => {
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
      return row.id;
    },
    /**
     * 删除按钮触发事件
     */
    deleteStatic() {
      if (untils.isArrayEmpty(this.multipleSelection)) {
        let params = [];
        for (let i in this.multipleSelection) {
          params.push(this.multipleSelection[i].id);
        }
        this.delBsStaticData(params);
      } else {
        this.$messageCom("warning", "请选择至少一条信息进行删除", "1000");
      }
    },
    /**
     * 清理缓存
     */
    cleanUpCache() {
      if (untils.isArrayEmpty(this.multipleSelection)) {
        let params = [];
        for (let i in this.multipleSelection) {
          params.push(this.multipleSelection[i].id);
        }
        this.tableLoading = true;
        this.$contract.delRedis(params).then((res) => {
          if (res.returnCode == "0") {
            this.$messageCom("success", "缓存清理成功", "1000");
            this.queryForm();
          } else {
            this.$messageCom(
              "error",
              "缓存清理失败，失败原因：" + res.returnMessage,
              "1500"
            );
          }
          this.tableLoading = false;
        });
      } else {
        this.$messageCom("warning", "请选择至少一条信息进行删除", "1000");
      }
    },
    /**
     * 删除指标调用接口
     * params：所选数据的userId
     */
    delBsStaticData(params) {
      this.tableLoading = true;
      this.$contract.delBsStaticData(params).then((res) => {
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
  created() {
    this.queryForm();
  },
  mounted() {},
};
</script>