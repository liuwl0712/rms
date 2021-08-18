<!--
 * @Descripttion: 
 * @version: 
 * @Author: liuwl
 * @Date: 2021-07-09 16:38:49
 * @LastEditTime: 2021-07-22 17:13:08
-->
<template>
  <div>
    <com-breadcrumb
      :title1="'酬金规则'"
      :title2="'对象管理'"
    ></com-breadcrumb>
    <el-form
      :inline="true"
      :model="formInline"
      ref="formInline"
      class="my-form-dom1"
    >
      <el-form-item
        label="对象名称"
        prop="objectName"
      >
        <el-input
          v-model="formInline.objectName"
          placeholder="请输入对象名称"
          clearable
        ></el-input>
      </el-form-item>
      <el-form-item
        label="对象类型"
        prop="objectKind"
      >
        <el-select
          v-model="formInline.objectKind"
          placeholder="请选择对象类型"
        >
          <el-option
            v-for="item in objectKindOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
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
        prop="objectId"
        label="对象编号"
        align="center"
        min-width="160"
        show-overflow-tooltip
      >
      </el-table-column>
      <el-table-column
        prop="objectName"
        label="对象名称"
        align="center"
        min-width="180"
        show-overflow-tooltip
      >
      </el-table-column>
      <el-table-column
        prop="objectCode"
        label="对象编码"
        align="center"
        min-width="180"
        show-overflow-tooltip
      >
      </el-table-column>
      <el-table-column
        prop="kindName"
        label="对象类型"
        align="center"
        min-width="160"
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
  components: {},
  props: {},
  data() {
    return {
      // 查询表单
      formInline: {
        objectName: "",
        objectKind: "",
      },
      // 对象类型下拉数据
      objectKindOptions: [],
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
  watch: {},
  computed: {},
  methods: {
    /**
     * 查询静态数据 --系数类型
     * item：静态数据的codeType
     */
    getStaticDataByCodeType(item) {
      this.$contract.getStaticDataByCodeType(item).then((res) => {
        if (res.returnCode === "0") {
          this.objectKindOptions = res.object.map((item) => {
            return { value: item.codeValue, label: item.codeName };
          });
        } else {
          this.$messageCom(
            "error",
            "获取对象类型失败，失败原因：" + res.returnMessage,
            "1500"
          );
        }
      });
    },
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
     * 对象管理查询接口参数封装
     */
    queryParams() {
      let params = {
        objectName: this.formInline.objectName,
        objectKind: this.formInline.objectKind,
        pageNum: this.page,
        pageSize: this.sizeVal,
      };
      this.qryRuleObject(params);
    },
    /**
     * 对象管理查询接口
     * params：查询入参
     */
    qryRuleObject(params) {
      this.tableLoading = true;
      this.$contract.qryRuleObject(params).then((res) => {
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
  created() {
    this.getStaticDataByCodeType("OBJECT_KIND");
    this.queryForm();
  },
  mounted() {},
};
</script>