<!--
 * @Descripttion: 
 * @version: 
 * @Author: liuwl
 * @Date: 2021-07-13 10:17:33
 * @LastEditTime: 2021-07-28 17:32:31
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
        label="规则名称"
        prop="ruleName"
      >
        <el-input
          v-model="ruleForm.ruleName"
          placeholder="请输入规则名称"
          clearable
          :readonly="btnLoading"
        ></el-input>
      </el-form-item>
      <el-form-item
        label="规则类型"
        prop="ruleType"
      >
        <el-select
          v-model="ruleForm.ruleType"
          placeholder="请选择规则类型"
          :disabled="btnLoading"
        >
          <el-option
            v-for="item in ruleTypeOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item
        label="包类型"
        prop="packageType"
      >
        <el-select
          v-model="ruleForm.packageType"
          placeholder="请选择包类型"
          :disabled="btnLoading"
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
        label="规则描述"
        prop="ruleDesc"
        style="width:100%"
      >
        <el-input
          style="width: 3.36rem;"
          v-model="ruleForm.ruleDesc"
          type="textarea"
          :autosize="{ minRows: 2, maxRows: 4}"
          placeholder="请输入规则描述"
          :readonly="btnLoading"
        ></el-input>
      </el-form-item>
      <el-form-item
        label="规则算法"
        style="width:100%"
        prop="ruleExp"
      >
        <el-input
          style="width: 3.36rem;"
          type="textarea"
          v-model="ruleForm.ruleExp"
          :autosize="{ minRows: 10, maxRows: 10}"
          placeholder="关联规则算法"
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
        ruleName: "",
        ruleType: "",
        packageType: "",
        ruleDesc: "",
        ruleExp: "",
      },
      //表单验证
      rules: rules,
      // 规则类型下拉选数据
      ruleTypeOptions: [],
      // 包类型下拉数据
      packageTypeOptions: [],
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
     * 查询静态数据
     * item：静态数据的codeType
     */
    getStaticDataByCodeType(item) {
      this.$contract.getStaticDataByCodeType(item).then((res) => {
        if (res.returnCode === "0") {
          switch (item) {
            case "RULE_TYPE":
              this.ruleTypeOptions = res.object.map((item) => {
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
     * 管理根据ID查询信息
     * item：ruleId
     */
    getRuleById(item) {
      this.formLoading = true;
      this.$contract.getRuleById(item).then((res) => {
        if (res.returnCode === "0") {
          this.ruleForm.ruleName = res.object.ruleName;
          this.ruleForm.ruleType = res.object.ruleType;
          this.ruleForm.packageType = res.object.packageType;
          this.ruleForm.ruleDesc = res.object.ruleDesc;
          this.ruleForm.ruleExp = res.object.ruleExp;
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
          this.ruleForm.opCode = JSON.parse(
            sessionStorage.getItem("userInfo")
          ).uname;
          this.ruleForm.ruleExpReckon = this.ruleForm.ruleExp;
          if (this.passItem === null) {
            this.addRule();
          } else {
            if (this.passItem.titleType === "新增规则") {
              this.addRule();
            } else {
              this.updateRule();
            }
          }
        }
      });
    },
    /**
     * 新增接口调用
     */
    addRule() {
      this.btnLoading = true;
      this.$contract.addRule(this.ruleForm).then((res) => {
        if (res.returnCode === "0") {
          this.$messageCom("success", "规则新增成功", "1000");
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
     * 修改接口调用
     */
    updateRule() {
      this.ruleForm.ruleId = this.passItem.ruleId;
      this.$contract.updateRule(this.ruleForm).then((res) => {
        if (res.returnCode === "0") {
          this.$messageCom("success", "指标修改成功", "1000");
          this.$emit("submitForm");
        } else {
          this.$messageCom(
            "error",
            "修改失败，失败原因：" + res.returnMessage,
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
    this.getStaticDataByCodeType("RULE_TYPE");
    this.getStaticDataByCodeType("PACKAGE_TYPE");
    if (this.passItem != null) {
      if (this.passItem.titleType === "新增规则") {
        this.submitBtn = "立即创建";
      } else {
        this.submitBtn = "提交";
      }
      this.getRuleById(this.passItem.ruleId);
    }
  },
  mounted() {
    if (this.passItem === null) {
      this.newForm === null ? "" : (this.ruleForm = this.newForm);
    }
  },
};
</script>