<!--
 * @Descripttion: 
 * @version: 
 * @Author: liuwl
 * @Date: 2021-05-27 09:42:38
 * @LastEditTime: 2021-07-01 11:23:20
-->
<template>
  <div style="text-align: center;">
    <el-image
      :src="require('@/assets/img/zwqx.png')"
      class="error-401"
    ></el-image>
  </div>
</template>
<script>
export default {
  created() {
    this.$message.error({
      message: "您没有此页面权限，页面找不到。。。",
      center: true,
      showClose: true,
      duration: 1000,
    });
  },
};
</script>