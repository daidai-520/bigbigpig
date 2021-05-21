// ajax 预处理函数
$.ajaxPrefilter(function (options) {
    console.log(options.url);
    // 给请求地址拼接上跟地址
    options.url = 'http://api-breakingnews-web.itheima.net' + options.url;
})