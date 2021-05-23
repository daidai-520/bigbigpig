$(function () {
    // console.log(45);

    // 获取用户信息，展示到表单里
    getUserInfo()

    function getUserInfo() {
        $.ajax({
            url: '/my/userinfo',
            method: 'get',
            success: function (res) {
                console.log(res);
                if (res.status !== 0) {
                    return layui.layer.msg('res.message', { icon: 5 });
                }
                // 表单用户名等赋值
                // $('[name=username]').val(res.data.username);
                layui.form.val('formUserInfo', res.data);
            }
        })
    }

    // 自定义验证昵称规则
    layui.form.verify({
        nickname: [
            /^[\S]{1,6}$/,
            '昵称是1-6位非空字符'
        ]
    })

    // 重置密码
    $('#btnReset').on('click', function (e) {
        e.preventDefault();

        // 重新获取，重新赋值
        getUserInfo();
    })

    // 完成修改用户
    $('.layui-form').on('submit', function (e) {
        e.preventDefault();
        var data = $(this).serialize();
        // console.log(data);
        $.ajax({
            url: '/my/userinfo',
            method: 'post',
            data:data,
            success: function (res) {
                // console.log(res);
                if (res.status !== 0) {
                    return layui.layer.msg(res.message, { icon: 5 });
                }
                layui.layer.msg('修改成功', { icon: 6 });


                window.parent.getUserInfo();
            }
        })
    })
})