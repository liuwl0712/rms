<!--
 * @Descripttion: 
 * @version: 
 * @Author: liuwl
 * @Date: 2021-07-12 14:40:56
 * @LastEditTime: 2021-07-27 16:16:39
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
        label="因子名称"
        prop="attrName"
      >
        <el-input
          v-model="ruleForm.attrName"
          placeholder="请输入因子名称"
          clearable
          :readonly="btnLoading"
        ></el-input>
      </el-form-item>
      <el-form-item
        label="因子编码"
        prop="attrCode"
      >
        <el-input
          v-model="ruleForm.attrCode"
          placeholder="请输入因子编码"
          clearable
          :readonly="btnLoading"
        ></el-input>
      </el-form-item>
      <el-form-item
        label="因子类型"
        prop="attrKind"
      >
        <el-select
          v-model="ruleForm.attrKind"
          placeholder="请选择因子类型"
          :readonly="btnLoading"
        >
          <el-option
            v-for="item in attrKindOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item
        label="对象名称"
        prop="objectId"
      >
        <el-select
          v-model="ruleForm.objectId"
          placeholder="请选择对象名称"
          :disabled="btnLoading"
        >
          <el-option
            v-for="item in objectNameOptions"
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
        attrName: "",
        attrCode: "",
        attrKind: "",
        objectId: "",
        objectName: "",
      },
      //表单验证
      rules: rules,
      // 因子类型下拉选数据
      attrKindOptions: [],
      // 对象名称下拉选数据
      objectNameOptions: [],
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
     * 查询对象名称下拉选
     */
    findAllObjectName() {
      this.$contract.findAllObjectName().then((res) => {
        this.objectNameOptions = res.object.map((item) => {
          return { value: item.objectId, label: item.objectName };
        });
      });
    },
    /**
     * 查询静态数据 --因子类型
     * item：静态数据的codeType
     */
    getStaticDataByCodeType(item) {
      this.$contract.getStaticDataByCodeType(item).then((res) => {
        if (res.returnCode === "0") {
          this.attrKindOptions = res.object.map((item) => {
            return { value: item.codeValue, label: item.codeName };
          });
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
     * item：kpiId
     */
    selectDataById(item) {
      this.formLoading = true;
      this.$contract.selectDataById(item).then((res) => {
        if (res.returnCode === "0") {
          this.ruleForm.attrName = res.object.attrName;
          this.ruleForm.attrCode = res.object.attrCode;
          this.ruleForm.attrKind = res.object.attrKind;
          this.ruleForm.objectId = res.object.objectId;
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
     * 根据objectId获取objectName
     */
    getName(id) {
      var arr = this.objectNameOptions.find((item) => {
        return item.value === id;
      });
      return arr.label;
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
          this.ruleForm.objectName = this.getName(this.ruleForm.objectId);
          if (this.passItem === null) {
            this.addFactor();
          } else {
            this.updateFactor();
          }
        }
      });
    },
    /**
     * 新增接口调用
     */
    addFactor() {
      this.btnLoading = true;
      this.$contract.addFactor(this.ruleForm).then((res) => {
        if (res.returnCode === "0") {
          this.$messageCom("success", "因子新增成功", "1000");
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
    updateFactor() {
      this.ruleForm.attrId = this.passItem.attrId;
      this.$contract.updateFactor(this.ruleForm).then((res) => {
        if (res.returnCode === "0") {
          this.$messageCom("success", "因子修改成功", "1000");
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
    this.findAllObjectName();
    this.getStaticDataByCodeType("ATTR_KIND");
    if (this.passItem != null) {
      this.selectDataById(this.passItem.attrId);
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