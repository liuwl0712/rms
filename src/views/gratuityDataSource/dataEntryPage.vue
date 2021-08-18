<!--
 * @Descripttion: 
 * @version: 
 * @Author: liuwl
 * @Date: 2021-06-09 14:32:40
 * @LastEditTime: 2021-07-28 11:39:40
-->
<template>
  <div>
    <div class="Breadcrumb_title">酬金数据源&nbsp;&nbsp;&nbsp;&nbsp;>&nbsp;&nbsp;&nbsp;&nbsp;数据录入</div>
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
            :current-node-key="1"
            @node-click="handleNodeClick"
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
              label="名称"
              prop="infoName"
            >
              <el-input
                v-model="formInline.infoName"
                placeholder="请输入名称"
                clearable
              ></el-input>
            </el-form-item>
            <el-form-item
              label="表名"
              prop="tabName"
            >
              <el-input
                v-model="formInline.tabName"
                placeholder="请输入表名"
                clearable
              ></el-input>
            </el-form-item>
            <el-form-item
              label="众包结算导入"
              prop="type"
            >
              <el-select
                v-model="formInline.type"
                placeholder="请选择角色"
              >
                <el-option
                  v-for="item in typeOptions"
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
            prop="infoName"
            label="名称"
            align="center"
            min-width="160"
            show-overflow-tooltip
          >
          </el-table-column>
          <el-table-column
            prop="tabName"
            label="表名"
            align="center"
            min-width="160"
            show-overflow-tooltip
          >
          </el-table-column>
          <el-table-column
            prop="type"
            label="众包结算导入"
            align="center"
            min-width="120"
            show-overflow-tooltip
          >
            <template slot-scope="scope">
              <span v-if="scope.row.type === '1'">员工基础信息</span>
              <span v-else-if="scope.row.type === '2'">备份信息</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="dataCycle"
            label="数据类型"
            align="center"
            min-width="120"
            show-overflow-tooltip
          >
            <template slot-scope="scope">
              <span v-if="scope.row.dataCycle === '1'">周</span>
              <span v-else-if="scope.row.dataCycle === '2'">月</span>
              <span v-else-if="scope.row.dataCycle === '3'">年</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="opCode"
            label="创建人"
            align="center"
            min-width="120"
            show-overflow-tooltip
          >
          </el-table-column>
          <el-table-column
            prop="workCode"
            label="业务人员"
            align="center"
            min-width="120"
            show-overflow-tooltip
          >
          </el-table-column>
          <!-- <el-table-column
            prop="auditState"
            label="是否已审核"
            align="center"
            min-width="140"
            show-overflow-tooltip
          >
            <template slot-scope="scope">
              <span v-if="scope.row.auditState === '1'">是</span>
              <span v-if="scope.row.auditState === '0'">否</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="invalidTime"
            label="失效时间"
            align="center"
            min-width="160"
            show-overflow-tooltip
          >
          </el-table-column> -->
          <el-table-column
            label="操作"
            align="center"
            min-width="240"
            fixed="right"
          >
            <template slot-scope="scope">
              <el-link
                icon="el-icon-view"
                @click="openDialog('toView',scope.row)"
              >查看</el-link>
              <el-link
                icon="el-icon-upload2"
                @click="openDialog('upload',scope.row)"
              >上传</el-link>
              <el-link
                icon="el-icon-edit-outline"
                @click="openDialog('theLog',scope.row)"
              >日志</el-link>
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
      </el-col>
    </el-row>
    <el-dialog
      :title="dialogTitle"
      :visible.sync="dialogVisible"
      :width="dialogWidth"
      append-to-body
      :close-on-click-modal="false"
      custom-class="dialog-min-height-500"
    >
      <data-entry-dialog
        :item="passItem"
        v-if="dialogShow"
        @widthChange="widthChange"
      >
      </data-entry-dialog>
    </el-dialog>
  </div>
</template>
<script>
import dataEntryDialog from "./components/dataEntryDialog.vue";
export default {
  name: "staffInformationPage",
  components: {
    "data-entry-dialog": dataEntryDialog,
  },
  data() {
    return {
      //查询表单
      formInline: {
        infoName: "",
        tabName: "",
        type: "1",
      },
      //众包结算导入下拉选
      typeOptions: [],
      //表格数据
      tableData: [],
      //表格Loading
      tableLoading: false,
      //数据列表条数
      total: null,
      //查询每页个数
      sizeVal: 10,
      //查询页码
      page: 1,
      //模态框标题
      dialogTitle: "",
      // 模态框宽度
      dialogWidth: "4.55rem",
      //模态框是否打开
      dialogVisible: false,
      dialogShow: false,
      //传递模态框里的值
      passItem: {
        type: null,
        row: null,
      },
    };
  },
  created() {
    this.getStaticDataByCodeType("CROWDSOURCING_SETTLEMENT_IMPORT");
    this.queryForm();
  },
  methods: {
    /**
     * 查询静态数据
     * item：静态数据的codeType
     */
    getStaticDataByCodeType(item) {
      this.$contract.getStaticDataByCodeType(item).then((res) => {
        if (res.returnCode === "0") {
          this.typeOptions = res.object.map((item) => {
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
     * 分页展示录入数据参数处理
     */
    queryParams() {
      let params = {
        infoName: this.formInline.infoName,
        tabName: this.formInline.tabName,
        type: this.formInline.type,
        current: this.page,
        size: this.sizeVal,
      };
      this.getDataList(params);
    },
    /**
     * 分页展示录入数据调用接口
     * params：查询参数
     */
    getDataList(params) {
      this.tableLoading = true;
      this.$contract.getDataList(params).then((res) => {
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
    /**
     * 表格操作按钮，打开模态框
     * type：操作类型、row：当前行的数据
     */
    openDialog(type, row) {
      this.widthChange(type);
      this.dialogTitle = row.infoName;
      this.passItem.type = type;
      this.passItem.row = row;
      this.dialogVisible = true;
      this.dialogShow = false;
      this.$nextTick(() => {
        this.dialogShow = true;
      });
    },
    /**
     * 模态框宽度改变
     */
    widthChange(item) {
      if (item != "upload") {
        this.dialogWidth = "7.5rem";
      } else {
        this.dialogWidth = "4.55rem";
      }
    },
    /**
     * 树节点被点击时的回调
     * 传递给 data 属性的数组中该节点所对应的对象
     */
    handleNodeClick(data) {
      this.formInline.type = data.id;
      this.queryParams();
    },
  },
};
</script>