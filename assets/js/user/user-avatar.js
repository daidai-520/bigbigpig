$(function () {
    
    // console.log(45);
    // 把大图编程可裁剪的图片(初始化裁剪区域)
    // 1.1 获取裁剪区域的 DOM 元素
    var $image = $('#image')
    // 1.2 配置选项
    const options = {
        // 纵横比
        aspectRatio: 1,
        // 指定预览区域
        preview: '.img-preview'
    }

    // 1.3 创建裁剪区域
    $image.cropper(options)

    // 点击上传按钮，让用户选择文件
    $('#btnChooseImage').on('click', function () {
        // 触发文件选择控件的click事件
        $('#file').click();
    })

    // 用户选择了文件
    $('#file').on('change', function () {
        var filelist = $(this)[0].files;
        // 判断是否选择了文件
        if (filelist.length === 0) {
            return layui.layer.msg('请选择文件');
        }
        // 获取用户选中的文件
        var file = filelist[0];
        // console.log(file);

        // 把选中图片转成可访问的路径
        var newImgURL = URL.createObjectURL(file);
        // console.log(newImgURL);

        // 更换图片并重新渲染裁剪区域
        $image
            .cropper('destroy')      // 销毁旧的裁剪区域
            .attr('src', newImgURL)  // 重新设置图片路径
            .cropper(options)        // 重新初始化裁剪区域
    })

    // 点击确定上传头像
    $('#btnUpload').on('click', function () {
        var dataURL = $image
            .cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
                width: 100,
                height: 100
            })
            .toDataURL('image/png')       // 将 Canvas 画布上的内容，转化为 base64 格式的字符串
        // 调接口
        $.ajax({
            url: '/my/update/avatar',
            method: 'post',
            data: { avatar: dataURL },
            success: function (res) {
                console.log(res);
                if (res.status !== 0) {
                    return layui.layer.msg(res.message, { icon: 5 });
                }
                layui.layer.msg(res.message, { icon: 6 });

                
                window.parent.getUserInfo();
            }
        })
    })
})