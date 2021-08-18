<!--
 * @Descripttion: 
 * @version: 
 * @Author: liuwl
 * @Date: 2021-07-05 10:20:07
 * @LastEditTime: 2021-07-05 10:21:08
-->
<template>
  <div>
    <div class="Breadcrumb_title">{{title1}}&nbsp;&nbsp;&nbsp;&nbsp;>&nbsp;&nbsp;&nbsp;&nbsp;{{title2}}</div>
  </div>
</template>
<script>
export default {
  components: {},
  props: {
    title1: {
      type: String,
    },
    title2: {
      type: String,
    },
  },
  data() {
    return {};
  },
  watch: {},
  computed: {},
  methods: {},
  created() {},
  mounted() {},
};
</script>