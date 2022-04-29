//每次调用ajax相关接口时，会先调用这个函数
//可以拿到一些配置项，比如公有的url开头等
$.ajaxPrefilter(function (options) {
  //发起真正的ajax请求之前，统一拼接根路径
  options.url = 'http://www.liulongbin.top:3007' + options.url;

  //统一为有权限的接口设置headers请求
  //需要权限的请求以/my开头
  if (options.url.indexOf('/my/') !== -1) {
    options.headers = {
      Authorization: localStorage.getItem('token') || ''
    }
  }

  //全局统一挂载 complete回调函数
  options.complete = res => {
    //无论最终成功还是失败，最终都会调用complete函数
    //在complete回调函数中，可以使用res.responseJSON拿到服务器响应回来的数据
    if (res.responseJSON.status === 1 && res.responseJSON.message === '身份认证失败！') {
      //1.清空token
      localStorage.removeItem('token');
      //2.强制跳转到登录页面
      location.href = '/login.html'
    }
  }
})