$(() => {
  let form = layui.form;
  let layer = layui.layer;
  form.verify({
    nickname: function (value) {
      if (value.length > 6) {
        return '昵称长度必须在1-6之间！';
      }
    }
  })
  initUserInfo();
  //初始化用户信息
  function initUserInfo() {
    $.ajax({
      method: 'GET',
      url: '/my/userinfo',
      success: res => {
        if (res.status !== 0) {
          return layer.msg('获取用户信息失败！');
        }
        //使用layui提供的form.val()赋值
        //需要给表单加一个lay-filter属性
        form.val('formUserInfo', res.data);
      }
    })
  }

  //重置表单数据
  $('#btnReset').on('click', function (e) {
    //阻止表单的默认重置行为
    e.preventDefault();
    //还原到初始状态即可
    initUserInfo();
  })

  //监听表单提交
  $('.layui-form').on('submit', e => {
    //阻止表单默认提交行为
    e.preventDefault();
    //发起ajax，更新用户数据
    $.ajax({
      method: 'POST',
      url: '/my/userinfo',
      //快速拿到表单数据
      data: $(this).serialize(),
      success: res => {
        if (res.status !== 0) {
          return layer.msg('更新用户信息失败!')
        }
        layer.msg(res.message);
        //调用父页面中方法，重新渲染用户头像和信息
        window.parent.getUserInfo();
      }
    })
  })
})