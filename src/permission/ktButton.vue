<!--
 * @Descripttion: 
 * @version: 
 * @Author: liuwl
 * @Date: 2021-06-22 11:23:08
 * @LastEditTime: 2021-07-02 15:53:10
-->
<template>
  <el-button
    :size="size"
    :type="type"
    :loading="loading"
    :disabled="!hasPerms(perms)"
    @click="handleClick"
    :icon="icon"
  >
    {{label}}
  </el-button>
</template>
<script>
// 禁用判断
import { hasPermission } from "@/permission/index.js";
export default {
  name: "KtButton",
  props: {
    label: {
      // 按钮显示文本
      type: String,
      default: "Button",
    },
    size: {
      // 按钮尺寸
      type: String,
      default: null,
    },
    type: {
      // 按钮类型
      type: String,
      default: null,
    },
    loading: {
      // 按钮加载标识
      type: Boolean,
      default: false,
    },
    disabled: {
      // 按钮是否禁用
      type: Boolean,
      default: false,
    },
    icon: {
      // 按钮图标
      type: String,
      default: null,
    },
    perms: {
      // 按钮权限标识，外部使用者传入
      type: String,
      default: null,
    },
  },
  data() {
    return {};
  },
  methods: {
    handleClick: function () {
      // 按钮操作处理函数
      if (this.hasPerms(this.perms)) {
        this.$emit("click", {});
      }
    },
    hasPerms: function (perms) {
      // 根据权限标识和外部指示状态进行权限判断
      return hasPermission(perms); //& !this.disabled
    },
  },
  mounted() {},
};
</script>