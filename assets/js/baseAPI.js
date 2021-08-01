// 设置每次发送AJAX请求进行拦截并拼接URL根地址
$.ajaxPrefilter(function (options) {
    options.url = 'http://api-breakingnews-web.itheima.net' + options.url;
    // 统一为有权限的接口，设置headers请求头
    if(options.url.indexOf('/my')){
        options.headers = {
            Authorization: localStorage.getItem('token') || '' 
        }
        // 全局统一挂载回调函数
        options.complete =  function (res) {
            if(res.responseJSON.status === 1) {
                location.href = '/login.html';
            }
        }
    }
});