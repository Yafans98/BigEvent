$(() => {
  initArtCateList();
  const layer = layui.layer;
  const form = layui.form;
  //1.获取文章分类列表
  function initArtCateList() {
    $.ajax({
      method: 'GET',
      url: '/my/article/cates',
      success: res => {
        //将数据渲染到模板引擎中
        let htmlStr = template('tpl-table', res);
        $('tbody').html(htmlStr);
      }
    })
  }
  //为添加类别按钮绑定点击事件
  let indexAdd = null;
  $('#btnAddCate').on('click', function () {
    //每次创建一个曾会返回一个索引值
    indexAdd = layer.open({
      //弹出层样式
      type: 1,
      //弹出层宽高
      area: ['500px', '250px'],
      title: '添加文章分类',
      //拿到script标签中的html结构
      content: $('#dialog-add').html()
    });
  })

  //因为编辑和删除都是点击后才出现表单，所以无法直接给按钮绑定事件
  //通过代理形式，为表单绑定submit事件
  $('body').on('submit', '#form-add', function (e) {
    e.preventDefault();
    $.ajax({
      method: 'POST',
      url: '/my/article/addcates',
      data: $(this).serialize(),
      success: res => {
        if (res.status !== 0) {
          layer.msg('新增分类失败')
        }
        layer.msg('新增分类成功');
        //重新渲染
        initArtCateList();
        //根据索引关闭对应弹出层
        layer.close(indexAdd);
      }
    })
  })

  let indexEdit = null;
  //通过代理形式，为编辑按钮绑定点击事件
  $('tbody').on('click', '.btn-edit', function () {
    //弹出一个修改文章信息的层
    indexEdit = layer.open({
      //弹出层样式
      type: 1,
      //弹出层宽高
      area: ['500px', '250px'],
      title: '修改',
      //拿到script标签中的html结构
      content: $('#dialog-edit').html()
    });
    let id = $(this).attr('data-id');
    //发起请求获取对应分类的数据
    $.ajax({
      method: 'GET',
      url: '/my/article/cates/' + id,
      success: res => {
        form.val('form-edit', res.data)
      }
    })
  })

  //通过代理形式，为修改分类的表单绑定submit事件
  $('body').on('submit', '#form-edit', function (e) {
    e.preventDefault();
    $.ajax({
      method: 'POST',
      url: '/my/article/updatecate',
      data: $(this).serialize(),
      success: res => {
        if (res.status !== 0) {
          return layer.msg('更新分类数据失败');
        }
        layer.msg('更新数据成功!');
        //关闭弹出层
        layer.close(indexEdit);
        initArtCateList();
      }
    })
  })

  //通过代理形式，为删除按钮绑定delete事件
  $('tbody').on('click', '#btn-delete', function (e) {
    let id = $(this).attr('data-id');
    //提示用户是否要删除
    layer.confirm('确认删除?', { icon: 3, title: '提示' }, function (index) {
      $.ajax({
        method: 'GET',
        url: '/my/article/deletecate/' + id,
        success: res => {
          if (res.status !== 0) {
            return layer.msg('删除分类失败!');
          }
          layer.msg('删除分类成功！')
          layer.close(index);
          //重新渲染页面
          initArtCateList();
        }
      })
    })
  })
})