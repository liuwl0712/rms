<!--
 * @Descripttion: 
 * @version: 
 * @Author: liuwl
 * @Date: 2021-07-06 10:16:00
 * @LastEditTime: 2021-08-04 17:19:00
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
        label="指标名称"
        prop="kpiName"
      >
        <el-input
          v-model="ruleForm.kpiName"
          placeholder="请输入指标名称"
          clearable
          :readonly="btnLoading"
        ></el-input>
      </el-form-item>
      <el-form-item
        label="指标类型"
        prop="kpiKind"
      >
        <el-select
          v-model="ruleForm.kpiKind"
          placeholder="请选择指标类型"
          :disabled="btnLoading"
        >
          <el-option
            v-for="item in kpiKindOptions"
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
        label="关联规则"
        prop="ruleId"
      >
        <el-cascader
          :disabled="btnLoading"
          v-model="ruleForm.ruleId"
          popper-class="el-cascader-packageType"
          ref="refPackage"
          clearable
          @change="handleChange"
          :options="ruleIdOptions"
          :show-all-levels="false"
          :props="{label:'ruleName',children:'data',value:'ruleId',}"
        >
          <template slot-scope="{ node, data }">
            <span>{{ data.ruleName }}</span>
            <span v-if="data.data == undefined">_{{data.ruleVersion}}</span>
            <span v-if="data.data != undefined">({{ data.data.length }})</span>
          </template>
        </el-cascader>
      </el-form-item>
      <el-form-item
        label="指标描述"
        prop="kpiDesc"
        style="width:100%"
      >
        <el-input
          style="width: 3.36rem;"
          v-model="ruleForm.kpiDesc"
          type="textarea"
          :autosize="{ minRows: 2, maxRows: 4}"
          placeholder="请输入指标描述"
          :readonly="btnLoading"
        ></el-input>
      </el-form-item>
      <el-form-item
        label="规则算法"
        style="width:100%"
      >
        <el-input
          v-model="ruleAlgorithm"
          style="width: 3.36rem;"
          type="textarea"
          :autosize="{ minRows: 6, maxRows: 8}"
          placeholder="关联规则算法"
          :readonly="true"
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
        kpiName: "",
        kpiKind: "",
        packageType: "",
        ruleId: "",
        kpiDesc: "",
      },
      //规则算法
      ruleAlgorithm: "",
      //表单验证
      rules: rules,
      // 指标类型下拉选数据
      kpiKindOptions: [],
      // 包类型下拉选数据
      packageTypeOptions: [],
      // 关联规则下拉选数据
      ruleIdOptions: [],
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
     * 关联规则
     */
    getAllRule() {
      this.$contract.getAllRule().then((res) => {
        if (res.returnCode === "0") {
          this.ruleIdOptions = res.object;
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
     * 根据ID获取该节点的所有父节点的对象
     */
    getParentId(list, id) {
      for (let i in list) {
        if (list[i].ruleId == id) {
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
      let arr1 = this.getParentId(this.ruleIdOptions, item);
      if (arr1 === undefined) {
        return "";
      }
      let arr2 = arr1.map(function (item) {
        return item.ruleId;
      });
      return arr2.reverse();
    },
    /**
     * 当选中节点变化时触发
     * 选中节点的值
     */
    handleChange(value) {
      this.ruleAlgorithm =
        this.$refs.refPackage.getCheckedNodes()[0].data.ruleExp;
    },
    /**
     * 根据id获取指定节点
     * @params: id-要查询的节点id
     * @params: tree-树形结构的数组
     * 要查找的节点对象
     **/
    getItemByIdInTree(id, tree) {
      let res = null;
      for (let i = 0; i < tree.length; i++) {
        let ele = tree[i];
        ele.ruleId === id ? (res = ele) : "";
        if (res) break;
        if (ele.data != undefined) {
          if (ele.data.length) {
            res = this.getItemByIdInTree(id, ele.data);
          }
        }
      }
      return res;
    },
    /**
     * 查询静态数据
     * item：静态数据的codeType
     */
    getStaticDataByCodeType(item) {
      this.$contract.getStaticDataByCodeType(item).then((res) => {
        if (res.returnCode === "0") {
          switch (item) {
            case "KPI_KIND":
              this.kpiKindOptions = res.object.map((item) => {
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
     * 根据ID查询信息
     * item：kpiId
     */
    qryBsKpiById(item) {
      this.formLoading = true;
      this.$contract.qryBsKpiById(item).then((res) => {
        if (res.returnCode === "0") {
          this.ruleForm.kpiName = res.object.kpiName;
          this.ruleForm.kpiKind = res.object.kpiKind;
          this.ruleForm.packageType = res.object.packageType;
          this.ruleForm.ruleId = this.getArr(res.object.ruleId);
          this.ruleAlgorithm =
            this.getItemByIdInTree(res.object.ruleId, this.ruleIdOptions) ===
            null
              ? ""
              : this.getItemByIdInTree(res.object.ruleId, this.ruleIdOptions)
                  .ruleExp;
          this.ruleForm.kpiDesc = res.object.kpiDesc;
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
          this.ruleForm.ruleId = this.ruleForm.ruleId.reverse()[0];
          this.ruleForm.opCode = JSON.parse(
            sessionStorage.getItem("userInfo")
          ).uname;
          if (this.passItem === null) {
            this.addBsKpi();
          } else {
            if (this.passItem.titleType === "新增指标") {
              this.addBsKpi();
            } else {
              this.updateBsKpi();
            }
          }
        }
      });
    },
    /**
     * 指标新增接口调用
     */
    addBsKpi() {
      this.btnLoading = true;
      this.$contract.addBsKpi(this.ruleForm).then((res) => {
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
          this.ruleForm.ruleId = this.getArr(this.ruleForm.ruleId);
        }
        this.btnLoading = false;
      });
    },
    /**
     * 指标修改接口调用
     */
    updateBsKpi() {
      this.ruleForm.kpiId = this.passItem.kpiId;
      this.$contract.updateBsKpi(this.ruleForm).then((res) => {
        if (res.returnCode === "0") {
          this.$messageCom("success", "指标修改成功", "1000");
          this.$emit("submitForm");
        } else {
          this.$messageCom(
            "error",
            "修改失败，失败原因：" + res.returnMessage,
            "1000"
          );
          this.ruleForm.ruleId = this.getArr(this.ruleForm.ruleId);
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
    this.getAllRule();
    this.getStaticDataByCodeType("KPI_KIND");
    this.getStaticDataByCodeType("PACKAGE_TYPE");
    if (this.passItem != null) {
      if (this.passItem.titleType === "新增指标") {
        this.submitBtn = "立即创建";
      } else {
        this.submitBtn = "提交";
      }
      this.qryBsKpiById(this.passItem.kpiId);
    }
  },
  mounted() {
    if (this.passItem === null) {
      this.newForm === null ? "" : (this.ruleForm = this.newForm);
    }
  },
};
</script>