<!--
 * @Descripttion: 
 * @version: 
 * @Author: liuwl
 * @Date: 2021-07-08 14:53:16
 * @LastEditTime: 2021-07-08 15:16:06
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
        label="编码类型"
        prop="codeType"
      >
        <el-input
          v-model="ruleForm.codeType"
          placeholder="请输入编码类型"
          clearable
          :readonly="btnLoading"
        ></el-input>
      </el-form-item>
      <el-form-item
        label="编码值"
        prop="codeValue"
      >
        <el-input
          v-model="ruleForm.codeValue"
          placeholder="请输入编码值"
          clearable
          :readonly="btnLoading"
        ></el-input>
      </el-form-item>
      <el-form-item
        label="编码名称"
        prop="codeName"
      >
        <el-input
          v-model="ruleForm.codeName"
          placeholder="请输入编码名称"
          clearable
          :readonly="btnLoading"
        ></el-input>
      </el-form-item>
      <el-form-item
        label="编码描述"
        prop="codeDesc"
        style="width:100%"
      >
        <el-input
          style="width: 3.36rem;"
          v-model="ruleForm.codeDesc"
          type="textarea"
          :autosize="{ minRows: 3, maxRows: 5}"
          placeholder="请输入编码描述"
          :readonly="btnLoading"
        ></el-input>
      </el-form-item>
    </el-form>
    <div class="demo-ruleForm-btn">
      <el-button
        type="primary"
        :loading="btnLoading"
        @click="submitForm('ruleForm')"
      >{{submitBtn}}</el-button>
      <el-button
        :disabled="btnLoading"
        @click="resetForm"
      >重置</el-button>
    </div>
  </div>
</template>
<script>
import rules from "@/assets/json/rules.json";
export default {
  components: {},
  props: ["passItem", "newForm"],
  data() {
    return {
      // 表单数据
      ruleForm: {
        codeType: "",
        codeValue: "",
        codeName: "",
        codeDesc: "",
      },
      //表单验证
      rules: rules,
      //保存按钮重命名
      submitBtn: "立即创建",
      //表单输入框、按钮状态
      btnLoading: false,
      //模态框loading状态
      formLoading: false,
    };
  },
  watch: {},
  computed: {},
  methods: {
    /**
     * 根据ID查询信息
     * item：Id
     */
    qryBsById(item) {
      this.formLoading = true;
      this.$contract.qryBsById(item).then((res) => {
        if (res.returnCode === "0") {
          this.ruleForm.codeType = res.object.codeType;
          this.ruleForm.codeValue = res.object.codeValue;
          this.ruleForm.codeName = res.object.codeName;
          this.ruleForm.codeDesc = res.object.codeDesc;
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
          if (this.passItem === null) {
            this.addBsStaticData();
          } else {
            this.updateBsStaticData();
          }
        }
      });
    },
    /**
     * 新增接口调用
     */
    addBsStaticData() {
      this.btnLoading = true;
      this.ruleForm.state = "E";
      this.$contract.addBsStaticData(this.ruleForm).then((res) => {
        if (res.returnCode === "0") {
          this.$messageCom("success", "静态数据新增成功", "1000");
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
     * 指标修改接口调用
     */
    updateBsStaticData() {
      this.ruleForm.id = this.passItem.id;
      this.$contract.updateBsStaticData(this.ruleForm).then((res) => {
        if (res.returnCode === "0") {
          this.$messageCom("success", "指标修改成功", "1000");
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
  created() {
    if (this.passItem != null) {
      this.qryBsById(this.passItem.id);
      this.submitBtn = "提交";
    }
  },
  mounted() {
    if (this.passItem === null) {
      this.newForm === null ? "" : (this.ruleForm = this.newForm);
    }
  },
};
</script>