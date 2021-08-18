<!--
 * @Descripttion: 
 * @version: 
 * @Author: liuwl
 * @Date: 2021-07-15 17:12:11
 * @LastEditTime: 2021-07-28 17:33:15
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
        label="模板月份"
        prop="yearMonth"
      >
        <el-date-picker
          v-model="ruleForm.yearMonth"
          type="month"
          placeholder="选择指标模板月份"
          value-format="yyyyMM"
          :readonly="btnLoading"
        >
        </el-date-picker>
      </el-form-item>
      <el-form-item
        label="模板名称"
        prop="templateName"
      >
        <el-input
          v-model="ruleForm.templateName"
          placeholder="请输入模板名称"
          clearable
          :readonly="btnLoading"
        ></el-input>
      </el-form-item>
      <el-form-item
        label="模板描述"
        prop="templateDesc"
        style="width:100%"
      >
        <el-input
          style="width: 3.36rem;"
          v-model="ruleForm.templateDesc"
          type="textarea"
          :autosize="{ minRows: 2, maxRows: 4}"
          placeholder="请输入模板描述"
          :readonly="btnLoading"
        ></el-input>
      </el-form-item>
    </el-form>
    <el-tabs
      v-model="activeName"
      @tab-click="handleClick"
      class="tamplate-el-tabs"
      :before-leave="beforeLeave"
    >
      <el-tab-pane
        label="前置指标"
        name="0"
      >
      </el-tab-pane>
      <el-tab-pane
        v-for="item in packageTypeOptions"
        :key="item.value"
        :label="item.label"
        :name="item.value"
      >
      </el-tab-pane>
    </el-tabs>
    <div
      class="tamplate-el-tabs"
      v-show="preIndexShow"
    >
      <el-form
        :inline="true"
        :model="ruleForm"
        :rules="rules"
        ref="ruleForm2"
        class="tamplate-el-form-0"
      >
        <el-form-item
          label="关联指标"
          prop="before"
        >
          <el-select
            v-model="ruleForm.before"
            placeholder="请选择指标"
            multiple
          >
            <el-option
              v-for="item in KaiOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
    </div>
    <div
      class="tamplate-el-tabs"
      v-show="packageShow"
    >
      <div class="tamplate-el-div-0">
        <el-button
          type="primary"
          @click="addItem"
        >增加数据</el-button>
      </div>
      <div
        class="tamplate-el-div-1"
        id="tamplate_div"
      >
        <el-row
          v-for="(item,index) in ruleForm.package"
          :key="index"
          class="tamplate-el-row"
        >
          <el-col
            :span="22"
            class="tamplate-el-col-22"
          >
            <el-form
              :model="item"
              :inline="true"
              label-width="0.6rem"
              class="tamplate-el-form-1"
              :rules="rules"
              ref="ruleForm3"
            >
              <el-form-item
                label="关联指标"
                prop="kpiId"
              >
                <el-select
                  v-model="item.kpiId"
                  placeholder="请选择关联指标"
                  clearable
                >
                  <el-option
                    v-for="item in KaiOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  >
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item
                label="权重类型"
                prop="weightType"
              >
                <el-select
                  v-model="item.weightType"
                  placeholder="请选择权重类型"
                  clearable
                >
                  <el-option
                    v-for="item in weightOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  >
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item
                label="指标权重"
                prop="weight"
                style="width:100%"
              >
                <el-input
                  style="width: 2.75rem;"
                  v-model="item.weight"
                  type="textarea"
                  :autosize="{ minRows: 2, maxRows: 4}"
                  placeholder="请输入指标权重"
                  :readonly="btnLoading"
                ></el-input>
              </el-form-item>
            </el-form>
          </el-col>
          <el-col
            :span="2"
            class="tamplate-el-col-2"
          >
            <el-button
              v-if="ruleForm.package.length > '1'"
              type="danger"
              icon="el-icon-delete"
              circle
              @click="deleteItem(item, index)"
            ></el-button>
          </el-col>
        </el-row>
      </div>
    </div>
    <div class="demo-ruleForm-btn">
      <el-button
        type="primary"
        :loading="btnLoading"
        @click="submitForm('ruleForm','ruleForm2','ruleForm3')"
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
        yearMonth: "",
        templateName: "",
        templateDesc: "",
        before: [],
        package: [
          {
            kpiId: "",
            weightType: "",
            weight: "",
          },
        ],
        // 短暂储存
        bsTemplateKpiRels: {},
      },
      // 默认标签页激活
      activeName: "0",
      // 包类型
      packageTypeOptions: [],
      // 关联指标下拉选数据
      KaiOptions: [],
      // 权重类型下拉选数据
      weightOptions: [],
      //表单验证
      rules: rules,
      //保存按钮重命名
      submitBtn: "立即创建",
      //表单输入框、按钮状态
      btnLoading: false,
      //模态框loading状态
      formLoading: false,
      // 前置指标表单
      preIndexShow: true,
      // 包类型表单
      packageShow: false,
      // 顶部表单是否验证通过
      formName1Type: true,
      // 前置指标表单是否验证通过
      formName2Type: true,
      // 包类型表单是否验证通过
      formName3Type: [],
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
            case "PACKAGE_TYPE":
              this.packageTypeOptions = res.object.map((item) => {
                return { value: item.codeValue, label: item.codeName };
              });
              break;
            case "WEIGHT_TYPE":
              this.weightOptions = res.object.map((item) => {
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
     * 查询关联指标
     */
    getKpiName(data) {
      this.$contract.getKpiName(data).then((res) => {
        if (res.returnCode === "0") {
          this.KaiOptions = res.beans.map((item) => {
            return { value: item.kpi_id, label: item.kpi_name };
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
     * tab 被选中时触发
     * 被选中的标签 tab 实例
     */
    handleClick(tab, event) {
      if (tab.name === "0") {
        this.preIndexShow = true;
        this.packageShow = false;
        this.getKpiName(null);
      } else {
        this.packageShow = true;
        this.preIndexShow = false;
        this.getKpiName(tab.name);
      }
    },
    /**
     * 切换标签之前的钩子，若返回 false 或者返回 Promise 且被 reject，则阻止切换。
     * activeName, oldActiveName
     */
    beforeLeave(activeName, oldActiveName) {
      if (oldActiveName != 0) {
        let checkNull = this.checkNull(this.ruleForm.package);
        if (checkNull) {
          this.ruleForm.bsTemplateKpiRels[oldActiveName] = checkNull;
        }
      }
      if (activeName != 0) {
        this.ruleForm.bsTemplateKpiRels[activeName] === undefined
          ? (this.ruleForm.package = [
              {
                kpiId: "",
                weightType: "",
                weight: "",
              },
            ])
          : (this.ruleForm.package =
              this.ruleForm.bsTemplateKpiRels[activeName]);
      }
    },
    /**
     * 去除全空
     */
    checkNull(val) {
      let arr = val.map((item) => {
        if (item.kpiId === "" && item.weightType === "" && item.weight === "") {
        } else {
          return item;
        }
      });
      let checkNull = arr.filter((item) => item);
      if (checkNull.length == "0") {
        return false;
      } else {
        return checkNull;
      }
    },
    /**
     * 弹出框关闭前出发方法
     */
    closeBefore() {
      if (this.activeName != "0") {
        this.ruleForm.bsTemplateKpiRels[this.activeName] =
          this.ruleForm.package;
      }
    },
    /**
     * 管理根据ID查询信息
     * item：templateId
     */
    qryBsTemplateById(item) {
      this.formLoading = true;
      this.$contract.qryBsTemplateById(item).then((res) => {
        if (res.returnCode === "0") {
          this.ruleForm.yearMonth = res.object.yearMonth;
          this.ruleForm.templateName = res.object.templateName;
          this.ruleForm.templateDesc = res.object.templateDesc;
          this.ruleForm.before = res.object.before;
          this.ruleForm.bsTemplateKpiRels = res.object.bsTemplateKpiRels;
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
     * 提交前的校验
     * 校验前置指标
     */
    checkBefore() {
      if (this.ruleForm.before.length == "0") {
        this.activeName = "0";
        this.preIndexShow = true;
        this.packageShow = false;
        this.formName2("ruleForm2");
      }
    },
    /**
     * 提交前的校验
     * 校验包类型表单
     */
    checkPack() {
      for (let i = 0; i < this.packageTypeOptions.length; i++) {
        let a =
          this.ruleForm.bsTemplateKpiRels[this.packageTypeOptions[i].value];
        if (a != undefined) {
          for (let j = 0; j < a.length; j++) {
            if (
              a[j].kpiId != "" &&
              a[j].weight != "" &&
              a[j].weightType != ""
            ) {
            } else {
              this.activeName = this.packageTypeOptions[i].value;
              this.preIndexShow = false;
              this.packageShow = true;
              let bolForm3 = true;
              this.formName3("ruleForm3");
              bolForm3 = this.formName3Type.every((val, index, arr) => {
                return val === true;
              });
              return bolForm3;
            }
          }
        }
      }
    },
    /**
     * 表单提交
     */
    submitForm(formName1, formName2, formName3) {
      this.closeBefore();
      this.formName1(formName1);
      let bolForm3 = true;
      if (this.activeName === "0") {
        this.formName2(formName2);
      } else {
        this.formName3(formName3);
        bolForm3 = this.formName3Type.every((val, index, arr) => {
          return val === true;
        });
      }
      if (this.checkPack() != undefined) {
        bolForm3 = this.checkPack();
      }
      this.checkBefore();
      let formNameType = [];
      formNameType.push(this.formName1Type, this.formName2Type, bolForm3);
      let arr = formNameType.every((val, index, arr) => {
        return val === true;
      });
      if (arr) {
        if (this.passItem === null) {
          this.addBsTemplate();
        } else {
          if (this.passItem.titleType === "新增指标模板") {
            this.addBsTemplate();
          } else {
            this.modBsTemplate();
          }
        }
      } else {
        this.$messageCom("warning", "还有信息未填写完成，请检查", "1000");
      }
    },
    /**
     * 新增接口调用
     */
    addBsTemplate() {
      this.btnLoading = true;
      this.$contract.addBsTemplate(this.ruleForm).then((res) => {
        if (res.returnCode === "0") {
          this.$messageCom("success", "指标模板新增成功", "1000");
          this.ruleForm = {
            yearMonth: "",
            templateName: "",
            templateDesc: "",
            before: [],
            package: [
              {
                kpiId: "",
                weightType: "",
                weight: "",
              },
            ],
            // 短暂储存
            bsTemplateKpiRels: {},
          };
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
    modBsTemplate() {
      this.ruleForm.templateId = this.passItem.templateId;
      this.$contract.modBsTemplate(this.ruleForm).then((res) => {
        if (res.returnCode === "0") {
          this.$messageCom("success", "指标模板修改成功", "1000");
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
     * 顶部表单验证
     */
    formName1(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          return (this.formName1Type = true);
        } else {
          return (this.formName1Type = false);
        }
      });
    },
    /**
     * 前置指标表单验证
     */
    formName2(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          return (this.formName2Type = true);
        } else {
          return (this.formName2Type = false);
        }
      });
    },
    /**
     * 包类型表单验证
     */
    formName3(formName) {
      this.formName3Type = [];
      for (let i = 0; i < this.$refs[formName].length; i++) {
        this.$refs[formName][i].validate((valid) => {
          if (valid) {
            return this.formName3Type.push(true);
          } else {
            return this.formName3Type.push(false);
          }
        });
      }
    },
    /**
     * 新增包类型表单
     */
    addItem() {
      this.ruleForm.package.push({
        kpiId: "",
        weightType: "",
        weight: "",
      });
      setTimeout(() => {
        document.querySelector("#tamplate_div").scrollTo({
          top: document.querySelector("#tamplate_div").scrollHeight,
          behavior: "smooth",
        });
      }, 10);
    },
    /**
     * 删除包类型表单
     */
    deleteItem(item, index) {
      this.ruleForm.package.splice(index, 1);
    },
    /**
     * 表单重置
     */
    resetForm() {
      this.$refs["ruleForm"].resetFields();
      if (this.activeName === "0") {
        this.$refs["ruleForm2"].resetFields();
      } else {
        this.ruleForm.package = [
          {
            kpiId: "",
            weightType: "",
            weight: "",
          },
        ];
        this.$refs["ruleForm3"][0].resetFields();
      }
    },
  },
  created() {
    this.getKpiName(null);
    this.getStaticDataByCodeType("PACKAGE_TYPE");
    this.getStaticDataByCodeType("WEIGHT_TYPE");
    if (this.passItem != null) {
      if (this.passItem.titleType === "新增指标模板") {
        this.submitBtn = "立即创建";
      } else {
        this.submitBtn = "提交";
      }
      this.qryBsTemplateById(this.passItem.templateId);
    }
  },
  mounted() {
    if (this.passItem === null) {
      this.newForm === null ? "" : (this.ruleForm = this.newForm);
    }
  },
};
</script>
<style lang="scss">
.tamplate-el-tabs {
  padding: 0px 30px;
}
.tamplate-el-form-0 {
  .el-form-item,
  .el-form-item__content,
  .el-select {
    width: 100%;
    .el-tag {
      height: 40px;
      line-height: 40px;
      font-size: 16px;
    }
    .el-input--suffix .el-input__inner {
      height: 60px !important;
      line-height: 60px;
    }
  }
}
.tamplate-el-div-0 {
  text-align: right;
  margin-bottom: 20px;
}
.tamplate-el-div-1 {
  max-height: 400px;
  overflow: auto;
  .tamplate-el-row {
    margin-bottom: 20px;
    .tamplate-el-col-22 {
      border-left: 10px solid #409eff;
      border-radius: 10px;
      .tamplate-el-form-1 {
        .el-form-item__content {
          width: 200px;
        }
      }
    }
    .tamplate-el-col-2 {
      line-height: 120px;
    }
  }
}
</style>