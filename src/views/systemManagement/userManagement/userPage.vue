<!--
 * @Descripttion: 
 * @version: 
 * @Author: liuwl
 * @Date: 2021-06-03 16:39:24
 * @LastEditTime: 2021-07-22 11:03:13
-->
<template>
  <div>
    <div class="Breadcrumb_title">系统管理&nbsp;&nbsp;&nbsp;&nbsp;>&nbsp;&nbsp;&nbsp;&nbsp;用户管理</div>
    <div>
      <el-form
        :inline="true"
        :model="formInline"
        ref="formInline"
        class="my-form-dom1"
      >
        <el-form-item
          label="用户名"
          prop="userCode"
        >
          <el-input
            v-model="formInline.userCode"
            placeholder="请输入用户名"
            clearable
          ></el-input>
        </el-form-item>
        <el-form-item
          label="姓  名"
          prop="userName"
        >
          <el-input
            v-model="formInline.userName"
            placeholder="请输入姓名"
            clearable
          ></el-input>
        </el-form-item>
        <el-form-item
          label="手机号码"
          prop="phoneNum"
        >
          <el-input
            v-model="formInline.phoneNum"
            placeholder="请输入手机号码"
            clearable
          ></el-input>
        </el-form-item>
        <el-form-item
          label="用户状态"
          prop="userState"
        >
          <el-select
            v-model="formInline.userState"
            placeholder="请选择用户状态"
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
        label="新增用户"
        perms='newUsers'
        :loading="tableLoading"
        @click="editorUser('新增用户',null)"
      ></kt-button>
      <kt-button
        type="primary"
        icon="el-icon-refresh-right"
        label="重置密码"
        perms='resetPassword'
        @click="resetPassword"
        :loading="tableLoading"
      ></kt-button>
      <el-popconfirm
        title="确定删除所选的用户信息吗？"
        @confirm="deleteUser"
      >
        <kt-button
          slot="reference"
          type="danger"
          icon="el-icon-delete"
          label="删除用户"
          perms='deleteUser'
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
        :selectable="selectable"
      >
      </el-table-column>
      <el-table-column
        prop="userCode"
        label="用户名"
        align="center"
        min-width="100"
        show-overflow-tooltip
      >
      </el-table-column>
      <el-table-column
        prop="userName"
        label="姓 名"
        align="center"
        min-width="100"
        show-overflow-tooltip
      >
      </el-table-column>
      <el-table-column
        prop="phoneNum"
        label="手机号码"
        align="center"
        min-width="130"
        show-overflow-tooltip
      >
      </el-table-column>
      <el-table-column
        prop="userState"
        label="用户状态"
        align="center"
        min-width="100"
        show-overflow-tooltip
      >
        <template slot-scope="scope">
          <div v-if="scope.row.userState==='E'">
            <div class="zt-radius dd"></div><span>有效</span>
          </div>
          <div v-else>
            <div class="zt-radius zt"></div><span>无效</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column
        prop="roleName"
        label="角 色"
        align="center"
        min-width="110"
        show-overflow-tooltip
      >
      </el-table-column>
      <el-table-column
        prop="crtTime"
        label="创建时间"
        align="center"
        min-width="160"
        show-overflow-tooltip
      >
      </el-table-column>
      <el-table-column
        prop="email"
        label="邮箱"
        align="center"
        min-width="180"
        show-overflow-tooltip
      >
      </el-table-column>
      <el-table-column
        label="操 作"
        min-width="100"
        align="center"
      >
        <template slot-scope="scope">
          <kt-link
            icon="el-icon-edit"
            label="编辑"
            perms='editUser'
            @click="editorUser('修改用户',scope.row)"
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
      <editor-user
        v-if="dialogShow"
        :item="passItem"
        :newForm="newForm"
        ref="userChildren"
        @submitForm="submitForm"
      ></editor-user>
    </el-dialog>
  </div>
</template>
<script>
import editorUser from "./components/editorUser.vue";
//引入常用的方法封装
import untils from "@/untils/index";
export default {
  components: {
    "editor-user": editorUser,
  },
  data() {
    return {
      //查询表单
      formInline: {
        userCode: "",
        userName: "",
        phoneNum: "",
        userState: "E",
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
    this.queryForm();
  },
  methods: {
    /**
     * 新增，修改用户模态框
     * title：新增用户/修改用户
     * row：当前行数据
     */
    editorUser(title, row) {
      this.dialogTitle = title + (row === null ? "" : " —— " + row.userName);
      this.passItem = row;
      this.dialogVisible = true;
      this.dialogShow = false;
      this.$nextTick(() => {
        this.dialogShow = true;
      });
    },
    /**
     * 删除用户
     */
    deleteUser() {
      if (untils.isArrayEmpty(this.multipleSelection)) {
        let params = [];
        for (let i in this.multipleSelection) {
          params.push(this.multipleSelection[i].userId);
        }
        this.delUser(params);
      } else {
        this.$messageCom("warning", "请选择至少一个用户进行删除", "1000");
      }
    },
    /**
     * 删除用户调用接口
     * params：所选数据的userId
     */
    delUser(params) {
      this.tableLoading = true;
      this.$contract.deleteUser(params).then((res) => {
        if (res.returnCode == "0") {
          this.$messageCom("success", "用户删除成功", "1000");
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
        this.newForm = this.$refs.userChildren.ruleForm;
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
     * 行数据，用来优化 Table 的渲染
     * 分页记忆选中，分页切换 页面打勾不丢失
     */
    rowKey(row) {
      return row.userId;
    },
    /**
     * 返回值用来决定这一行的 CheckBox 是否可以勾选
     */
    selectable(row, index) {
      if (row.userState === "D") {
        return false;
      } else {
        return true;
      }
    },
    /**
     * 表格选中项切换的事件
     * @selection-change
     */
    handleSelectionChange(value) {
      this.multipleSelection = value;
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
     * 用户查询接口参数封装
     */
    queryParams() {
      let params = {
        userCode: this.formInline.userCode,
        userName: this.formInline.userName,
        phoneNum: this.formInline.phoneNum,
        userState: this.formInline.userState,
        pageNum: this.page,
        pageSize: this.sizeVal,
      };
      this.userOrgRoleQry(params);
    },
    /**
     * 用户查询接口
     * params：查询入参
     */
    userOrgRoleQry(params) {
      this.tableLoading = true;
      this.$contract.userOrgRoleQry(params).then((res) => {
        if (res.returnCode === "0") {
          this.tableData = res.beans;
          this.total = res.totalCount;
        } else {
          this.$messageCom(
            "error",
            "获取数据调用失败，失败原因：" + res.returnMessage,
            "1500"
          );
        }
        this.tableLoading = false;
      });
    },
    /**
     * 重置密码
     */
    resetPassword() {
      if (untils.isArrayEmpty(this.multipleSelection)) {
        let arr = this.multipleSelection.map((item) => {
          return { userId: item.userId, password: "123456" };
        });
        this.tableLoading = true;
        this.$contract.resetPassword(arr).then((res) => {
          if (res.returnCode === "0") {
            this.dialogVisible = false;
            this.$messageCom("success", "密码重置成功", "1000");
          } else {
            this.$messageCom(
              "error",
              "密码修改失败，失败原因：" + res.returnMessage,
              "1500"
            );
          }
          this.tableLoading = false;
        });
      } else {
        this.$messageCom("warning", "请选择至少一个用户进行密码重置", "1000");
      }
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