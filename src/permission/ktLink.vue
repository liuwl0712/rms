<!--
 * @Descripttion: 
 * @version: 
 * @Author: liuwl
 * @Date: 2021-06-24 10:43:16
 * @LastEditTime: 2021-07-02 15:53:25
-->
<template>
  <el-link
    :icon="icon"
    :disabled="!hasPerms(perms)"
    @click="handleClick"
    :underline="false"
  >
    {{label}}<i :class="iconRight"></i>
  </el-link>
</template>

<script>
// 禁用判断
import { hasPermission } from "@/permission/index.js";
export default {
  name: "ktLink",
  components: {},
  props: {
    label: {
      // 按钮显示文本
      type: String,
      default: null,
    },
    type: {
      // 按钮类型
      type: String,
      default: null,
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
    iconRight: {
      // 按钮右图标
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
  computed: {},
  watch: {},
  created() {},
  mounted() {},
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
};
</script>

