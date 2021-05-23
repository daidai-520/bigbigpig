$(function () {
    // console.log(45);
    $('.layui-form').on('submit', function (e) {
        e.preventDefault();


        // 自定义校验规则
        layui.form.verify({
            pwd: [
                /^[\S]{6,12}$/,
                '密码必须是6-12位非空字符'
            ],
            newpwd: function (value) {
                if (value === $('.layui-form [name=oldPwd]').val()) {
                    return '新旧密码不能一致';
                }
            },


            repwd: function (value, item) {
                console.log(value);
                if (value !== $('.layui-form [name=newPwd]').val()) {
                    return '两次密码不对';
                }
            }
        })

        var oldpwd = $('.layui-form [name=oldPwd]').val().trim();
        var newpwd = $('.layui-form [name=newPwd]').val().trim();
        // 调接口
        $.ajax({
            url: '/my/updatepwd',
            method: 'post',
            data: {
                oldPwd: oldpwd,
                newPwd: newpwd
            },
            success: function (res) {
                if (res.status !== 0) {
                    return layui.layer.msg(res.message, { icon: 5 });
                }
                layui.layer.msg('修改成功', { icon: 6 });
            }
        })
    })
})