<!--
 * @Descripttion: 
 * @version: 
 * @Author: liuwl
 * @Date: 2021-06-09 10:02:35
 * @LastEditTime: 2021-07-08 14:28:39
-->
<template>
  <div>
    <div class="Breadcrumb_title">定时任务管理</div>
    <div>
      <el-form
        :inline="true"
        :model="formInline"
        ref="formInline"
        class="my-form-dom1"
      >
        <el-form-item
          label="任务名称"
          prop="jobName"
        >
          <el-input
            v-model="formInline.jobName"
            placeholder="请输入任务名称"
            clearable
          ></el-input>
        </el-form-item>
        <el-form-item
          label="上次执行时间"
          prop="time"
          class="my-form-dom1-dateItem"
        >
          <el-date-picker
            v-model="formInline.time"
            type="datetimerange"
            :picker-options="pickerOptions"
            value-format="yyyy-MM-dd HH:mm:ss"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            align="right"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item
          label="任务状态"
          prop="triggerState"
        >
          <el-select
            v-model="formInline.triggerState"
            placeholder="请选择用户状态"
            clearable
          >
            <el-option
              v-for="item in stateOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item class="form-item-btn">
          <el-button
            type="primary"
            icon="el-icon-search"
            @click="queryForm"
            :disabled="submitBtnLoading"
          >查询</el-button>
          <el-button
            @click="resetForm('formInline')"
            icon="el-icon-refresh"
            :disabled="submitBtnLoading"
          >重置</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="my-operation-btn">
      <kt-button
        type="primary"
        icon="el-icon-plus"
        @click="addTimingTask('新增定时任务')"
        label="新增定时任务"
        perms='newTimingTask'
        :loading="submitBtnLoading"
      ></kt-button>
      <kt-button
        type="warning"
        icon="el-icon-video-pause"
        @click="pauseTimeTask"
        label="暂停定时任务"
        perms='pauseTimedTask'
        :loading="submitBtnLoading"
      ></kt-button>
      <kt-button
        type="primary"
        icon="el-icon-video-play"
        @click="restoreTimeTask"
        label="恢复定时任务"
        perms='resumeTimingTask'
        :loading="submitBtnLoading"
      ></kt-button>
      <el-popconfirm
        title="确定删除所选的定时任务信息吗？"
        @confirm="delTimeTask"
      >
        <kt-button
          slot="reference"
          type="danger"
          icon="el-icon-delete"
          label="删除定时任务"
          perms='deleteScheduledTask'
          :loading="submitBtnLoading"
        ></kt-button>
      </el-popconfirm>
    </div>
    <el-table
      :data="tableData"
      border
      tooltip-effect="light"
      :header-cell-style="{background:'#f5f7fa'}"
      v-loading="tableLoading"
      @selection-change="handleSelectionChange"
    >
      <el-table-column
        type="selection"
        width="50"
        align="center"
      >
      </el-table-column>
      <el-table-column
        prop="jobName"
        label="任务名称"
        align="center"
        min-width="160"
        show-overflow-tooltip
      >
      </el-table-column>
      <el-table-column
        prop="jobClassName"
        label="任务类名称"
        align="center"
        min-width="260"
        show-overflow-tooltip
      >
      </el-table-column>
      <el-table-column
        prop="cronExpression"
        label="时间表达式"
        align="center"
        min-width="150"
        show-overflow-tooltip
      >
      </el-table-column>
      <el-table-column
        prop="prevFireTime"
        label="上次执行时间"
        align="center"
        min-width="210"
        show-overflow-tooltip
      >
      </el-table-column>
      <el-table-column
        prop="nextFireTime"
        label="下次执行时间"
        align="center"
        min-width="210"
        show-overflow-tooltip
      >
      </el-table-column>
      <el-table-column
        prop="triggerState"
        label="任务状态"
        align="center"
        min-width="120"
      >
        <template slot-scope="scope">
          <div v-if="scope.row.triggerState==='WAITING'">
            <div class="zt-radius dd"></div><span>等待</span>
          </div>
          <div v-else-if="scope.row.triggerState==='PAUSED'">
            <div class="zt-radius zt"></div><span>暂停</span>
          </div>
          <div v-else-if="scope.row.triggerState==='ACQUIRED'">
            <div class="zt-radius zc"></div><span>正常</span>
          </div>
          <div v-else-if="scope.row.triggerState==='BLOCKED'">
            <div class="zt-radius zs"></div><span>阻塞</span>
          </div>
          <div v-else-if="scope.row.triggerState==='ERROR'">
            <div class="zt-radius cw"></div><span>错误</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
        width="210"
        fixed="right"
        align="center"
      >
        <template slot-scope="scope">
          <el-popover
            placement="bottom"
            trigger="click"
            class="input-popover"
          >
            <el-form
              :inline="true"
              :model="cronExpressionForm"
              ref="cronExpressionForm"
            >
              <el-form-item
                style="margin-bottom: 0px;"
                label="时间表达式"
                prop="cronExpression"
                :rules="[{ required: true, message: ' ',trigger: 'change'}]"
              >
                <el-input
                  v-model="cronExpressionForm.cronExpression"
                  clearable
                  :readonly="submitBtnLoading"
                  placeholder="不能为空"
                  style="width: 1rem;"
                ></el-input>
              </el-form-item>
              <el-form-item style="margin-bottom: 0px;">
                <el-button
                  type="primary"
                  @click.native.prevent="submitCronExpression(scope.row)"
                  :loading="submitBtnLoading"
                >提交</el-button>
              </el-form-item>
            </el-form>
            <kt-link
              slot="reference"
              icon="el-icon-edit"
              @click.native.prevent="updataTimingTask(scope.row.cronExpression)"
              label="编辑"
              perms='editTimingTask'
            ></kt-link>
          </el-popover>
          <kt-link
            iconRight="el-icon-tickets"
            label="执行记录"
            perms=''
          ></kt-link>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      :current-page="page"
      :page-sizes="[10, 20, 50]"
      :page-size="sizeVal"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
      @size-change="handleSizeChange"
      @current-change="pageChange"
    >
    </el-pagination>
    <el-dialog
      :title="dialogTitle"
      :visible.sync="dialogVisible"
      width="4.6875rem"
      append-to-body
      :close-on-click-modal="false"
    >
      <editor-timingTask
        @submitForm="submitForm"
        ref="timingTaskChild"
      ></editor-timingTask>
    </el-dialog>
  </div>
