$(() => {
  // 1. 初始化图片裁剪器
  var $image = $('#image')

  // 2. 裁剪选项
  var options = {
    aspectRatio: 400 / 280,
    preview: '.img-preview'
  }

  // 3. 初始化裁剪区域
  $image.cropper(options)
  let res = JSON.parse(localStorage.getItem('data'));
  // 初始化富文本编辑器
  initEditor();
  const form = layui.form;
  initEdit();
  //渲染文章内容
  function initEdit() {
    form.val('formArtInfo', res.data);
    //模板引擎渲染
    let htmlStr = template('tpl-artCate', res);
    $('#artCate').html(htmlStr);
    //重新渲染
    form.render();
  }
  //点击选择文件时，触发file的点击事件
  $('#btnChooseImage').on('click', () => {
    $('#coverFile').click();
  })

  //监听coverFile的change事件，获取用户选择的文件列表
  $('#coverFile').on('change', function (e) {
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
  $('#formEdit').on('submit', function (e) {
    e.preventDefault();
    let fd = new FormData($(this)[0]);
    fd.append('Id', res.data.Id);
    fd.append('state', '已发布');
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
        subChange(fd);
        fd.forEach((v, k) => {
          console.log(k, v);
        })
      })
  })

  //提交更改的方法
  function subChange(fd) {
    $.ajax({
      method: 'POST',
      url: '/my/article/edit',
      data: fd,
      //注意，如果向服务器提交的是Formdata格式的数据
      //必须添加以下两个配置项
      contentType: false,
      processData: false,
      success: res => {
        if (res.status !== 0) {
          return layer.msg('修改文章信息失败!');
        }
        layer.msg('修改成功!');
        location.href = './art_list.html'
      }
    })
  }
})