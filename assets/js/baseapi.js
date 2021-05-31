// ajax 预处理函数
$.ajaxPrefilter(function (options) {
    // console.log(options.url);
    // 给请求地址拼接上跟地址
    options.url = 'http://api-breakingnews-web.itheima.net' + options.url;

    // 对有权限的接口设置请求头
    // 通过请求 options.url

    if (options.url.indexOf('/my/') !== -1) {
        options.headers = {
            Authorization: localStorage.getItem('token')
        }
    };

    // 用户未登录，所有后台页面都不能登录
    options.complete= function(res) {
        if (res.responseJSON.status === 1 && res.responseJSON.message === '身份认证失败！') {
            localStorage.removeItem('token');
            if (window.parent) {
                window.parent.location.href = '/login.html';
            } else {
                location.href = '/login.html';
            }
           
            
        }
    }

})