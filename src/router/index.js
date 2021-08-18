/*
 * @Descripttion:
 * @version:
 * @Author: liuwl
 * @Date: 2021-05-17 19:07:37
 * @LastEditTime: 2021-08-12 10:08:35
 */
import Vue from "vue";
import VueRouter from "vue-router";
import { Message } from "element-ui";

const login = () => import("@/views/layoutPage/login.vue");
const home = () => import("@/views/layoutPage/home.vue");
const For01 = () => import("@/views/layoutPage/401.vue");
const homePage = () => import("@/views/layoutPage/homePage.vue");
const timingTask = () => import("@/views/actionBar/timingTaskPage.vue");
const staticManagement = () => import("@/views/actionBar/staticPage.vue");
const dataEntry = () => import("@/views/gratuityDataSource/dataEntryPage.vue");
const indexSynRecord = () => import("@/views/gratuityDataSource/indexSynRecordPage.vue");
const crowdRemDataSettle = () => import("@/views/gratuityDataSource/crowdRemDataSettlePage.vue");
const User = () => import("@/views/systemManagement/userManagement/userPage.vue");
const Role = () => import("@/views/systemManagement/roleManagement/rolePage.vue");
const Coefficient = () => import("@/views/remIndex/coefficientPage.vue");
const index = () => import("@/views/remIndex/indexPage.vue");
const rule = () => import("@/views/remIndex/rulePage.vue");
const ruleManage = () => import("@/views/remRules/ruleManagementPage.vue");
const object = () => import("@/views/remRules/objectManagementPage.vue");
const factor = () => import("@/views/remRules/factorManagementPage.vue");
const template = () => import("@/views/remCalculation/indexTemplatePage.vue");
const satisfaction = () => import("@/views/remCalculation/satisfactionCalculationPage.vue");
const calculation = () => import("@/views/remCalculation/remCalculationPage.vue");
Vue.use(VueRouter);

const router = new VueRouter({
  routes: [
    {
      path: "/",
      redirect: "/login",
    },
    {
      path: "/home",
      name: "home",
      redirect: "/homePage",
      component: home,
      children: [
        {
          path: "/homePage",
          name: "homePage",
          component: homePage,
          meta: {
            needLogin: true,
            needPermissions: false,
          },
        },
        {
          path: "/401",
          name: "401",
          component: For01,
          meta: {
            title: "401",
            needLogin: true,
            needPermissions: false,
          },
        },
        {
          path: "/timing-task",
          name: "timing-task",
          component: timingTask,
          meta: {
            title: "定时任务管理",
            needLogin: true,
            needPermissions: false,
          },
        },
        {
          path: "/static-management",
          name: "static-management",
          component: staticManagement,
          meta: {
            title: "静态资源管理",
            needLogin: true,
            needPermissions: false,
          },
        },
        {
          path: "/data-entry",
          name: "data-entry",
          component: dataEntry,
          meta: {
            title: "数据录入",
            needLogin: true,
            needPermissions: true,
          },
        },
        {
          path: "/index-synchronization-record",
          name: "index-synchronization-record",
          component: indexSynRecord,
          meta: {
            title: "指标同步记录",
            needLogin: true,
            needPermissions: true,
          },
        },
        {
          path: "/crowd-remuner-data-settle",
          name: "crowd-remuner-data-settle",
          component: crowdRemDataSettle,
          meta: {
            title: "众包酬金结算数据",
            needLogin: true,
            needPermissions: true,
          },
        },
        {
          path: "/user-management",
          name: "user-management",
          component: User,
          meta: {
            title: "用户管理",
            needLogin: true,
            needPermissions: true,
          },
        },
        {
          path: "/role-management",
          name: "role-management",
          component: Role,
          meta: {
            title: "角色管理",
            needLogin: true,
            needPermissions: true,
          },
        },
        {
          path: "/configuring-coefficient-management",
          name: "configuring-coefficient-management",
          component: Coefficient,
          meta: {
            title: "折算系数管理",
            needLogin: true,
            needPermissions: true,
          },
        },
        {
          path: "/indicator-management",
          name: "indicator-management",
          component: index,
          meta: {
            title: "指标管理",
            needLogin: true,
            needPermissions: true,
          },
        },
        {
          path: "/indicator-rule-relationship-management",
          name: "indicator-rule-relationship-management",
          component: rule,
          meta: {
            title: "指标规则关系管理",
            needLogin: true,
            needPermissions: true,
          },
        },
        {
          path: "/rule-management",
          name: "rule-management",
          component: ruleManage,
          meta: {
            title: "规则管理",
            needLogin: true,
            needPermissions: true,
          },
        },
        {
          path: "/object-management",
          name: "object-management",
          component: object,
          meta: {
            title: "对象管理",
            needLogin: true,
            needPermissions: true,
          },
        },
        {
          path: "/factor-management",
          name: "factor-management",
          component: factor,
          meta: {
            title: "因子管理",
            needLogin: true,
            needPermissions: true,
          },
        },
        {
          path: "/index-template-management",
          name: "index-template-management",
          component: template,
          meta: {
            title: "指标模板管理",
            needLogin: true,
            needPermissions: true,
          },
        },
        {
          path: "/satisfaction-compensation-calculation",
          name: "satisfaction-compensation-calculation",
          component: satisfaction,
          meta: {
            title: "满意度酬金计算",
            needLogin: true,
            needPermissions: true,
          },
        },
        {
          path: "/remuneration-calculation",
          name: "remuneration-calculation",
          component: calculation,
          meta: {
            title: "酬金计算",
            needLogin: true,
            needPermissions: true,
          },
        },
      ],
    },
    {
      path: "/login",
      name: "login",
      component: login,
      meta: {
        needLogin: false,
        needPermissions: false,
      },
    },
    {
      path: "*",
      redirect: "/401",
    },
  ],
});
//路由导航守卫
router.beforeEach(function(to, from, next) {
  if (to.meta.needLogin) {
    if (sessionStorage.getItem("userInfo")) {
      //  登录权限判断
      let routerName = [];
      if (sessionStorage.getItem("routerName") != null) {
        routerName = sessionStorage.getItem("routerName").split(",");
      }
      if (to.meta.needPermissions) {
        if (routerName.indexOf(to.name) > -1) {
          next();
        } else {
          Message.error({
            message: "您暂无权限访问此页面，请联系管理员。",
            center: true,
            showClose: true,
            duration: 1500,
          });
        }
      } else {
        next();
      }
    } else {
      next({
        name: "login",
      });
    }
  } else {
    next();
  }
});
router.afterEach((to, from, next) => {
  if (document.getElementsByClassName("el-main")[0] != undefined) {
    document.getElementsByClassName("el-main")[0].scrollTo(0, 0);
  }
});
// 解决在VUE中路由遇到Error: Avoided redundant navigation to current location:报错显示是路由重复，
const originalPush = VueRouter.prototype.push;
VueRouter.prototype.push = function push(location) {
  return originalPush.call(this, location).catch((err) => err);
};

export default router;
