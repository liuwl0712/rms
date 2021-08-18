<!--
 * @Descripttion: 
 * @version: 
 * @Author: liuwl
 * @Date: 2021-06-01 15:12:15
 * @LastEditTime: 2021-06-02 17:58:22
-->
<template>
  <div>
    <div class="gf-div"><span class="yjbt">文本</span></div>
    <div class="gf-div">
      <span class="yjbt">一级标题</span><span class="yjbt">22px</span><span class="yjbt">weight：bold</span>
    </div>
    <div class="gf-div">
      <span class="ejbt">二级标题</span><span class="ejbt">20px</span><span class="ejbt">weight：600</span>
    </div>
    <div class="gf-div">
      <span class="zw">正文</span><span class="zw">18px</span>
    </div>
    <div class="gf-div">
      <span class="cywz">次要文字</span><span class="cywz">16px</span><span class="cywz">color: #909399</span>
    </div>
    <div class="gf-div"><span class="yjbt">颜色</span></div>
    <div class="gf-div">
      <span class="ejbt">主色</span>
    </div>
    <div class="gf-div">
      <span class="zw">默认选中/操作/跳转文字链接...等场景使用主色</span>
    </div>
    <div class="gf-div">
      <div class="zs">#409EFF</div>
    </div>
    <div class="gf-div">
      <span class="ejbt">辅色</span>
    </div>
    <div class="gf-div">
      <span class="zw">除了主色外的场景色，需要在不同的场景中使用</span>
    </div>
    <div class="gf-div">
      <div class="fs fs1">#67C23A</div>
      <div class="fs fs2">#E6A23C</div>
      <div class="fs fs3">#F56C6C</div>
      <div class="fs fs4">#909399</div>
    </div>
    <div class="gf-div"><span class="yjbt">面包屑</span></div>
    <div class="gf-div">
      <span class="ejbt">例： 数据集 > 采集任务管理</span>
    </div>
    <div class="gf-div">
      <span class="zw">使用面包屑时，可添加Breadcrumb_title的全局class属性(字体为二级标题格式，面包屑与下面内容有30px的外边距</span>
    </div>
    <div class="gf-div"><span class="yjbt">查询表单</span></div>
    <div class="gf-div">
      <span class="zw">在查询表单添加全局class属性my-form-dom1(表单里的组件框设置等宽宽度，表单里的每个表单都有5px的下外边距，表单与下方操作按钮有20px的外边距。表单功能按钮与表单同行，不换行。按钮颜色根据情况而定，一般情况下：</span>
    </div>
    <div class="gf-div">
      <el-button
        type="primary"
        icon="el-icon-search"
      >查询</el-button>
      <el-button icon="el-icon-refresh">重置</el-button>
    </div>
    <div class="gf-div"><span class="yjbt">操作按钮</span></div>
    <div class="gf-div">
      <span class="zw">一般情况下，操作按钮处于查询表单下方，数据表格上方，与数据表格有10px的下边距。一般情况下：</span>
    </div>
    <div class="gf-div">
      <el-button
        type="primary"
        icon="el-icon-plus"
        @click="add"
      >新增</el-button>
      <el-button
        type="primary"
        icon="el-icon-edit"
      >修改</el-button>
      <el-button
        type="primary"
        icon="el-icon-download"
      >导出</el-button>
      <el-button
        type="primary"
        icon="el-icon-upload2"
      >导入</el-button>
      <el-popconfirm title="确定删除吗？">
        <el-button
          slot="reference"
          type="danger"
          icon="el-icon-delete"
        >删除</el-button>
      </el-popconfirm>
    </div>
    <div class="gf-div">
      <span class="zw">注：点击新增按钮可弹出模态框，样式仅供参考</span>
    </div>
    <el-dialog
      title="新增"
      :visible.sync="dialogVisible"
      width="700px"
      append-to-body
      :close-on-click-modal="false"
    >
      <el-form
        :model="ruleForm"
        :rules="rules"
        ref="ruleForm"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item
          label="活动名称"
          prop="name"
        >
          <el-input v-model="ruleForm.name"></el-input>
        </el-form-item>
        <el-form-item
          label="活动区域"
          prop="region"
        >
          <el-select
            v-model="ruleForm.region"
            placeholder="请选择活动区域"
          >
            <el-option
              label="区域一"
              value="shanghai"
            ></el-option>
            <el-option
              label="区域二"
              value="beijing"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item
          label="活动时间"
          required
        >
          <el-col :span="11">
            <el-form-item prop="date1">
              <el-date-picker
                type="date"
                placeholder="选择日期"
                v-model="ruleForm.date1"
                style="width: 100%;"
              ></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col
            class="line"
            :span="2"
          >-</el-col>
          <el-col :span="11">
            <el-form-item prop="date2">
              <el-time-picker
                placeholder="选择时间"
                v-model="ruleForm.date2"
                style="width: 100%;"
              ></el-time-picker>
            </el-form-item>
          </el-col>
        </el-form-item>
        <el-form-item
          label="即时配送"
          prop="delivery"
        >
          <el-switch v-model="ruleForm.delivery"></el-switch>
        </el-form-item>
        <el-form-item
          label="活动性质"
          prop="type"
        >
          <el-checkbox-group v-model="ruleForm.type">
            <el-checkbox
              label="美食/餐厅线上活动"
              name="type"
            ></el-checkbox>
            <el-checkbox
              label="地推活动"
              name="type"
            ></el-checkbox>
            <el-checkbox
              label="线下主题活动"
              name="type"
            ></el-checkbox>
            <el-checkbox
              label="单纯品牌曝光"
              name="type"
            ></el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item
          label="特殊资源"
          prop="resource"
        >
          <el-radio-group v-model="ruleForm.resource">
            <el-radio label="线上品牌商赞助"></el-radio>
            <el-radio label="线下场地免费"></el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item
          label="活动形式"
          prop="desc"
        >
          <el-input
            type="textarea"
            v-model="ruleForm.desc"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary"
            @click="submitForm('ruleForm')"
          >立即创建</el-button>
          <el-button @click="resetForm('ruleForm')">重置</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>
<script>
export default {
  data() {
    return {
      dialogVisible: false,
      ruleForm: {
        name: "",
        region: "",
        date1: "",
        date2: "",
        delivery: false,
        type: [],
        resource: "",
        desc: "",
      },
      rules: {
        name: [
          { required: true, message: "请输入活动名称", trigger: "blur" },
          { min: 3, max: 5, message: "长度在 3 到 5 个字符", trigger: "blur" },
        ],
        region: [
          { required: true, message: "请选择活动区域", trigger: "change" },
        ],
        date1: [
          {
            type: "date",
            required: true,
            message: "请选择日期",
            trigger: "change",
          },
        ],
        date2: [
          {
            type: "date",
            required: true,
            message: "请选择时间",
            trigger: "change",
          },
        ],
        type: [
          {
            type: "array",
            required: true,
            message: "请至少选择一个活动性质",
            trigger: "change",
          },
        ],
        resource: [
          { required: true, message: "请选择活动资源", trigger: "change" },
        ],
        desc: [{ required: true, message: "请填写活动形式", trigger: "blur" }],
      },
    };
  },
  methods: {
    add() {
      this.dialogVisible = true;
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.dialogVisible = true;
        } else {
          return false;
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
  },
};
</script>
<style scoped>
.gf-div {
  margin-bottom: 10px;
}
.zs {
  background: #409eff;
  height: 40px;
  width: 240px;
  color: #fff;
  text-align: center;
  line-height: 40px;
}
.fs {
  height: 40px;
  width: 240px;
  color: #fff;
  text-align: center;
  line-height: 40px;
  display: inline-block;
  margin-right: 10px;
}
.fs1 {
  background: #67c23a;
}
.fs2 {
  background: #e6a23c;
}
.fs3 {
  background: #f56c6c;
}
.fs4 {
  background: #909399;
}
</style>