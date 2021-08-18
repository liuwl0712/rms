/*
 * @Descripttion:
 * @version:
 * @Author: liuwl
 * @Date: 2021-06-22 15:21:18
 * @LastEditTime: 2021-07-22 16:46:17
 */
/*
 * 是否空数组
 */
export function isArrayEmpty(val) {
  if (val && val instanceof Array && val.length > 0) {
    return true;
  } else {
    return false;
  }
}
/*
 * 验证字符串是否为空（也不能为纯空格）
 * true--说明为空， false--说明不为空
 */
export function isEmptyString(string) {
  if (string == undefined || typeof string == "undefined" || !string || string == null || string == "" || /^\s+$/gi.test(string)) {
    return true;
  } else {
    return false;
  }
}
/*
 * 只支持英文 数字的组合
 */
export function isRegExp(string) {
  let regExp = /^[a-zA-Z0-9]+$/;
  if (!regExp.test(string)) {
    return false;
  } else {
    return true;
  }
}
/*
 * 只支持中文
 */
export function isChinese(string) {
  let regExp = /[^\u4e00-\u9fa5]/;
  if (regExp.test(string)) {
    return false;
  } else {
    return true;
  }
}
/*
 * 验证手机号是否合格
 * true--说明合格
 */
export function isPhone(phoneStr) {
  let myreg = /^[1][3,4,5,7,8,9][0-9]{9}$/;
  if (!myreg.test(phoneStr)) {
    return false;
  } else {
    return true;
  }
}
/*
 * 验证邮箱是否合格
 * true--说明合格
 */
export function isEmail(strEmail) {
  let regExp = /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/;
  if (!regExp.test(strEmail)) {
    return false;
  } else {
    return true;
  }
}
/*
 * 验证只能输入数字和小数点 -- 类似金额
 * true--说明合格
 */
export function isMoney(str) {
  let regExp = /^([1-9][\d]{0,7}|0)(\.[\d]{1,2})?$/;
  if (!regExp.test(str)) {
    return false;
  } else {
    return true;
  }
}
export default { isArrayEmpty, isRegExp, isChinese, isPhone, isEmail, isMoney };
