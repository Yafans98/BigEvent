$(() => {
  let form = layui.form;
  let layer = layui.layer;
  // 1. 初始化图片裁剪器
  const $image = $('#image')

  // 2. 裁剪选项
  const options = {
    aspectRatio: 400 / 280,
    preview: '.img-preview'
  }

  // 3. 初始化裁剪区域
  $image.cropper(options)
  initCate();
  initEditor();
  //定义加载文章分类的方法
  function initCate() {
    $.ajax({
      method: 'GET',
      url: '/my/article/cates',
      success: res => {
        if (res.status !== 0) {
          return layer.msg('初始化文章分类失败!');
        }
        //调用模板引擎，渲染下拉菜单
        let htmlStr = template('tpl-cate', res);
        $('[name=cate_id]').html(htmlStr);
        //调用form.render方法重新渲染
        form.render();
      }
    })
  }

  //点击选择文件时，触发file的点击事件
  $('#btnChooseImage').on('click', () => {
    $('#coverFile').click();
  })

  //监听coverFile的change事件，获取用户选择的文件列表
  $('#coverFile').on('change', function (e) {
    //获取到文件列表数组
    let files = e.target.files;
    if (files.length === 0) {
      return
    }
    //根据文件创建对应URL地址
    let newImgURL = URL.createObjectURL(files[0]);
    //为裁剪区域重新设计图片
    $image
      .cropper('destroy')      // 销毁旧的裁剪区域
      .attr('src', newImgURL)  // 重新设置图片路径
      .cropper(options)        // 重新初始化裁剪区域
  })

  //定义文章的发布状态
  let art_state = '已发布';
  //为存为草稿按钮，绑定点击事件函数
  $('#btnSave2').on('click', function () {
    art_state = '草稿';
  })

  //为表单绑定submit提交事件
  $('#form-pub').on('submit', function (e) {
    e.preventDefault();
    //1.基于form表单,快速创建Formdata对象
    let fd = new FormData($(this)[0]);
    //2.将文章的发布状态存到fd中
    fd.append('state', art_state);
    //3.将封面裁剪过后的图片，输出为一个文件对象
    $image
      .cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
        width: 400,
        height: 280
      })
      .toBlob(function (blob) {       // 将 Canvas 画布上的内容，转化为文件对象
        // 得到文件对象后，进行后续的操作
        // 将文件对象存储到fd中
        fd.append('cover_img', blob);
        //4.发起ajax请求发布文章
        publishArticle(fd);
      })
  })

  //定义一个发表文章的方法
  function publishArticle(fd) {
    $.ajax({
      method: 'POST',
      url: '/my/article/add',
      data: fd,
      //注意，如果向服务器提交的是Formdata格式的数据
      //必须添加以下两个配置项
      contentType: false,
      processData: false,
      success: res => {
        if (res.status !== 0) {
          return layer.msg('发表文章失败');
        }
        layer.msg('发布文章成功!');
        //发布文章成功后，跳转到文章列表页面
        location.href = '/article/art_list.html';
      }
    })
  }
})