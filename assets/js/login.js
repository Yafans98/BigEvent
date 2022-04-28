$(() => {
  //点击去注册账号的连接
  $('#link-reg').on('click', function () {
    $('.loginBox').hide();
    $('.regBox').show();
  });

  $('#link-login').on('click', function () {
    $('.loginBox').show();
    $('.regBox').hide();
  });

  //从layui中获取form对象
  let form = layui.form;
  //layer变量，用来弹出消息
  let layer = layui.layer;

  //通过form.verify函数自定义校验规则
  form.verify({
    //自定义了一个叫做pwd的校验规则
    pwd: [/^[\S]{6,12}$/, '密码必须6到12位，且不能出现空格'],
    // 校验两次密码是否一致
    repwd: function (value) {
      //通过形参拿到的是确认密码框中的内容
      //还需要密码框中的内容然后进行一次相等的判断
      //如果判断失败则return一个错误消息提示即可
      let pwd = $('.regBox [name=password]').val();
      if (pwd !== value) {
        return '两次密码不一致！'
      }
    }
  });

  //监听注册表单的提交事件
  $('#form_reg').on('submit', function (e) {
    //阻止默认刷新页面的行为
    e.preventDefault();
    $.ajax({
      type: 'POST',
      url: '/api/reguser',
      data: {
        username: $('#form_reg [name=username]').val(),
        password: $('#form_reg [name=password]').val()
      },
      success: (res) => {
        if (res.status !== 0) {
          return layer.msg(res.message);
        }
        layer.msg('注册成功，请登录！');
        //模拟人的点击行为
        $('#link-login').click();
      }
    })
  });

  //调用接口发起登录请求
  $('#form_login').submit(function (e) {
    e.preventDefault();
    $.ajax({
      url: '/api/login',
      method: 'POST',
      //快速获取表单中元素
      data: $(this).serialize(),
      success: res => {
        if (res.status !== 0) {
          layer.msg('登录失败！')
        }
        layer.msg('登录成功！');
        //将token存到本地存储内，以便之后使用
        localStorage.setItem('token', res.token);
        //跳转到后台主页
        location.href = '/index.html';
      }
    })
  })
})