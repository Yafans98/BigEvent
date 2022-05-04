$(() => {
  const layer = layui.layer;
  const form = layui.form;
  const laypage = layui.laypage;
  //定义补零的函数
  function padZero(n) {
    return n > 9 ? n : '0' + n;
  }
  //定义美化时间的过滤器
  template.defaults.imports.dataFormat = function (date) {
    const dt = new Date(date);

    let y = dt.getFullYear();
    let m = padZero(dt.getMonth() + 1);
    let d = padZero(dt.getDate());

    let hh = padZero(dt.getHours());
    let mm = padZero(dt.getMinutes());
    let ss = padZero(dt.getSeconds());

    return y + '-' + m + '-' + d + ' ' + hh + ':' + mm + ':' + ss;
  }

  //定义一个查询参数对象，将来请求数据时需要将其发送到服务器
  let q = {
    pagenum: 1,//页码值，默认请求第一页数据
    pagesize: 2,//每页显示几条数据，默认2
    cate_id: '',//文章分类的Id
    state: ''//文章的发布状态
  }

  initTable();
  initCate();

  //获取文章列表数据的方法
  function initTable() {
    $.ajax({
      method: 'GET',
      url: '/my/article/list',
      data: q,
      success: res => {
        if (res.status !== 0) {
          return layer.msg('获取文章列表失败!');
        }
        //使用模板引擎渲染页面数据
        let htmlStr = template('tpl-table', res);
        $('tbody').html(htmlStr);
        //调用渲染分页的方法
        renderPage(res.total);
      }
    })
  }

  //初始化文章分类的方法
  function initCate() {
    $.ajax({
      method: 'GET',
      url: '/my/article/cates',
      success: res => {
        if (res.status !== 0) {
          return layer.msg('获取文章分类数据失败!');
        }
        //调用模板引擎分类的可选项
        let htmlStr = template('tpl-cate', res);
        $('[name = cate_id]').html(htmlStr);
        //重新渲染一下可选项，通知layui重新渲染表单区域UI结构
        form.render();
      }
    })
  }

  //为筛选表单绑定submit事件
  $('#form-search').on('submit', function (e) {
    e.preventDefault();
    //获取表单中选中项的值
    let cateId = $('[name=cate_id]').val();
    let state = $('[name=state]').val();
    //为查询对象q中对应属性赋值

    q.cate_id = cateId;
    q.state = state;
    console.log(q);
    //重新筛选表格数据
    initTable();
  })

  //定义渲染分页的方法
  function renderPage(total) {
    //调用render方法来渲染分页结构
    laypage.render({
      elem: 'pageBox',//分页容器的id
      count: total,//总数据条数
      limit: q.pagesize,//每页显示多少数据
      curr: q.pagenum,//设置默认被选中的分页
      //layout可以选择layui渲染哪些部分，包括total与跳转等
      layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],
      //修改limit可选范围
      limits: [2, 3, 5, 10],
      //分页发生切换时触发的jump回调函数
      //触发jump回调的方式有两种：
      //1.点击页码时
      //2.只要调用laypage.render方法就会触发回调
      jump: function (obj, first) {
        //把最新页码值赋值给q
        q.pagenum = obj.curr;
        //把最新条目数更新
        q.pagesize = obj.limit;
        //根据最新的q获取对应的数据列表并渲染表格
        //render方法触发jump，first为true
        //只在点击页码时触发jump即可
        if (!first) {
          initTable();
        }
      }
    });
  }

  //通过代理形式，为删除按钮绑定点击事件处理函数
  $('tbody').on('click', '#btn-delete', function () {
    //获取删除按钮的个数
    let len = $('#btn-delete').length;

    //获取当前文章的id
    let id = $(this).attr('data-id')
    //询问用户是否要删除数据
    layer.confirm('确认删除?', { icon: 3, title: '提示' }, function (index) {
      $.ajax({
        method: 'GET',
        url: '/my/article/delete/' + id,
        success: res => {
          if (res.status !== 0) {
            return layer.msg('删除文章失败!');
          }
          layer.msg('删除文章成功!');
          //判断当前页是否仍有数据
          //如果没有剩余数据，则页码值-1后重新渲染数据
          if (len === 1) {
            //如果len的值为1
            //证明删除后页面上没有任何数据
            //实现页码减一的操作
            //页码值最小必须为1
            q.pagenum = q.pagenum === 1 ? q.pagenum : q.pagenum - 1;
          }
          initTable();
        }
      })

      layer.close(index);
    });
  })


  //修改文章分类
  let indexEdit = null;
  $('tbody').on('click', '#btn-edit', function () {
    let id = $(this).parent().siblings('[name=artId]').attr('data-id');
    indexEdit = layer.open({
      type: 2,
      content: './art_edit.html',
      area: ['100%', '100%'],
    })
    $.ajax({
      method: 'GET',
      url: '/my/article/' + id,
      success: res => {
        if (res.status !== 0) {
          return layer.msg('获取文章信息失败!');
        }
        localStorage.setItem('data', JSON.stringify(res));
      }
    })
  })
})