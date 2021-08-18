<!--
 * @Descripttion: 
 * @version: 
 * @Author: liuwl
 * @Date: 2021-06-22 17:19:39
 * @LastEditTime: 2021-07-27 17:47:21
-->
<template>
  <div>
    <div class="Breadcrumb_title">酬金数据源&nbsp;&nbsp;&nbsp;&nbsp;>&nbsp;&nbsp;&nbsp;&nbsp;众包酬金结算数据</div>
    <el-row :gutter="20">
      <!-- <el-col :span="5">
        <el-card
          shadow="never"
          class="el-card-tree"
        >
          <el-tree
            :data="treeData"
            node-key="id"
            default-expand-all
            :expand-on-click-node="false"
            class="el-tree-rewrite"
          >
            <span
              class="custom-tree-node"
              slot-scope="{ node, data }"
            >
              {{ node.label }}
            </span>
          </el-tree>
        </el-card>
      </el-col> -->
      <el-col :span="24">
        <div>
          <el-form
            :inline="true"
            :model="formInline"
            ref="formInline"
            class="my-form-dom1"
          >
            <el-form-item
              label="统计周期"
              prop="period"
            >
              <el-input
                v-model="formInline.period"
                placeholder="请输入统计周期"
                clearable
              ></el-input>
            </el-form-item>
            <el-form-item
              label="因素名称"
              prop="indexType"
            >
              <el-select
                v-model="formInline.indexType"
                placeholder="请选择因素名称"
                clearable
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
            <el-form-item
              label="会员编号"
              prop="kfCode"
            >
              <el-input
                v-model="formInline.kfCode"
                placeholder="请输入会员编号"
                clearable
              ></el-input>
            </el-form-item>
            <el-form-item>
              <el-button
                type="primary"
                icon="el-icon-search"
                @click="queryForm"
              >查询</el-button>
              <el-button
                @click="resetForm('formInline')"
                icon="el-icon-refresh"
              >重置</el-button>
            </el-form-item>
          </el-form>
        </div>
        <el-table
          :data="tableData"
          border
          tooltip-effect="light"
          :header-cell-style="{background:'#f5f7fa'}"
          v-loading="tableLoading"
        >
          <el-table-column
            type="index"
            width="50"
            align="center"
          >
          </el-table-column>
          <el-table-column
            prop="period"
            label="周期"
            align="center"
            min-width="140"
            show-overflow-tooltip
          >
          </el-table-column>
          <el-table-column
            prop="opTime"
            label="同步时间"
            align="center"
            min-width="220"
            show-overflow-tooltip
          >
          </el-table-column>
          <el-table-column
            prop="kfCode"
            label="会员编号"
            align="center"
            min-width="140"
            show-overflow-tooltip
          >
          </el-table-column>
          <el-table-column
            prop="factorCode"
            label="因素编号"
            align="center"
            min-width="140"
            show-overflow-tooltip
          >
          </el-table-column>
          <el-table-column
            prop="factorName"
            label="因素名称"
            align="center"
            min-width="160"
            show-overflow-tooltip
          >
          </el-table-column>
          <el-table-column
            prop="factorValue"
            label="因素值"
            align="center"
            min-width="120"
            show-overflow-tooltip
          >
          </el-table-column>
          <el-table-column
            prop="beginDate"
            label="统计开始时间"
            align="center"
            min-width="140"
            show-overflow-tooltip
          >
          </el-table-column>
          <el-table-column
            prop="endDate"
            label="统计结束时间"
            align="center"
            min-width="140"
            show-overflow-tooltip
          >
          </el-table-column>
          <el-table-column
            prop="createTime"
            label="创建时间"
            align="center"
            min-width="220"
            show-overflow-tooltip
          >
          </el-table-column>
          <el-table-column
            prop="opCode"
            label="操作员"
            align="center"
            min-width="140"
            show-overflow-tooltip
          >
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
      </el-col>
    </el-row>
  </div>
</template>
<script>
export default {
  name: "crowdRemunerDataSettle",
  components: {},
  props: [],
  data() {
    return {
      //树结构数据
      treeData: [
        {
          id: 1,
          label: "一级 1",
          children: [
            {
              id: 4,
              label: "二级 1-1",
              children: [
                {
                  id: 9,
                  label: "三级 1-1-1",
                  children: [],
                },
                {
                  id: 10,
                  label: "三级 1-1-2",
                  children: [],
                },
              ],
            },
          ],
        },
        {
          id: 2,
          label: "一级 2",
          children: [
            {
              id: 5,
              label: "二级 2-1",
              children: [],
            },
            {
              id: 6,
              label: "二级 2-2",
              children: [],
            },
          ],
        },
        {
          id: 3,
          label: "一级 3",
          children: [
            {
              id: 7,
              label: "二级 3-1",
              children: [],
            },
            {
              id: 8,
              label: "二级 3-2",
              children: [],
            },
          ],
        },
      ],
      //查询表单数据列表
      formInline: {
        period: "",
        indexType: "",
        kfCode: "",
      },
      //指标类型下拉框数据
      indexTypeOptions: [],
      //数据列表
      tableData: [],
      //表格Loading
      tableLoading: false,
      //数据列表条数
      total: null,
      //查询每页个数
      sizeVal: 10,
      //查询页码
      page: 1,
    };
  },
  computed: {},
  watch: {},
  created() {
    this.queryForm();
    this.getFactorCodeAndName();
  },
  mounted() {},
  methods: {
    /**
     * 指标类型下拉框数据
     */
    getFactorCodeAndName() {
      this.$contract.getFactorCodeAndName().then((res) => {
        if (res.returnCode === "0") {
          this.indexTypeOptions = res.object.map((item) => {
            return { value: item.factorCode, label: item.factorName };
          });
        } else {
          this.$messageCom(
            "error",
            "获取数据失败，失败原因：" + res.returnMessage,
            "1500"
          );
        }
        this.tableLoading = false;
      });
    },
    /**
     * 查询按钮
     */
    queryForm() {
      this.page = 1;
      this.queryParams();
    },
    /**
     * 分页数量改变触发方法
     */
    handleSizeChange(val) {
      this.sizeVal = val;
      this.page = 1;
      this.queryParams();
    },
    /**
     * 分页页码改变触发方法
     */
    pageChange(val) {
      this.page = val;
      this.queryParams();
    },
    /**
     * 分页展示指标同步任务记录参数处理
     */
    queryParams() {
      let params = {
        indexType: this.formInline.indexType,
        period: this.formInline.period,
        kfCode: this.formInline.kfCode,
        current: this.page,
        size: this.sizeVal,
      };
      this.getAdviceData(params);
    },
    /**
     * 众包酬金结算数据分页展示
     * params：查询参数
     */
    getAdviceData(params) {
      this.tableLoading = true;
      this.$contract.getAdviceData(params).then((res) => {
        if (res.returnCode === "0") {
          this.total = res.totalCount;
          this.tableData = res.beans;
        } else {
          this.$messageCom(
            "error",
            "获取数据失败，失败原因：" + res.returnMessage,
            "1500"
          );
        }
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

