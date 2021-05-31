$(function () {
    // console.log(45);
    initArtcateList();

    function initArtcateList() {
        $.ajax({
            url: '/my/article/cates',
            method: 'get',
            success: function (res) {
                console.log(res);
                if (res.status !== 0) {
                    return layui.layer.msg(res.message, { icon: 5 });
                }
                // layui.layer.msg(res.message, { icon: 6 });

                var htmlStr = template('tpl-list', res);
                $('tbody').html(htmlStr);
            }
        })
    }
    // 添加分类
    var indexAdd = null;

    $('#btnAddCate').on('click', function () {
        // 弹出模态框
        indexAdd = layui.layer.open({
            type: 1,
            title: '信息',
            area: ['500px', '300px'],
            content: $('#dialog-add').html(),
        })
    })

    // 完成分类的添加
    $('body').on('submit', '#form-add', function (e) {
        e.preventDefault();

        var data = $(this).serialize();
        // 调接口
        $.ajax({
            url: '/my/article/addcates',
            method: 'post',
            data: data,
            success: function (res) {
                console.log(res);
                if (res.status !== 0) {
                    return layui.layer.msg(res.message, { icon: 5 });
                }
                layui.layer.msg(res.message, { icon: 6 });

                // 关闭模态框
                layui.layer.close(indexAdd);
                // 重新获取数据重新渲染页面
                initArtcateList();

            }
        })
    })

    // 编辑功能

    var indexEdit = null;
    $('body').on('click', '.btn-edit ', function () {
        indexEdit = layui.layer.open({
            type: 1,
            title: '编辑分类',
            area: ['500px', '300px'],
            content: $('#dialog-edit').html(),
        })

        // 把分类信息渲染到表单中
        var id = $(this).attr('data-id');
        console.log(id);
        // 根据id获取编辑分类信息
        $.ajax({
            url: '/my/article/cates/' + id,
            method: 'get',
            success: function (res) {
                layui.form.val('form-edit', res.data);
            }
        })

        // 完成编辑功能
        $('body').on('submit', '#form-edit', function (e) {
            e.preventDefault();

            var data = $(this).serialize();

            $.ajax({
                url: '/my/article/updatecate',
                method: 'post',
                data: data,
                success: function (res) {
                    if (res.status !== 0) {
                        return layui.layer.msg(res.message, { icon: 5 });
                    }
                    layui.layer.msg(res.message, { icon: 6 });

                    // 关闭模态框
                    layui.layer.close(indexEdit);
                    // 重新渲染页面
                    initArtcateList();
                }
            })
        })



    })

    // 删除分类
    $('tbody').on('click', '.btn-delete', function () {
        // 获取被删除的id
        var id = $(this).attr('data-id');

        layui.layer.confirm('确定要删除吗?', { icon: 3, title: '提示' }, function (index) {
            //do something
            $.ajax({
                url: '/my/article/deletecate/' + id,
                method: 'get',
                success: function (res) {
                    if (res.status !== 0) {
                        return layui.layer.msg(res.message, { icon: 5 });

                    }
                    layui.layer.msg(res.message, { icon: 6 });
                    // 重新渲染
                    initArtcateList();
                }
            })

            // 关闭 confirm 询问框
            layer.close(index)
        })
    })
})