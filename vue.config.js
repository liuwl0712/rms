/*
 * @Descripttion:
 * @version:
 * @Author: liuwl
 * @Date: 2020-07-22 09:48:13
 * @LastEditTime: 2021-07-30 11:03:23
 */
const webpack = require("webpack");
module.exports = {
  // 基本路径
  publicPath: "./",
  productionSourceMap: false, //去除打包后的文件含有 js.map 文件。
  devServer: {
    port: 8000,
    proxy: {
      //配置跨域
      "/api": {
        target: "http://localhost:18080/", //本地
        changOrigin: true, //允许跨域
        pathRewrite: {
          /**
           *重写路径，当我们在浏览器中看到请求的地址为：http://localhost:8888/api/...... 时
           *实际上访问的地址是：http://localhost:18080/......,因为重写了 /api
           */
          "^/api": "",
        },
      },
    },
  },
  lintOnSave: false,

  configureWebpack: {
    devtool: "source-map",
  },
  css: {
    loaderOptions: {
      css: {
        // options here will be passed to css-loader
      },
      postcss: {
        // options here will be passed to postcss-loader
        plugins: [
          require("postcss-px2rem")({
            remUnit: 192,
          }),
        ],
      },
    },
  },
  configureWebpack: {
    plugins: [
      new webpack.optimize.MinChunkSizePlugin({
        minChunkSize: 100000, // 通过合并小于 minChunkSize 大小的 chunk，将 chunk 体积保持在指定大小限制以上
      }),
    ],
  },
};