</template>
<script>
import editorTimingTask from "./components/editorTimingTask.vue";
//引入常用的方法封装
import untils from "@/untils/index";
export default {
  name: "timingTaskPage",
  components: {
    "editor-timingTask": editorTimingTask,
  },
  data() {
    return {
      //查询表单数据
      formInline: {
        jobName: "",
        time: "",
        triggerState: "",
      },
      //状态下拉选数据
      stateOptions: [
        {
          label: "等待",
          value: "WAITING",
        },
        {
          label: "暂停",
          value: "PAUSED",
        },
        {
          label: "正常",
          value: "ACQUIRED",
        },
        {
          label: "阻塞",
          value: "BLOCKED",
        },
        {
          label: "错误",
          value: "ERROR",
        },
      ],
      //时间组件配置
      pickerOptions: {
        shortcuts: [
          {
            text: "最近一周",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit("pick", [start, end]);
            },
          },
          {
            text: "最近一个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit("pick", [start, end]);
            },
          },
          {
            text: "最近三个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit("pick", [start, end]);
            },
          },
        ],
      },
      //查询表格数据
      tableData: [],
      //表格勾选数据
      multipleSelection: [],
      //表格Loading
      tableLoading: false,
      //数据条数
      total: null,
      //查询每页个数
      sizeVal: 10,
      //查询页码
      page: 1,
      //模态框标题
      dialogTitle: "",
      //模态框是否打开
      dialogVisible: false,
      //要修改的时间表达式数据
      cronExpressionForm: {
        cronExpression: "",
      },
      //要修改的时间表达式提交按钮以及输入框状态
      submitBtnLoading: false,
    };
  },
  created() {
    this.queryForm();
  },
  methods: {
    /**
     *表格复选框勾选数据
     */
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    /**
     * 新增定时任务
     */
    addTimingTask(type) {
      this.dialogTitle = type;
      this.dialogVisible = true;
    },
    /**
     * 修改定时任务时间表达式
     */
    updataTimingTask(val) {
      this.cronExpressionForm.cronExpression = val;
    },
    /**
     * 暂停定时任务/恢复定时任务入参
     * 循环列表所选值，进行字段筛选
     */
    multipleFor(item) {
      let arr = [];
      for (let index of item) {
        let obj = {
          jobName: index.jobName,
          jobGroupName: index.jobGroupName,
        };
        arr.push(obj);
      }
      return arr;
    },
    /**
     * 暂停定时任务
     */
    pauseTimeTask() {
      let callState = untils.isArrayEmpty(this.multipleSelection);
      if (callState) {
        let params = {
          methodName: "pauseJob",
          jobAndTriggerDtoList: this.multipleFor(this.multipleSelection),
        };
        this.allMethod(params, "pauseJob");
      } else {
        this.$messageCom("warning", "请选择至少一条定时任务进行暂停", "1000");
      }
    },
    /**
     * 恢复定时任务
     */
    restoreTimeTask() {
      let callState = untils.isArrayEmpty(this.multipleSelection);
      if (callState) {
        let params = {
          methodName: "resumeJob",
          jobAndTriggerDtoList: this.multipleFor(this.multipleSelection),
        };
        this.allMethod(params, "resumeJob");
      } else {
        this.$messageCom("warning", "请选择至少一条定时任务进行恢复", "1000");
      }
    },
    /**
     * 删除定时任务
     */
    delTimeTask() {
      let callState = untils.isArrayEmpty(this.multipleSelection);
      if (callState) {
        let arr = [];
        for (let index of this.multipleSelection) {
          let obj = {
            jobName: index.jobName,
            jobGroupName: index.jobGroupName,
            triggerName: index.triggerName,
            triggerGroupName: index.triggerGroupName,
          };
          arr.push(obj);
        }
        let params = {
          methodName: "deleteJob",
          jobAndTriggerDtoList: arr,
        };
        this.allMethod(params, "deleteJob");
      } else {
        this.$messageCom("warning", "请选择至少一条定时任务进行删除", "1000");
      }
    },
    /**
     * 修改定时任务时间表达式--提交
     */
    submitCronExpression(item) {
      this.$refs["cronExpressionForm"].validate((valid) => {
        if (valid) {
          let params = {
            methodName: "updateJob",
            jobClassName: item.jobClassName,
            jobGroupName: item.jobGroupName,
            jobName: item.jobName,
            triggerName: item.triggerName,
            triggerGroupName: item.triggerGroupName,
            cronExpression: this.cronExpressionForm.cronExpression,
          };
          this.allMethod(params, "updateJob");
        } else {
          return false;
        }
      });
    },
    /**
     * 表单查询事件
     */
    queryForm() {
      this.page = 1;
      this.qryByPage();
    },
    /**
     * 分页数量改变触发方法
     */
    handleSizeChange(val) {
      this.sizeVal = val;
      this.page = 1;
      this.qryByPage();
    },
    /**
     * 分页页码改变触发方法
     */
    pageChange(val) {
      this.page = val;
      this.qryByPage();
    },
    /**
     * 定时任务查询--接口传递参数方法
     * 接口封装方法：allMethod
     * params 调用接口传递参数
     */
    qryByPage() {
      let params = {
        methodName: "qryByPage",
        current: this.page,
        size: this.sizeVal,
        jobName: this.formInline.jobName,
        triggerState: this.formInline.triggerState,
        crtTime: this.formInline.time === "" ? "" : this.formInline.time[0],
        endTime: this.formInline.time === "" ? "" : this.formInline.time[1],
      };
      this.tableLoading = true;
      this.allMethod(params, "qryByPage");
    },
    /**
     * 定时任务新增--接口传递参数方法
     * 接口封装方法：allMethod
     * params 调用接口传递参数
     */
    submitForm(item) {
      item.methodName = "addJobWithData";
      item.jobClassName = "com.cmos.rms.serviceimpl.IndexSynchJob";
      item.jobGroupName = "rms_zj";
      item.triggerName = item.jobName;
      item.triggerGroupName = "rms_zj";
      item.jobData = {
        indexType: item.indexType,
      };
      this.allMethod(item, "addJobWithData");
    },
    /**
     * 接口封装方法
     * params 调用接口传递参数
     * method 方法类型：qryByPage--查询
     * 接口封装名：allMethod
     */
    allMethod(params, method) {
      this.submitBtnLoading = true;
      this.$contract.allMethod(params).then((res) => {
        if (res.returnCode == 0) {
          switch (method) {
            case "qryByPage":
              this.tableData = res.beans;
              this.total = res.totalCount;
              break;
            case "addJobWithData":
              this.$refs.timingTaskChild.resetForm();
              this.dialogVisible = false;
              this.$messageCom("success", "定时任务新增成功", "1000");
              this.qryByPage();
              break;
            case "updateJob":
              document.body.click();
              this.$messageCom("success", "定时任务修改成功", "1000");
              this.qryByPage();
              break;
            case "pauseJob":
              this.$messageCom("success", "定时任务暂定成功", "1000");
              this.qryByPage();
              break;
            case "resumeJob":
              this.$messageCom("success", "定时任务恢复成功", "1000");
              this.qryByPage();
              break;
            case "deleteJob":
              this.$messageCom("success", "定时任务删除成功", "1000");
              this.qryByPage();
              break;
          }
        } else {
          this.$messageCom(
            "error",
            "操作失败，失败原因：" + res.returnMessage,
            "1500"
          );
        }
        try {
          this.$refs.timingTaskChild.clearStart();
        } catch (error) {}
        this.submitBtnLoading = false;
        this.tableLoading = false;
      });
    },
    /**
     * 表单重置
     */
    resetForm(form) {
      this.$refs[form].resetFields();
      this.sizeVal = 10;
      this.queryForm();
    },
  },
};
</script>