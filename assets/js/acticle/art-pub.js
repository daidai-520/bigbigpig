$(function () {
    // console.log(45);

    initCata();

    function initCata() {
        $.ajax({
            url: '/my/article/cates',
            method: 'get',
            success: function (res) {
                if (res.status !== 0) {
                    return layui.layer.msg(res.message, { icon: 5 });
                }
                layui.layer.msg(res.message, { icon: 6 });

                //渲染到下拉列表
                var htmlStr = template('tpl-cate', res);

                $('[name=cate_id]').html(htmlStr);

                layui.form.render();
            }
        })
    }

    // 初始化文本
    // 初始化富文本编辑器
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


    //  点击选择封面按钮
    $('#btnChooseImage').on('click', function () {
        // 触发文件选择点击事件
        $('#coverFile').click();
    })

    //   选择了新的图片文件，跟换图片
    $('#coverFile').on('change', function () {
        // 获取文件列表
        var files = $(this)[0].files;

        if (files.length === 0) {
            return layui.layer.msg('请选择文件');
        }

        // 获取选择文件
        var file = files[0];

        // 把文件转化为可图像
        var newImgURL = URL.createObjectURL(file);

        // 为裁剪区域重新设置图片
        $image
            .cropper('destroy') // 销毁旧的裁剪区域
            .attr('src', newImgURL) // 重新设置图片路径
            .cropper(options) // 重新初始化裁剪区域
    })

    // 准备文章状态的数据

    var state = '已发布';
    $('#btnSave2').on('click', function () {
        state = '草稿';
    })

    // 发布文张 
    $('#form-pub').on('submit', function (e) {
        e.preventDefault();
        // 使用FormData对象收集数据
        var fd = new FormData($(this)[0]);
        // 把文章状态追加到fd表单中
        fd.append('state', state);

        /* fd.forEach(function (value) {
            console.log(value);
        }) */
        
        // 裁剪图片
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
      
                publishArticle(fd);
        })
    })

    function publishArticle(fd) {
        // 调接口
        $.ajax({
            url: '/my/article/add',
            method: 'post',
            data: fd,
            contentType: false,
            processData: false,
            success: function (res) {
                if (res.status !== 0) {
                    return layui.layer.msg(res.message, { icon: 5 });
                }
                layui.layer.msg(res.message, { icon: 6 });
                //调转到文章列表页
                // location.href = '/article/art_list.html';

                window.parent.document.querySelector('#artlist').click();

            }
        })
    }
})