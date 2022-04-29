$(() => {
  //调用函数获取用户基本信息
  getUserInfo();
  const layer = layui.layer;
  //实现退出功能
  $('#logout').on('click', function () {
    //提示用户是否确认退出
    layer.confirm('确定退出登录？', { icon: 3, title: '提示' }, function (index) {
      //1.清空存储中的token
      localStorage.removeItem('token');
      //2.跳转到登录页
      location.href = '/login.html';
      //关闭confirm询问框
      layer.close(index);
    });
  })
})


//获取用户基准信息
function getUserInfo() {
  $.ajax({
    method: 'GET',
    url: '/my/userinfo',
    //headers 就是请求头配置对象
    success: res => {
      if (res.status !== 0) {
        return layui.layer.msg('获取信息失败！');
      }
      renderAvatar(res.data);
    },
  })
}


//渲染用户头像
function renderAvatar(user) {
  //是否拥有nickname
  let name = user.nickname || user.username;
  //设置欢迎文本
  $('#welcome').html('欢迎&nbsp;&nbsp;' + name);
  //按需渲染用户头像
  if (user.user_pic !== null) {
    //渲染图片头像
    $('.layui-nav-img').attr('src', user.user_pic).show();
    $('.text-avatar').hide();
  }
  else {
    //渲染文本头像
    $('.layui-nav-img').hide();
    let first = name[0].toUpperCase();
    $('.text-avatar').html(first).show();
  }
}