<!--
 * @Descripttion: 
 * @version: 
 * @Author: liuwl
 * @Date: 2021-06-28 17:18:21
 * @LastEditTime: 2021-07-15 15:34:40
-->
<template>
  <el-table
    :data="totalData"
    border
    tooltip-effect="light"
    :header-cell-style="{background:'#f5f7fa'}"
    max-height="550"
  >
    <el-table-column
      type="index"
      width="50"
      align="center"
    ></el-table-column>
    <el-table-column
      v-for="item in multiSelectData"
      :key="item.name"
      :prop="item.name"
      :label="item.comment"
      show-overflow-tooltip
      align="center"
      min-width="140"
    >
    </el-table-column>
  </el-table>
</template>
<script>
export default {
  name: "ktTable",
  props: {
    totalData: {
      type: Array,
      default: () => {
        return [];
      },
    },
    multiSelectData: {
      type: Array,
      default: () => {
        return [];
      },
    },
  },
};
</script>