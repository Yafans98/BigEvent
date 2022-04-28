//每次调用ajax相关接口时，会先调用这个函数
//可以拿到一些配置项，比如公有的url开头等
$.ajaxPrefilter(function (options) {
  //发起真正的ajax请求之前，统一拼接根路径
  options.url = 'http://www.liulongbin.top:3007' + options.url;
})