<!--
 * @Descripttion: 
 * @version: 
 * @Author: liuwl
 * @Date: 2021-06-09 14:14:26
 * @LastEditTime: 2021-06-24 18:58:02
-->
<template>
  <div>
    <el-form
      :inline="true"
      :model="ruleForm"
      :rules="rules"
      ref="ruleForm"
      label-width="0.7rem"
      class="demo-ruleForm"
    >
      <el-form-item
        label="任务名称"
        prop="jobName"
      >
        <el-input
          v-model="ruleForm.jobName"
          clearable
          :readonly="btnLoading"
        ></el-input>
      </el-form-item>
      <el-form-item
        label="时间表达式"
        prop="cronExpression"
      >
        <el-input
          v-model="ruleForm.cronExpression"
          clearable
          :readonly="btnLoading"
        ></el-input>
      </el-form-item>
      <el-form-item
        label="因素名称"
        prop="indexType"
      >
        <el-select
          v-model="ruleForm.indexType"
          placeholder="请选择因素名称"
          :disabled="btnLoading"
        >
          <el-option
            v-for="item in indexTypeOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select>
      </el-form-item>
    </el-form>
    <div class="demo-ruleForm-btn">
      <el-button
        type="primary"
        @click="submitForm('ruleForm')"
        :loading="btnLoading"
      >立即创建</el-button>
      <el-button
        @click="resetForm"
        :disabled="btnLoading"
      >重置</el-button>
    </div>
  </div>
</template>
<script>
import rules from "@/assets/json/rules.json";
export default {
  name: "editorTimingTask",
  data() {
    return {
      //表单数据
      ruleForm: {
        jobName: "",
        cronExpression: "",
        indexType: "F0001",
      },
      //因素名称下拉数据
      indexTypeOptions: [
        {
          value: "F0001",
          label: "满意度指标",
        },
      ],
      //表单判断必填
      rules: rules,
      //按钮和输入框加载、禁用状态
      btnLoading: false,
    };
  },
  methods: {
    /**
     * 表单提交
     */
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.btnLoading = true;
          this.$emit("submitForm", this.ruleForm);
        } else {
          return false;
        }
      });
    },
    /**
     * 表单重置
     */
    resetForm() {
      this.$refs["ruleForm"].resetFields();
    },
    /**
     * 按钮、输入框取消禁用与loading
     */
    clearStart() {
      this.btnLoading = false;
    },
  },
};
</script>