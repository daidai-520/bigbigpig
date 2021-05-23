$(function () {
    

    //  弹层对象
    var layer = layui.layer;
    // alert(25)
    $('#link_reg').on('click', function () {
        $('.reg-box').show();
        $('.login-box').hide();
    })
    $('#link_login').on('click', function () {
        $('.reg-box').hide();
        $('.login-box').show();
    })

    // 自定义表单验证规则
    var form = layui.form;
    form.verify({
        // pwd 规则
        pwd: [
            // \S 是非空
            /^[\S]{6,12}$/,
            '密码必须是6-12位非空格字符'
        ],

        // 验证确认密码
        repwd: function (value, item) {
            //`value 使用此规则的表单项的值（确认密码框的值）
            // item 使用此规则的表单项元素对象

            if (value !== $('#form_reg [name=password]').val()) {
                return '两次密码不一致';
            }
        }
    });


    // 注册用户
    $('#form_reg').on('submit', function (e) {
        e.preventDefault();

        //收集数据
        var username = $('#form_reg [name=username]').val().trim();
        var password = $('#form_reg [name=password]').val().trim();
        var repassword = $('#form_reg [name=repassword]').val().trim();
        console.log(username, password, repassword);
        // 调接口 注册用户
        $.ajax({
            url: '/api/reguser',
            method: 'post',
            data: {
                username,
                password,
            },
            success: function (res) {
                console.log(res);
                if (res.status !== 0) {
                    // return alert('注册失败');
                    return layer.msg(res.massage, { icon: 5 });
                }
                // alert('注册成功');
                layer.msg('注册成功', { icon: 6 }, function () {
                    $('#link_login').click();
                })
            }
        })
    })


    // 登录

    $('#form_login').on('submit', function (e) {
        e.preventDefault();

        var data = $(this).serialize();
        // console.log(data);
        $.ajax({
            url: '/api/login',
            method: 'POST',
            data: data,
            success: function (res) {
                console.log(res);
                if (res.status !== 0) {
                    return layer.msg(res.message, { icon: 5 });
                }
                layer.msg('登陆成功', { icon: 6 }, function () {
                    // 保存token到本地
                    localStorage.setItem('token', res.token);
                    // 跳转页面
                    location.href = 'index.html';
                });
            }
        })
    })
})