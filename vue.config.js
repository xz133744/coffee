const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  publicPath: './',


  //部署静态网页到github

  assetsDir:'static',
    parallel:false,
    publicPath:'./',
    devServer:{
        port:8090,//端口号
        open:false, //运行时自动打开浏览器
        }
})

var path = require('path')
