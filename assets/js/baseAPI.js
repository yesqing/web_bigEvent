// 设置每次发送AJAX请求进行拦截并拼接URL根地址
$.ajaxPrefilter(function (options) {
    options.url = 'http://api-breakingnews-web.itheima.net' + options.url;
})