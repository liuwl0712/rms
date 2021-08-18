<!--
 * @Descripttion: 
 * @version: 
 * @Author: liuwl
 * @Date: 2021-06-24 14:50:11
 * @LastEditTime: 2021-07-27 16:17:21
-->
<template>
  <div v-loading="formLoading">
    <el-form
      :inline="true"
      :model="ruleForm"
      :rules="rules"
      ref="ruleForm"
      label-width="0.6rem"
      class="demo-ruleForm"
    >
      <el-form-item
        label="用户名"
        prop="userCode"
      >
        <el-input
          v-model="ruleForm.userCode"
          placeholder="请输入用户名"
          clearable
          :readonly="btnLoading"
        ></el-input>
      </el-form-item>
      <el-form-item
        label="姓 名"
        prop="userName"
      >
        <el-input
          v-model="ruleForm.userName"
          placeholder="请输入姓名"
          clearable
          :readonly="btnLoading"
        ></el-input>
      </el-form-item>
      <el-form-item
        label="角 色"
        prop="roleIds"
      >
        <el-select
          v-model="ruleForm.roleIds"
          placeholder="请选择角色"
          :disabled="btnLoading"
        >
          <el-option
            v-for="item in roleIdOptions"
            :key="item.roleId"
            :label="item.roleName"
            :value="item.roleId"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item
        label="手机号码"
        prop="phoneNum"
      >
        <el-input
          v-model="ruleForm.phoneNum"
          placeholder="请输入手机号码"
          clearable
          :readonly="btnLoading"
        ></el-input>
      </el-form-item>
      <el-form-item
        label="状 态"
        prop="userState"
      >
        <el-select
          v-model="ruleForm.userState"
          placeholder="请选择用户状态"
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
        label="邮 箱"
        prop="email"
      >
        <el-input
          v-model="ruleForm.email"
          placeholder="请输入邮箱"
          clearable
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
      //表单信息
      ruleForm: {
        userCode: "",
        userName: "",
        roleIds: "",
        phoneNum: "",
        userState: "E",
        email: "",
      },
      //表单验证
      rules: rules,
      //保存按钮重命名
      submitBtn: "立即创建",
      //表单输入框、按钮状态
      btnLoading: false,
      //模态框loading状态
      formLoading: false,
      //角色下拉选数据
      roleIdOptions: [],
    };
  },
  computed: {},
  watch: {},
  created() {
    this.qryRmsRole();
    if (this.item != null) {
      this.userQry(this.item.userId);
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
     *用户管理根据ID查询信息
     * item：userId
     */
    userQry(item) {
      this.formLoading = true;
      this.$contract.userQry(item).then((res) => {
        if (res.returnCode === "0") {
          this.ruleForm.userCode = res.object.userCode;
          this.ruleForm.userName = res.object.userName;
          this.ruleForm.roleIds = res.object.roleIds;
          this.ruleForm.phoneNum = res.object.phoneNum;
          this.ruleForm.email = res.object.email;
          this.ruleForm.userState = res.object.userState;
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
     * 查找所有角色信息，数据为下拉选数据
     */
    qryRmsRole() {
      this.$contract.qryRmsRole().then((res) => {
        if (res.returnCode === "0") {
          this.roleIdOptions = res.beans;
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
     * 表单提交
     */
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (!untils.isRegExp(this.ruleForm.userCode)) {
            this.$messageCom(
              "warning",
              "用户名只能为数字或者英文字母！",
              "1000"
            );
            return;
          }
          if (!untils.isChinese(this.ruleForm.userName)) {
            this.$messageCom("warning", "姓名只能为中文！", "1000");
            return;
          }
          if (!untils.isPhone(this.ruleForm.phoneNum)) {
            this.$messageCom("warning", "请填写正确的手机号！", "1000");
            return;
          }
          if (!untils.isEmail(this.ruleForm.email)) {
            this.$messageCom("warning", "请填写正确的邮箱！", "1000");
            return;
          }
          if (this.item === null) {
            this.qryRmsUserByUserCode();
          } else {
            this.updateRmsUser();
          }
        } else {
          return false;
        }
      });
    },
    /**
     * 用户新增前接口调用,检查用户名是否重复
     */
    qryRmsUserByUserCode() {
      let params = {
        userCode: this.ruleForm.userCode,
      };
      this.$contract.qryRmsUserByUserCode(params).then((res) => {
        if (res.returnCode === "0") {
          this.addRmsUser();
        } else {
          this.$messageCom(
            "error",
            "新增失败，失败原因：" + res.returnMessage,
            "1000"
          );
        }
      });
    },
    /**
     * 用户修改接口调用
     */
    updateRmsUser() {
      this.ruleForm.userId = this.item.userId;
      this.$contract.updateRmsUser(this.ruleForm).then((res) => {
        if (res.returnCode === "0") {
          this.$messageCom("success", "用户修改成功", "1000");
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
     * 用户新增接口调用
     */
    addRmsUser() {
      this.btnLoading = true;
      this.ruleForm.password = "123456"; //默认密码
      this.$contract.addRmsUser(this.ruleForm).then((res) => {
        if (res.returnCode === "0") {
          this.$messageCom(
            "success",
            "用户新增成功，默认密码为：123456",
            "2000"
          );
          this.resetForm();
          this.$emit("submitForm");
        } else {
          this.$messageCom(
            "error",
            "新增失败，失败原因：" + res.returnMessage,
            "1000"
          );
        }
        this.btnLoading = false;
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

