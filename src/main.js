/*
 * @Descripttion:
 * @version:
 * @Author: liuwl
 * @Date: 2021-05-26 13:47:57
 * @LastEditTime: 2021-07-05 10:22:54
 */
import Vue from "vue";
import App from "./App.vue";
//引入封装好的axios
import axios from "axios";
import * as contract from "./utils/contract.js";
//引入element-ui
import ElementUI from "element-ui";
import "element-ui/lib/theme-chalk/index.css";
// 引入vue-router
import router from "./router/index";
// 引入全局sass
import "./assets/css/app.scss";
import "./flexible/flexible.js";
// 引入动画效果库
import animated from "animate.css";
// 引入全局nprogress
import NProgress from "nprogress";
import "nprogress/nprogress.css";
//引入自己封装的消息提示组件
import messageCom from "./components/js/message";
//引入vuex
import store from "./store/index.js";
// 面包屑组件  全局使用
import comBreadcrumb from "@/components/page/comBreadcrumb.vue";
// 权限按钮组件 全局使用
import KtButton from "@/permission/ktButton.vue";
// 权限文字链接组件 全局使用
import KtLink from "@/permission/ktLink.vue";
Vue.component("com-breadcrumb", comBreadcrumb);
Vue.component("kt-button", KtButton);
Vue.component("kt-link", KtLink);
Vue.prototype.$contract = contract;
Vue.prototype.$axios = axios;
Vue.prototype.$NProgress = NProgress;
Vue.prototype.$messageCom = messageCom;
Vue.config.productionTip = false;
Vue.use(ElementUI);
Vue.use(animated);
new Vue({
  render: (h) => h(App),
  router,
  store,
}).$mount("#app");
