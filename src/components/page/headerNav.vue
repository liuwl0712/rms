<!--
 * @Descripttion: 
 * @version: 
 * @Author: liuwl
 * @Date: 2021-06-03 14:36:20
 * @LastEditTime: 2021-07-08 15:34:58
-->
<template>
  <div>
    <el-menu
      :default-active="activeIndex"
      @select="handleSelect"
      class="header-menu-demo"
      mode="horizontal"
      background-color="#001529"
      text-color="#fff"
      active-text-color="#ffd04b"
    >
      <el-menu-item
        v-for="item in menuList"
        :key="item.id"
        v-if="item.children.length == 0"
        :index="item.index"
        :disabled="!hasPerms(item.index)"
      >
        <span slot="title">{{item.name}}</span>
      </el-menu-item>
      <el-submenu
        v-for="item in menuList"
        v-if="item.children.length>0"
        :index="item.index"
        :key="item.id"
        :disabled="!hasPerms(item.index)"
      >
        <template slot="title">
          <span slot="title">{{item.name}}</span>
        </template>
        <el-menu-item
          v-for="children in item.children"
          :key="children.id"
          :index="children.index"
          :disabled="!hasPerms(children.index)"
        >{{children.name}}</el-menu-item>
      </el-submenu>
    </el-menu>
  </div>
</template>
<script>
import menu from "@/assets/json/headerMenu.json";
// 禁用判断
import { hasPermission } from "@/permission/index.js";
export default {
  data() {
    return {
      //菜单激活名称
      activeIndex: "homePage",
      //菜单列表
      menuList: [],
    };
  },
  /**
   * 监听路由变化，激活对应菜单目录
   */
  watch: {
    $route: function (to) {
      this.activeIndex = to.name;
    },
  },
  /**
   * 页面初始化触发created生命周期，完成了 data 数据的初始化，el没有
   */
  created() {
    this.menuList = menu;
  },
  /**
   * 存放一些函数，供调用
   */
  methods: {
    /**
     * 菜单激活回调
     * key: 选中菜单项的 index, keyPath: 选中菜单项的 index path
     * 路由跳转
     */
    handleSelect(key, keyPath) {
      this.$router.push("/" + key);
    },
    hasPerms: function (perms) {
      // 根据权限标识和外部指示状态进行权限判断
      return hasPermission(perms); //& !this.disabled
    },
  },
};
</script>