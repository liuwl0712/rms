/*
 * @Descripttion:
 * @version:
 * @Author: liuwl
 * @Date: 2021-06-22 11:22:21
 * @LastEditTime: 2021-06-22 11:22:54
 */
import store from "@/store/index.js";

/**
 * 判断是否有按钮权限。根据传入的权限标识，查看是否存在于用户的权限标识集合内。
 */
export function hasPermission(perms) {
  let hasPermission = false;
  let permission = store.state.permission;
  for (var i = 0; i < permission.length; i++) {
    if (permission[i] === perms) {
      hasPermission = true;
      break;
    }
  }
  return hasPermission;
}
