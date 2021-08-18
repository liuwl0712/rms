/*
 * @Descripttion:
 * @version:
 * @Author: liuwl
 * @Date: 2021-06-22 11:15:15
 * @LastEditTime: 2021-06-22 14:12:19
 */
import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

//创建vue实例
const state = {
  // 设置属性，用于保存后台接口返回的按钮权限数据
  permission: [],
};
const mutations = {
  BTN_PERMISSION(state, permission) {
    //permission 为传入的权限标识集合
    // 传入的权限集合 赋值给状态中的 permission
    state.permission = permission;
  },
};
const actions = {
  BTN_PERMISSION(context, permission) {
    // 提交到 mutation 中的 SET_PERMISSION 函数
    context.commit("BTN_PERMISSION", permission);
  },
};

//导出store
export default new Vuex.Store({
  state,
  mutations,
  actions,
});
