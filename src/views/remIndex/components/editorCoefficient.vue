<!--
 * @Descripttion: 
 * @version: 
 * @Author: liuwl
 * @Date: 2021-07-05 11:26:13
 * @LastEditTime: 2021-08-06 10:40:06
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
        label="包类型"
        prop="packageType"
      >
        <el-select
          v-model="ruleForm.packageType"
          placeholder="请选择包类型"
          clearable
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
        label="系数名称"
        prop="itemName"
      >
        <el-input
          v-model="ruleForm.itemName"
          placeholder="请输入系数名称"
          clearable
          :readonly="btnLoading"
        ></el-input>
      </el-form-item>
      <el-form-item
        label="系数类型"
        prop="coefficientType"
      >
        <el-select
          v-model="ruleForm.coefficientType"
          placeholder="请选择系数类型"
          :disabled="btnLoading"
          @change="coefficientTypeChange"
        >
          <el-option
            v-for="item in coefficientTypeOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item
        label="取值模式"
        prop="mode"
      >
        <el-select
          v-model="ruleForm.mode"
          placeholder="请选择取值模式"
          :disabled="btnLoading"
        >
          <el-option
            v-for="item in modeOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item
        label="编码"
        prop="itemCode"
        v-if="codeShow"
      >
        <el-select
          v-model="ruleForm.itemCode"
          placeholder="请选择关联编码"
          :disabled="btnLoading"
        >
          <el-option
            v-for="item in itemCodeOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item
        label="系数描述"
        prop="itemDesc"
        style="width:100%"
      >
        <el-input
          style="width: 3.36rem;"
          v-model="ruleForm.itemDesc"
          type="textarea"
          :autosize="{ minRows: 2, maxRows: 4}"
          placeholder="请输入系数描述"
          :readonly="btnLoading"
        ></el-input>
      </el-form-item>
      <el-form-item
        label="取值"
        prop="itemValue"
        style="width:100%"
      >
        <el-input
          style="width: 3.36rem;"
          v-model="ruleForm.itemValue"
          type="textarea"
          :autosize="{ minRows: 4, maxRows: 6}"
          placeholder="请输入取值"
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
//引入常用的方法封装
import untils from "@/untils/index";
export default {
  components: {},
  props: ["passItem", "newForm"],
  data() {
    return {
      // 表单数据
      ruleForm: {
        packageType: "",
        itemName: "",
        coefficientType: "",
        mode: "",
        itemDesc: "",
        itemValue: "",
        itemCode: "",
      },
      //表单验证
      rules: rules,
      // 包类型下拉选数据
      packageTypeOptions: [],
      // 系数类型下拉数据
      coefficientTypeOptions: [],
      // 编码下拉数据
      itemCodeOptions: [],
      // 取值模式下拉数据
      modeOptions: [],
      //保存按钮重命名
      submitBtn: "立即创建",
      //表单输入框、按钮状态
      btnLoading: false,
      //模态框loading状态
      formLoading: false,
      //编码下拉选是否展示
      codeShow: false,
    };
  },
  watch: {},
  computed: {},
  created() {
    this.getStaticDataByCodeType("COEFFICIENT_TYPE");
    this.getStaticDataByCodeType("MODE_OPTIONS");
    this.getStaticDataByCodeType("PACKAGE_TYPE");
    this.findFactorNames();
    if (this.passItem != null) {
      this.selectCoefficientById(this.passItem.coefficientId);
      this.submitBtn = "提交";
    }
  },
  mounted() {
    if (this.passItem === null) {
      this.newForm === null ? "" : (this.ruleForm = this.newForm);
    }
  },
  methods: {
    /**
     * 根据ID获取该节点的所有父节点的对象
     */
    getParentId(list, id) {
      for (let i in list) {
        if (list[i].packageId == id) {
          return [list[i]];
        }
        if (list[i].data) {
          let node = this.getParentId(list[i].data, id);
          if (node !== undefined) {
            return node.concat(list[i]);
          }
        }
      }
    },
    /**
     * 获取数组，并且反转
     */
    getArr(item) {
      let arr1 = this.getParentId(this.packageTypeOptions, item);
      let arr2 = arr1.map(function (item) {
        return item.packageId;
      });
      return arr2.reverse();
    },
    /**
     * 查询静态数据 --系数类型
     * item：静态数据的codeType
     * type：静态数据类型
     */
    getStaticDataByCodeType(item) {
      this.$contract.getStaticDataByCodeType(item).then((res) => {
        if (res.returnCode === "0") {
          switch (item) {
            case "COEFFICIENT_TYPE":
              this.coefficientTypeOptions = res.object.map((item) => {
                return { value: item.codeValue, label: item.codeName };
              });
              if (this.ruleForm.coefficientType != "") {
                this.coefficientTypeChange(this.ruleForm.coefficientType);
              }
              break;
            case "MODE_OPTIONS":
              this.modeOptions = res.object.map((item) => {
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
     * 查找因子名称列表，编码下拉数据
     */
    findFactorNames() {
      this.$contract.findFactorNames().then((res) => {
        if (res.returnCode === "0") {
          this.itemCodeOptions = res.object.map((item) => {
            return { value: item.attrCode, label: item.attrName };
          });
        } else {
          this.$messageCom(
            "error",
            "获取指标类型失败，失败原因：" + res.returnMessage,
            "1500"
          );
        }
      });
    },
    /**
     * 管理根据ID查询信息
     * item：coefficientId
     */
    selectCoefficientById(item) {
      this.formLoading = true;
      this.$contract.selectCoefficientById(item).then((res) => {
        if (res.returnCode === "0") {
          this.ruleForm.packageType = res.object.packageType;
          this.ruleForm.itemName = res.object.itemName;
          this.ruleForm.coefficientType = res.object.coefficientType;
          this.ruleForm.mode = res.object.mode;
          this.ruleForm.itemDesc = res.object.itemDesc;
          this.ruleForm.itemValue = res.object.itemValue;
          this.ruleForm.itemCode = res.object.itemCode;
          this.iscodeShow(res.object.coefficientName);
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
          if (this.ruleForm.mode === "1") {
            if (!untils.isMoney(this.ruleForm.itemValue)) {
              this.$messageCom(
                "warning",
                "取值模式为直接取值时，请填写数字格式！",
                "1000"
              );
              return;
            }
          }
          if (this.passItem === null) {
            this.addCoefficient();
          } else {
            this.updateCoefficientById();
          }
        }
      });
    },
    /**
     * 折算系数新增接口调用
     */
    addCoefficient() {
      this.btnLoading = true;
      this.$contract.addCoefficient(this.ruleForm).then((res) => {
        if (res.returnCode === "0") {
          this.$messageCom("success", "指标新增成功", "1000");
          this.resetForm();
          this.$emit("submitForm");
        } else {
          this.$messageCom(
            "error",
            "新增失败，失败原因：" + res.returnMessage,
            "1000"
          );
          this.ruleForm.packageType = this.getArr(this.ruleForm.packageType);
        }
        this.btnLoading = false;
      });
    },
    /**
     * 折算系数修改接口调用
     */
    updateCoefficientById() {
      this.ruleForm.coefficientId = this.passItem.coefficientId;
      this.$contract.updateCoefficientById(this.ruleForm).then((res) => {
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
     * 系数类型选中值发生变化时触发
     */
    coefficientTypeChange(val) {
      let item = this.coefficientTypeOptions.filter(
        (item) => item.value === val
      );
      this.iscodeShow(item[0].label);
    },
    /**
     * 编码下拉选是否展示
     */
    iscodeShow(val) {
      if (val === "基础系数") {
        this.codeShow = true;
      } else {
        this.codeShow = false;
        this.ruleForm.itemCode = "";
      }
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