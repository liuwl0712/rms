<!--
 * @Descripttion: 
 * @version: 
 * @Author: liuwl
 * @Date: 2021-06-03 14:57:20
 * @LastEditTime: 2021-06-09 16:58:05
-->
<template>
  <div>
    <div class="Breadcrumb_title">系统管理 > Tab管理</div>
    <div>
      <el-form
        :inline="true"
        :model="formInline"
        ref="formInline"
        class="my-form-dom1"
      >
        <el-form-item
          label="Tab名称"
          prop="tabName"
        >
          <el-input
            v-model="formInline.tabName"
            placeholder="请输入Tab名称"
            clearable
          ></el-input>
        </el-form-item>
        <el-form-item
          label="Tab状态"
          prop="tabState"
        >
          <el-select
            v-model="formInline.tabState"
            placeholder="请选择Tab状态"
            clearable
          >
            <el-option
              label="可用"
              value="E"
            ></el-option>
            <el-option
              label="禁用"
              value="D"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item class="form-item-btn">
          <el-button
            type="primary"
            icon="el-icon-search"
          >查询</el-button>
          <el-button
            @click="resetForm('formInline')"
            icon="el-icon-refresh"
          >重置</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="my-operation-btn">
      <el-button
        type="primary"
        icon="el-icon-plus"
      >新增Tab菜单</el-button>
      <el-popconfirm title="确定删除所选的Tab菜单吗？">
        <el-button
          slot="reference"
          type="danger"
          icon="el-icon-delete"
        >删除Tab菜单</el-button>
      </el-popconfirm>
    </div>
    <el-table
      :data="tableData"
      border
      row-key="id"
      default-expand-all
      :tree-props="{children: 'children'}"
    >
      <el-table-column
        type="selection"
        width="50"
        align="center"
      >
      </el-table-column>
      <el-table-column
        prop="tabName"
        label="Tab名称"
      >
      </el-table-column>
      <el-table-column
        prop="parentTabName"
        label="Tab归属"
        align="center"
      >
      </el-table-column>
      <el-table-column
        prop="sortId"
        label="Tab排列序号"
        align="center"
      >
      </el-table-column>
      <el-table-column
        prop="tabState"
        label="Tab状态"
        align="center"
      >
        <template slot-scope="scope">
          <div v-if="scope.row.tabState==='E'">
            <div class="zt-radius dd"></div><span>可用</span>
          </div>
          <div v-else>
            <div class="zt-radius zt"></div><span>禁用</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column
        prop="crtTime"
        label="创建时间"
        width="200"
      >
      </el-table-column>
      <el-table-column
        label="操作"
        width="100"
        align="center"
      >
        <template>
          <el-link icon="el-icon-edit">编辑</el-link>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>
<script>
export default {
  data() {
    return {
      formInline: {
        tabName: "",
        tabState: "E",
      },
      tableData: [
        {
          id: "1",
          tabName: "系统管理",
          parentTabName: "根目录",
          sortId: "1",
          tabState: "E",
          crtTime: "2021-06-03 15:30:00",
          children: [
            {
              id: "11",
              tabName: "Tab管理",
              parentTabName: "系统管理",
              sortId: "1",
              tabState: "E",
              crtTime: "2021-06-03 15:30:00",
              children: [],
            },
            {
              id: "12",
              tabName: "用户管理",
              parentTabName: "系统管理",
              sortId: "2",
              tabState: "E",
              crtTime: "2021-06-03 15:30:00",
              children: [],
            },
            {
              id: "13",
              tabName: "组织管理",
              parentTabName: "系统管理",
              sortId: "3",
              tabState: "E",
              crtTime: "2021-06-03 15:30:00",
              children: [],
            },
            {
              id: "14",
              tabName: "角色管理",
              parentTabName: "系统管理",
              sortId: "4",
              tabState: "D",
              crtTime: "2021-06-03 15:30:00",
              children: [],
            },
          ],
        },
      ],
    };
  },
  methods: {
    /**
     * 重置按钮触发方法
     */
    resetForm(form) {
      this.$refs[form].resetFields();
    },
  },
};
</script>