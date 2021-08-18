/*
 * @Descripttion:
 * @version:
 * @Author: liuwl
 * @Date: 2021-06-18 11:31:54
 * @LastEditTime: 2021-06-18 11:39:31
 */
import { Message } from "element-ui";
export function messageCom(msg, title, duration) {
  Message({
    showClose: true,
    type: msg,
    message: title,
    duration: duration,
  });
}
export default messageCom;
