$(function () {
    // alert(45);
    getUserInfo();

    // 获取用户信息
    function getUserInfo() {
        // 调接口
        $.ajax({
            url: '/my/userinfo',
            method: 'get',
            /* // 设置请求头
            headers: {
                Authorization: localStorage.getItem('token')
            }, */
            success: function (res) {
                console.log(res);
                if (res.status !== 0) {
                    return layui.layer.msg(res.message, { icon: 5 });
                }
                // 渲染用户
                renderAvatar(res.data);
            },
           /*  complete: function (res) {
                console.log(res);
                console.log(res.responseJSON);
                if (res.responseJSON.status === 1 && res.responseJSON.message === '身份认证失败！') {
                    localStorage.removeItem('token');
                    location.href = 'login.html';
                }
                
            } */
        })
    }

    function renderAvatar(user) {
        // 欢迎语
        console.log(user);

        // 如果有nickname 则使用，否则就用username
        var name = user.nickname || user.username;

        $('#welcome').html('欢迎' + name);

        // 渲染我们的头像
        if (user.user_pic !== null) {
            // 有头像图片 展示图片头像，隐藏文字头像
            $('.layui-nav-img').attr('scr', user.user_pic).show();
            $('.text-avatar').hide();
        } else {
            // 如果没有图片头像 ，显示文字头像，隐藏图片头像
            var first = name[0].toUpperCase(); // 转大写
            $('.text-avatar').html(first).show();
            $('.layui-nav-img').hide();
        }
    }

    // 退出登录
    $('#logout').on('click', function () {
        layer.confirm('您确认要退出吗？', { icon: 3, title: '提示' }, function (index) {
            //do something
            localStorage.removeItem('token');

            location.href = 'login.html';

            layer.close(index);
        });
    })
})