/*
 * @Descripttion:
 * @version:
 * @Author: liuwl
 * @Date: 2021-05-26 13:50:22
 * @LastEditTime: 2021-07-01 10:22:20
 */
/**
 * 网络请求Axios
 * 这里用的是console.log,在项目里使用框架可以直接引用框架里的提示组件
 */
import axios from "axios";
import { Message } from "element-ui";
import router from "../router/index";
import NProgress from "nprogress";

// 错误信息的响应方法
const errorHandle = (status, other) => {
  switch (status) {
    case 400:
      // 请求头和服务器的限制
      Message.error({ message: "服务器不理解请求语法", duration: 1000, showClose: true });
      break;
    case 401:
      // token验证失败
      router.push({ path: "/login" });
      break;
    case 403:
      // 用户身份过期,服务器请求限制
      Message.error({ message: "禁止，服务器拒绝请求", duration: 1000, showClose: true });
      break;
    case 404:
      // 网络请求地址错误
      Message.error({ message: "未找到，服务器找不到请求的网页", duration: 1000, showClose: true });
      break;
    default:
      Message.error({ message: other, duration: 1000, showClose: true });
      break;
  }
  return Promise.reject(status);
};

//创建axios对象
const instance = axios.create({
  baseURL: process.env.VUE_APP_BASEURL, //环境变量接口请求头
  timeout: 60000, //请求超时
});

// 添加请求拦截器
instance.interceptors.request.use(
  (config) => {
    NProgress.start();
    // 在发送请求之前做些什么
    var token;
    if (sessionStorage.getItem("userInfo") == "" || sessionStorage.getItem("userInfo") == null) {
      token = "";
    } else {
      token = JSON.parse(sessionStorage.getItem("userInfo")).token;
    }
    config.headers["Content-Type"] = "application/json";
    config.headers["Authorization"] = token;
    return config;
  },
  (error) => {
    NProgress.done();
    // 对请求错误做些什么
    return Promise.reject(error);
  }
);

// 添加响应拦截器
instance.interceptors.response.use(
  //成功
  /**
   * 成功和失败
   * 1.请求成功和请求失败
   * 2.结果的成功和失败
   */
  (response) => {
    NProgress.done();
    response.status === 200 ? Promise.resolve(response) : Promise.resolve(response);
    return response.data;
  },
  (error) => {
    NProgress.done();
    // 对响应错误做点什么
    const { response } = error; //ES6的解构赋值
    /**
     * response包含的信息
     * status
     * data
     */
    if (response) {
      // 具体错误信息
      errorHandle(response.status, response.data);
    } else {
      Message.error({ message: "请求中断了", duration: 1000, showClose: true });
    }
  }
);
export default instance;
