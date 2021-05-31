$(function () {
    var q = {
        pagenum: 1,
        pagesize: 3,
        cate_id: '',
        state: '',
    }

    // 渲染文章数据
    // console.log(45);
    initArtList();
    

    function initArtList() {

        $.ajax({
            url: '/my/article/list',
            method: 'get',
            data:q,
            success: function (res) {
                // console.log(res);
                if (res.status !== 0) {
                    return layui.layer.msg(res.message, { icon: 5 });
                }
                var htmlStr = template('tpl-list', res);
                // console.log(htmlStr);
                $('tbody').html(htmlStr);

                // 分页按钮
                rendenPage(res.total);
            }
        })
    }

    // 文章筛选

    initCate();

    function initCate() {
        // 获取所有分类
        $.ajax({
            url: '/my/article/cates',
            method: 'get',
            success: function (res) {
                // console.log(res);
                if (res.status !== 0) {
                    return layui.layer.msg(res.message, { icon: 5 });
                }
                // 渲染到下拉列表里
                var htmlStr = template('tpl-cate', res);
                // console.log(htmlStr)
                $('[name=cate_id]').html(htmlStr);
                // 手动重新渲染表单
                layui.form.render();
            }
        })
    }

    // 筛选功能
    $('#form-search').on('submit', function (e) {
        e.preventDefault();

        // 收集数据
        var cate_id = $('[name = cate_id]').val();
        var state = $('[name = state]').val();
        // console.log(state, cate_id);

        q.cate_id = cate_id;
        q.state = state;
        // 重新渲染
        initArtList();

    })


    // 渲染分页按钮
    function rendenPage(total) {
        layui.laypage.render({
            elem: 'pageBox',  // 分页按钮渲染到的日期
            count: total,  /// 数据总数
            limit: q.pagesize,   // 每页显示的条数
            curr: q.pagenum,   // 当前页码
            limits:[3,6,9,12,15], // 每页显示多少条的选项
            layout:['limit','page','prev','next','count','skip'],  // 页码的排版
            jump: function (obj, first) {
                // 切换页码时调用此函数，first的值是 undefined
                // 渲染分页按钮时，也会调用此函数 first的值是 true

                // console.log(obj);
                // obj 参数 分页参数对象 (obj.limit ,  obj.curr,  obj.count)

                if (first) {
                    return;
              }
              // 获取最新页码值，修改参数对象q
                q.pagenum = obj.curr;
              // 获取最新每页显示的条数，修改参数对象q
                q.pagesize = obj.limit;

                // 重新渲染数据
                initArtList();
            }
            
        })
    }

    // 删除文章
    $('tbody').on('click', '.btn-delete', function () {
        var id = $(this).attr('data-id');

        var len = $('.btn-delete').length;

        // 询问
        layer.confirm('确定要删除?', { icon: 3, title: '提示' }, function (index) {
            //do something  调接口
            $.ajax({
                url: '/my/article/delete/'+id,
                method: 'get',
                success: function (res) {
                    console.log(res);
                    if (res.status !== 0) {
                        return layui.layer.msg(res.message, { icon: 5 });
                    }
                    layui.layer.msg(res.message, { icon: 6 });

                    if (len === 1) { // 如果当前已经是第一页，就不用减1
                        q.pagenum = q.pagenum === 1 ? 1 : q.pagenum - 1;
                    }

                    // 重新渲染页面
                    initArtList();
                }
            })

            layer.close(index);
        });
    })

    //  编辑文章

    $('tbody').on('click', '.btn-edit', function () {
        var id = $(this).attr('data-id');

        location.href = '/article/art-edit.html?id=' + id;
    })
})