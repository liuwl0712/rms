<!--
 * @Descripttion: 
 * @version: 
 * @Author: liuwl
 * @Date: 2021-06-03 17:21:26
 * @LastEditTime: 2021-07-27 14:32:18
-->
<template>
  <div>
    <div class="Breadcrumb_title">系统管理&nbsp;&nbsp;&nbsp;&nbsp;>&nbsp;&nbsp;&nbsp;&nbsp;角色管理</div>
    <div>
      <el-form
        :inline="true"
        :model="formInline"
        ref="formInline"
        class="my-form-dom1"
      >
        <el-form-item
          label="角色名称"
          prop="roleName"
        >
          <el-input
            v-model="formInline.roleName"
            placeholder="请输入角色名称"
            clearable
          ></el-input>
        </el-form-item>
        <el-form-item
          label="角色编码"
          prop="roleCode"
        >
          <el-input
            v-model="formInline.roleCode"
            placeholder="请输入角色编码"
            clearable
          ></el-input>
        </el-form-item>
        <el-form-item
          label="角色状态"
          prop="roleState"
        >
          <el-select
            v-model="formInline.roleState"
            placeholder="请选择角色状态"
            clearable
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
            @click="queryForm"
            :disabled="tableLoading"
          >查询</el-button>
          <el-button
            @click="resetForm('formInline')"
            icon="el-icon-refresh"
            :disabled="tableLoading"
          >重置</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="my-operation-btn">
      <kt-button
        type="primary"
        icon="el-icon-plus"
        label="新增角色"
        perms='newRole'
        :loading="tableLoading"
        @click="editorRole('新增角色',null)"
      ></kt-button>
      <el-popconfirm
        title="确定删除所选的角色吗？"
        @confirm="deleteRole"
      >
        <kt-button
          slot="reference"
          type="danger"
          icon="el-icon-delete"
          label="删除角色"
          perms='deleteRole'
          :loading="tableLoading"
        ></kt-button>
      </el-popconfirm>
    </div>
    <el-table
      :data="tableData"
      border
      :header-cell-style="{background:'#f5f7fa'}"
      v-loading="tableLoading"
      @selection-change="handleSelectionChange"
      tooltip-effect="light"
    >
      <el-table-column
        type="selection"
        width="50"
        align="center"
        :selectable="selectable"
      >
      </el-table-column>
      <el-table-column
        prop="roleName"
        label="角色名称"
        min-width="200"
        align="center"
        show-overflow-tooltip
      >
      </el-table-column>
      <el-table-column
        prop="roleCode"
        label="角色编码"
        min-width="200"
        align="center"
        show-overflow-tooltip
      >
      </el-table-column>
      <el-table-column
        prop="roleState"
        label="角色状态"
        min-width="200"
        align="center"
        show-overflow-tooltip
      >
        <template slot-scope="scope">
          <div v-if="scope.row.roleState==='E'">
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
        min-width="200"
        align="center"
        show-overflow-tooltip
      >
      </el-table-column>
      <el-table-column
        prop="roleId"
        label="角色编号"
        align="center"
        min-width="200"
        show-overflow-tooltip
      >
      </el-table-column>
      <el-table-column
        label="操作"
        min-width="160"
        align="center"
        fixed="right"
      >
        <template slot-scope="scope">
          <kt-link
            icon="el-icon-edit"
            label="编辑"
            perms='editRole'
            @click="editorRole('修改角色',scope.row)"
          ></kt-link>
          <kt-link
            icon="el-icon-key"
            label="权限"
            perms='rolePermissions'
            @click="jurisdiction(scope.row)"
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
      <editor-role
        v-if="editorRolShow"
        ref="roleChildren"
        :item="passItem"
        :newForm="newForm"
        @submitForm="submitForm"
      ></editor-role>
      <jurisdiction-com
        v-if="jurisdictionShow"
        :passItem="passItem"
        @submitForm="submitForm"
      ></jurisdiction-com>
    </el-dialog>
  </div>
</template>
<script>
import editorRole from "./components/editorRole.vue";
import jurisdictionCom from "./components/jurisdiction.vue";
//引入常用的方法封装
import untils from "@/untils/index";
export default {
  components: {
    "editor-role": editorRole,
    "jurisdiction-com": jurisdictionCom,
  },
  data() {
    return {
      //查询表单
      formInline: {
        roleName: "",
        roleCode: "",
        roleState: "E",
      },
      //数据列表
      tableData: [],
      //表格Loading
      tableLoading: false,
      //表格复选框选择的数据
      multipleSelection: [],
      //数据列表条数
      total: null,
      //查询每页个数
      sizeVal: 10,
      //查询页码
      page: 1,
      //模态框状态
      dialogVisible: false,
      dialogTitle: "",
      // 新增角色组件状态
      editorRolShow: false,
      // 新增数据时，没有点击保存，关闭模态框前取得数据
      newForm: null,
      // 权限组件状态
      jurisdictionShow: false,
      // 传入模态框的数据
      passItem: null,
    };
  },
  created() {
    this.queryForm();
  },
  methods: {
    /**
     * 新增角色
     */
    editorRole(title, row) {
      this.dialogTitle = title + (row === null ? "" : " —— " + row.roleName);
      this.passItem = row;
      this.dialogVisible = true;
      this.editorRolShow = false;
      this.$nextTick(() => {
        this.editorRolShow = true;
      });
      this.jurisdictionShow = false;
    },
    /**
     * 角色新增成功返回
     */
    submitForm() {
      this.dialogVisible = false;
      this.queryForm();
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
     * 角色查询接口参数封装
     */
    queryParams() {
      let params = {
        roleName: this.formInline.roleName,
        roleCode: this.formInline.roleCode,
        roleState: this.formInline.roleState,
        pageNum: this.page,
        pageSize: this.sizeVal,
      };
      this.qryRoleByPage(params);
    },
    /**
     * 角色查询接口
     * params：查询入参
     */
    qryRoleByPage(params) {
      this.tableLoading = true;
      this.$contract.qryRoleByPage(params).then((res) => {
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
     *表格复选框勾选数据
     */
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    /**
     * 返回值用来决定这一行的 CheckBox 是否可以勾选
     */
    selectable(row, index) {
      if (row.roleState === "D") {
        return false;
      } else {
        return true;
      }
    },
    /**
     * 删除事件
     */
    deleteRole() {
      let callState = untils.isArrayEmpty(this.multipleSelection);
      if (callState) {
        let params = [];
        for (let i in this.multipleSelection) {
          params.push(this.multipleSelection[i].roleId);
        }
        this.delRole(params);
      } else {
        this.$messageCom("warning", "请选择至少一个角色进行删除", "1000");
      }
    },
    /**
     * 调用删除接口
     * params：删除入参
     */
    delRole(params) {
      this.tableLoading = true;
      this.$contract.deleteRole(params).then((res) => {
        if (res.returnCode == "0") {
          this.$messageCom("success", "角色删除成功", "1000");
          this.queryParams();
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
     * 模态框关闭前的回调，会暂停 Dialog 的关闭
     * function(done)，done 用于关闭 Dialog
     * 用于保存新增数据没有提交
     */
    handleClose(done) {
      if (this.passItem === null) {
        this.newForm = this.$refs.roleChildren.ruleForm;
      }
      done();
    },
    /**
     * 权限点击事件
     */
    jurisdiction(row) {
      this.passItem = row;
      this.dialogTitle = row.roleName;
      this.editorRolShow = false;
      this.dialogVisible = true;
      this.jurisdictionShow = false;
      this.$nextTick(() => {
        this.jurisdictionShow = true;
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