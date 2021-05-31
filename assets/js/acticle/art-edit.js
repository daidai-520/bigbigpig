$(function () {
    // console.log(55);
    console.log(location.search.substring(1).split('=')[1]);
    var id = location.search.substring(1).split('=')[1];
    console.log(id);
    initCate();

    function initCate() {
        // 获取所有的分类
        $.ajax({
            url: '/my/article/cates',
            method: 'get',
            success: function (res) {
                if (res.status !== 0) {
                    return layui.layer.msg(res.message);
                }
                console.log(res);
                var str = template('tpl', res)
                console.log(str);
                // 重新渲染表单
                $('[name = cate_id]').html(str);
                layui.form.render();
                initArticle();
            }
        })
    }

    // 初始富文本编辑器
    initEditor();


    // 1. 初始化图片裁剪器
    var $image = $('#image')

    // 2. 裁剪选项
    var options = {
        aspectRatio: 400 / 280,
        preview: '.img-preview'
    }

    // 3. 初始化裁剪区域
    $image.cropper(options);

    //  获取文章的详情内容，渲染到页面
    // 渲染完分类下拉列表再调用此函数
    function initArticle() {
        // 调接口
        $.ajax({
            url: '/my/article/' + id,
            method: 'get',
            success: function (res) {
                // console.log(res);
                if (res.status !== 0) {
                    return layui.layer.msg(res.message);
                }
                // 渲染到页面
                layui.form.val('form-edit', res.data);
                // 使用插件的代码，给富文本编辑器赋值
                tinyMCE.activeEditor.setContent(res.data.content);

                // 渲染封面图片到裁剪区域
                $image
                    .cropper('destroy') // 销毁旧的裁剪区域
                    .attr('src', 'http://api-breakingnews-web.itheima.net' + res.data.cover_img) // 重新设置图片路径
                    .cropper(options) // 重新初始化裁剪区域
            }

        })
    }


    // 处理文章封面
    // 点击选择，弹出文件选择框
    $('#btnChooseImage').on('click', function () {
        $('#coverFile').click();
    })

    // 选择图片，跟换裁剪区图片
    $('#coverFile').on('change', function () {
        // 获取文件列表
        var files = $(this)[0].files;
        if (files.length === 0) {
            return layui.layer.msg('请选择文件');
        }
        //  获取选中的文件
        var file = files[0];
        // 把文件转化为可访问路径
        var newImgURL = URL.createObjectURL(file);
        // 跟换裁剪区图片
        $image
            .cropper('destroy') // 销毁旧的裁剪区域
            .attr('src', newImgURL) // 重新设置图片路径
            .cropper(options) // 重新初始化裁剪区域
    })

    // 编辑文章 
    $('#form-adit').on('submit', function (e) {
        e.preventDefault();
        // 收集数据
        var fd = new FormData($(this)[0]);
        console.log(fd);
        // 追加id到fd中
        fd.append('Id', id);
        // 裁剪图片，追加到fd中
        // 4. 将封面裁剪过后的图片，输出为一个文件对象
        $image
            .cropper('getCroppedCanvas', {
                // 创建一个 Canvas 画布
                width: 400,
                height: 280
            })
            .toBlob(function (blob) {
                // 将 Canvas 画布上的内容，转化为文件对象
                // 得到文件对象后，进行后续的操作
                // 5. 将文件对象，存储到 fd 中
                fd.append('cover_img', blob)

                // 调接口，更新文章
                updateArticle(fd);
            })
    })

    function updateArticle(fd) {
        $.ajax({
            url: '/my/article/edit',
            method: 'post',
            data: fd,
            contentType: false,
            processData: false,
            success: function (res) {
                if (res.status !== 0) {
                    return layui.layer.msg(res.message);
                }
                layui.layer.msg(res.message, function () {
                    location.href = '/article/art_list.html'
                });

            }
        })
    }
})