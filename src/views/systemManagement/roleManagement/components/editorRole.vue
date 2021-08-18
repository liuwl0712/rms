<!--
 * @Descripttion: 
 * @version: 
 * @Author: liuwl
 * @Date: 2021-06-24 17:13:48
 * @LastEditTime: 2021-07-27 16:17:06
-->
<template>
  <div v-loading="formLoading">
    <el-form
      :inline="true"
      :model="ruleForm"
      :rules="rules"
      ref="ruleForm"
      label-width="0.7rem"
      class="demo-ruleForm"
    >
      <el-form-item
        label="角色名称"
        prop="roleName"
      >
        <el-input
          v-model="ruleForm.roleName"
          clearable
          placeholder="请输入角色名称"
          :readonly="btnLoading"
        ></el-input>
      </el-form-item>
      <el-form-item
        label="角色状态"
        prop="roleState"
      >
        <el-select
          v-model="ruleForm.roleState"
          placeholder="请选择角色状态"
          :disabled="btnLoading"
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
      <el-form-item
        label="角色编码"
        prop="roleCode"
      >
        <el-input
          v-model="ruleForm.roleCode"
          clearable
          placeholder="请输入角色编码"
          :readonly="btnLoading"
        ></el-input>
      </el-form-item>
    </el-form>
    <div class="demo-ruleForm-btn">
      <el-button
        type="primary"
        @click="submitForm('ruleForm')"
        :loading="btnLoading"
      >{{submitBtn}}</el-button>
      <el-button
        @click="resetForm"
        :disabled="btnLoading"
      >重置</el-button>
    </div>
  </div>
</template>
<script>
import rules from "@/assets/json/rules.json";
//引入常用的方法封装
import untils from "@/untils/index";
export default {
  name: "",
  components: {},
  props: ["item", "newForm"],
  data() {
    return {
      //表单数据
      ruleForm: {
        roleName: "",
        roleState: "E",
        roleCode: "",
      },
      //表单验证
      rules: rules,
      //表单输入框、按钮状态
      btnLoading: false,
      //模态框loading状态
      formLoading: false,
      //保存按钮重命名
      submitBtn: "立即创建",
    };
  },
  computed: {},
  watch: {},
  created() {
    if (this.item != null) {
      this.selectRoleById(this.item.roleId);
      this.submitBtn = "提交";
    }
  },
  mounted() {
    if (this.item === null) {
      this.newForm === null ? "" : (this.ruleForm = this.newForm);
    }
  },
  methods: {
    /**
     * 根据ID查询信息
     * item：roleId
     */
    selectRoleById(item) {
      this.formLoading = true;
      this.$contract.selectRoleById(item).then((res) => {
        if (res.returnCode === "0") {
          this.ruleForm.roleName = res.object.roleName;
          this.ruleForm.roleState = res.object.roleState;
          this.ruleForm.roleCode = res.object.roleCode;
          this.formLoading = false;
        } else {
          this.$messageCom(
            "error",
            "获取数据失败，失败原因：" + res.returnMessage,
            "1500"
          );
          this.$emit("submitForm");
        }
      });
    },
    /**
     * 表单提交
     */
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let isRoleName = untils.isChinese(this.ruleForm.roleName);
          let roleCode = untils.isRegExp(this.ruleForm.roleCode);
          if (!isRoleName) {
            this.$messageCom("warning", "角色名称只能为中文！", "1000");
            return;
          }
          if (!roleCode) {
            this.$messageCom(
              "warning",
              "角色编码只能为数字或者英文字母！",
              "1000"
            );
            return;
          }
          if (this.item === null) {
            this.addRole();
          } else {
            this.updateRole();
          }
        } else {
          return false;
        }
      });
    },
    /**
     * 角色新增调用接口
     */
    addRole() {
      this.btnLoading = true;
      this.$contract.addRole(this.ruleForm).then((res) => {
        if (res.returnCode === "0") {
          this.$messageCom("success", "角色新增成功", "1000");
          this.resetForm();
          this.$emit("submitForm");
        } else {
          this.$messageCom("warning", res.returnMessage, "1500");
        }
        this.btnLoading = false;
      });
    },
    /**
     * 修改接口调用
     */
    updateRole() {
      this.ruleForm.roleId = this.item.roleId;
      this.$contract.updateRole(this.ruleForm).then((res) => {
        if (res.returnCode === "0") {
          this.$messageCom("success", "角色修改成功", "1000");
          this.$emit("submitForm");
        } else {
          this.$messageCom(
            "error",
            "修改失败，失败原因：" + res.returnMessage == null
              ? "接口调用错误"
              : res.returnMessage,
            "1000"
          );
        }
      });
    },
    /**
     * 表单重置
     */
    resetForm() {
      this.$refs["ruleForm"].resetFields();
    },
  },
};
</script>

